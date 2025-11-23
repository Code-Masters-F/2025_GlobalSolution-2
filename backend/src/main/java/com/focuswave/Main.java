package com.focuswave;

import com.focuswave.config.ApiConfig;
import org.glassfish.grizzly.http.server.HttpServer;
import org.glassfish.jersey.grizzly2.httpserver.GrizzlyHttpServerFactory;

import java.io.IOException;
import java.net.URI;

public class Main {
    public static final String BASE_URI = "http://localhost:8080/";

    public static HttpServer startServer() {
        return GrizzlyHttpServerFactory.createHttpServer(
                URI.create(BASE_URI),
                new ApiConfig()
        );
    }

    public static void main (String[] args) {
        final HttpServer server = startServer();

        System.out.println("===========================================");
        System.out.println("Servidor FocusWave iniciado!");
        System.out.println("Endpoint base: " + BASE_URI + "api/");
        System.out.println("Pressione ENTER para parar o servidor.");
        System.out.println("===========================================");

        try {
            System.in.read();
        } catch (IOException e) {
            System.out.println("Um erro ocorreu ao rodar o servidor: " + e.getMessage());
        }

        server.shutdown();
        System.out.println("Servidor encerrado");

    }
}
