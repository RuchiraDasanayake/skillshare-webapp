package com.skillshare.app.posts.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
public class SkillPostDto {
    private Long id;
    private String title;
    private String description;
    private String userId;
    private String skillCategory;
    private List<String> mediaUrls = new ArrayList<>(); 
    private List<CommentDto> comments;
    private List<LikeDto> likes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}