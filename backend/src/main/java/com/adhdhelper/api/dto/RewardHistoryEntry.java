package com.adhdhelper.api.dto;

import java.util.List;

public class RewardHistoryEntry {
    private Long batchId;
    private String date;
    private List<RewardDto> rewards;

    public RewardHistoryEntry() {}

    public RewardHistoryEntry(Long batchId, String date, List<RewardDto> rewards) {
        this.batchId = batchId;
        this.date = date;
        this.rewards = rewards;
    }

    public Long getBatchId() { return batchId; }
    public void setBatchId(Long batchId) { this.batchId = batchId; }

    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }

    public List<RewardDto> getRewards() { return rewards; }
    public void setRewards(List<RewardDto> rewards) { this.rewards = rewards; }
}
