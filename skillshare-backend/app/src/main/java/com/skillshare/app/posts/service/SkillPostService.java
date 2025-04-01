package com.skillshare.app.posts.service;

import com.skillshare.app.posts.dto.*;
import com.skillshare.app.posts.exception.ResourceNotFoundException;
import com.skillshare.app.posts.model.*;
import com.skillshare.app.posts.repository.*;
import com.skillshare.app.posts.util.EntityDtoMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SkillPostService {
    private final SkillPostRepository postRepository;
    private final CommentRepository commentRepository;
    private final LikeRepository likeRepository;
    private final EntityDtoMapper mapper;

    // Post Operations
    @Transactional
    public SkillPostDto createPost(SkillPostDto postDto) {
        SkillPost post = new SkillPost();
        post.setTitle(postDto.getTitle());
        post.setDescription(postDto.getDescription());
        post.setUserId(postDto.getUserId());
        post.setSkillCategory(postDto.getSkillCategory());
        // Ensure mediaUrls is set properly
        post.setMediaUrls(postDto.getMediaUrls() != null ? 
            postDto.getMediaUrls() : new ArrayList<>());
        
        SkillPost savedPost = postRepository.save(post);
        return mapper.toSkillPostDto(savedPost);
    }

    @Transactional(readOnly = true)
    public SkillPostDto getPostById(Long id) {
        SkillPost post = postRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Post not found with id: " + id));
        return mapper.toSkillPostDto(post);
    }

    @Transactional(readOnly = true)
    public Page<SkillPostDto> getAllPosts(Pageable pageable) {
        return postRepository.findAll(pageable)
            .map(mapper::toSkillPostDto);
    }

    @Transactional
    public SkillPostDto updatePost(Long id, SkillPostDto postDto) {
        SkillPost post = postRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Post not found with id: " + id));
        
        post.setTitle(postDto.getTitle());
        post.setDescription(postDto.getDescription());
        post.setSkillCategory(postDto.getSkillCategory());
        post.setMediaUrls(postDto.getMediaUrls()); // Update media URLs
        
        SkillPost updatedPost = postRepository.save(post);
        return mapper.toSkillPostDto(updatedPost);
    }

    @Transactional
    public void deletePost(Long id) {
        SkillPost post = postRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Post not found with id: " + id));
        postRepository.delete(post);
    }

    // Comment Operations (unchanged)
    @Transactional
    public CommentDto addComment(Long postId, CommentDto commentDto) {
        SkillPost post = postRepository.findById(postId)
            .orElseThrow(() -> new ResourceNotFoundException("Post not found with id: " + postId));
        
        Comment comment = new Comment();
        comment.setContent(commentDto.getContent());
        comment.setUserId(commentDto.getUserId());
        
        if (commentDto.getParentCommentId() != null) {
            Comment parent = commentRepository.findById(commentDto.getParentCommentId())
                .orElseThrow(() -> new ResourceNotFoundException("Parent comment not found"));
            comment.setParentComment(parent);
        }
        
        post.addComment(comment);
        Comment savedComment = commentRepository.save(comment);
        return mapper.toCommentDto(savedComment);
    }

    @Transactional
    public CommentDto updateComment(Long commentId, CommentDto commentDto) {
        Comment comment = commentRepository.findById(commentId)
            .orElseThrow(() -> new ResourceNotFoundException("Comment not found with id: " + commentId));
        
        comment.setContent(commentDto.getContent());
        Comment updatedComment = commentRepository.save(comment);
        return mapper.toCommentDto(updatedComment);
    }

    @Transactional
    public void deleteComment(Long commentId) {
        Comment comment = commentRepository.findById(commentId)
            .orElseThrow(() -> new ResourceNotFoundException("Comment not found with id: " + commentId));
        commentRepository.delete(comment);
    }

    // Like Operations (unchanged)
    @Transactional
    public LikeDto likePost(Long postId, String userId) {
        SkillPost post = postRepository.findById(postId)
            .orElseThrow(() -> new ResourceNotFoundException("Post not found with id: " + postId));
        
        likeRepository.findByUserIdAndPostId(userId, postId)
            .ifPresent(_ -> {
                throw new IllegalStateException("User already liked this post");
            });
        
        Like like = new Like();
        like.setUserId(userId);
        post.addLike(like);
        Like savedLike = likeRepository.save(like);
        return mapper.toLikeDto(savedLike);
    }

    @Transactional
    public void unlikePost(Long postId, String userId) {
        Like like = likeRepository.findByUserIdAndPostId(userId, postId)
            .orElseThrow(() -> new ResourceNotFoundException("Like not found"));
        likeRepository.delete(like);
    }

    @Transactional(readOnly = true)
    public int getLikeCount(Long postId) {
        return likeRepository.countByPostId(postId);
    }

    @Transactional(readOnly = true)
    public boolean hasUserLikedPost(Long postId, String userId) {
        return likeRepository.findByUserIdAndPostId(userId, postId).isPresent();
    }

    @Transactional(readOnly = true)
    public List<CommentDto> getPostComments(Long postId) {
        return commentRepository.findByPostId(postId).stream()
            .map(mapper::toCommentDto)
            .collect(Collectors.toList());
    }
}