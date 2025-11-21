package com.focuswave.model;

import java.sql.Timestamp;

public class MusicHistory {
    private int id;
    private int idUser;
    private int idMusic;
    private Timestamp playedAt;

    public MusicHistory(int id, int idUser, int idMusic, Timestamp playedAt) {
        this.id = id;
        this.idUser = idUser;
        this.idMusic = idMusic;
        this.playedAt = playedAt;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getIdUser() {
        return idUser;
    }

    public void setIdUser(int id_user) {
        this.idUser = id_user;
    }

    public int getIdMusic() {
        return idMusic;
    }

    public void setIdMusic(int id_music) {
        this.idMusic = id_music;
    }

    public Timestamp getPlayedAt() {
        return playedAt;
    }

    public void setPlayedAt(Timestamp playedAt) {
        this.playedAt = playedAt;
    }
}




