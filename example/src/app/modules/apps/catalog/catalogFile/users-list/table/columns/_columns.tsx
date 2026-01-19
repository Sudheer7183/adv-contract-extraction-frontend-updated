// @ts-nocheck
import React from 'react';
import { Column } from 'react-table'

import { FileType, UserLastLoginCell } from './FileType'
// import { UserTwoStepsCell } from './UserTwoStepsCell'
import { UserActionsCell } from './UserActionsCell'


import { UserCustomHeader } from './UserCustomHeader'

import { User } from '../../core/_models'

// import { FileType } from './FileType';



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
      <UserCustomHeader tableProps={props} title='catalog Name' className='min-w-125px text-capitalize' />
    ),
    id: 'catalog_name',
    Cell: ({ ...props }) => <ProjectName catalogName={props.data[props.row.index]} />,
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
