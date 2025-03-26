package com.skillshare.app.posts.dto;

import lombok.Data;

@Data
public class MediaDto {
    private Long id;
    private String fileName;
    private String fileType;
    private String fileUrl;
    private Long fileSize;
    private Long postId;
    private String uploadedAt;
}