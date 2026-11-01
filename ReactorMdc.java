package com.marriott.commerce.reservation.common.util;

import org.slf4j.MDC;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.util.context.Context;
import reactor.util.context.ContextView;

import java.util.HashMap;
import java.util.Map;
import java.util.function.Consumer;
import java.util.function.Function;

public final class ReactorMdc {
    public static final String PROPERTY_CODE = "property_code";

    private ReactorMdc() {}

    /**
     * Consumer that restores MDC from Reactor context on each signal.
     * This should be used with doOnEach to propagate context to MDC for logging.
     */
    public static <T> Consumer<Signal<T>> restoreConsumer() {
        return signal -> {
            if (!(signal.isOnNext() || signal.isOnError() || signal.isOnComplete())) {
                return;
            }

            // Save current MDC state BEFORE modifying
            Map<String, String> prev = MDC.getCopyOfContextMap();
            
            try {
                ContextView ctx = signal.getContextView();
                ctx.getOrEmpty(PROPERTY_CODE)
                    .ifPresent(v -> MDC.put(PROPERTY_CODE, String.valueOf(v)));
            } catch (Exception e) {
                // Restore previous state on error
                if (prev != null) {
                    MDC.setContextMap(prev);
                } else {
                    MDC.clear();
                }
                throw e;
            }
            
            // Note: We DON'T restore the previous context here anymore.
            // The MDC should persist across the reactive chain for proper logging.
            // If you need to restore, do it in a separate operator at the very end.
        };
    }

    /**
     * Function to put propertyCode into Reactor context.
     * Use with contextWrite() at the START of the reactive chain.
     */
    public static Function<Context, Context> putIntoContext(String value) {
        return ctx -> (value == null || value.isBlank()) ? ctx :
            ctx.put(PROPERTY_CODE, value);
    }

    /**
     * Alternative: Put value into context only if not already present.
     * Useful for preserving context from upstream.
     */
    public static Function<Context, Context> putIntoContextIfAbsent(String value) {
        return ctx -> {
            if (value == null || value.isBlank()) {
                return ctx;
            }
            if (ctx.hasKey(PROPERTY_CODE)) {
                return ctx;
            }
            return ctx.put(PROPERTY_CODE, value);
        };
    }
}
