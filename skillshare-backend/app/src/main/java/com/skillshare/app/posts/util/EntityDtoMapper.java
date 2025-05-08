package com.skillshare.app.posts.util;

import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import com.skillshare.app.posts.dto.CommentDto;
import com.skillshare.app.posts.dto.LikeDto;
import com.skillshare.app.posts.dto.SkillPostDto;
import com.skillshare.app.posts.model.Comment;
import com.skillshare.app.posts.model.Like;
import com.skillshare.app.posts.model.SkillPost;
import com.skillshare.app.user.model.User;

@Component
public class EntityDtoMapper {

    // Convert SkillPost entity to SkillPostDto
    public SkillPostDto toSkillPostDto(SkillPost post) {
        SkillPostDto dto = new SkillPostDto();
        dto.setId(post.getId());
        dto.setTitle(post.getTitle());
        dto.setDescription(post.getDescription());
        dto.setSkillCategory(post.getSkillCategory());
        dto.setCreatedAt(post.getCreatedAt());
        dto.setUpdatedAt(post.getUpdatedAt());
        dto.setMediaUrls(post.getMediaUrls());

        // ✅ Extract user ID from User object
        if (post.getUser() != null) {
            dto.setUserId(post.getUser().getId());
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

    // Convert Comment entity to CommentDto
    public CommentDto toCommentDto(Comment comment) {
        CommentDto dto = new CommentDto();
        dto.setId(comment.getId());
        dto.setContent(comment.getContent());
        dto.setUserId(comment.getUser().getId()); // ✅ From User object
        dto.setPostId(comment.getPost() != null ? comment.getPost().getId() : null);
        dto.setParentCommentId(comment.getParentComment() != null ? comment.getParentComment().getId() : null);
        dto.setCreatedAt(comment.getCreatedAt());
        dto.setUpdatedAt(comment.getUpdatedAt());
        return dto;
    }

    // Convert Like entity to LikeDto
    public LikeDto toLikeDto(Like like) {
        LikeDto dto = new LikeDto();
        dto.setId(like.getId());
        dto.setUserId(like.getUser().getId()); // ✅ From User object
        dto.setPostId(like.getPost() != null ? like.getPost().getId() : null);
        dto.setCreatedAt(like.getCreatedAt());
        return dto;
    }

    // Convert SkillPostDto to SkillPost (requires full User object)
    public SkillPost toSkillPost(SkillPostDto dto, User user) {
        SkillPost post = new SkillPost();
        post.setId(dto.getId());
        post.setTitle(dto.getTitle());
        post.setDescription(dto.getDescription());
        post.setSkillCategory(dto.getSkillCategory());
        post.setMediaUrls(dto.getMediaUrls());
        post.setUser(user); // ✅ Assign full user entity
        return post;
    }
}
