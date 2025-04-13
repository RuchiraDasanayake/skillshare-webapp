package com.skillshare.app.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class NotificationDTO {
    private Long id;
    private Long recipientId;
    private Long senderId;
    private String senderName;
    private Long postId;
    private String message;
    private String type;
    private boolean isRead;
    private LocalDateTime createdAt;
}