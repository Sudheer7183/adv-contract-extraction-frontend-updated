/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { FC } from 'react'
import { useAuth } from '../../../../app/modules/auth'
import { Languages } from './Languages'
import { Colors } from './Colors'
import { ThemeModeSwitcher } from '../theme-mode/ThemeModeSwitcher'
import { Avatar } from '@mui/material';
import ProfilePage from '../../../../app/modules/auth/components/ProfilePage'

const HeaderUserMenu: FC = () => {
  const { currentUser, logout } = useAuth()
  console.log("CurrentUser", currentUser)
  const profilePicturePath = currentUser?.profilePicture;
  const Schema = localStorage.getItem('Schema');
  const TenantName = localStorage.getItem('TenantName')

  return (
    <div
      className='menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-800 menu-state-bg menu-state-primary fw-bold py-4 fs-6 w-275px'
      data-kt-menu='true'
      data-popper-placement='bottom-start'
    >
      <div className='menu-item px-3'>
        <div className='menu-content d-flex align-items-center px-3'>
          {/* <div className='symbol symbol-50px me-5'>
            <img alt='Logo' src='media/avatars/300-1.jpg' />
          </div> */}
          <div className='symbol symbol-50px me-5'>
            {profilePicturePath ? (
              <Avatar id="profile-picture"
                alt={currentUser?.username}
                src={"http://192.168.1.2:8001/" + profilePicturePath}
              />
            ) : (
              <Avatar>{currentUser?.username.charAt(0).toUpperCase()}</Avatar>
            )}
          </div>

          <div className='d-flex flex-column'>
            <div className='fw-bolder d-flex text-black align-items-center fs-5'>
              {currentUser?.username}
              {/* <span className='badge badge-light-success fw-bolder fs-8 px-2 py-1 ms-2'>Pro</span> */}
            </div>
            <a href='#' className='fw-bold text-muted text-hover-primary fs-7'>
              {currentUser?.email}
            </a>
            <a href='#' className='fw-bold text-muted text-hover-primary fs-7'>
              Company Name: {TenantName}
            </a>
            <a href='#' className='fw-bold text-muted text-hover-primary fs-7'>
              Schema: {Schema}
            </a>
          </div>
        </div>
      </div>

      <div className='separator my-2'></div>


      <ProfilePage />
      <Languages />
      <Colors />
      {/* <ThemeModeSwitcher toggleBtnClass='btn btn-sm btn-icon btn-icon-muted btn-light btn-active-icon-dark' /> */}


      <div className='menu-item px-5'>
        <a onClick={logout} className='menu-link px-5'>
          Sign Out
        </a>
      </div>
    </div>
  )
}

export { HeaderUserMenu }
