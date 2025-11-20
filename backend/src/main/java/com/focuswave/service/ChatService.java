package com.focuswave.service;

import com.focuswave.dto.MusicSuggestionDTO;

import java.util.ArrayList;
import java.util.List;

public class ChatService {

    public List<MusicSuggestionDTO> getSuggestions(String goal) {

        if (goal == null || goal.isEmpty()) {
            return new ArrayList<>();
        }

        // Normaliza o texto para evitar problemas com maiúsculas/minúsculas
        String normalized = goal.trim().toLowerCase();

        List<MusicSuggestionDTO> suggestions = new ArrayList<>();

        // Lógica simples do MVP — baseada em palavras-chave
        if (normalized.contains("foco") || normalized.contains("focus") || normalized.contains("estudar")) {

            suggestions.add(new MusicSuggestionDTO(
                    1,
                    "Deep Focus 432hz",
                    "Música binaural ideal para concentração.",
                    "https://yourmusicurl.com/focus1",
                    "focus"
            ));

            suggestions.add(new MusicSuggestionDTO(
                    2,
                    "Alpha Waves",
                    "Ondas binaurais alfa para produtividade.",
                    "https://yourmusicurl.com/focus2",
                    "focus"
            ));
        }
        else if (normalized.contains("relax") || normalized.contains("descansar")) {

            suggestions.add(new MusicSuggestionDTO(
                    3,
                    "Calm Ocean",
                    "Som de mar com frequência relaxante.",
                    "https://yourmusicurl.com/relax1",
                    "relax"
            ));

            suggestions.add(new MusicSuggestionDTO(
                    4,
                    "Deep Breathing Waves",
                    "Binaural suave para reduzir ansiedade.",
                    "https://yourmusicurl.com/relax2",
                    "relax"
            ));
        }
        else if (normalized.contains("dormir") || normalized.contains("sono") || normalized.contains("sleep")) {

            suggestions.add(new MusicSuggestionDTO(
                    5,
                    "Delta Sleep 528hz",
                    "Música binaural para indução ao sono.",
                    "https://yourmusicurl.com/sleep1",
                    "sleep"
            ));
        }
        else {
            // fallback padrão caso a intenção não seja reconhecida
            suggestions.add(new MusicSuggestionDTO(
                    99,
                    "Binaural Genérico",
                    "Música neutra para foco ou relaxamento leve.",
                    "https://yourmusicurl.com/default",
                    "neutral"
            ));
        }

        return suggestions;
    }
}
