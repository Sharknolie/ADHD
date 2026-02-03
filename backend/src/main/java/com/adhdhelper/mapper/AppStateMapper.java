package com.adhdhelper.mapper;

import com.adhdhelper.domain.AppState;
import org.apache.ibatis.annotations.*;

@Mapper
public interface AppStateMapper {
    @Select("SELECT id, coins FROM app_state WHERE id = 1")
    AppState get();

    @Insert("INSERT INTO app_state (id, coins) VALUES (1, #{coins}) ON DUPLICATE KEY UPDATE coins = VALUES(coins)")
    int upsert(AppState state);

    @Update("UPDATE app_state SET coins = #{coins} WHERE id = 1")
    int updateCoins(int coins);
}
