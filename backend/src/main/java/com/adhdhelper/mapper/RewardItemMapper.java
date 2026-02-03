package com.adhdhelper.mapper;

import com.adhdhelper.domain.RewardHistoryRow;
import com.adhdhelper.domain.RewardItem;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface RewardItemMapper {
    @Insert("INSERT INTO reward_item (batch_id, reward_text, status, created_at) VALUES (#{batchId}, #{rewardText}, #{status}, NOW())")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(RewardItem item);

    @Select("""
            SELECT b.id AS batch_id,
                   b.created_at AS batch_created_at,
                   i.id AS item_id,
                   i.reward_text,
                   i.status
            FROM reward_batch b
            JOIN reward_item i ON i.batch_id = b.id
            WHERE i.status = 'earned'
            ORDER BY b.created_at DESC, i.id ASC
            """)
    List<RewardHistoryRow> findHistoryRows();

    @Update("UPDATE reward_item SET status = #{status} WHERE id = #{id}")
    int updateStatus(@Param("id") Long id, @Param("status") String status);

    @Delete("DELETE FROM reward_item")
    int deleteAll();

    @Delete("DELETE FROM reward_batch")
    int deleteAllBatches();
}
