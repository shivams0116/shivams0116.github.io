@Test
public void testForResponsewithHeadersWhenOfferCollectionRateRequestPresent() {
    ServerRequest serverRequest = MockServerRequest.builder()
        .header(CRSMapperConstants.Headers.ACRS_CONFO, "acrs123")
        .header(CRSMapperConstants.Headers.MARSHA_CONFO, "marsha456")
        .build();

    RateRequest rateRequest = new RateRequest();
    rateRequest.setRateRequestTypeEnum(RateRequestTypeEnum.OFFERCOLLECTIONID);

    PriceModifiers priceModifiers = new PriceModifiers();
    priceModifiers.setRateRequest(List.of(rateRequest));

    // Create BasicPropertyInfo with property code
    BasicPropertyInfo basicPropertyInfo = new BasicPropertyInfo();
    basicPropertyInfo.setCode("MIA");

    // Create RoomStayQueryProduct with BasicPropertyInfo
    RoomStayQueryProduct roomStayQueryProduct = new RoomStayQueryProduct();
    roomStayQueryProduct.setBaseHospitalityFacilityQuery(BaseHospitalityFacilityQuery.builder().build());
    roomStayQueryProduct.setBasicPropertyInfo(List.of(basicPropertyInfo));

    ProductQueriesHospitality productQueriesHospitality = new ProductQueriesHospitality();
    productQueriesHospitality.setPriceModifiers(priceModifiers);
    productQueriesHospitality.setRoomStayQueryProduct(roomStayQueryProduct);

    ASPRequest aspRequest = new ASPRequest();
    aspRequest.setProductQueriesHospitality(productQueriesHospitality);

    ASPRequestWrapper aspRequestWrapper = new ASPRequestWrapper();
    aspRequestWrapper.setAspRQ(aspRequest);

    ASPResponse aspResponse = new ASPResponse();
    Mono<ASPResponse> aspResponseMono = Mono.just(aspResponse);

    when(paginateService.processPaginateRequest(aspRequestWrapper))
        .thenReturn(aspResponseMono);

    Mono<ServerResponse> responseMono = resASPAdapterHandler.nextstep(serverRequest, Mono.just(aspRequest));

    StepVerifier.create(responseMono)
        .assertNext(response -> {
            assertEquals(HttpStatus.OK, response.statusCode());
            Assertions.assertTrue((response.headers()).asSingleValueMap()
                .get(CRSMapperConstants.Headers.ACRS_CONFO).contains("acrs123"));
            Assertions.assertTrue((response.headers()).asSingleValueMap()
                .get(CRSMapperConstants.Headers.MARSHA_CONFO).contains("marsha456"));
        })
        .verifyComplete();
}
