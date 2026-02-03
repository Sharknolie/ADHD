package com.adhdhelper.domain;

import java.time.LocalDateTime;

public class RewardHistoryRow {
    private Long batchId;
    private LocalDateTime batchCreatedAt;
    private Long itemId;
    private String rewardText;
    private String status;

    public Long getBatchId() { return batchId; }
    public void setBatchId(Long batchId) { this.batchId = batchId; }

    public LocalDateTime getBatchCreatedAt() { return batchCreatedAt; }
    public void setBatchCreatedAt(LocalDateTime batchCreatedAt) { this.batchCreatedAt = batchCreatedAt; }

    public Long getItemId() { return itemId; }
    public void setItemId(Long itemId) { this.itemId = itemId; }

    public String getRewardText() { return rewardText; }
    public void setRewardText(String rewardText) { this.rewardText = rewardText; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
