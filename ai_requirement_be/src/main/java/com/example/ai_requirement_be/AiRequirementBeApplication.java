package com.example.ai_requirement_be;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class AiRequirementBeApplication {

    public static void main(String[] args) {
        SpringApplication.run(AiRequirementBeApplication.class, args);
    }

}
