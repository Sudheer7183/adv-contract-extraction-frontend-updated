// @ts-nocheck
import React from 'react';
import { Column } from 'react-table'

import { UserSelectionCell } from './UserSelectionCell'
import { UserCustomHeader } from './UserCustomHeader'
import { UserSelectionHeader } from './UserSelectionHeader'
import { User } from '../../core/_models'


const usersColumns: ReadonlyArray<Column<User>> = [
  {
    Header: (props) => (
      <div style={{ marginLeft: '20px', paddingTop: '20px' }}>
        <UserSelectionHeader tableProps={props} />
      </div>
    ),
    id: 'selection',
    Cell: ({ ...props }) => (
      <div style={{ marginLeft: '30px' }}>
        <UserSelectionCell id={props.data[props.row.index].id} />
      </div>
    ),
  },
  {
    Header: (props) => <UserCustomHeader tableProps={props} title='Project Name' className='min-w-125px text-capitalize' />,
    id: 'project.projectName',
    accessor: 'project.projectName',
  },
  {
    Header: (props) => <UserCustomHeader tableProps={props} title='Contract Type' className='min-w-125px text-capitalize' />,
    accessor: 'contractType.contractTypeName',
  },
  {
    Header: (props) => <UserCustomHeader tableProps={props} title='File Name' className='min-w-125px text-capitalize' />,
    accessor: 'fileName',
  },
  {
    Header: (props) => <UserCustomHeader tableProps={props} title='Status' className='min-w-125px text-capitalize' />,
    accessor: 'fileStatus',
  }
]

export { usersColumns }
