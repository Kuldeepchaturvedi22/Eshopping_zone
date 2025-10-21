package com.cartservice.app.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI cartServiceOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Cart Service API")
                        .version("1.0")
                        .description("This API handles all operations related to Cart in the E-Shopping Zone project.")
                        .contact(new Contact()
                                .name("Kuldeep Chaturvedi")
                                .email("kuldeep@example.com")
                                .url("https://github.com"))
                );
    }
}
