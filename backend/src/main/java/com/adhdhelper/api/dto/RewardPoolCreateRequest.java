package com.adhdhelper.api.dto;

import jakarta.validation.constraints.NotBlank;

public class RewardPoolCreateRequest {
    @NotBlank
    private String text;

    public String getText() { return text; }
    public void setText(String text) { this.text = text; }
}
