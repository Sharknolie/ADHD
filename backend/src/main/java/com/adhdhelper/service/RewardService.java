package com.adhdhelper.service;

import com.adhdhelper.api.dto.RewardDto;
import com.adhdhelper.api.dto.RewardHistoryEntry;
import com.adhdhelper.domain.RewardBatch;
import com.adhdhelper.domain.RewardHistoryRow;
import com.adhdhelper.domain.RewardItem;
import com.adhdhelper.mapper.RewardBatchMapper;
import com.adhdhelper.mapper.RewardItemMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class RewardService {
    private final RewardBatchMapper rewardBatchMapper;
    private final RewardItemMapper rewardItemMapper;

    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    public RewardService(RewardBatchMapper rewardBatchMapper, RewardItemMapper rewardItemMapper) {
        this.rewardBatchMapper = rewardBatchMapper;
        this.rewardItemMapper = rewardItemMapper;
    }

    @Transactional
    public RewardHistoryEntry saveHistory(List<String> rewards) {
        RewardBatch batch = new RewardBatch();
        batch.setCreatedAt(java.time.LocalDateTime.now());
        rewardBatchMapper.insert(batch);

        for (String text : rewards) {
            RewardItem item = new RewardItem();
            item.setBatchId(batch.getId());
            item.setRewardText(text);
            item.setStatus("earned");
            rewardItemMapper.insert(item);
        }

        String date = FORMATTER.format(batch.getCreatedAt());
        return new RewardHistoryEntry(batch.getId(), date, new ArrayList<>());
    }

    public List<RewardHistoryEntry> listHistory() {
        List<RewardHistoryRow> rows = rewardItemMapper.findHistoryRows();
        Map<Long, RewardHistoryEntry> grouped = new LinkedHashMap<>();
        for (RewardHistoryRow row : rows) {
            RewardHistoryEntry entry = grouped.computeIfAbsent(
                    row.getBatchId(),
                    id -> new RewardHistoryEntry(id, FORMATTER.format(row.getBatchCreatedAt()), new ArrayList<>())
            );
            entry.getRewards().add(new RewardDto(row.getItemId(), row.getRewardText()));
        }
        return new ArrayList<>(grouped.values());
    }

    public void consume(Long id, String action) {
        String normalized = action == null ? "" : action.trim().toLowerCase();
        if (!normalized.equals("used") && !normalized.equals("deleted")) {
            throw new IllegalArgumentException("Invalid action");
        }
        rewardItemMapper.updateStatus(id, normalized);
    }

    @Transactional
    public void clearHistory() {
        rewardItemMapper.deleteAll();
        rewardItemMapper.deleteAllBatches();
    }
}
