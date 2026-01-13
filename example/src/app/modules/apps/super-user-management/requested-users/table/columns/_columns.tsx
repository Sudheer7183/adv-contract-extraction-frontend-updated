// @ts-nocheck
import React from 'react';
import { Column } from 'react-table'
import { UserInfoCell } from './UserInfoCell'
import { UserLastLoginCell } from './UserLastLoginCell'
import { UserTwoStepsCell } from './UserTwoStepsCell'
import { UserActionsCell } from './UserActionsCell'
import { UserSelectionCell } from './UserSelectionCell'
import { UserCustomHeader } from './UserCustomHeader'
import { UserSelectionHeader } from './UserSelectionHeader'
import { User } from '../../core/_models'
import { UserStatus } from './UserStatus';
import { LastLogin } from './LastLogin'
import Header from '../../../../../landing_components/Header';

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
  // {
  //   Header: (props) => <UserCustomHeader tableProps={props} title='Role' className='min-w-125px text-capitalize' />,
  //   accessor: 'role',
  // },
  {
    Header: (props) => <UserCustomHeader tableProps={props} title='CompanyName' className='min-w-125px text-capitalize' />,
    accessor: 'companyName',
  },
    {
    Header: (props) => <UserCustomHeader tableProps={props} title='CompanyWebsite' className='min-w-125px text-capitalize' />,
    accessor: 'companyWebsite',
  },
  {
    Header: (props) => <UserCustomHeader tableProps={props} title='FullName' className='min-w-125px text-capitalize' />,
    accessor: 'fullName',
  },
  {
    Header: (props) => <UserCustomHeader tableProps={props} title='Region' className='min-w-125px text-capitalize' />,
    accessor: 'country',
  },
  {
    Header: (props) => <UserCustomHeader tableProps={props} title='PhoneNumber' className='min-w-125px text-capitalize' />,
    accessor: 'phoneNumber',
  },
  {
    Header: (props) => <UserCustomHeader tableProps={props} title='Jobtitle' className='min-w-125px text-capitalize' />,
    accessor: 'jobTitle',
  },
    {
    Header: (props) => <UserCustomHeader tableProps={props} title='Status' className='min-w-125px text-capitalize' />,
    accessor: 'status',
  },
  // {
  //   Header: (props) => <UserCustomHeader tableProps={props} title='Last Login' className='min-w-125px text-capitalize' />,
  //   id: 'last_login',
  //   Cell: ({ ...props }) => {
  //     console.log("props.data", props.data);
  //     return <LastLogin lastLogin={props.data[props.row.index]} />;
  //   },
  // },

  // {
  //   Header: (props) => (
  //     <UserCustomHeader tableProps={props} title='Status' className='min-w-125px text-capitalize' />
  //   ),
  //   id: 'dataStatus',
  //   Cell: ({ ...props }) => <UserStatus dataStatus={props.data[props.row.index]} />,
  // },
    {
      Header: (props) => (
        <UserCustomHeader tableProps={props} title='Actions' className='text-center min-w-100px text-capitalize' />
      ),
      id: 'actions',
      Cell: ({ ...props }) => <UserActionsCell id={props.data[props.row.index]} />,
    },
  // {
  //   Header: (props) => (
  //     <UserCustomHeader tableProps={props} title='Actions' className='text-center min-w-100px text-capitalize' />
  //   ),
  //   id: 'actions',
  //   Cell: ({ ...props }) => <UserActionsCell id={props.data[props.row.index].id} />,
  // },
]

export { usersColumns }
