package com.focuswave.dao;


import com.focuswave.factory.DBConnectionFactory;
import com.focuswave.model.Music;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;

public class MusicDAO {

    public List<Music> findByGoal(String goal) {
        List<Music> list = new ArrayList<>();

        String sql = "SELECT id, title, description, url, category FROM music WHERE category = ?";

        try (Connection connection = DBConnectionFactory.getConnection();
             PreparedStatement statement = connection.prepareStatement(sql)) {

            statement.setString(1, goal);

            ResultSet rs = statement.executeQuery();
            while (rs.next()) {
                Music music = new Music(
                        rs.getInt("id"),
                        rs.getString("title"),
                        rs.getString("description"),
                        rs.getString("url"),
                        rs.getString("category")
                );
                list.add(music);
            }

        } catch (Exception e) {
            e.printStackTrace();
        }

        return list;
    }

    public Music findById(int musicId) {
        String sql = "SELECT id, title, description, url, category FROM music WHERE id = ?";

        try (Connection connection = DBConnectionFactory.getConnection();
             PreparedStatement statement = connection.prepareStatement(sql)) {

            statement.setInt(1, musicId);

            ResultSet resultSet = statement.executeQuery();

            if (resultSet.next()) {
                return new Music(
                        resultSet.getInt("id"),
                        resultSet.getString("title"),
                        resultSet.getString("description"),
                        resultSet.getString("url"),
                        resultSet.getString("category")
                );
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }
}
