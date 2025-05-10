import React, { useState, useEffect, useRef } from 'react';
import {
    Dialog,
    Box,
    Button,
    IconButton,
    TextField,
    Snackbar,
    Alert,
    CircularProgress,
    Avatar,
    Paper
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import axios from 'axios';
import { getAuthToken } from '../Authentication/auth.tsx';
import { storage, ref, uploadBytesResumable, getDownloadURL } from '../../config/firebaseConfig';

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    maxHeight: '90vh',
    overflowY: 'auto',
    bgcolor: 'background.paper',
    border: 'none',
    borderRadius: 2,
    boxShadow: 24,
    p: 4,
    display: 'flex',
    flexDirection: 'column'
};

const ProfileModal = ({ open, handleClose, userData, setUserData }) => {
    const [formData, setFormData] = useState({
        fullName: '',
        birthDate: '',
        location: '',
        bio: '',
        website: ''
    });

    const [coverImage, setCoverImage] = useState(null);
    const [coverPreview, setCoverPreview] = useState('');
    const [profileImage, setProfileImage] = useState(null);
    const [profilePreview, setProfilePreview] = useState('');
    const [loading, setLoading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertSeverity, setAlertSeverity] = useState('success');
    const [openAlert, setOpenAlert] = useState(false);

    const coverInputRef = useRef(null);
    const profileInputRef = useRef(null);
    const DEFAULT_AVATAR = "https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80";

    useEffect(() => {
        if (userData) {
            setFormData({
                fullName: userData.fullName || '',
                birthDate: userData.birthDate || '',
                location: userData.location || '',
                bio: userData.bio || '',
                website: userData.website || ''
            });
            setCoverPreview(userData.backgroundImage || '');
            setProfilePreview(userData.image || '');
        }
    }, [userData]);

    const handleCoverChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                showAlert('File size too large (max 5MB)', 'error');
                return;
            }
            if (!file.type.startsWith('image/')) {
                showAlert('Please upload an image file', 'error');
                return;
            }
            setCoverImage(file);
            setCoverPreview(URL.createObjectURL(file));
        }
    };

    const handleProfileImageChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                showAlert('File size too large (max 5MB)', 'error');
                return;
            }
            if (!file.type.startsWith('image/')) {
                showAlert('Please upload an image file', 'error');
                return;
            }
            setProfileImage(file);
            setProfilePreview(URL.createObjectURL(file));
        }
    };

    const handleRemoveCover = () => {
        setCoverImage(null);
        setCoverPreview('');
        if (coverInputRef.current) coverInputRef.current.value = '';
    };

    const handleRemoveProfileImage = () => {
        setProfileImage(null);
        setProfilePreview('');
        if (profileInputRef.current) profileInputRef.current.value = '';
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const uploadToFirebase = async (file, path) => {
        return new Promise((resolve, reject) => {
            if (!file) {
                resolve(null);
                return;
            }

            const storageRef = ref(storage, `${path}/${Date.now()}_${file.name}`);
            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setUploadProgress(progress);
                },
                (error) => reject(error),
                async () => resolve(await getDownloadURL(uploadTask.snapshot.ref))
            );
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setUploadProgress(0);

        try {
            const token = getAuthToken();
            if (!token) {
                showAlert('Authentication required. Please login again.', 'error');
                return;
            }

            const [profileImageUrl, coverImageUrl] = await Promise.all([
                profileImage ? uploadToFirebase(profileImage, 'profile-images') : null,
                coverImage ? uploadToFirebase(coverImage, 'cover-images') : null
            ]);

            // Preserve the original userId and isOwnProfile fields to ensure
            // the profile ownership status doesn't change
            const updatedUser = {
                ...userData, // Keep original user data including userId and isOwnProfile
                ...formData,
                image: profileImageUrl || (profilePreview === '' ? '' : userData.image),
                backgroundImage: coverImageUrl || (coverPreview === '' ? '' : userData.backgroundImage)
            };

            // Make sure isOwnProfile is explicitly set to true if it exists in original userData
            if (userData.isOwnProfile !== undefined) {
                updatedUser.isOwnProfile = userData.isOwnProfile;
            }

            const response = await axios.put(
                'http://localhost:8080/api/users/update',
                updatedUser,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            // Ensure we preserve the isOwnProfile flag in the response data
            const updatedResponse = {
                ...response.data,
                isOwnProfile: userData.isOwnProfile
            };

            setUserData(updatedResponse);
            showAlert('Profile updated successfully!', 'success');
            handleClose();
        } catch (error) {
            console.error('Profile update error:', error);
            showAlert(error.response?.data?.message || 'Update failed. Please try again.', 'error');
        } finally {
            setLoading(false);
            setUploadProgress(0);
        }
    };

    const showAlert = (message, severity) => {
        setAlertMessage(message);
        setAlertSeverity(severity);
        setOpenAlert(true);
    };

    const handleCloseAlert = () => setOpenAlert(false);

    return (
        <>
            <Dialog
                open={open}
                onClose={handleClose}
                PaperComponent={Paper}
                PaperProps={{
                    sx: modalStyle
                }}
                aria-labelledby="edit-profile-modal"
            >
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Edit Profile</h2>
                    <IconButton onClick={handleClose} disabled={loading}>
                        <CloseIcon />
                    </IconButton>
                </div>
                <form onSubmit={handleSubmit} className="flex-grow flex flex-col">
                    {/* Profile Picture Section */}
                    <div className="mb-4 flex flex-col items-center">
                        <label className="block text-sm font-medium mb-2">Profile Picture</label>
                        <div className="relative group mb-3">
                            <Avatar
                                src={profilePreview || (userData?.image || DEFAULT_AVATAR)}
                                sx={{ width: 100, height: 100, boxShadow: 2 }}
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-opacity rounded-full">
                                <IconButton component="label" sx={{ opacity: 0, transition: 'opacity 0.3s', '.group:hover &': { opacity: 1 } }}>
                                    <CameraAltIcon sx={{ color: 'white' }} />
                                    <input type="file" hidden onChange={handleProfileImageChange} accept="image/*" ref={profileInputRef} />
                                </IconButton>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button component="label" variant="outlined" size="small" startIcon={<CloudUploadIcon />} disabled={loading}>
                                {profilePreview ? 'Change' : 'Upload'}
                                <input type="file" hidden onChange={handleProfileImageChange} accept="image/*" />
                            </Button>
                            {profilePreview && (
                                <Button variant="outlined" color="error" size="small" startIcon={<DeleteIcon />}
                                    onClick={handleRemoveProfileImage} disabled={loading}>
                                    Remove
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Cover Photo Section */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">Cover Photo</label>
                        <div className="relative group">
                            {coverPreview && (
                                <div className="relative mb-2">
                                    <img src={coverPreview} alt="Cover preview" className="w-full h-32 object-cover rounded-lg" />
                                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-opacity" />
                                </div>
                            )}
                            <div className="flex gap-2">
                                <Button component="label" variant="outlined" startIcon={<CloudUploadIcon />} disabled={loading}>
                                    {coverPreview ? 'Change' : 'Upload'}
                                    <input type="file" hidden onChange={handleCoverChange} accept="image/*" ref={coverInputRef} />
                                </Button>
                                {coverPreview && (
                                    <Button variant="outlined" color="error" startIcon={<DeleteIcon />}
                                        onClick={handleRemoveCover} disabled={loading}>
                                        Remove
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>

                    {loading && uploadProgress > 0 && (
                        <Box sx={{ width: '100%', mb: 2 }}>
                            <CircularProgress variant="determinate" value={uploadProgress} size={24} sx={{ mr: 1 }} />
                            <span>{Math.round(uploadProgress)}% uploaded</span>
                        </Box>
                    )}

                    <TextField fullWidth label="Full Name" name="fullName" value={formData.fullName} onChange={handleChange}
                        margin="normal" variant="outlined" disabled={loading} />

                    <TextField fullWidth label="Birth Date" name="birthDate" type="date" value={formData.birthDate}
                        onChange={handleChange} margin="normal" variant="outlined" InputLabelProps={{ shrink: true }} disabled={loading} />

                    <TextField fullWidth label="Location" name="location" value={formData.location} onChange={handleChange}
                        margin="normal" variant="outlined" disabled={loading} />

                    <TextField fullWidth label="Website" name="website" value={formData.website} onChange={handleChange}
                        margin="normal" variant="outlined" placeholder="https://example.com" disabled={loading} />

                    <TextField fullWidth label="Bio" name="bio" value={formData.bio} onChange={handleChange}
                        margin="normal" variant="outlined" multiline rows={3} disabled={loading} />

                    <div className="flex justify-end mt-4 gap-2 pt-4 sticky bottom-0 bg-white z-10">
                        <Button variant="outlined" onClick={handleClose} disabled={loading}>Cancel</Button>
                        <Button type="submit" variant="contained" color="primary" disabled={loading}
                            startIcon={loading && <CircularProgress size={20} />}>
                            {loading ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>
                </form>
            </Dialog>

            <Snackbar open={openAlert} autoHideDuration={6000} onClose={handleCloseAlert}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
                <Alert onClose={handleCloseAlert} severity={alertSeverity} variant="filled" sx={{ width: '100%' }}>
                    {alertMessage}
                </Alert>
            </Snackbar>
        </>
    );
};

export default ProfileModal;