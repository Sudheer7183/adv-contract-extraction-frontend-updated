// @ts-nocheck
import React from 'react';
import { Column } from 'react-table'

import { UserSelectionCell } from './UserSelectionCell'
import { UserCustomHeader } from './UserCustomHeader'
import { UserSelectionHeader } from './UserSelectionHeader'
import { User } from '../../core/_models'
import { UserStatus } from './UserStatus';
import { LastLogin } from './LastLogin'

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
  // {
  //   Header: (props: any) => (
  //     <UserCustomHeader tableProps={props} title='File name' className='min-w-125px text-capitalize' />
  //   ),
  //   id: 'userContractType.contractTypeName',
  //   Cell: ({ ...props }) => <ContractFileType userContract={props.data[props.row.index]} />,
  // },
  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='Type' className='min-w-125px text-capitalize' />
    ),
    accessor: 'ruleType',
    // Cell: ({ ...props }) => <FileName data={props.data[props.row.index]} />,
  },
  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='FileName' className='min-w-125px text-capitalize' />
    ),
    accessor: 'filename',
    // Cell: ({ ...props }) => <FileName data={props.data[props.row.index]} />,
  },
  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='Alert' className='min-w-125px text-capitalize' />
    ),
    accessor: 'title',
    // Cell: ({ ...props }) => <FileStatus fileStatus={props.data[props.row.index]} />,
  },
  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='Message' className='min-w-125px text-capitalize' />
    ),
    accessor: 'message',
    // Cell: ({ ...props }) => <Language data={props.data[props.row.index]} />,
  },


]

export { usersColumns }
