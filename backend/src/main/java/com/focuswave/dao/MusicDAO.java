package com.focuswave.dao;

import com.focuswave.dto.MusicDTO;
import com.focuswave.factory.DBConnectionFactory;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;

public class MusicDAO {

    public List<MusicDTO> findByGoal(String goal) {
        List<MusicDTO> list = new ArrayList<>();

        String sql = "SELECT id, title, description, url, category FROM music WHERE category = ?";

        try (Connection connection = DBConnectionFactory.getConnection();
             PreparedStatement statement = connection.prepareStatement(sql)) {

            statement.setString(1, goal);

            ResultSet rs = statement.executeQuery();
            while (rs.next()) {
                MusicDTO dto = new MusicDTO(
                        rs.getInt("id"),
                        rs.getString("title"),
                        rs.getString("description"),
                        rs.getString("url"),
                        rs.getString("category")
                );
                list.add(dto);
            }

        } catch (Exception e) {
            e.printStackTrace();
        }

        return list;
    }

}
