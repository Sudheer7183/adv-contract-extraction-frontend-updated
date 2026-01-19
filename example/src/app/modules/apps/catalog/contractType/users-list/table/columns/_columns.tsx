// @ts-nocheck
import React from 'react';
import { Column } from 'react-table'

import { UserActionsCell } from './UserActionsCell'


import { UserCustomHeader } from './UserCustomHeader'
import { User } from '../../core/_models'

import { Actions } from './Actions';
import { ProjectName } from './ProjectName';
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
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='Contract Types' className='min-w-125px text-capitalize' />
    ),
    id: 'contract_type_name',
    Cell: ({ ...props }) => <ProjectName contractTypeName={props.data[props.row.index]} />,
  },
  {
    Header: 'No.of.fields', // Add a new header for the count value
    accessor: 'count', // Define an accessor for the count value
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
