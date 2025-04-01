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
import org.springframework.web.multipart.MultipartFile;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SkillPostService {
    private final SkillPostRepository postRepository;
    // private final MediaRepository mediaRepository;
    private final CommentRepository commentRepository;
    private final LikeRepository likeRepository;
    private final MediaService mediaService;
    private final EntityDtoMapper mapper;

    // Post Operations
    @Transactional
    public SkillPostDto createPost(SkillPostDto postDto, List<MultipartFile> files) {
        SkillPost post = new SkillPost();
        post.setTitle(postDto.getTitle());
        post.setDescription(postDto.getDescription());
        post.setUserId(postDto.getUserId());
        post.setSkillCategory(postDto.getSkillCategory());
        
        if (files != null && !files.isEmpty()) {
            files.forEach(file -> {
                Media media = mediaService.uploadMedia(file);
                post.addMediaFile(media);
            });
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

    @Transactional
    public SkillPostDto updatePost(Long id, SkillPostDto postDto) {
        SkillPost post = postRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Post not found with id: " + id));
        
        post.setTitle(postDto.getTitle());
        post.setDescription(postDto.getDescription());
        post.setSkillCategory(postDto.getSkillCategory());
        
        SkillPost updatedPost = postRepository.save(post);
        return mapper.toSkillPostDto(updatedPost);
    }

    @Transactional
    public void deletePost(Long id) {
        SkillPost post = postRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Post not found with id: " + id));
        postRepository.delete(post);
    }

    // Media Operations
    @Transactional
    public MediaDto addMediaToPost(Long postId, MultipartFile file) {
        SkillPost post = postRepository.findById(postId)
            .orElseThrow(() -> new ResourceNotFoundException("Post not found with id: " + postId));
        
        Media media = mediaService.uploadMedia(file);
        post.addMediaFile(media);
        
        return mapper.toMediaDto(media);
    }

    // @Transactional
    // public void removeMediaFromPost(Long postId, Long mediaId) {
    //     Media media = mediaRepository.findByIdAndPostId(mediaId, postId)
    //         .orElseThrow(() -> new ResourceNotFoundException("Media not found with id: " + mediaId));
    //     mediaRepository.delete(media);
    // }

    // Comment Operations
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

    // Like Operations
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

    // Additional methods
    @Transactional(readOnly = true)
    public List<CommentDto> getPostComments(Long postId) {
        return commentRepository.findByPostId(postId).stream()
            .map(mapper::toCommentDto)
            .collect(Collectors.toList());
    }

    // @Transactional(readOnly = true)
    // public List<MediaDto> getPostMedia(Long postId) {
    //     return mediaRepository.findByPostId(postId).stream()
    //         .map(mapper::toMediaDto)
    //         .collect(Collectors.toList());
    // }
}