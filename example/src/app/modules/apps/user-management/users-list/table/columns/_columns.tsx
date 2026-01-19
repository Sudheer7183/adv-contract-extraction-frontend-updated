// @ts-nocheck
import React from 'react';
import { Column } from 'react-table'
import { UserInfoCell } from './UserInfoCell'

import { UserActionsCell } from './UserActionsCell'

import { UserCustomHeader } from './UserCustomHeader'

import { User } from '../../core/_models'
import { UserStatus } from './UserStatus';
import { LastLogin } from './LastLogin'

const usersColumns: ReadonlyArray<Column<User>> = [
  {
    Header: (props) => (
      <div style={{ marginLeft: '20px', paddingTop: '20px' }}>
        <UserCustomHeader tableProps={props} title='Email' className='min-w-125px text-capitalize' />
      </div>
    ),
    id: 'email',
    Cell: ({ ...props }) => (
      <div style={{ marginLeft: '30px' }}>
        <UserInfoCell user={props.data[props.row.index]} />
      </div>
    ),
    // Cell: ({ ...props }) => <UserInfoCell user={props.data[props.row.index]} />,
  },
  {
    Header: (props) => <UserCustomHeader tableProps={props} title='Role' className='min-w-125px text-capitalize' />,
    accessor: 'role',
  },
  {
    Header: (props) => <UserCustomHeader tableProps={props} title='User Name' className='min-w-125px text-capitalize' />,
    accessor: 'username',
  },
  {
    Header: (props) => <UserCustomHeader tableProps={props} title='First Name' className='min-w-125px text-capitalize' />,
    accessor: 'firstName',
  },
  {
    Header: (props) => <UserCustomHeader tableProps={props} title='Last Name' className='min-w-125px text-capitalize' />,
    accessor: 'lastName',
  },
  {
    Header: (props) => <UserCustomHeader tableProps={props} title='Last Login' className='min-w-125px text-capitalize' />,
    id: 'last_login',
    Cell: ({ ...props }) => {
      console.log("props.data", props.data);
      return <LastLogin lastLogin={props.data[props.row.index]} />;
    },
  },

  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='Status' className='min-w-125px text-capitalize' />
    ),
    id: 'dataStatus',
    Cell: ({ ...props }) => <UserStatus dataStatus={props.data[props.row.index]} />,
  },
  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='Actions' className='text-center min-w-100px text-capitalize' />
    ),
    id: 'actions',
    Cell: ({ ...props }) => <UserActionsCell id={props.data[props.row.index].id} />,
  },
]

export { usersColumns }
