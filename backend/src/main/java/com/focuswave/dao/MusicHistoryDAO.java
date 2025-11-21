package com.focuswave.dao;

import com.focuswave.factory.DBConnectionFactory;
import com.focuswave.model.MusicHistory;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;

public class MusicHistoryDAO {

    /**
     * Insere uma nova entrada no histórico.
     */
    public boolean insertEntry(int userId, int musicId) {
        String sql = "INSERT INTO fw_music_history (id_user_profile, id_music, played_at) VALUES (?, ?, CURRENT_TIMESTAMP)";

        try (Connection connection = DBConnectionFactory.getConnection();
             PreparedStatement statement = connection.prepareStatement(sql)) {

            statement.setInt(1, userId);
            statement.setInt(2, musicId);

            int rows = statement.executeUpdate();
            return rows > 0;

        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    /**
     * Busca os registros recentes do usuário.
     */
    public List<MusicHistory> findRecentByUser(int userId, int limit) {
        List<MusicHistory> list = new ArrayList<>();

        String sql =
                "SELECT id, id_user_profile, id_music, played_at " +
                        "FROM fw_music_history " +
                        "WHERE id_user_profile = ? " +
                        "ORDER BY played_at DESC " +
                        "FETCH FIRST ? ROWS ONLY"; // Oracle
        // Para MySQL: "LIMIT ?"

        try (Connection connection = DBConnectionFactory.getConnection();
             PreparedStatement statement = connection.prepareStatement(sql)) {

            statement.setInt(1, userId);
            statement.setInt(2, limit);

            ResultSet resultSet = statement.executeQuery();

            while (resultSet.next()) {
                MusicHistory entry = new MusicHistory(
                        resultSet.getInt("id"),
                        resultSet.getInt("id_user_profile"),
                        resultSet.getInt("id_music"),
                        resultSet.getTimestamp("played_at")
                );
                list.add(entry);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        return list;
    }
}
