package com.futsal.teamsmatchesservice.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI openAPI() {
        Server devServer = new Server();
        devServer.setUrl("http://localhost:8081");
        devServer.setDescription("Serveur de développement");

        Contact contact = new Contact();
        contact.setName("Équipe de développement");
        contact.setEmail("contact@futsalcenter.com");
        contact.setUrl("https://futsalcenter.com");

        License license = new License()
                .name("Licence propriétaire")
                .url("https://futsalcenter.com/licence");

        Info info = new Info()
                .title("API du service de gestion des équipes et matchs")
                .version("1.0.0")
                .contact(contact)
                .description("Cette API permet de gérer les équipes, les joueurs, les matchs et les défis pour la plateforme Futsal Center.")
                .termsOfService("https://futsalcenter.com/terms")
                .license(license);

        return new OpenAPI()
                .info(info)
                .servers(List.of(devServer));
    }
}