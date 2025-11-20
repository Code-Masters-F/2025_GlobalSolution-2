package com.focuswave.service;

import com.focuswave.dao.MusicDAO;
import com.focuswave.dto.MusicDTO;
import com.focuswave.dto.MusicSuggestionDTO;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class ChatService {

    private MusicDAO musicDAO = new MusicDAO();

    public List<MusicSuggestionDTO> getSuggestions(String goal, Integer lastMusicId) {

        // Validação básica
        if (goal == null || goal.trim().isEmpty()) {
            return new ArrayList<>();
        }

        String normalized = goal.trim().toLowerCase();

        // Identifica intenção principal
        String intent = detectIntent(normalized);

        // Busca músicas do banco correspondentes à intenção
        List<MusicDTO> all = musicDAO.findByGoal(intent);

        // Embaralhar para dar variedade
        Collections.shuffle(all);

        // Evitar repetir a música anterior
        if (lastMusicId != null && !all.isEmpty()) {
            all.removeIf(m -> m.getId() == lastMusicId);
        }

        // Se a lista ficou vazia após remoção → recarrega
        if (all.isEmpty()) {
            all = musicDAO.findByGoal(intent);
            Collections.shuffle(all);
        }

        // Converter MusicDTO → MusicSuggestionDTO
        List<MusicSuggestionDTO> suggestions = new ArrayList<>();

        for (MusicDTO m : all) {
            suggestions.add(new MusicSuggestionDTO(
                    m.getId(),
                    m.getTitle(),
                    m.getDescription(),
                    m.getUrl(),
                    m.getCategory()
            ));
        }

        return suggestions;
    }

    /**
     * Detecta a intenção baseada no texto enviado pelo usuário
     */
    private String detectIntent(String text) {

        if (text.contains("foco") || text.contains("focus") || text.contains("estudar")) {
            return "focus";
        }

        if (text.contains("relax") || text.contains("descansar") || text.contains("calmar") || text.contains("acalmar")) {
            return "relax";
        }

        if (text.contains("sono") || text.contains("dormir") || text.contains("sleep")) {
            return "sleep";
        }

        return "neutral";
    }
}
