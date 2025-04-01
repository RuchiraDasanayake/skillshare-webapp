package com.skillshare.app.posts.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class LikeDto {
    private Long id;
    private String userId;
    private Long postId;
    private LocalDateTime createdAt;
}