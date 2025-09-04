package com.nallijaku.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins(
                    "https://nallijaku.com",
                    "https://www.nallijaku.com", 
                    "https://api.nallijaku.com",  // 새로 추가!
                    "http://localhost:3000",  // 로컬 개발용
                    "http://localhost:3001"   // 로컬 개발용
                )
                .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true)  // 특정 도메인 허용시 true 가능
                .maxAge(3600);
    }
}
