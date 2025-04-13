import React, { useEffect, useState } from 'react';
import { Badge, IconButton, Popover } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import NotificationList from './NotificationList';
import { getUnreadNotificationCount, getNotifications } from '../api/notificationApi';
import { useWebSocket } from '../hooks/useWebSocket';

const NotificationBadge: React.FC<{ userId: number }> = ({ userId }) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [unreadCount, setUnreadCount] = useState(0);
    const [notifications, setNotifications] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    
    // Set up WebSocket connection for real-time notifications
    const { lastMessage } = useWebSocket();
    
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
        fetchNotifications();
    };
    
    const handleClose = () => {
        setAnchorEl(null);
    };
    
    const fetchUnreadCount = async () => {
        try {
            const count = await getUnreadNotificationCount(userId);
            setUnreadCount(count);
        } catch (error) {
            console.error('Error fetching unread notification count:', error);
        }
    };
    
    const fetchNotifications = async () => {
        setLoading(true);
        try {
            const data = await getNotifications(userId);
            setNotifications(data);
            fetchUnreadCount();
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setLoading(false);
        }
    };
    
    const refreshNotifications = () => {
        fetchNotifications();
        fetchUnreadCount();
    };
    
    useEffect(() => {
        fetchUnreadCount();
        
        // Refresh count every 30 seconds in case of missed WebSocket updates
        const interval = setInterval(fetchUnreadCount, 30000);
        return () => clearInterval(interval);
    }, [userId]);
    
    useEffect(() => {
        if (lastMessage) {
            fetchUnreadCount();
        }
    }, [lastMessage]);
    
    const open = Boolean(anchorEl);
    const id = open ? 'notification-popover' : undefined;
    
    return (
        <>
            <IconButton 
                color="inherit" 
                onClick={handleClick}
                aria-describedby={id}
            >
                <Badge badgeContent={unreadCount} color="error">
                    <NotificationsIcon />
                </Badge>
            </IconButton>
            
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                sx={{
                    '& .MuiPaper-root': {
                        width: 400,
                        maxHeight: 500,
                        p: 2
                    }
                }}
            >
                <NotificationList 
                    notifications={notifications} 
                    loading={loading}
                    unreadCount={unreadCount}
                    refreshNotifications={refreshNotifications}
                />
            </Popover>
        </>
    );
};

export default NotificationBadge;