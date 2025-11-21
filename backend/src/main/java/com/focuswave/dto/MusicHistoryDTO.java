package com.focuswave.dto;

import java.sql.Timestamp;

/**
 * Usado para enviar dados de histórico de músicas do back para o front
 */
public class MusicHistoryDTO {
    private int idMusic;
    private String title;
    private String url;
    private Timestamp playedAt;

    public MusicHistoryDTO() {}

    public MusicHistoryDTO(int idMusic, String title, String url, Timestamp playedAt) {
        this.idMusic = idMusic;
        this.title = title;
        this.url = url;
        this.playedAt = playedAt;
    }

    public int getIdMusic() {
        return idMusic;
    }

    public void setIdMusic(int id_music) {
        this.idMusic = id_music;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public Timestamp getPlayedAt() {
        return playedAt;
    }

    public void setPlayedAt(Timestamp playedAt) {
        this.playedAt = playedAt;
    }
}



