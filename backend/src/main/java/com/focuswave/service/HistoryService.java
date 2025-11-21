package com.focuswave.service;

import com.focuswave.dao.MusicHistoryDAO;
import com.focuswave.dao.MusicDAO;
import com.focuswave.dto.MusicHistoryDTO;
import com.focuswave.model.Music;
import com.focuswave.model.MusicHistory;

import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

public class HistoryService {

    private final MusicHistoryDAO musicHistoryDAO = new MusicHistoryDAO();
    private final MusicDAO musicDAO = new MusicDAO();

    /**
     * Registra uma música tocada pelo usuário.
     */
    public boolean registerPlay(int userId, int musicId) {
        // Verifica se música existe
        Music music = musicDAO.findById(musicId);
        if (music == null) {
            return false;
        }

        return musicHistoryDAO.insertEntry(userId, musicId);
    }

    /**
     * Lista músicas recentes do usuário.
     */
    public List<MusicHistoryDTO> getRecentHistory(int userId, int limit) {

        List<MusicHistory> entries = musicHistoryDAO.findRecentByUser(userId, limit);
        List<MusicHistoryDTO> dtos = new ArrayList<>();

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

        for (MusicHistory entry : entries) {
            Music music = musicDAO.findById(entry.getIdMusic());

            String formattedPlayedAt = entry.getPlayedAt().toLocalDateTime().format(formatter);

            dtos.add(new MusicHistoryDTO(
                    music.getId(),
                    music.getTitle(),
                    music.getUrl(),
                    formattedPlayedAt
            ));
        }
        return dtos;
    }




}
