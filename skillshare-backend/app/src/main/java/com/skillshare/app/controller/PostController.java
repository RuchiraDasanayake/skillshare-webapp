package com.skillshare.app.controller;

import com.skillshare.app.dto.PostDTO;
import com.skillshare.app.service.PostService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/posts")
public class PostController {
    private final PostService postService;

    public PostController(PostService postService) {
        this.postService = postService;
    }

    @PostMapping
    public ResponseEntity<PostDTO> createPost(@RequestBody PostDTO postDTO) {
        PostDTO createdPost = postService.createPost(postDTO);
        return ResponseEntity.ok(createdPost);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<PostDTO>> getUserPosts(@PathVariable Long userId) {
        List<PostDTO> posts = postService.getUserPosts(userId);
        return ResponseEntity.ok(posts);
    }

    @GetMapping
    public ResponseEntity<Page<PostDTO>> getAllPosts(Pageable pageable) {
        Page<PostDTO> posts = postService.getAllPosts(pageable);
        return ResponseEntity.ok(posts);
    }

    @PostMapping("/{postId}/like/{userId}")
    public ResponseEntity<Void> toggleLike(@PathVariable Long postId, @PathVariable Long userId) {
        postService.toggleLike(postId, userId);
        return ResponseEntity.ok().build();
    }
}