package com.skillshare.app.user.dto;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class Varification {
      private boolean status = false;
    private LocalDateTime startedAt;
    private LocalDateTime endsAt;

    private String planType;
    
}
