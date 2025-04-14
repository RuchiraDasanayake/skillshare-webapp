package com.skillshare.app.service;

import com.skillshare.app.dto.NotificationDTO;
import com.skillshare.app.exception.ResourceNotFoundException;
import com.skillshare.app.model.Notification;
import com.skillshare.app.model.Post;
import com.skillshare.app.model.User;
import com.skillshare.app.repository.NotificationRepository;
import com.skillshare.app.repository.PostRepository;
import com.skillshare.app.repository.UserRepository;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class NotificationService {
    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final PostRepository postRepository;
    private final SimpMessagingTemplate messagingTemplate;

    public NotificationService(NotificationRepository notificationRepository,
                               UserRepository userRepository,
                               PostRepository postRepository,
                               SimpMessagingTemplate messagingTemplate) {
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
        this.postRepository = postRepository;
        this.messagingTemplate = messagingTemplate;
    }

    @Transactional
    public NotificationDTO createNotification(Notification notification) {
        Notification saved = notificationRepository.save(notification);
        sendRealTimeNotification(saved);
        return convertToDTO(saved);
    }

    public void createFromDTO(NotificationDTO dto) {
        User recipient = userRepository.findById(dto.getRecipientId())
            .orElseThrow(() -> new ResourceNotFoundException("Recipient not found"));

        Notification notification = new Notification();
        notification.setRecipient(recipient);
        notification.setMessage(dto.getMessage());
        notification.setType(dto.getType());
        notification.setRead(false);
        notification.setCreatedAt(LocalDateTime.now());

        if (dto.getSenderId() != null) {
            userRepository.findById(dto.getSenderId()).ifPresent(notification::setSender);
        }

        if (dto.getPostId() != null) {
            postRepository.findById(dto.getPostId()).ifPresent(notification::setPost);
        }

        createNotification(notification);
    }

    @Transactional(readOnly = true)
    public List<NotificationDTO> getUserNotifications(Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return notificationRepository.findByRecipientOrderByCreatedAtDesc(user).stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<NotificationDTO> getUnreadNotifications(Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return notificationRepository.findByRecipientAndIsReadOrderByCreatedAtDesc(user, false).stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }

    @Transactional
    public void markAsRead(Long id) {
        notificationRepository.findById(id).ifPresent(n -> {
            n.setRead(true);
            notificationRepository.save(n);
        });
    }

    @Transactional
    public void markAllAsRead(Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        notificationRepository.markAllAsRead(user);
    }

    private void sendRealTimeNotification(Notification notification) {
        messagingTemplate.convertAndSendToUser(
            notification.getRecipient().getId().toString(),
            "/queue/notifications",
            convertToDTO(notification)
        );
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
