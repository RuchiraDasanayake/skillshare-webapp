package com.skillshare.app.posts.dto;

import java.time.LocalDateTime;

import com.skillshare.app.user.dto.UserDto;

import lombok.Data;

@Data
public class LikeDto {
    private Long id;
    private String userId;
    private Long postId;
    private UserDto user;
    private SkillPostDto post;
    private LocalDateTime createdAt;
}