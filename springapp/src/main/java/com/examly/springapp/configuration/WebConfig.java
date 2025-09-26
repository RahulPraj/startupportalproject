package com.examly.springapp.configuration;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.*;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        // Allow the local dev frontend and the examly preview domain (replace <your-environment> if needed)
        registry.addMapping("/**")
                .allowedOrigins(
                        "http://localhost:8081",
                        "https://8081-<your-environment>.premiumproject.examly.io"
                )
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*");
    }
}