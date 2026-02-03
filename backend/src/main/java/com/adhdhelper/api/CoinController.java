package com.adhdhelper.api;

import com.adhdhelper.api.dto.CoinAdjustRequest;
import com.adhdhelper.api.dto.CoinResponse;
import com.adhdhelper.service.CoinService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/coins")
public class CoinController {
    private final CoinService coinService;

    public CoinController(CoinService coinService) {
        this.coinService = coinService;
    }

    @GetMapping
    public CoinResponse get() {
        return new CoinResponse(coinService.getCoins());
    }

    @PostMapping("/adjust")
    public CoinResponse adjust(@Valid @RequestBody CoinAdjustRequest request) {
        return new CoinResponse(coinService.adjustCoins(request.getDelta()));
    }
}
