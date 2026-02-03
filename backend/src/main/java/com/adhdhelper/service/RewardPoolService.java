package com.adhdhelper.service;

import com.adhdhelper.domain.RewardPoolItem;
import com.adhdhelper.mapper.RewardPoolMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RewardPoolService {
    private final RewardPoolMapper rewardPoolMapper;

    public RewardPoolService(RewardPoolMapper rewardPoolMapper) {
        this.rewardPoolMapper = rewardPoolMapper;
    }

    public List<RewardPoolItem> list() {
        return rewardPoolMapper.findAll();
    }

    public RewardPoolItem create(String text) {
        RewardPoolItem item = new RewardPoolItem();
        item.setText(text);
        rewardPoolMapper.insert(item);
        return item;
    }

    public void delete(Long id) {
        rewardPoolMapper.delete(id);
    }
}
