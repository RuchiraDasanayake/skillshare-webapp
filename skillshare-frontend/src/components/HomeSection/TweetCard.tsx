import { Verified } from '@mui/icons-material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import BarChartIcon from '@mui/icons-material/BarChart';
import FavoriteIcon from '@mui/icons-material/Favorite';
import RepeatIcon from '@mui/icons-material/Repeat';
import { Avatar, Button, Menu, MenuItem } from "@mui/material";
import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import FavoriteOutlined from '@mui/icons-material/FavoriteOutlined';
import ReplyModal from "./ReplyModal";

const TweetCard = () => {
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [isLiked, setIsLiked] = useState(false);
    const [isRetweeted, setIsRetweeted] = useState(false);
    const open = Boolean(anchorEl);
    const [openReplyModel, setOpenReplyModel] = useState(false);

    // Handling reply modal
    const handleOpenReplyModal = () => setOpenReplyModel(true);
    const handleCloseReplyModal = () => setOpenReplyModel(false);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    
    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleDelete = () => {
        console.log("delete tweet");
        handleClose();
    };

    const handleCreateRetweet = () => {
        setIsRetweeted(!isRetweeted);
        console.log("Handle Retweet");
    };

    const handleLikeTweet = () => {
        setIsLiked(!isLiked);
        console.log("Handle Like tweet");
    };

    return (
        <React.Fragment>
            <div className='flex space-x-5'>
                <Avatar onClick={() => navigate(`/profile/${6}`)} className='cursor-pointer' alt='username' src='https://secure.gravatar.com/avatar/3fbe84b93407a82e024390352db2544b?d=https%3A%2F%2Favatar-management--avatars.us-west-2.prod.public.atl-paas.net%2Finitials%2FMP-5.png' />
                <div className='w-full'>
                    <div className='flex justify-between items-center'>
                        <div className='flex cursor-pointer items-center space-x-2'>
                            <span className='font-semibold'>Minsandha Pathirana</span>
                            <span className='text-gray-600'>@Mina   2m</span>
                            <Verified className='ml-2 w-5 h-5 text-[#1d9bf0]' />
                        </div>
                        <div>
                            <Button
                                id="basic-button"
                                aria-controls={open ? 'basic-menu' : undefined}
                                aria-haspopup="true"
                                aria-expanded={open ? 'true' : undefined}
                                onClick={handleClick}
                            >
                                <MoreHorizIcon />
                            </Button>
                            <Menu
                                id="basic-menu"
                                anchorEl={anchorEl}
                                open={open}
                                onClose={handleClose}
                                MenuListProps={{
                                    'aria-labelledby': 'basic-button',
                                }}
                            >
                                <MenuItem onClick={handleDelete}>Delete</MenuItem>
                                <MenuItem onClick={handleDelete}>Edit</MenuItem>
                            </Menu>
                        </div>
                    </div>
                    <div className='mt-5'>
                        <div className='cursor-pointer flex flex-col items-center'>
                            <img className='w-[28rem] border border-gray-400 p-5' src="https://secure.gravatar.com/avatar/3fbe84b93407a82e024390352db2544b?d=https%3A%2F%2Favatar-management--avatars.us-west-2.prod.public.atl-paas.net%2Finitials%2FMP-5.png" alt="" />
                        </div>
                        <p className='mb-7 mt-5'>Welcome Here Man</p>
                        <div className='mt-3 mb-6 flex justify-around max-w-md mx-auto'>
                            <div className='flex items-center text-gray-600 space-x-3'>
                                <ChatBubbleOutlineIcon 
                                    className='cursor-pointer hover:text-blue-500'      
                                    onClick={handleOpenReplyModal} 
                                />
                                <span className="text-sm">43</span>
                            </div>
                            <div className={`flex items-center space-x-1 ${isRetweeted ? "text-green-600" : "text-gray-600"}`}>
                                <RepeatIcon 
                                    className='cursor-pointer hover:text-green-500' 
                                    onClick={handleCreateRetweet} 
                                />
                                <span className="text-sm">34</span>
                            </div>
                            <div className={`flex items-center space-x-1 ${isLiked ? "text-pink-600" : "text-gray-600"}`}>
                                {isLiked ? (
                                    <FavoriteIcon 
                                        className='cursor-pointer hover:text-pink-500' 
                                        onClick={handleLikeTweet} 
                                    />
                                ) : (
                                    <FavoriteOutlined 
                                        className='cursor-pointer hover:text-pink-500' 
                                        onClick={handleLikeTweet} 
                                    />
                                )}
                                <span className="text-sm">45</span>
                            </div>
                            <div className='flex items-center text-gray-600 space-x-1'>
                                <BarChartIcon 
                                    className='cursor-pointer hover:text-blue-500' 
                                    onClick={handleOpenReplyModal} 
                                />
                                <span className="text-sm">43</span>
                            </div>
                            <div className='flex items-center text-gray-600'>
                                <FileUploadIcon 
                                    className='cursor-pointer hover:text-blue-500' 
                                    onClick={handleOpenReplyModal} 
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Reply Modal */}
            <ReplyModal open={openReplyModel} handleClose={handleCloseReplyModal} />
        </React.Fragment>
    );
};

export default TweetCard;
