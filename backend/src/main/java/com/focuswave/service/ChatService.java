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

        // Identifica intenção principal (retorna categoria do banco)
        String category = detectIntent(normalized);

        // Busca músicas do banco correspondentes à categoria
        List<Music> all;

        if (category.equals("all")) {
            // Busca todas as músicas quando não identificar categoria específica
            all = musicDAO.findAll();
        } else {
            all = musicDAO.findByGoal(category);
        }

        // Se não encontrou nada, busca todas
        if (all == null || all.isEmpty()) {
            all = musicDAO.findAll();
        }

        // Embaralhar para dar variedade
        Collections.shuffle(all);

        // Evitar repetir a música anterior
        if (lastMusicId != null && !all.isEmpty()) {
            all.removeIf(m -> m.getId() == lastMusicId);
        }

        // Se a lista ficou vazia após remoção → recarrega
        if (all.isEmpty()) {
            all = musicDAO.findAll();
            Collections.shuffle(all);
        }

        // Converter Music → MusicSuggestionDTO
        // Retorna apenas 1 música para não sobrecarregar o usuário
        List<MusicSuggestionDTO> suggestions = new ArrayList<>();

        if (!all.isEmpty()) {
            Music m = all.get(0);
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
     * Detecta a intenção baseada no texto enviado pelo usuário.
     * Simula comportamento de uma LLM mapeando palavras-chave para categorias.
     *
     * Categorias disponíveis no banco: Natureza, Meditação, Cultura, Foco, ASMR
     */
    private String detectIntent(String text) {

        text = text.toLowerCase();

        // =====================================================
        // FOCO - estudar, concentrar, trabalhar, produtivo
        // =====================================================
        if (text.contains("foco") || text.contains("focar") ||
            text.contains("focus") || text.contains("estudar") ||
            text.contains("estudando") || text.contains("estudo") ||
            text.contains("concentrar") || text.contains("concentração") ||
            text.contains("trabalhar") || text.contains("trabalho") ||
            text.contains("produtivo") || text.contains("produtividade") ||
            text.contains("ler") || text.contains("leitura") ||
            text.contains("profundo") || text.contains("profundamente") ||
            text.contains("binaural") || text.contains("chuva")) {
            return "Foco";
        }

        // =====================================================
        // MEDITAÇÃO - relaxar, calmo, meditar, paz
        // =====================================================
        if (text.contains("meditação") || text.contains("meditacao") ||
            text.contains("meditar") || text.contains("meditation") ||
            text.contains("relaxar") || text.contains("relax") ||
            text.contains("calmo") || text.contains("calma") ||
            text.contains("tranquilo") || text.contains("tranquila") ||
            text.contains("paz") || text.contains("acalmar") ||
            text.contains("respirar") || text.contains("zen") ||
            text.contains("tigela") || text.contains("singing bowl")) {
            return "Meditação";
        }

        // =====================================================
        // NATUREZA - sons naturais, floresta, pássaros, ambiente
        // =====================================================
        if (text.contains("natureza") || text.contains("nature") ||
            text.contains("floresta") || text.contains("forest") ||
            text.contains("pássaro") || text.contains("passaro") ||
            text.contains("birds") || text.contains("ambiente") ||
            text.contains("ambience") || text.contains("rio") ||
            text.contains("mar") || text.contains("ocean") ||
            text.contains("vento") || text.contains("wind")) {
            return "Natureza";
        }

        // =====================================================
        // CULTURA - músicas culturais, étnicas, tradicionais
        // =====================================================
        if (text.contains("cultura") || text.contains("cultural") ||
            text.contains("chinês") || text.contains("chines") ||
            text.contains("japones") || text.contains("japonês") ||
            text.contains("oriental") || text.contains("tradicional") ||
            text.contains("étnico") || text.contains("etnico") ||
            text.contains("world music") || text.contains("dragão")) {
            return "Cultura";
        }

        // =====================================================
        // ASMR - sons relaxantes, sussurros, triggers
        // =====================================================
        if (text.contains("asmr") || text.contains("sussurro") ||
            text.contains("whisper") || text.contains("trigger") ||
            text.contains("trem") || text.contains("train") ||
            text.contains("viagem") || text.contains("dormir") ||
            text.contains("sono") || text.contains("sleep") ||
            text.contains("soneca") || text.contains("descanso") ||
            text.contains("noite")) {
            return "ASMR";
        }

        // =====================================================
        // CONTEXTOS GENÉRICOS
        // =====================================================

        // Música/Genérico → retorna todas
        if (text.contains("música") || text.contains("musica") ||
            text.contains("music") || text.contains("tocar") ||
            text.contains("ouvir") || text.contains("escutar") ||
            text.contains("qualquer") || text.contains("sugira") ||
            text.contains("recomend") || text.contains("indica")) {
            return "all";
        }

        // Saudação → retorna todas
        if (text.contains("olá") || text.contains("oi") ||
            text.contains("ola") || text.contains("hello") ||
            text.contains("bom dia") || text.contains("boa tarde") ||
            text.contains("boa noite") || text.contains("ajuda")) {
            return "all";
        }

        // Fallback: retorna todas as músicas
        return "all";
    }

}
