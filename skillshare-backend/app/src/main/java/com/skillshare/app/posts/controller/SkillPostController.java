package com.skillshare.app.posts.controller;

import com.skillshare.app.posts.dto.*;
import com.skillshare.app.posts.service.SkillPostService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
public class SkillPostController {

    private final SkillPostService skillPostService;

    @PostMapping
    public ResponseEntity<SkillPostDto> createPost(
            @RequestBody @Valid SkillPostDto postDto) {
        SkillPostDto createdPost = skillPostService.createPost(postDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdPost);
    }

    @GetMapping("/{id}")
    public ResponseEntity<SkillPostDto> getPostById(@PathVariable Long id) {
        SkillPostDto post = skillPostService.getPostById(id);
        return ResponseEntity.ok(post);
    }

    @GetMapping("/all")
    public ResponseEntity<Page<SkillPostDto>> getAllPosts(
            @PageableDefault(size = 10) Pageable pageable) {
        Page<SkillPostDto> posts = skillPostService.getAllPosts(pageable);
        return ResponseEntity.ok(posts);
    }

    @PutMapping("/{id}")
    public ResponseEntity<SkillPostDto> updatePost(
            @PathVariable Long id,
            @RequestBody @Valid SkillPostDto postDto) {
        SkillPostDto updatedPost = skillPostService.updatePost(id, postDto);
        return ResponseEntity.ok(updatedPost);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePost(@PathVariable Long id) {
        skillPostService.deletePost(id);
        return ResponseEntity.noContent().build();
    }

    // Comment Endpoints
    @PostMapping("/{postId}/comments")
    public ResponseEntity<CommentDto> addComment(
            @PathVariable Long postId,
            @RequestBody @Valid CommentDto commentDto) {
        CommentDto comment = skillPostService.addComment(postId, commentDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(comment);
    }

    @PutMapping("/comments/{commentId}")
    public ResponseEntity<CommentDto> updateComment(
            @PathVariable Long commentId,
            @RequestBody @Valid CommentDto commentDto) {
        CommentDto updatedComment = skillPostService.updateComment(commentId, commentDto);
        return ResponseEntity.ok(updatedComment);
    }

    @DeleteMapping("/comments/{commentId}")
    public ResponseEntity<Void> deleteComment(@PathVariable Long commentId) {
        skillPostService.deleteComment(commentId);
        return ResponseEntity.noContent().build();
    }

    // Like Endpoints
    @PostMapping("/{postId}/likes")
    public ResponseEntity<LikeDto> likePost(
            @PathVariable Long postId,
            @RequestParam String userId) {
        LikeDto like = skillPostService.likePost(postId, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(like);
    }

    @DeleteMapping("/{postId}/likes")
    public ResponseEntity<Void> unlikePost(
            @PathVariable Long postId,
            @RequestParam String userId) {
        skillPostService.unlikePost(postId, userId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{postId}/likes/count")
    public ResponseEntity<Integer> getLikeCount(@PathVariable Long postId) {
        int count = skillPostService.getLikeCount(postId);
        return ResponseEntity.ok(count);
    }

    @GetMapping("/{postId}/likes/check")
    public ResponseEntity<Boolean> hasUserLikedPost(
            @PathVariable Long postId,
            @RequestParam String userId) {
        boolean hasLiked = skillPostService.hasUserLikedPost(postId, userId);
        return ResponseEntity.ok(hasLiked);
    }

    @GetMapping("/{postId}/comments/all")
    public ResponseEntity<List<CommentDto>> getPostComments(@PathVariable Long postId) {
        List<CommentDto> comments = skillPostService.getPostComments(postId);
        return ResponseEntity.ok(comments);
    }
}