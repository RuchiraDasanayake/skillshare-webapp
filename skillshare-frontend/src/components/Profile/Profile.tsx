import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { Avatar, Box, Button, Tab, CircularProgress } from '@mui/material';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import TabContext from '@mui/lab/TabContext';
import TweetCard from '../HomeSection/TweetCard';
import ProfileModal from './ProfileModal';
import axios from 'axios';
import { getAuthToken, isAuthenticated } from '../Authentication/auth.tsx';
import RightPart from '../RightPart/RightPart.tsx';

const Profile = () => {
    const [value, setValue] = useState('1');
    const [openProfileModal, setOpenProfileModal] = useState(false);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Fetch user profile data on component mount
    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                setLoading(true);
                
                // Check if user is authenticated
                if (!isAuthenticated()) {
                    console.log('No token found, redirecting to login');
                    navigate('/login');
                    return;
                }

                // Get JWT token from our auth utility
                const token = getAuthToken();
                console.log('Token retrieved for API call:', token ? 'Yes' : 'No');

                // Make API call to get user profile data
                const response = await axios.get('http://localhost:8080/api/users/profile', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                
                console.log('Profile data retrieved successfully');
                setUserData(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching user profile:', error);
                setError('Failed to load profile data. Please try again later.');
                setLoading(false);
                
                // If unauthorized (401), redirect to login
                if (axios.isAxiosError(error) && error.response?.status === 401) {
                    console.log('Token expired or invalid, redirecting to login');
                    navigate('/login');
                }
            }
        };

        fetchUserProfile();
    }, [navigate]);

    const handleChange = (event, newValue) => {
        setValue(newValue);
        console.log(newValue === '4' ? "Like tweets" : "User tweets");
    };

    const handleClose = () => setOpenProfileModal(false);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <CircularProgress />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-red-500">{error}</div>
            </div>
        );
    }

    return (
        <div className="flex flex-col">
            {/* Header image section */}
            <section>
                <img 
                    className='w-full h-[15rem] object-cover' 
                    src={userData?.backgroundImage || "https://cdn.pixabay.com/photo/2024/02/22/19/14/mosaic-8590725_1280.jpg"} 
                    alt="Cover" 
                />
            </section>
    
            {/* Main content area with profile info and RightPart side by side */}
            <div className="flex flex-row px-6 mt-4 gap-6">
                {/* Left/main profile content */}
                <div className="w-full lg:w-2/3">
                    {/* Avatar and Edit Profile button */}
                    <div className='flex justify-between items-start h-[5rem]'>
                        <Avatar 
                            className='transform -translate-y-24' 
                            alt={userData?.fullName || 'User'} 
                            src={userData?.image || 'https://secure.gravatar.com/avatar/3fbe84b93407a82e024390352db2544b?d=https%3A%2F%2Favatar-management--avatars.us-west-2.prod.public.atl-paas.net%2Finitials%2FMP-5.png'} 
                            sx={{ width: "10rem", height: "10rem", border: "4px solid white" }} 
                        />
                        <Button
                            onClick={() => setOpenProfileModal(true)}
                            variant='contained'
                            sx={{ borderRadius: "20px" }}>
                            Edit Profile
                        </Button>
                    </div>
    
                    {/* User Info */}
                    <div className='mt-3 flex flex-col items-start'>
                        <h4 className='font-bold text-lg'>{userData?.fullName || 'User'}</h4>
                        <h4 className='text-gray-500'>@{userData?.userId || 'username'}</h4>
                        <p className='mt-2'>{userData?.bio || 'No bio available'}</p> 
                    </div>
    
                    <div className='mt-3 space-y-3'>
                        <div className='py-1 flex space-x-5 flex-wrap'>
                            {userData?.birthDate && (
                                <div className='flex items-center text-gray-500'>
                                    <CalendarMonthIcon />
                                    <p className='ml-2'>Born on {userData.birthDate}</p>
                                </div>
                            )}
                            {userData?.location && (
                                <div className='flex items-center text-gray-500'>
                                    <LocationOnIcon />
                                    <p className='ml-2'>{userData.location}</p>
                                </div>
                            )}
                            {userData?.website && (
                                <div className='flex items-center text-gray-500'>
                                    <BusinessCenterIcon />
                                    <p className='ml-2'>{userData.website}</p>
                                </div>
                            )}
                        </div>
                        <div className='flex items-center space-x-5 mb-3.5'>
                            <div className='flex items-center space-x-1 font-semibold'>
                                <span>{userData?.followings?.length || 0}</span>
                                <span className='text-gray-500'>Following</span>
                            </div>
                            <div className='flex items-center space-x-1 font-semibold'>
                                <span>{userData?.followers?.length || 0}</span>
                                <span className='text-gray-500'>Followers</span>
                            </div>
                        </div>
                    </div>
    
                    {/* Tabs for Tweets, Replies, etc. */}
                    <section>
                        <Box sx={{ width: '100%', typography: 'body1' }}>
                            <TabContext value={value}>
                                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                    <TabList onChange={handleChange} aria-label="Profile Tabs">
                                        <Tab label="Tweets" value="1" />
                                        <Tab label="Replies" value="2" />
                                        <Tab label="Media" value="3" />
                                        <Tab label="Likes" value="4" />
                                    </TabList>
                                </Box>
                                <TabPanel value="1">{[1,1,1,1].map((_, idx) => <TweetCard key={idx} />)}</TabPanel>
                                <TabPanel value="2">User Replies</TabPanel>
                                <TabPanel value="3">User Media</TabPanel>
                                <TabPanel value="4">Likes</TabPanel>
                            </TabContext>
                        </Box>
                    </section>
                </div>
    
                {/* Right sidebar */}
                <div className="hidden lg:block lg:w-1/3">
                    <RightPart />
                </div>
            </div>
    
            {/* Edit Profile Modal */}
            <ProfileModal 
                handleClose={handleClose} 
                open={openProfileModal} 
                userData={userData}
                setUserData={setUserData}
            />
        </div>
    );
}
export default Profile;