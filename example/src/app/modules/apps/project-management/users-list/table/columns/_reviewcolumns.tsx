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
import { ProjectName } from './ProjectName'
import { ProjectStatus } from './ProjectStatus';

const reviewusersColumns: ReadonlyArray<Column<User>> = [
  {
    Header: (props) => (
      <div style={{ marginLeft: '20px', paddingTop: '20px' }}>
        <UserCustomHeader tableProps={props} title='ProjectName' className='min-w-125px' />
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
    Header: (props) => <UserCustomHeader tableProps={props} title='TotalFiles' className='min-w-125px' />,
    accessor: 'count',
    id: 'total_files',
  },
]

export { reviewusersColumns }
