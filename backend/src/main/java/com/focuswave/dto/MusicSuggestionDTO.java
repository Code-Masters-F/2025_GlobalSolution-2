package com.focuswave.dto;

public class MusicSuggestionDTO {
    private int id;
    private String title;
    private String description;
    private String url;
    private String category;

    public MusicSuggestionDTO() {

    }

    public MusicSuggestionDTO(int id, String title, String description, String url, String category) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.url = url;
        this.category = category;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

}
