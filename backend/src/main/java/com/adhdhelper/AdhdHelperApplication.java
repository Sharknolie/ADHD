package com.adhdhelper;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@MapperScan("com.adhdhelper.mapper")
public class AdhdHelperApplication {
    public static void main(String[] args) {
        SpringApplication.run(AdhdHelperApplication.class, args);
    }
}
