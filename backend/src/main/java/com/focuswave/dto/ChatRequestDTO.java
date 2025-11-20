package com.focuswave.dto;

public class ChatRequestDTO {
    private String goal;
    private Integer lastMusicId;

    public ChatRequestDTO() {

    }

    public ChatRequestDTO(String goal) {
        this.goal = goal;
    }

    public String getGoal() {
        return goal;
    }

    public void setGoal(String goal) {
        this.goal = goal;
    }

    public Integer getLastMusicId() {
        return lastMusicId;
    }

    public void setLastMusicId(Integer lastMusicId) {
        this.lastMusicId = lastMusicId;
    }
}
