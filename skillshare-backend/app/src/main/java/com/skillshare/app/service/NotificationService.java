package com.skillshare.app.service;

import com.skillshare.app.dto.NotificationDTO;
import com.skillshare.app.model.*;
import com.skillshare.app.repository.NotificationRepository;
import com.skillshare.app.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class NotificationService {
    @Autowired
    private NotificationRepository notificationRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private SimpMessagingTemplate messagingTemplate;
    
    public void notifyLike(Post post, User liker) {
        String message = liker.getUsername() + " liked your post: " + post.getTitle();
        createNotification(post.getUser(), message, "LIKE", liker, post);
    }
    
    public void notifyComment(Post post, User commenter, String commentText) {
        String message = commenter.getUsername() + " commented on your post: " + 
                         (commentText.length() > 30 ? commentText.substring(0, 30) + "..." : commentText);
        createNotification(post.getUser(), message, "COMMENT", commenter, post);
    }
    
    public void notifyFollow(User followedUser, User follower) {
        String message = follower.getUsername() + " started following you";
        createNotification(followedUser, message, "FOLLOW", follower, null);
    }
    
    public void notifyProgressUpdate(User user, LearningProgress progress) {
        String message = "You updated your progress in " + progress.getSkill() + ": " + 
                         progress.getProgressTitle() + " (" + progress.getCompletionPercentage() + "%)";
        createNotification(user, message, "PROGRESS_UPDATE", null, null);
    }
    
    private void createNotification(User recipient, String message, String type, User sender, Post post) {
        Notification notification = new Notification();
        notification.setRecipient(recipient);
        notification.setMessage(message);
        notification.setType(type);
        notification.setSender(sender);
        notification.setPost(post);
        
        Notification savedNotification = notificationRepository.save(notification);
        
        // Send real-time notification via WebSocket
        messagingTemplate.convertAndSendToUser(
                recipient.getUsername(), 
                "/queue/notifications", 
                convertToDTO(savedNotification)
        );
    }
    
    public List<NotificationDTO> getUserNotifications(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        return notificationRepository.findByRecipientOrderByCreatedAtDesc(user).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public List<NotificationDTO> getUnreadNotifications(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        return notificationRepository.findByRecipientAndIsReadOrderByCreatedAtDesc(user, false).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public long getUnreadNotificationCount(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        return notificationRepository.countByRecipientAndIsRead(user, false);
    }
    
    public void markAsRead(Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        
        notification.setRead(true);
        notificationRepository.save(notification);
    }
    
    public void markAllAsRead(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        List<Notification> unreadNotifications = notificationRepository.findByRecipientAndIsRead(user, false);
        unreadNotifications.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(unreadNotifications);
    }
    
    private NotificationDTO convertToDTO(Notification notification) {
        NotificationDTO dto = new NotificationDTO();
        dto.setId(notification.getId());
        dto.setRecipientId(notification.getRecipient().getId());
        dto.setMessage(notification.getMessage());
        dto.setType(notification.getType());
        dto.setRead(notification.isRead());
        dto.setCreatedAt(notification.getCreatedAt());
        
        if (notification.getSender() != null) {
            dto.setSenderId(notification.getSender().getId());
            dto.setSenderName(notification.getSender().getUsername());
        }
        
        if (notification.getPost() != null) {
            dto.setPostId(notification.getPost().getId());
        }
        
        return dto;
    }
}