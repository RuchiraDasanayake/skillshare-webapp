import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Avatar, Box, Button, CircularProgress, Tab, IconButton, Tooltip, 
  Fade, Grow, Zoom, Badge, Skeleton
} from '@mui/material';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import TabContext from '@mui/lab/TabContext';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import axios from 'axios';

import TweetCard from '../HomeSection/TweetCard';
import ProfileModal from './ProfileModal';
import RightPart from '../RightPart/RightPart.tsx';
import { getAuthToken, isAuthenticated } from '../Authentication/auth.tsx';
import { AddPhotoAlternate, CalendarMonth, ChatBubbleOutline, Edit, Favorite, LocationOn, Link, Verified } from '@mui/icons-material';

const Profile = () => {
  const { userId } = useParams();
  const [value, setValue] = useState('1');
  const [openProfileModal, setOpenProfileModal] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFollowingHovered, setIsFollowingHovered] = useState(false);
  const [coverHover, setCoverHover] = useState(false);
  const [avatarHover, setAvatarHover] = useState(false);
  const [activeTab, setActiveTab] = useState('1');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);

        if (!isAuthenticated()) {
          navigate('/login');
          return;
        }

        const token = getAuthToken();
        const endpoint = userId
          ? `http://localhost:8080/api/users/${userId}`
          : 'http://localhost:8080/api/users/profile';

        const res = await axios.get(endpoint, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setUserData(res.data);
      } catch (err) {
        console.error('Error fetching profile:', err);
        if (err.response?.status === 401) {
          setError('Authentication error. Please log in again.');
        } else if (err.response?.status === 404) {
          setError('User profile not found.');
        } else {
          setError('Failed to load profile. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [userId, navigate]);

  // Enhanced handleFollowUser with proper state updates
  const handleFollowUser = async (targetUserId) => {
    try {
      const token = getAuthToken();
      const response = await axios.put(
        `http://localhost:8080/api/users/${targetUserId}/follow`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Update userData with the response
      setUserData(prev => ({
        ...prev,
        followed: !prev.followed,
        followers: response.data.followers || prev.followers,
        // Properly update the followers count
        followersCount: prev.followed 
          ? (prev.followers?.length - 1 || 0) 
          : (prev.followers?.length + 1 || 1)
      }));
      
      // Trigger confetti if following
      if (!userData.followed) {
        // You can add a confetti library here
        console.log("Confetti time!");
      }
    } catch (err) {
      console.error('Follow/unfollow failed:', err);
      // Show error message to user
      alert("Failed to follow/unfollow. Please try again.");
    }
  };
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', gap: 2, p: 2 }}>
        <Box sx={{ flex: 3 }}>
          <Box className="bg-white rounded-xl shadow p-5">
            <Skeleton variant="rectangular" width="100%" height={208} />
            <Box sx={{ position: 'relative', mt: -10, ml: 2 }}>
              <Skeleton variant="circular" width={100} height={100} sx={{ border: '4px solid white' }} />
            </Box>
            <Box sx={{ mt: 4, ml: 2 }}>
              <Skeleton variant="text" width={200} height={40} />
              <Skeleton variant="text" width={150} />
              <Skeleton variant="text" width="80%" />
              <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                <Skeleton variant="text" width={100} />
                <Skeleton variant="text" width={100} />
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <div className="text-center p-5 text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="text-center p-5">
        <p>User not found.</p>
      </div>
    );
  }
  const DEFAULT_COVER = "https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80";
  const DEFAULT_AVATAR = "https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80";

  // Calculate follower and following counts
  const followersCount = userData.followers?.length || 0;
  const followingsCount = userData.followings?.length || 0;

  return (
    <Box sx={{ display: 'flex', gap: 2, p: 2 }}>
      <Box sx={{ flex: 3 }}>
        {/* Cover Photo with Hover Effect */}
        <Box className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
          <Box 
            sx={{ 
              position: 'relative',
              '&:hover .cover-overlay': {
                opacity: 0.7,
              }
            }}
            onMouseEnter={() => setCoverHover(true)}
            onMouseLeave={() => setCoverHover(false)}
          >
            <img
              src={userData.backgroundImage || DEFAULT_COVER}
              alt="Cover"
              className="w-full h-52 object-cover rounded-t-xl transition-transform duration-500 hover:scale-105"
              onError={(e) => e.target.src = DEFAULT_COVER}
            />
            
            {userData.req_user && (
              <Fade in={coverHover}>
                <Box className="cover-overlay absolute inset-0 bg-black opacity-0 transition-opacity duration-300 flex items-center justify-center">
                  <Button 
                    startIcon={<AddPhotoAlternate />}
                    variant="contained"
                    onClick={() => setOpenProfileModal(true)}
                    sx={{ color: 'white', border: '1px solid white' }}
                  >
                    Change Cover
                  </Button>
                </Box>
              </Fade>
            )}
          </Box>
          
          {/* Avatar with Hover Effect */}
          <Box 
            sx={{ 
              position: 'relative', 
              display: 'inline-block',
              ml: 2,
              mt: -8,
              '&:hover .avatar-overlay': {
                opacity: 0.7,
              }
            }}
            onMouseEnter={() => setAvatarHover(true)}
            onMouseLeave={() => setAvatarHover(false)}
          >
            <Badge
              overlap="circular"
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              badgeContent={
                userData.verified && (
                  <Tooltip title="Verified" arrow>
                    <Verified color="primary" sx={{ fontSize: 30 }} />
                  </Tooltip>
                )
              }
            >
              <Avatar
                src={userData.image || DEFAULT_AVATAR}
                sx={{ 
                  width: 100, 
                  height: 100, 
                  border: '4px solid white',
                  transition: 'transform 0.3s',
                  '&:hover': {
                    transform: 'scale(1.05)'
                  }
                }}
                onError={(e) => e.target.src = DEFAULT_AVATAR}
              />
            </Badge>
            
            {userData.req_user && (
              <Fade in={avatarHover}>
                <Box className="avatar-overlay absolute inset-0 rounded-full bg-black opacity-0 transition-opacity duration-300 flex items-center justify-center">
                  <IconButton onClick={() => setOpenProfileModal(true)}>
                    <Edit sx={{ color: 'white' }} />
                  </IconButton>
                </Box>
              </Fade>
            )}
          </Box>
          
          {/* Profile Info with Animation */}
          <Grow in={!loading} timeout={500}>
            <Box sx={{ mt: 2, ml: 2, mb: 3, pr: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <h1 className="text-2xl font-bold">{userData.fullName}</h1>
                  {userData.verified && (
                    <Tooltip title="Verified account" arrow>
                      <Verified color="primary" fontSize="small" />
                    </Tooltip>
                  )}
                </Box>

                {/* Follow/Edit buttons */}
                <Box>
                  {!userData.req_user ? (
                    <Tooltip 
                      title={userData.followed ? (isFollowingHovered ? 'Unfollow' : 'Following') : 'Follow'} 
                      arrow
                    >
                      <Button
                        variant={userData.followed ? 'outlined' : 'contained'}
                        color={userData.followed ? (isFollowingHovered ? 'error' : 'primary') : 'primary'}
                        onMouseEnter={() => setIsFollowingHovered(true)}
                        onMouseLeave={() => setIsFollowingHovered(false)}
                        onClick={() => handleFollowUser(userData.id)}
                        sx={{
                          minWidth: 120,
                          transition: 'all 0.3s',
                          '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: 2
                          }
                        }}
                      >
                        {userData.followed ? (isFollowingHovered ? 'Unfollow' : 'Following') : 'Follow'}
                      </Button>
                    </Tooltip>
                  ) : (
                    <Button
                      variant="outlined"
                      startIcon={<Edit />}
                      onClick={() => setOpenProfileModal(true)}
                      sx={{
                        transition: 'all 0.3s',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: 2,
                          backgroundColor: 'primary.light',
                          color: 'primary.contrastText'
                        }
                      }}
                    >
                      Edit Profile
                    </Button>
                  )}
                </Box>
              </Box>
              
              <p className="text-gray-500">@{userData.userId || userData.email?.split('@')[0]}</p>
              
              {userData.bio && (
                <p className="mt-2 text-gray-800 animate-fade-in">
                  {userData.bio}
                </p>
              )}
              
              <Box className="flex flex-wrap gap-4 text-sm text-gray-600 mt-3">
                {userData.location && (
                  <Tooltip title="Location" arrow>
                    <span className="flex items-center gap-1 hover:text-primary cursor-pointer transition-colors">
                      <LocationOn fontSize="small" /> {userData.location}
                    </span>
                  </Tooltip>
                )}
                
                {userData.website && (
                  <Tooltip title="Website" arrow>
                    <a
                      href={userData.website.startsWith('http') ? userData.website : `https://${userData.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-blue-500 hover:text-blue-700 hover:underline transition-colors"
                    >
                      <Link fontSize="small" /> {userData.website.replace(/^https?:\/\//, '')}
                    </a>
                  </Tooltip>
                )}
                
                {userData.birthDate && (
                  <Tooltip title="Birth date" arrow>
                    <span className="flex items-center gap-1 hover:text-primary cursor-pointer transition-colors">
                      <CalendarMonth fontSize="small" /> 
                      {new Date(userData.birthDate).toLocaleDateString()}
                    </span>
                  </Tooltip>
                )}
              </Box>
              
              <Box className="flex gap-4 mt-3 text-sm">
                <Tooltip title="Following count" arrow>
                  <span className="hover:text-primary cursor-pointer transition-colors">
                    <strong>{followingsCount}</strong> Following
                  </span>
                </Tooltip>
                <Tooltip title="Followers count" arrow>
                  <span className="hover:text-primary cursor-pointer transition-colors">
                    <strong>{followersCount}</strong> Followers
                  </span>
                </Tooltip>
              </Box>
            </Box>
          </Grow>
        </Box>

        {/* Enhanced Tabs with Animation */}
        <Box sx={{ width: '100%', mt: 3 }}>
          <TabContext value={activeTab}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <TabList 
                onChange={(e, newValue) => setActiveTab(newValue)}
                aria-label="Profile tabs"
                variant="scrollable"
                scrollButtons="auto"
              >
                <Tab 
                  label={
                    <span className={`flex items-center gap-1 ${activeTab === '1' ? 'text-primary font-medium' : ''}`}>
                      Tweets
                      {activeTab === '1' && <span className="animate-pulse">✨</span>}
                    </span>
                  } 
                  value="1" 
                />
                <Tab 
                  label={
                    <span className={`flex items-center gap-1 ${activeTab === '2' ? 'text-primary font-medium' : ''}`}>
                      Replies
                    </span>
                  } 
                  value="2" 
                />
                <Tab 
                  label={
                    <span className={`flex items-center gap-1 ${activeTab === '3' ? 'text-primary font-medium' : ''}`}>
                      Media
                    </span>
                  } 
                  value="3" 
                />
                <Tab 
                  label={
                    <span className={`flex items-center gap-1 ${activeTab === '4' ? 'text-primary font-medium' : ''}`}>
                      Likes
                    </span>
                  } 
                  value="4" 
                />
              </TabList>
            </Box>
            
            <Zoom in={activeTab === '1'} unmountOnExit>
              <TabPanel value="1">
                {[1,1,1,1].map((_, idx) => (
                  <Box key={idx} sx={{ mb: 2 }}>
                    <TweetCard />
                  </Box>
                ))}
              </TabPanel>
            </Zoom>
            
            <Zoom in={activeTab === '2'} unmountOnExit>
              <TabPanel value="2">
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <ChatBubbleOutline sx={{ fontSize: 60, color: 'text.disabled', mb: 1 }} />
                  <p className="text-gray-500">No replies yet</p>
                </Box>
              </TabPanel>
            </Zoom>
            
            <Zoom in={activeTab === '3'} unmountOnExit>
              <TabPanel value="3">
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <AddPhotoAlternate sx={{ fontSize: 60, color: 'text.disabled', mb: 1 }} />
                  <p className="text-gray-500">No media yet</p>
                </Box>
              </TabPanel>
            </Zoom>
            
            <Zoom in={activeTab === '4'} unmountOnExit>
              <TabPanel value="4">
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Favorite sx={{ fontSize: 60, color: 'text.disabled', mb: 1 }} />
                  <p className="text-gray-500">No likes yet</p>
                </Box>
              </TabPanel>
            </Zoom>
          </TabContext>
        </Box>
      </Box>

      {/* Right Part Section */}
      <Box sx={{ flex: 1 }}>
        <RightPart />
      </Box>

      {/* Profile Modal */}
      <ProfileModal
        open={openProfileModal}
        handleClose={() => setOpenProfileModal(false)}
        userData={userData}
        setUserData={setUserData}
      />
    </Box>
  );
};

export default Profile;