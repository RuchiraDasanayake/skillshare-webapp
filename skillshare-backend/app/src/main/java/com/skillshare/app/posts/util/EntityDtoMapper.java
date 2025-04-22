package com.skillshare.app.posts.util;

import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import com.skillshare.app.posts.dto.CommentDto;
import com.skillshare.app.posts.dto.LikeDto;
import com.skillshare.app.posts.dto.SkillPostDto;
import com.skillshare.app.posts.model.Comment;
import com.skillshare.app.posts.model.Like;
import com.skillshare.app.posts.model.SkillPost;

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
        dto.setMediaUrls(post.getMediaUrls()); 

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
}