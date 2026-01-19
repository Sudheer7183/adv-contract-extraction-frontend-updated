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
import { Expand } from './Expand';

const usersColumns: ReadonlyArray<Column<User>> = [
  {
    Header: (props) => (
      <div style={{ marginLeft: '20px', paddingTop: '20px' }}>
        <UserCustomHeader tableProps={props} title='Expand' className='min-w-55px text-capitalize' />
      </div>
    ),
    id: 'allData',
    Cell: ({ ...props }) => (
      <div style={{ marginLeft: '30px' }}>
        <Expand allData={props.data[props.row.index].id} />
      </div>
    ),
  },
  {
    Header: (props) => <UserCustomHeader tableProps={props} title='Service Type' className='min-w-125px text-capitalize' />,
    accessor: 'service.serviceName',
  },
  {
    Header: (props) => <UserCustomHeader tableProps={props} title='Description' className='min-w-125px text-capitalize' />,
    accessor: 'description',
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
