package com.adhdhelper.api.dto;

import jakarta.validation.constraints.NotEmpty;
import java.util.List;

public class RewardSaveRequest {
    @NotEmpty
    private List<String> rewards;

    public List<String> getRewards() { return rewards; }
    public void setRewards(List<String> rewards) { this.rewards = rewards; }
}
