package com.skillshare.app.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig {

    private static final String[] ALLOWED_ORIGINS = {
        "http://localhost:5173",         
    };

    private static final String API_PATH = "/api/**";
    private static final String[] ALLOWED_METHODS = {
        "GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS", "HEAD"
    };

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping(API_PATH)
                        .allowedOrigins(ALLOWED_ORIGINS)
                        .allowedMethods(ALLOWED_METHODS)
                        .allowedHeaders("*")
                        .exposedHeaders(
                            "Authorization", 
                            "Content-Type",
                            "Content-Disposition",
                            "X-Requested-With"
                        )
                        .allowCredentials(true)
                        .maxAge(3600); // 1 hour cache for preflight responses
            }
        };
    }
}