package com.focuswave.model;

import java.sql.Timestamp;
import java.time.LocalDateTime;

public class MusicHistory {
    private int id;
    private int id_user;
    private int id_music;
    private Timestamp playedAt;

    public int getIdUser() {
        return id_user;
    }

    public void setIdUser(int id_user) {
        this.id_user = id_user;
    }

    public int getIdMusic() {
        return id_music;
    }

    public void setIdMusic(int id_music) {
        this.id_music = id_music;
    }

    public Timestamp getPlayedAt() {
        return playedAt;
    }

    public void setPlayedAt(Timestamp playedAt) {
        this.playedAt = playedAt;
    }
}




