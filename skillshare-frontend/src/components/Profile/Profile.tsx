/* eslint-disable no-constant-condition */
/* eslint-disable no-constant-binary-expression */
import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { Avatar, Box, Button, Tab } from '@mui/material';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import TabContext from '@mui/lab/TabContext';
import TweetCard from '../HomeSection/TweetCard';
import ProfileModal from './ProfileModal';

const Profile = () => {
    const [value, setValue] = useState('1');
    const [openProfileModal, setOpenProfileModal] = useState(false);
    const navigate = useNavigate();

    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        setValue(newValue);
        console.log(newValue === '4' ? "Like tweets" : "User tweets");
    };

    const handleClose = () => setOpenProfileModal(false);
    const handleFollower = () => console.log("Follow");

    return (
        <div>
            <section>
                <img className='w-full h-[15rem] object-cover' src="https://cdn.pixabay.com/photo/2024/02/22/19/14/mosaic-8590725_1280.jpg" alt="Cover" />
            </section>

            <section className='pl-6'>
                <div className='flex justify-between items-start mt-5 h-[5rem]'>
                    <Avatar 
                        className='transform -translate-y-24' 
                        alt='Minsandha Pathirana' 
                        src='https://secure.gravatar.com/avatar/3fbe84b93407a82e024390352db2544b?d=https%3A%2F%2Favatar-management--avatars.us-west-2.prod.public.atl-paas.net%2Finitials%2FMP-5.png' 
                        sx={{ width: "10rem", height: "10rem", border: "4px solid white" }} 
                    />
                    <Button
                        onClick={() => setOpenProfileModal(true)}
                        variant='contained'
                        sx={{ borderRadius: "20px" }}>
                        Edit Profile
                    </Button>
                </div>

                <div className='mt-3 flex flex-col items-start'>
                    <h4 className='font-bold text-lg'>Minsandha Pathirana</h4>
                    <h4 className='text-gray-500'>@Minsandha</h4>
                    <p className='mt-2'>Hellooo I am Mina, Welcome Here!!</p>
                </div>

                <div className='mt-3 space-y-3'>
                    <div className='py-1 flex space-x-5'>
                        <div className='flex items-center text-gray-500'>
                            <BusinessCenterIcon />
                            <p className='ml-2'>Education</p>
                        </div>
                        <div className='flex items-center text-gray-500'>
                            <LocationOnIcon />
                            <p className='ml-2'>Sri Lanka</p>
                        </div>
                        <div className='flex items-center text-gray-500'>
                            <CalendarMonthIcon />
                            <p className='ml-2'>Joined Jun 2023</p>
                        </div>
                    </div>
                    <div className='flex items-center space-x-5 mb-3.5'>
                        <div className='flex items-center space-x-1 font-semibold'>
                            <span>300</span>
                            <span className='text-gray-500'>Following</span>
                        </div>
                        <div className='flex items-center space-x-1 font-semibold'>
                            <span>590</span>
                            <span className='text-gray-500'>Followers</span>
                        </div>
                    </div>
                </div>
            </section>

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

            <ProfileModal handleClose={handleClose} open={openProfileModal} />
        </div>
    );
};

export default Profile;
