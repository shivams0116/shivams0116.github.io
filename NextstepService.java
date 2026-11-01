import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.slf4j.MDC;
import reactor.core.publisher.Mono;
import reactor.util.context.Context;
import reactor.util.context.ContextView;

import com.marriott.commerce.reservation.common.util.ReactorMdc;

public Mono<ServerResponse> nextstep(ServerRequest serverRequest,
    Mono<ASPRequest> aspRequestMono) {
    
    return aspRequestMono
        .flatMap(request -> {
            ASPRequestWrapper aspRequestWrapper = ASPRequestWrapper.builder()
                .aspRQ(request)
                .aspHeaders(getASPHeaders(serverRequest.headers()))
                .dspHeaders(getDspHeaders(serverRequest))
                .build();

            Optional.ofNullable(aspRequestWrapper.getAspRQ())
                .map(ASPRequest::getProductQueriesHospitality)
                .map(ProductQueriesHospitality::getRoomStayQueryProduct)
                .map(RoomStayQueryProduct::getBasicPropertyInfo)
                .filter(CollectionUtils::isNotEmpty)
                .map(List::getFirst)
                .ifPresent(basicPropInfo -> {
                    String propertyCode = basicPropInfo.getCode();
                    if (propertyCode != null) {
                        String normalizedPropertyCode = propertyCode.replaceAll("\\s", "").trim().toUpperCase();
                        basicPropInfo.setCode(normalizedPropertyCode);
                    }
                });

            Optional.ofNullable(aspRequestWrapper.getAspRQ())
                .map(ASPRequest::getProductQueriesHospitality)
                .filter(ObjectUtils::isNotEmpty)
                .orElseThrow(() -> new BadRequestException(rdsErrorMappingService.getByErrorCode(ASP521)));

            mapRateQualifierToRateRequest(aspRequestWrapper);
            fetchConfirmationNumber(aspRequestWrapper);
            updateGuestCount(aspRequestWrapper);
            validateDateFields(aspRequestWrapper);

            // Final, immutable propertyCode for this request
            final String propertyCode = Optional.ofNullable(aspRequestWrapper.getAspRQ())
                .map(ASPRequest::getProductQueriesHospitality)
                .map(ProductQueriesHospitality::getRoomStayQueryProduct)
                .map(RoomStayQueryProduct::getBasicPropertyInfo)
                .filter(CollectionUtils::isNotEmpty)
                .map(List::getFirst)
                .map(BasicPropertyInfo::getCode)
                .orElse(null);

            // Set MDC immediately for synchronous logging
            if (propertyCode != null && !propertyCode.isBlank()) {
                Map<String, String> copy = MDC.getCopyOfContextMap();
                if (copy == null) copy = new HashMap<>();
                copy.put(ReactorMdc.PROPERTY_CODE, propertyCode);
                MDC.setContextMap(copy);
            }

            if (isRateRequestPresent(aspRequestWrapper) &&
                aspRequestWrapper.getAspRQ().getProductQueriesHospitality()
                    .getPriceModifiers().getRateRequest()
                    .stream().anyMatch(rateRequest -> 
                        RateRequestTypeEnum.OFFERCOLLECTIONID.equals(rateRequest.getRateRequestTypeEnum()))) {
                
                aspValidator.validate(aspRequestWrapper);
                
                // Use defer to propagate context across thread boundaries
                Mono<ASPResponse> body = Mono.defer(() -> 
                    paginateService.processPaginateRequest(aspRequestWrapper)
                        .as(this::postHandle)
                        .contextWrite(ReactorMdc.putIntoContextIfAbsent(propertyCode))
                        .doOnEach(ReactorMdc.restoreConsumer())
                );
                
                ServerResponse.BodyBuilder builder = ServerResponse.ok()
                    .header(CRSMapperConstants.Headers.ACRS_CONFO,
                        serverRequest.headers().firstHeader(CRSMapperConstants.Headers.ACRS_CONFO))
                    .header(CRSMapperConstants.Headers.MARSHA_CONFO,
                        serverRequest.headers().firstHeader(CRSMapperConstants.Headers.MARSHA_CONFO));

                if (propertyCode != null && !propertyCode.isBlank()) {
                    builder.header(PROPERTY_CODE, propertyCode);
                }

                return builder.body(body, ASPResponse.class);
            }

            // Identify the CRS type of this hotel code
            Mono<RouteDecision> routeDecision = baseRouterImpl.route(aspRequestWrapper);

            // Use deferContextual to propagate context across thread boundaries
            return Mono.deferContextual(ctx -> 
                routeDecision
                    .flatMap(crsType -> {
                        log.info("ResASPHandler - CRSType : {}", crsType.getName());
                        aspRequestWrapper.setCrsName(crsType.getName());
                        aspValidator.validate(aspRequestWrapper);
                        return getTapResponse(aspRequestWrapper);
                    })
                    .flatMap(aspReqtWrapper -> {
                        logGroupCodeDetailsIfRequired(aspRequestWrapper);
                        applyGroupCodeTruncationIfRequired(aspRequestWrapper);

                        // Build context with propertyCode if present and not already set
                        // Note: ctx here is ContextView, need to convert to Context for put()
                        Context updatedCtx = Context.of(ctx);
                        if (propertyCode != null && !ctx.hasKey(ReactorMdc.PROPERTY_CODE)) {
                            updatedCtx = updatedCtx.put(ReactorMdc.PROPERTY_CODE, propertyCode);
                        }
                        Mono<ASPResponse> body = resASPAdapterService.processASPRequest(aspRequestWrapper, aspReqtWrapper.getCrsName())
                            .as(this::postHandle)
                            .contextWrite(updatedCtx)
                            .doOnEach(ReactorMdc.restoreConsumer());

                        ServerResponse.BodyBuilder builder = ServerResponse.ok()
                            .header(CRSMapperConstants.Headers.ACRS_CONFO,
                                serverRequest.headers().firstHeader(CRSMapperConstants.Headers.ACRS_CONFO))
                            .header(CRSMapperConstants.Headers.MARSHA_CONFO,
                                serverRequest.headers().firstHeader(CRSMapperConstants.Headers.MARSHA_CONFO));

                        if (propertyCode != null && !propertyCode.isBlank()) {
                            builder.header(PROPERTY_CODE, propertyCode);
                        }

                        return builder.body(body, ASPResponse.class);
                    })
            )
            .contextWrite(ReactorMdc.putIntoContext(propertyCode));
        })
        .onErrorResume(e -> {
            log.error("ASP failure", e);
            rdsCommonUtils.logMMFErrorResponse(this.getClass().getName(), e);
            return Mono.error(e);
        });
}
