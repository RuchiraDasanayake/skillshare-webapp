package com.skillshare.app.posts.util;

import com.skillshare.app.posts.dto.*;
import com.skillshare.app.posts.model.*;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

@Component
public class EntityDtoMapper {

    public SkillPostDto toSkillPostDto(SkillPost post) {
        SkillPostDto dto = new SkillPostDto();
        dto.setId(post.getId());
        dto.setTitle(post.getTitle());
        dto.setDescription(post.getDescription());
        dto.setUserId(post.getUserId());
        dto.setSkillCategory(post.getSkillCategory());
        dto.setCreatedAt(post.getCreatedAt());
        dto.setUpdatedAt(post.getUpdatedAt());
        
        // Convert media files
        if (post.getMediaFiles() != null) {
            dto.setMediaFiles(post.getMediaFiles().stream()
                .map(this::toMediaDto)
                .collect(Collectors.toList()));
        }
        
        // Convert comments
        if (post.getComments() != null) {
            dto.setComments(post.getComments().stream()
                .map(this::toCommentDto)
                .collect(Collectors.toList()));
        }
        
        // Convert likes
        if (post.getLikes() != null) {
            dto.setLikes(post.getLikes().stream()
                .map(this::toLikeDto)
                .collect(Collectors.toList()));
        }
        
        return dto;
    }

    public MediaDto toMediaDto(Media media) {
        MediaDto dto = new MediaDto();
        dto.setId(media.getId());
        dto.setFileName(media.getFileName());
        dto.setFileType(media.getFileType());
        dto.setFileUrl(media.getFileUrl());
        dto.setFileSize(media.getFileSize());
        dto.setPostId(media.getPost() != null ? media.getPost().getId() : null);
        dto.setUploadedAt(media.getUploadedAt() != null ? media.getUploadedAt().toString() : null);
        return dto;
    }

    public CommentDto toCommentDto(Comment comment) {
        CommentDto dto = new CommentDto();
        dto.setId(comment.getId());
        dto.setContent(comment.getContent());
        dto.setUserId(comment.getUserId());
        dto.setPostId(comment.getPost() != null ? comment.getPost().getId() : null);
        dto.setParentCommentId(comment.getParentComment() != null ? comment.getParentComment().getId() : null);
        dto.setCreatedAt(comment.getCreatedAt());
        dto.setUpdatedAt(comment.getUpdatedAt());
        return dto;
    }

    public LikeDto toLikeDto(Like like) {
        LikeDto dto = new LikeDto();
        dto.setId(like.getId());
        dto.setUserId(like.getUserId());
        dto.setPostId(like.getPost() != null ? like.getPost().getId() : null);
        dto.setCreatedAt(like.getCreatedAt());
        return dto;
    }

    // Optional: Reverse mapping methods if needed
    public SkillPost toSkillPost(SkillPostDto dto) {
        SkillPost post = new SkillPost();
        post.setId(dto.getId());
        post.setTitle(dto.getTitle());
        post.setDescription(dto.getDescription());
        post.setUserId(dto.getUserId());
        post.setSkillCategory(dto.getSkillCategory());
        return post;
    }

    public Media toMedia(MediaDto dto) {
        Media media = new Media();
        media.setId(dto.getId());
        media.setFileName(dto.getFileName());
        media.setFileType(dto.getFileType());
        media.setFileUrl(dto.getFileUrl());
        media.setFileSize(dto.getFileSize());
        return media;
    }
}