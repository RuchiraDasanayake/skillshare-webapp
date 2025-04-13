package com.skillshare.app.service;

import com.skillshare.app.dto.PostDTO;
import com.skillshare.app.exception.ResourceNotFoundException;
import com.skillshare.app.model.Post;
import com.skillshare.app.model.User;
import com.skillshare.app.repository.PostRepository;
import com.skillshare.app.repository.UserRepository;
import com.skillshare.app.model.Notification; // Ensure this is the correct package for Notification
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PostService {
    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    public PostService(PostRepository postRepository, UserRepository userRepository, 
                      NotificationService notificationService) {
        this.postRepository = postRepository;
        this.userRepository = userRepository;
        this.notificationService = notificationService;
    }

    @Transactional
    public PostDTO createPost(PostDTO postDTO) {
        User user = userRepository.findById(postDTO.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Post post = new Post();
        post.setUser(user);
        post.setContent(postDTO.getContent());
        post.setCreatedAt(LocalDateTime.now());

        Post savedPost = postRepository.save(post);
        return convertToDTO(savedPost);
    }

    @Transactional(readOnly = true)
    public List<PostDTO> getUserPosts(Long userId) {
        return postRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Page<PostDTO> getAllPosts(Pageable pageable) {
        return postRepository.findAllByOrderByCreatedAtDesc(pageable)
                .map(this::convertToDTO);
    }

    @Transactional
    public void toggleLike(Long postId, Long userId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found"));

        if (post.getLikedBy().contains(userId)) {
            post.getLikedBy().remove(userId);
        } else {
            post.getLikedBy().add(userId);
            if (!post.getUser().getId().equals(userId)) {
                createLikeNotification(post, userId);
            }
        }
        postRepository.save(post);
    }

    private void createLikeNotification(Post post, Long likerId) {
        User liker = userRepository.findById(likerId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Notification notification = new Notification();
        notification.setRecipient(post.getUser());
        notification.setSender(liker);
        notification.setPost(post);
        notification.setMessage(liker.getUsername() + " liked your post");
        notification.setType("LIKE");

        notificationService.createNotification(notification);
    }

    private PostDTO convertToDTO(Post post) {
        PostDTO dto = new PostDTO();
        dto.setId(post.getId());
        dto.setUserId(post.getUser().getId());
        dto.setUsername(post.getUser().getUsername());
        dto.setContent(post.getContent());
        dto.setCreatedAt(post.getCreatedAt());
        dto.setLikedBy(post.getLikedBy());
        dto.setCommentCount((long) post.getComments().size());
        return dto;
    }
}