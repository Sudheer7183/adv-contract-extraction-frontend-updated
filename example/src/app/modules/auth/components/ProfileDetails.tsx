import React, { useRef, useState } from 'react';
// import './styles/ProfileDetails.css'; // Import your CSS for styling
import request, { gql } from 'graphql-request';
import BASEURL from '../../../config/baseurl';
import { useAuth } from '../core/Auth';
import { Avatar, Alert, Snackbar, Button, IconButton, TextField } from '@mui/material';
import axios from 'axios';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import styles from './styles/ProfileDetails.module.css';
import { KTIcon } from '../../../../_metronic/helpers';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';


const CHANGE_CURRENT_PASSWORD = gql`
  mutation changePassword(
    $email:String!
    $currentPassword: String!
    $newPassword: String!
    $verifyPassword: String!
  ){
    changePassword(
        email:$email,
        currentPassword: $currentPassword,
        newPassword: $newPassword,
        verifyPassword: $verifyPassword
    ){
      success
      message
    }
  }`


const ProfileDetails = ({ onClose }: { onClose: () => void }) => {
    const { currentUser, logout } = useAuth();
    const [currentPassword, setCurrentPassword] = useState('');
    const [open1, setOpen1] = useState(false);
    const [message, setMessage] = useState("")
    const [message1, setMessage1] = useState(false)
    const [newPassword, setNewPassword] = useState('');
    const [verifyPassword, setVerifyPassword] = useState('');
    const [passwordError, setPasswordError] = useState("");
    const [profilePictureError, setProfilePictureError] = useState("");
    const [selectedProfilePicture, setSelectedProfilePicture] = useState(null);
    const [currentPasswordError, setCurrentPasswordError] = useState(''); // Step 1
    const [shouldRemoveProfilePicture, setShouldRemoveProfilePicture] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showVerifyPassword, setShowVerifyPassword] = useState(false);

    const containerRef = useRef(null);


    const maxFileSizeKB = 1024; // 1 MB

    const handleTogglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };
    const handleToggleNewPasswordVisibility = () => {
        setShowNewPassword(!showNewPassword);
    };

    const handleToggleVerifyPasswordVisibility = () => {
        setShowVerifyPassword(!showVerifyPassword)
    }



    const handleProfilePictureChange = (event: any) => {
        const selectedFile = event.target.files[0];


        if (selectedFile) {
            const fileSizeKB = selectedFile.size / 1024; // Calculate the file size in KB
            console.log("fileSizeKB", fileSizeKB);


            if (fileSizeKB > maxFileSizeKB) {
                setProfilePictureError('File size exceeds the limit of 1MB.');
                return;
            }
            setProfilePictureError('');
            setSelectedProfilePicture(selectedFile);
        }
    };

    const openTable = () => {
        setIsDeleteDialogOpen(true);
    }
    const confirmDelete = () => {
        setIsDeleteDialogOpen(false);
        handleRemoveProfilePicture()
    }



    console.log("currentUser", currentUser);
    const userId = currentUser?.id;
    const profilePicturePath = currentUser?.profilePicture;


    const handleClose1 = () => {
        setOpen1(false);
    };

    const handleRemoveProfilePicture = () => {
        console.log("remove profile picture");
        const url = `${BASEURL}profile/${userId}/remove/`;
        axios.delete(url)
            .then((response: any) => {
                console.log("response.data", response.data);
                setOpen1(true);
                setMessage1(true);
                setShouldRemoveProfilePicture(true);
                setMessage("Profile picture removed successfully");
                setTimeout(() => {
                    window.location.reload();
                    logout()
                }, 500);
            })
            .catch((error: any) => {
                console.log("error", error);
                setOpen1(true);
                setMessage("Something Went Wrong");
                setMessage1(false);
                setShouldRemoveProfilePicture(false);
                setProfilePictureError("Failed to remove the profile picture.");
            });
        // setIsDeleteDialogOpen(false);
    };


    console.log("profilePicturePath", profilePicturePath);


    const editIconClick = () => {
        const fileInput = document.getElementById('profilePicture');
        console.log("fileInput", fileInput);
        if (fileInput) {
            fileInput.click();
        }
    };


    const handleSubmit = async (e: any) => {
        e.preventDefault();
        // Create flags to check if password and profile picture are being updated
        const isPasswordUpdated = currentPassword !== '' || newPassword !== '' || verifyPassword !== '';
        const isProfilePictureUpdated = selectedProfilePicture !== null;
        const isProfilePictureRemoved = shouldRemoveProfilePicture; // Add logic to set shouldRemoveProfilePicture flag


        // Reset any existing error messages
        setPasswordError('');
        setProfilePictureError('');


        if (isPasswordUpdated && isProfilePictureUpdated) {
            console.log(("updated message"));
            setOpen1(true);
            setMessage('Password and profile picture updated successfully');
            setMessage1(true);
            setTimeout(() => {
                window.location.reload();
                logout();
            }, 500);
            return;
            // If neither password nor profile picture is updated, you can save the form or handle it as needed
            // onClose();
        } else if (passwordError || profilePictureError) {
            // Do not proceed with form submission if there are errors
            setMessage('Please fix the form errors before saving.');
            setOpen1(true);
            setMessage1(false);
            if (containerRef.current) {
                containerRef.current.scrollIntoView({ behavior: 'smooth' });
            }
            return;
        } else {
            try {
                if (isPasswordUpdated) {
                    // Validate password fields
                    if (currentPassword === '' || newPassword === '' || verifyPassword === '') {
                        setPasswordError('Please fill in all password fields.');
                        return;
                    }
                }
                if (isProfilePictureUpdated) {
                    // Validate profile picture, if needed
                    const fileSizeKB = selectedProfilePicture.size / 1024;
                    if (fileSizeKB > maxFileSizeKB) {
                        setProfilePictureError('File size exceeds the limit of 1MB.');
                        return;
                    }
                }
                if (isPasswordUpdated) {
                    // Send the password change request
                    await sendPasswordMutation();
                    setOpen1(true);
                    setMessage('Password updated successfully');
                    setMessage1(true);
                    setTimeout(() => {
                        window.location.reload();
                        logout()
                    }, 500);
                }
                if (isProfilePictureUpdated) {
                    // Send the profile picture update request
                    handleProfilePictureUpdate();
                    console.log("updated profilepicture");


                    setOpen1(true);
                    setMessage('Profile picture updated successfully');
                    setMessage1(true);
                    setTimeout(() => {
                        window.location.reload();
                        logout()
                    }, 500);
                }
                if (isProfilePictureRemoved) {
                    await handleRemoveProfilePicture();
                    setOpen1(true);
                    setMessage('Profile picture removed successfully');
                    setMessage1(true);
                    setTimeout(() => {
                        window.location.reload();
                        logout()
                    }, 500);
                }
            } catch (error) {
                // Handle the error here and set the appropriate error message
                if (isPasswordUpdated) {
                    setPasswordError('An error occurred while changing the password.');
                }
                if (isProfilePictureUpdated) {
                    setProfilePictureError('An error occurred while updating the profile picture.');
                }
                if (isProfilePictureRemoved) {
                    setProfilePictureError('An error occurred while removing the profile picture.');
                }
                setOpen1(true);
                setMessage('Something Went Wrong');
                setMessage1(false);
            }
        }
    };



    const handleProfilePictureUpdate = async () => {
        const url = `${BASEURL}profile/${userId}/update/`;
        const formData = new FormData();
        formData.append('profile_picture', selectedProfilePicture);


        try {
            const response = await axios.put(url, formData, {
                headers: {
                    'content-type': 'multipart/form-data',
                },
            });
            setOpen1(true);
            setMessage('Profile picture updated successfully');
            setMessage1(true);
            console.log("response axios in async", response);
            // setTimeout(() => {
            //   window.location.reload();
            //   logout()
            // }, 500);
        } catch (error) {
            setProfilePictureError(
                'Upload a valid image. The file you uploaded was either not an image or a corrupted image.'
            );
            setOpen1(true);
            setMessage('Something Went Wrong');
            setMessage1(false);
            if (containerRef.current) {
                containerRef.current.scrollIntoView({ behavior: 'smooth' });
            }
        }
    };




    const sendPasswordMutation = () => {
        request(`${BASEURL}graphql/`, CHANGE_CURRENT_PASSWORD, {
            email: currentUser.email,
            currentPassword: currentPassword,
            newPassword: newPassword,
            verifyPassword: verifyPassword,
        })
            .then((response: any) => {
                console.log("response", response);
                if (response.changePassword.success) {
                    setOpen1(true);
                    setMessage1(true);
                    setMessage("Password updated successfully");
                    // onClose();
                    // setTimeout(() => {
                    //   window.location.reload();
                    //   logout()
                    // }, 500);
                } else {
                    // Handle different types of errors
                    const errorMessage = response.changePassword.message;
                    console.log("error message", errorMessage);
                    console.log("error message includes", errorMessage.includes("current password"));
                    if (errorMessage.includes("current password")) {
                        console.log("error message include inside", errorMessage.includes("current password"));
                        setCurrentPasswordError("Incorrect current password");
                    } else {
                        // Set a generic error message for other issues
                        setPasswordError("Failed to update password. Please try again later.");
                    }
                }
            })
            .catch((err: any) => {
                console.log("error catch", err.response.errors[0]?.message);
                setPasswordError(err.response.errors[0]?.message || 'An error occurred');
                setOpen1(true);
                setMessage("Something Went Wrong");
                setMessage1(false);
                if (containerRef.current) {
                    containerRef.current.scrollIntoView({ behavior: 'smooth' });
                }
                // alert(err.response.errors[0]?.message || 'An error occurred')
            });
    };


    console.log("message", message);
    const colorv = localStorage.getItem("themeColor")
    const themec = colorv != null ? colorv + " " + 'btn' : 'p-3 bg-primary text-white btn'


    return (
        <>
            <div className={`${styles['profile-modal']} ${styles['profile-details-form']}`}>
                <div className={`${styles['modal-content']}`}>
                    <form onSubmit={(e) => handleSubmit(e)}>
                        <div className='modal-header' ref={containerRef}>
                            <h2 className='fw-bolder'>User Profile</h2>
                            <div
                                className='btn btn-icon btn-sm btn-active-icon-primary'
                                data-kt-users-modal-action='close'
                                onClick={() => onClose()}
                                style={{ cursor: 'pointer' }}
                            >
                                <KTIcon iconName='cross' className='fs-1' />
                            </div>
                        </div><hr />
                        <>
                            <div className={`${styles['change-profile-picture-heading']}`}>
                                <h2>Profile</h2>
                                {profilePicturePath ? (
                                    <DeleteIcon className={`${styles['delete-icon']}`}
                                        // onClick={handleRemoveProfilePicture}
                                        onClick={openTable}
                                    />
                                ) : null}
                            </div>
                            <div className='text-center fv-row mb-7' style={{ height: '120px' }}>
                                {profilePictureError ?
                                    <div className="text-danger">{profilePictureError}</div> :
                                    <p>Maximum upload image size: 1MB</p>
                                }
                                <div className={`${styles['custom-profile-picture']}`}>
                                    {selectedProfilePicture ? (
                                        <img
                                            src={URL.createObjectURL(selectedProfilePicture)}
                                            alt='Profile Picture'
                                            className='rounded-circle h-80px w-80px' />
                                    ) : (
                                        <div className='text-center mb-5'>
                                            {profilePicturePath ? (
                                                <Avatar
                                                    alt={currentUser?.username}
                                                    src={"http://127.0.0.1:8000/" + profilePicturePath}
                                                    className='rounded-circle h-80px w-80px' />
                                            ) : (
                                                <Avatar className='rounded-circle h-80px w-80px'
                                                    style={{ fontSize: '70px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    {currentUser?.username.charAt(0).toUpperCase()}
                                                </Avatar>
                                            )}

                                        </div>
                                    )}

                                </div>
                                <div className={`${styles['profile-picture-controls']}`} style={{ height: '0px' }}>
                                    <div className={`${styles['edit-icon']}`} style={{ marginTop: '35px', marginLeft: '-10px' }} onClick={editIconClick}>
                                        <EditIcon />
                                        <input
                                            type="file"
                                            id="profilePicture"
                                            name="profilePicture"
                                            accept="image/*"
                                            onChange={handleProfilePictureChange}
                                            style={{ display: "none" }} />
                                    </div>
                                </div>
                            </div>
                        </><hr />
                        <>
                            <div className='fv-row mb-7'>
                                <label htmlFor='currentPassword'><b>Current Password:</b></label>
                                <TextField
                                    id='currentPassword'
                                    className='form-control form-control-solid mb-3 mb-lg-0'

                                    name='currentPassword'
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder='Enter Current Password'
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    InputProps={{
                                        endAdornment: (
                                            <IconButton
                                                aria-label='toggle password visibility'
                                                onClick={handleTogglePasswordVisibility}
                                            >
                                                {showPassword ? <Visibility /> : <VisibilityOff />}
                                            </IconButton>
                                        ),
                                        style: { height: '35px' }
                                    }}
                                />
                                {/* <input
                                    type='password'
                                    placeholder='Enter Current Password'
                                    className='form-control form-control-solid mb-3 mb-lg-0'
                                    style={{ paddingTop: '5px', paddingBottom: '5px' }}
                                    id='currentPassword'
                                    name='currentPassword'
                                    value={currentPassword}
                                    onChange={(e) => {
                                        setCurrentPassword(e.target.value);
                                        setPasswordError('');
                                    }} /> */}
                                {currentPasswordError && ( // Step 3
                                    <div className="text-danger">{currentPasswordError}</div>
                                )}
                                <p>You must provide your current password in order to change it.</p>
                            </div>
                            {passwordError && (
                                <div className="text-danger">{passwordError}</div>
                            )}
                            <div className='fv-row mb-7'>
                                <label htmlFor='newPassword'><b>New Password:</b></label>
                                <TextField
                                    id='newPassword'
                                    className='form-control form-control-solid mb-3 mb-lg-0'

                                    name='newPassword'
                                    type={showNewPassword ? 'text' : 'password'}
                                    placeholder='Enter New Password'
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    InputProps={{
                                        endAdornment: (
                                            <IconButton
                                                aria-label='toggle password visibility'
                                                onClick={handleToggleNewPasswordVisibility}
                                            >
                                                {showNewPassword ? <Visibility /> : <VisibilityOff />}
                                            </IconButton>
                                        ),
                                        style: { height: '35px' }
                                    }}
                                />
                                {/* <input
                                    type='password'
                                    placeholder='Enter New Password'
                                    className='form-control form-control-solid mb-3 mb-lg-0'
                                    style={{ paddingTop: '5px', paddingBottom: '5px' }}
                                    id='newPassword'
                                    name='newPassword'
                                    value={newPassword}
                                    onChange={(e) => {
                                        setNewPassword(e.target.value);
                                        // if (e.target.value !== verifyPassword) {
                                        //     setPasswordError('Passwords do not match.');
                                        // } else {
                                        //     setPasswordError('');
                                        // }
                                    }} /> */}
                            </div>
                            <div className='fv-row mb-7'>
                                <label htmlFor='verifyPassword'><b>Confirm Password:</b></label>
                                <TextField
                                    id='verifyPassword'
                                    className='form-control form-control-solid mb-3 mb-lg-0'

                                    name='verifyPassword'
                                    type={showVerifyPassword ? 'text' : 'password'}
                                    placeholder='Enter Confirm Password'
                                    value={verifyPassword}
                                    onChange={(e) => setVerifyPassword(e.target.value)}
                                    InputProps={{
                                        endAdornment: (
                                            <IconButton
                                                aria-label='toggle password visibility'
                                                onClick={handleToggleVerifyPasswordVisibility}
                                            >
                                                {showVerifyPassword ? <Visibility /> : <VisibilityOff />}
                                            </IconButton>
                                        ),
                                        style: { height: '35px' }
                                    }}
                                />
                                {/* <input
                                    type='password'
                                    placeholder='Enter Confirm Password'
                                    className='form-control form-control-solid mb-3 mb-lg-0'
                                    style={{ paddingTop: '5px', paddingBottom: '5px' }}
                                    id='verifyPassword'
                                    name='verifyPassword'
                                    value={verifyPassword}
                                    onChange={(e) => {
                                        setVerifyPassword(e.target.value);
                                        if (e.target.value !== newPassword) {
                                            setPasswordError('Passwords do not match.');
                                        } else {
                                            setPasswordError('');
                                        }
                                    }} /> */}
                            </div>
                        </><hr />
                        <div className={`text-center ${styles['fv-row']} mb-7`}>
                            <Button
                                onClick={onClose}
                                variant="contained"
                                className="btn btn-secondary me-3"
                            >
                                Discard
                            </Button>
                            <Button
                                type="submit"
                                variant="contained"
                                className={themec}
                            >
                                Save
                            </Button>
                        </div>
                    </form>
                </div>
                <Snackbar anchorOrigin={{
                    vertical: "top",
                    horizontal: "center",
                }} style={{ float: "right" }} open={open1} autoHideDuration={7000} onClose={handleClose1}>
                    {message1 ?
                        <Alert onClose={handleClose1} variant="filled" severity="success" sx={{ width: '100%' }}>
                            {message}!
                        </Alert>
                        : <Alert onClose={handleClose1} variant="filled" severity="error" sx={{ width: '100%' }}>
                            {message}!
                        </Alert>}
                </Snackbar>
                <Dialog
                    open={isDeleteDialogOpen}
                    style={{ zIndex: 9999 }}
                >
                    <DialogTitle>Delete Confirmation</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Are you sure you want to delete this Profile Picture?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setIsDeleteDialogOpen(false)} className='btn btn-secondary me-3'>
                            Cancel
                        </Button>
                        <Button onClick={confirmDelete} className={themec}>
                            Delete
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        </>
    );
};


export default ProfileDetails;
