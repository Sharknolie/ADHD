package com.adhdhelper.api.dto;

import jakarta.validation.constraints.NotBlank;

public class RewardConsumeRequest {
    @NotBlank
    private String action;

    public String getAction() { return action; }
    public void setAction(String action) { this.action = action; }
}
