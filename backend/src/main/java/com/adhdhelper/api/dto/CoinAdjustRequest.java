package com.adhdhelper.api.dto;

import jakarta.validation.constraints.NotNull;

public class CoinAdjustRequest {
    @NotNull
    private Integer delta;

    public Integer getDelta() { return delta; }
    public void setDelta(Integer delta) { this.delta = delta; }
}
