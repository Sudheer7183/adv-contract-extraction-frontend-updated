// @ts-nocheck
import React from 'react';
import { Column } from 'react-table'

import { UserActionsCell } from './UserActionsCell'
import { UserCustomHeader } from './UserCustomHeader'
import { User } from '../../core/_models'
import { ProjectName } from './ProjectName'
import { ProjectStatus } from './ProjectStatus';

const usersColumns: ReadonlyArray<Column<User>> = [
  {
    Header: (props) => (
      <div style={{ marginLeft: '20px', paddingTop: '20px' }}>
        <UserCustomHeader tableProps={props} title='Project Name' className='min-w-125px text-capitalize' />
      </div>
    ),
    id: 'project_name',
    Cell: ({ ...props }) => (
      <div style={{ marginLeft: '30px' }}>
        <ProjectName data={props.data[props.row.index]} />
      </div>
    ),
  },
  {
    Header: (props) => <UserCustomHeader tableProps={props} title='Total Files' className='min-w-125px text-capitalize' />,
    accessor: 'totalFiles',
    id: 'total_files',
  },
  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='Project Status' className='min-w-125px text-capitalize' />
    ),
    id: 'dataStatus',
    Cell: ({ ...props }) => <ProjectStatus dataStatus={props.data[props.row.index]} />,
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
