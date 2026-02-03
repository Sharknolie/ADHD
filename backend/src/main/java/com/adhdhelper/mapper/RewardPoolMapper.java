package com.adhdhelper.mapper;

import com.adhdhelper.domain.RewardPoolItem;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface RewardPoolMapper {
    @Select("SELECT id, reward_text AS text, created_at FROM reward_pool ORDER BY id DESC")
    List<RewardPoolItem> findAll();

    @Insert("INSERT INTO reward_pool (reward_text) VALUES (#{text})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(RewardPoolItem item);

    @Delete("DELETE FROM reward_pool WHERE id = #{id}")
    int delete(Long id);
}
