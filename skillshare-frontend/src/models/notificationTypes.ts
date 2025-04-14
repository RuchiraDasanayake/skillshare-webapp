// src/models/notificationTypes.ts
export interface NotificationDTO {
    id: number;
    recipientId: number;
    senderId?: number;
    senderName?: string;
    postId?: number;
    message: string;
    type: 'LIKE' | 'COMMENT' | 'PROGRESS_UPDATE';
    isRead: boolean;
    createdAt: string;
  }
  