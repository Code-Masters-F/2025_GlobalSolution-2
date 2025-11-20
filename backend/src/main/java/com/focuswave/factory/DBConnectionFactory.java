package com.focuswave.factory;

import java.io.IOException;
import java.io.InputStream;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.Properties;

public class DBConnectionFactory {

    /*
    Notas para Guilherme:
    TODO: Para inserir os valores de DB_URL, DB_USER, DB_PASS, basta criar um arquivo 'config.properties' na pasta do projeto. Os valores de exemplo estão em config.properties.example
     */

    private static final Properties props = new Properties();

    private static String URL;
    private static String USUARIO;
    private static String SENHA;

    static {
        try {
            InputStream input = DBConnectionFactory.class
                    .getClassLoader()
                    .getResourceAsStream("config.properties");

            if (input == null) {
                throw new RuntimeException("ERRO: config.properties não encontrado no classpath!");
            }

            props.load(input);

            URL = props.getProperty("db.url");
            USUARIO = props.getProperty("db.user");
            SENHA = props.getProperty("db.pass");

            if (URL == null || USUARIO == null || SENHA == null) {
                throw new RuntimeException("ERRO: Propriedades db.url, db.user ou db.pass não foram definidas!");
            }
        } catch (IOException e) {
            throw new RuntimeException("Erro ao carregar config.properties", e);
        }
    }

    public static Connection getConnection() throws SQLException {
        return DriverManager.getConnection(URL, USUARIO, SENHA);
    }

    public static void main (String[] args) {
        System.out.println("URL: " + URL);
        System.out.println("USUARIO: " + USUARIO);
        System.out.println("PASS: " + SENHA);
    }
}