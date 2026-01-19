/* eslint-disable jsx-a11y/anchor-is-valid */
import clsx from 'clsx'
import React, { FC } from 'react'
import { toAbsoluteUrl } from '../../../../../../../_metronic/helpers'
import { User } from '../../core/_models'
import { Avatar } from '@mui/material'

type Props = {
  user: User
}

const UserInfoCell: FC<Props> = ({ user }) => {
  console.log("userinfocell profile", user);


  // const fullName = user.firstName + ' ' + user.lastName

  return (
    <div className='d-flex align-items-center'>
      <div className='symbol symbol-circle symbol-50px overflow-hidden me-3'>
        {user.profilePicture ? (
          <div className='symbol-label'>
            <Avatar
              alt={user.username}
              src={"http://127.0.0.1:8000/" + user.profilePicture} />
          </div>
        ) : (
          <Avatar>
            {user.username?.charAt(0).toUpperCase()}
          </Avatar>
        )}
      </div>
      <div className='d-flex flex-column'>
        {/* <span>{fullName}</span> */}
        <span>{user.email}</span>
      </div>
    </div>
  )
}


export { UserInfoCell }
