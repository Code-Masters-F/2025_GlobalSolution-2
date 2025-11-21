package com.focuswave.service;

import com.focuswave.dao.MusicDAO;
import com.focuswave.dto.MusicSuggestionDTO;
import com.focuswave.model.Music;

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
        List<Music> all = musicDAO.findByGoal(intent);

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

        for (Music m : all) {
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

        text = text.toLowerCase();

        // Foco
        if (text.contains("foco") || text.contains("focus") || text.contains("estudar")) {
            return "focus";
        }

        // Relaxamento
        if (text.contains("relax") || text.contains("descansar") ||
                text.contains("calmar") || text.contains("acalmar") ||
                text.contains("tranquilo") || text.contains("calmo")) {
            return "relax";
        }

        // Sono
        if (text.contains("sono") || text.contains("dormir") || text.contains("sleep")) {
            return "sleep";
        }

        // Rock
        if (text.contains("rock") || text.contains("guitarra") || text.contains("pesado")) {
            return "Rock";
        }

        // Pop
        if (text.contains("pop") || text.contains("moderno") || text.contains("hits")) {
            return "Pop";
        }

        // Bossa Nova
        if (text.contains("bossa") || text.contains("bossa nova") || text.contains("violão")) {
            return "Bossa Nova";
        }

        // MPB
        if (text.contains("mpb") || text.contains("brasil") || text.contains("música brasileira")) {
            return "MPB";
        }

        // Clássica
        if (text.contains("classica") || text.contains("clássica") ||
                text.contains("orquestra") || text.contains("violin") || text.contains("piano")) {
            return "Clássica";
        }

        // Metal
        if (text.contains("metal") || text.contains("heavy") || text.contains("metallica")) {
            return "Metal";
        }

        // Grunge
        if (text.contains("grunge") || text.contains("nirvana") ||
                text.contains("anos 90") || text.contains("90s")) {
            return "Grunge";
        }

        return "neutral";
    }

}
