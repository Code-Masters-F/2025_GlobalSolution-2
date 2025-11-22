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
     * Detecta a intenção baseada no texto enviado pelo usuário.
     * Simula comportamento de uma LLM mapeando palavras-chave para categorias.
     *
     * Categorias disponíveis no banco: Rock, Pop, Bossa Nova, MPB, Clássica, Metal, Grunge
     */
    private String detectIntent(String text) {

        text = text.toLowerCase();

        // =====================================================
        // ROCK - energia, animação, guitarra
        // =====================================================
        if (text.contains("rock") || text.contains("guitarra") ||
            text.contains("energia") || text.contains("animado") ||
            text.contains("agitado") || text.contains("queen") ||
            text.contains("eagles") || text.contains("classic rock")) {
            return "Rock";
        }

        // =====================================================
        // POP - hits, moderno, dançar, alegre
        // =====================================================
        if (text.contains("pop") || text.contains("hit") || text.contains("hits") ||
            text.contains("moderno") || text.contains("atual") ||
            text.contains("dançar") || text.contains("dança") ||
            text.contains("alegre") || text.contains("feliz") ||
            text.contains("ed sheeran") || text.contains("adele") ||
            text.contains("michael jackson") || text.contains("animada")) {
            return "Pop";
        }

        // =====================================================
        // BOSSA NOVA - relaxar, calmo, suave, violão
        // =====================================================
        if (text.contains("bossa") || text.contains("bossa nova") ||
            text.contains("violão") || text.contains("suave") ||
            text.contains("relaxar") || text.contains("relax") ||
            text.contains("calmo") || text.contains("calma") ||
            text.contains("tranquilo") || text.contains("tranquila") ||
            text.contains("descansar") || text.contains("paz") ||
            text.contains("tom jobim") || text.contains("ipanema") ||
            text.contains("acalmar") || text.contains("leve")) {
            return "Bossa Nova";
        }

        // =====================================================
        // MPB - brasileiro, Brasil, saudade
        // =====================================================
        if (text.contains("mpb") || text.contains("brasileira") ||
            text.contains("brasileiro") || text.contains("brasil") ||
            text.contains("saudade") || text.contains("chico buarque") ||
            text.contains("nacional") || text.contains("samba")) {
            return "MPB";
        }

        // =====================================================
        // CLÁSSICA - foco, estudar, concentrar, piano, orquestra
        // =====================================================
        if (text.contains("classica") || text.contains("clássica") ||
            text.contains("classical") || text.contains("orquestra") ||
            text.contains("violin") || text.contains("violino") ||
            text.contains("piano") || text.contains("beethoven") ||
            text.contains("mozart") || text.contains("bach") ||
            text.contains("foco") || text.contains("focar") ||
            text.contains("focus") || text.contains("estudar") ||
            text.contains("estudando") || text.contains("estudo") ||
            text.contains("concentrar") || text.contains("trabalhar") ||
            text.contains("trabalho") || text.contains("produtivo") ||
            text.contains("ler") || text.contains("leitura") ||
            text.contains("profundo") || text.contains("profundamente")) {
            return "Clássica";
        }

        // =====================================================
        // METAL - pesado, intenso, agressivo
        // =====================================================
        if (text.contains("metal") || text.contains("heavy") ||
            text.contains("metallica") || text.contains("pesado") ||
            text.contains("intenso") || text.contains("forte") ||
            text.contains("agressivo") || text.contains("iron maiden")) {
            return "Metal";
        }

        // =====================================================
        // GRUNGE - anos 90, nirvana, alternativo
        // =====================================================
        if (text.contains("grunge") || text.contains("nirvana") ||
            text.contains("anos 90") || text.contains("90s") ||
            text.contains("noventa") || text.contains("alternativo") ||
            text.contains("seattle") || text.contains("pearl jam") ||
            text.contains("nostalgia") || text.contains("nostalgico")) {
            return "Grunge";
        }

        // =====================================================
        // CONTEXTOS GENÉRICOS
        // =====================================================

        // Dormir/Sono → Bossa Nova (mais calmo)
        if (text.contains("sono") || text.contains("dormir") ||
            text.contains("sleep") || text.contains("soneca") ||
            text.contains("descanso") || text.contains("noite")) {
            return "Bossa Nova";
        }

        // Exercício/Treino → Rock
        if (text.contains("treino") || text.contains("treinar") ||
            text.contains("academia") || text.contains("malhar") ||
            text.contains("correr") || text.contains("gym") ||
            text.contains("workout")) {
            return "Rock";
        }

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
