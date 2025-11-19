package com.focuswave.config;

import jakarta.ws.rs.ApplicationPath;
import org.glassfish.jersey.server.ResourceConfig;

@ApplicationPath("/api")
public class ApiConfig extends ResourceConfig {

    public ApiConfig() {
        packages("com.focuswave.resources");

        // habilita JSON Jackson
        register(org.glassfish.jersey.jackson.JacksonFeature.class);
    }
}
