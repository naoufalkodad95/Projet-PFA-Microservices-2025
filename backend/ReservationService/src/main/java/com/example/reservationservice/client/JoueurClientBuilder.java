package com.example.reservationservice.client;

import org.springframework.web.client.RestTemplate;

public class JoueurClientBuilder {
    private RestTemplate restTemplate;

    public JoueurClientBuilder setRestTemplate(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
        return this;
    }

    public JoueurClient createJoueurClient() {
        return new JoueurClient(restTemplate);
    }
}