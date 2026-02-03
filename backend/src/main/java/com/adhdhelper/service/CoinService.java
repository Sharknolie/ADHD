package com.adhdhelper.service;

import com.adhdhelper.domain.AppState;
import com.adhdhelper.mapper.AppStateMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CoinService {
    private final AppStateMapper appStateMapper;

    public CoinService(AppStateMapper appStateMapper) {
        this.appStateMapper = appStateMapper;
    }

    @Transactional
    public int getCoins() {
        AppState state = appStateMapper.get();
        if (state == null) {
            AppState init = new AppState();
            init.setCoins(0);
            appStateMapper.upsert(init);
            return 0;
        }
        return state.getCoins();
    }

    @Transactional
    public int adjustCoins(int delta) {
        int current = getCoins();
        int next = current + delta;
        if (next < 0) {
            next = 0;
        }
        appStateMapper.updateCoins(next);
        return next;
    }
}
