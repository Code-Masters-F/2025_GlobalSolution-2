package com.focuswave.dto;

public class ChatRequestDTO {
    private String goal;

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
}
