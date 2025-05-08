import React, { useState, useEffect } from 'react';
import { 
    Modal,
    Box,
    Button,
    IconButton,
    TextField,
    Snackbar,
    Alert
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import { getAuthToken } from '../Authentication/auth.tsx';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    bgcolor: 'background.paper',
    border: 'none',
    borderRadius: 2,
    boxShadow: 24,
    p: 4,
};

const ProfileModal = ({ open, handleClose, userData, setUserData }) => {
    const [formData, setFormData] = useState({
        fullName: '',
        birthDate: '',
        location: '',
        bio: '',
        website: ''
    });
    const [alertMessage, setAlertMessage] = useState('');
    const [alertSeverity, setAlertSeverity] = useState('success');
    const [openAlert, setOpenAlert] = useState(false);

    useEffect(() => {
        if (userData) {
            setFormData({
                fullName: userData.fullName || '',
                birthDate: userData.birthDate || '',
                location: userData.location || '',
                bio: userData.bio || '',
                website: userData.website || ''
            });
        }
    }, [userData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const token = getAuthToken();
            if (!token) {
                showAlert('You must be logged in to update your profile', 'error');
                return;
            }

            const response = await axios.put(
                'http://localhost:8080/api/users/update',
                formData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            // Update the user data in the parent component
            setUserData(response.data);
            
            showAlert('Profile updated successfully!', 'success');
            handleClose();
        } catch (error) {
            console.error('Error updating profile:', error);
            showAlert('Failed to update profile. Please try again.', 'error');
        }
    };

    const showAlert = (message, severity) => {
        setAlertMessage(message);
        setAlertSeverity(severity);
        setOpenAlert(true);
    };

    const handleCloseAlert = () => {
        setOpenAlert(false);
    };

    return (
        <>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="edit-profile-modal"
                aria-describedby="modal-to-edit-user-profile"
            >
                <Box sx={style}>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold">Edit Profile</h2>
                        <IconButton onClick={handleClose}>
                            <CloseIcon />
                        </IconButton>
                    </div>
                    
                    <form onSubmit={handleSubmit}>
                        <TextField
                            fullWidth
                            label="Full Name"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            margin="normal"
                            variant="outlined"
                        />
                        
                        <TextField
                            fullWidth
                            label="Birth Date (YYYY-MM-DD)"
                            name="birthDate"
                            value={formData.birthDate}
                            onChange={handleChange}
                            margin="normal"
                            variant="outlined"
                            placeholder="YYYY-MM-DD"
                        />
                        
                        <TextField
                            fullWidth
                            label="Location"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            margin="normal"
                            variant="outlined"
                        />
                        
                        <TextField
                            fullWidth
                            label="Website"
                            name="website"
                            value={formData.website}
                            onChange={handleChange}
                            margin="normal"
                            variant="outlined"
                        />
                        
                        <TextField
                            fullWidth
                            label="Bio"
                            name="bio"
                            value={formData.bio}
                            onChange={handleChange}
                            margin="normal"
                            variant="outlined"
                            multiline
                            rows={3}
                        />
                        
                        <div className="flex justify-end mt-4">
                            <Button 
                                type="button" 
                                onClick={handleClose}
                                sx={{ mr: 2 }}
                            >
                                Cancel
                            </Button>
                            <Button 
                                type="submit" 
                                variant="contained"

                                color="primary"
                            >
                                Save
                            </Button>
                        </div>
                    </form>
                </Box>
            </Modal>
            
            <Snackbar
                open={openAlert}
                autoHideDuration={6000}
                onClose={handleCloseAlert}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert 
                    onClose={handleCloseAlert} 
                    severity={alertSeverity} 
                    sx={{ width: '100%' }}
                >
                    {alertMessage}
                </Alert>
            </Snackbar>
        </>
    );
};

export default ProfileModal;