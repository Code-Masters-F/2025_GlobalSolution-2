package factory;

import io.github.cdimascio.dotenv.Dotenv;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.Statement;

public class DBConnectionFactory {

    /*
    Notas para Guilherme:
    TODO: Para inserir os valores de DB_URL, DB_USER, DB_PASS, basta criar um arquivo '.env' na pasta do projeto. Os valores de exemplo estão em .env.example
     */

    private static final Dotenv dotenv = Dotenv.load();

    public static final String URL = dotenv.get("DB_URL");
    public static final String USUARIO = dotenv.get("DB_USER"); // Insira o usuário na variável de ambiente
    public static final String SENHA = dotenv.get("DB_PASS"); // Insira a senha na variável de ambiente

    public static Connection getConnection() throws SQLException {
        Connection connection = DriverManager.getConnection(URL, USUARIO, SENHA);

        try (Statement statement = connection.createStatement()) {
            statement.execute("ALTER SESSION SET CURRENT_SCHEMA=" + USUARIO);
        }
        return connection;
    }
}