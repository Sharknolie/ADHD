package com.adhdhelper.mapper;

import com.adhdhelper.domain.RewardBatch;
import org.apache.ibatis.annotations.*;

@Mapper
public interface RewardBatchMapper {
    @Insert("INSERT INTO reward_batch (created_at) VALUES (#{createdAt})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(RewardBatch batch);
}
