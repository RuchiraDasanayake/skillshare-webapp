package com.skillshare.app.dto;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.Set;

@Data
public class PostDTO {
    private Long id;
    private Long userId;
    private String username;
    private String content;
    private LocalDateTime createdAt;
    private Set<Long> likedBy;
    private Long commentCount;
}