package com.skillshare.app.posts.service;

import com.skillshare.app.posts.dto.*;
import com.skillshare.app.posts.exception.ResourceNotFoundException;
import com.skillshare.app.posts.exception.UnauthorizedException;
import com.skillshare.app.posts.model.*;
import com.skillshare.app.posts.repository.*;
import com.skillshare.app.posts.util.EntityDtoMapper;
import com.skillshare.app.user.exception.UserException;
import com.skillshare.app.user.model.User;
import com.skillshare.app.user.repository.UserRepository;
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
    private final UserRepository userRepository;
    private final EntityDtoMapper mapper;

    // Post Operations
    @Transactional
    public SkillPostDto createPost(SkillPostDto postDto) {
        User user = userRepository.findById(postDto.getUserId())
            .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + postDto.getUserId()));

        SkillPost post = mapper.toSkillPost(postDto, user);

        // Ensure mediaUrls is set properly
        if (post.getMediaUrls() == null) {
            post.setMediaUrls(new ArrayList<>());
        }

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

    @Transactional(readOnly = true)
    public Page<SkillPostDto> getUserPosts(Long userId, Pageable pageable) {
        return postRepository.findByUserId(userId, pageable)
            .map(mapper::toSkillPostDto);
    }

    @Transactional(readOnly = true)
    public List<SkillPostDto> getPostsByCategory(String category) {
        return postRepository.findBySkillCategory(category).stream()
            .map(mapper::toSkillPostDto)
            .collect(Collectors.toList());
    }

    @Transactional
    public SkillPostDto updatePost(Long id, SkillPostDto postDto, Long userId) {
        SkillPost post = postRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Post not found with id: " + id));

        // Verify ownership
        if (!post.getUser().getId().equals(userId)) {
            throw new UnauthorizedException("You are not authorized to update this post");
        }

        post.setTitle(postDto.getTitle());
        post.setDescription(postDto.getDescription());
        post.setSkillCategory(postDto.getSkillCategory());
        post.setMediaUrls(postDto.getMediaUrls());

        SkillPost updatedPost = postRepository.save(post);
        return mapper.toSkillPostDto(updatedPost);
    }

    @Transactional
    public void deletePost(Long id, Long userId) {
        SkillPost post = postRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Post not found with id: " + id));

        // Verify ownership
        if (!post.getUser().getId().equals(userId)) {
            throw new UnauthorizedException("You are not authorized to delete this post");
        }

        postRepository.delete(post);
    }

    // Comment Operations
    @Transactional
    public CommentDto addComment(Long postId, CommentDto commentDto) {
        SkillPost post = postRepository.findById(postId)
            .orElseThrow(() -> new ResourceNotFoundException("Post not found with id: " + postId));

        User user = userRepository.findById(commentDto.getUserId())
            .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + commentDto.getUserId()));

        Comment comment = new Comment();
        comment.setContent(commentDto.getContent());
        comment.setUser(user);
        comment.setPost(post);

        if (commentDto.getParentCommentId() != null) {
            Comment parent = commentRepository.findById(commentDto.getParentCommentId())
                .orElseThrow(() -> new ResourceNotFoundException("Parent comment not found"));
            comment.setParentComment(parent);
        }

        Comment savedComment = commentRepository.save(comment);
        return mapper.toCommentDto(savedComment);
    }

    @Transactional
    public CommentDto updateComment(Long commentId, CommentDto commentDto, Long userId) {
        Comment comment = commentRepository.findById(commentId)
            .orElseThrow(() -> new ResourceNotFoundException("Comment not found with id: " + commentId));

        // Verify ownership
        if (!comment.getUser().getId().equals(userId)) {
            throw new UnauthorizedException("You are not authorized to update this comment");
        }

        comment.setContent(commentDto.getContent());
        Comment updatedComment = commentRepository.save(comment);
        return mapper.toCommentDto(updatedComment);
    }

    @Transactional
    public void deleteComment(Long commentId, Long userId) {
        Comment comment = commentRepository.findById(commentId)
            .orElseThrow(() -> new ResourceNotFoundException("Comment not found with id: " + commentId));

        // Verify ownership
        if (!comment.getUser().getId().equals(userId)) {
            throw new UnauthorizedException("You are not authorized to delete this comment");
        }

        commentRepository.delete(comment);
    }

    // Like Operations
    @Transactional
    public LikeDto likePost(Long postId, Long userId) {
        SkillPost post = postRepository.findById(postId)
            .orElseThrow(() -> new ResourceNotFoundException("Post not found with id: " + postId));

        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        likeRepository.findByUserIdAndPostId(userId, postId)
            .ifPresent(_ -> {
                throw new IllegalStateException("User already liked this post");
            });

        Like like = new Like();
        like.setUser(user);
        like.setPost(post);
        Like savedLike = likeRepository.save(like);
        return mapper.toLikeDto(savedLike);
    }

    @Transactional
    public void unlikePost(Long postId, Long userId) {
        Like like = likeRepository.findByUserIdAndPostId(userId, postId)
            .orElseThrow(() -> new ResourceNotFoundException("Like not found"));
        likeRepository.delete(like);
    }

    @Transactional(readOnly = true)
    public int getLikeCount(Long postId) {
        return likeRepository.countByPostId(postId);
    }

    @Transactional(readOnly = true)
    public boolean hasUserLikedPost(Long postId, Long userId) {
        return likeRepository.findByUserIdAndPostId(userId, postId).isPresent();
    }

    @Transactional(readOnly = true)
    public List<CommentDto> getPostComments(Long postId) {
        return commentRepository.findByPostId(postId).stream()
            .map(mapper::toCommentDto)
            .collect(Collectors.toList());
    }
}