package com.kesherManager.kesherManager.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.databind.util.StdDateFormat;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.converter.json.Jackson2ObjectMapperBuilder;

import java.util.TimeZone;

@Configuration
public class ApplicationConfig {

    @Bean
    public ObjectMapper objectMapper(Jackson2ObjectMapperBuilder builder) {
        ObjectMapper objectMapper = builder.build();
        objectMapper.configure(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS, false);

        // Use ISO-8601 date format
        StdDateFormat dateFormat = new StdDateFormat();
        dateFormat.setTimeZone(TimeZone.getTimeZone("Asia/Jerusalem"));
        objectMapper.setDateFormat(dateFormat);

        return objectMapper;
    }
}