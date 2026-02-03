package com.adhdhelper.api.dto;

public class CoinResponse {
    private Integer coins;

    public CoinResponse() {}
    public CoinResponse(Integer coins) { this.coins = coins; }

    public Integer getCoins() { return coins; }
    public void setCoins(Integer coins) { this.coins = coins; }
}
