package com.focuswave.dto;

/**
 * Usado para receber dados de histórico do front
 */
public class HistoryRegisterDTO {
    private int idUser;
    private int idMusic;

    public int getIdUser() {
        return idUser;
    }

    public void setIdUser(int idUser) {
        this.idUser = idUser;
    }

    public int getIdMusic() {
        return idMusic;
    }

    public void setIdMusic(int idMusic) {
        this.idMusic = idMusic;
    }
}
