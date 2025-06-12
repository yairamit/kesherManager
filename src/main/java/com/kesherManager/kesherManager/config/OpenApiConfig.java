package com.kesherManager.kesherManager.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@EnableWebMvc
public class OpenApiConfig implements WebMvcConfigurer {

    @Bean
    public OpenAPI kesherManagerOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Kesher Manager API")
                        .description("API for managing food box distribution for nonprofit organizations")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("KesherManager Team")
                                .email("contact@kesherManager.com"))
                        .license(new License()
                                .name("Apache 2.0")
                                .url("http://www.apache.org/licenses/LICENSE-2.0.html")));
    }
}