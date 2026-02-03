package com.adhdhelper.api.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class CreateTaskRequest {
    @NotBlank
    private String content;

    private String category;

    @NotNull
    @Min(1)
    private Integer energy;

    @NotNull
    @Min(1)
    private Integer coins;

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public Integer getEnergy() { return energy; }
    public void setEnergy(Integer energy) { this.energy = energy; }

    public Integer getCoins() { return coins; }
    public void setCoins(Integer coins) { this.coins = coins; }
}
