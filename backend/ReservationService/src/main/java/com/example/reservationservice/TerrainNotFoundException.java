package com.example.reservationservice;

public class TerrainNotFoundException extends RuntimeException {

    public TerrainNotFoundException(String message) {
        super(message);
    }
}
