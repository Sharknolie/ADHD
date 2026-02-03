package com.adhdhelper.api;

import com.adhdhelper.api.dto.RewardConsumeRequest;
import com.adhdhelper.api.dto.RewardHistoryEntry;
import com.adhdhelper.api.dto.RewardPoolCreateRequest;
import com.adhdhelper.api.dto.RewardSaveRequest;
import com.adhdhelper.domain.RewardPoolItem;
import com.adhdhelper.service.RewardPoolService;
import com.adhdhelper.service.RewardService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rewards")
public class RewardController {
    private final RewardService rewardService;
    private final RewardPoolService rewardPoolService;

    public RewardController(RewardService rewardService, RewardPoolService rewardPoolService) {
        this.rewardService = rewardService;
        this.rewardPoolService = rewardPoolService;
    }

    @GetMapping
    public List<RewardPoolItem> listPool() {
        return rewardPoolService.list();
    }

    @PostMapping
    public RewardPoolItem addPoolItem(@Valid @RequestBody RewardPoolCreateRequest request) {
        return rewardPoolService.create(request.getText());
    }

    @DeleteMapping("/{id}")
    public void deletePoolItem(@PathVariable("id") Long id) {
        rewardPoolService.delete(id);
    }

    @GetMapping("/history")
    public List<RewardHistoryEntry> history() {
        return rewardService.listHistory();
    }

    @PostMapping("/history")
    public RewardHistoryEntry save(@Valid @RequestBody RewardSaveRequest request) {
        return rewardService.saveHistory(request.getRewards());
    }

    @PostMapping("/{id}/consume")
    public void consume(@PathVariable("id") Long id, @Valid @RequestBody RewardConsumeRequest request) {
        rewardService.consume(id, request.getAction());
    }

    @DeleteMapping("/history")
    public void clear() {
        rewardService.clearHistory();
    }
}
