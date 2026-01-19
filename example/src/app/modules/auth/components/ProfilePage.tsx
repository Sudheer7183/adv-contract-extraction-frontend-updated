import React, { FC, useState } from 'react';
import ReactDOM from 'react-dom';
import ProfileDetails from './ProfileDetails';


const ProfilePage: FC = () => {
    // const [isSubMenuVisible, setSubMenuVisible] = useState(false);
    const [selectedSubMenu, setSelectedSubMenu] = useState<any>(null);

    const handleUserProfileClick = () => {
        // Toggle the visibility of the submenu when clicking User Profile
        setSelectedSubMenu('passwordAndProfilePicture');
    };



    return (
        <div className='menu-item px-5' data-kt-menu-trigger='hover'
            data-kt-menu-placement='left-start'
            data-kt-menu-flip='bottom'>
            <a href='#' className='menu-link px-5'>
                <span className='menu-title position-relative' onClick={handleUserProfileClick}>User Profile</span>
            </a>
            {selectedSubMenu && ReactDOM.createPortal(
                <ProfileDetails onClose={() => setSelectedSubMenu(null)} />,
                document.body
            )}
        </div>

    );
};


export default ProfilePage;
