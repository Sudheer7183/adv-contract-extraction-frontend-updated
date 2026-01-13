// @ts-nocheck
import React from 'react';
import { Column } from 'react-table'

import { UserLastLoginCell } from './UserLastLoginCell'

import { UserActionsCell } from './UserActionsCell'
import { UserCustomHeader } from './UserCustomHeader'

import { User } from '../../core/_models'
import { FileName } from './FileName';
import { FileType, UserLastLoginCell } from './FileType'
import { FileStatus } from './FileStatus';
import { FilePages } from './FilePage';
import { LockStatus } from './LockStatus';
import { Actions } from './Actions';
import { ContractFileType } from './ContractFileType';
import { DocType } from './Doctype';


const usersColumns: ReadonlyArray<Column<User>> = [
  // {
  //   Header: (props: any) => (
  //     <div style={{ marginLeft: '20px', paddingTop: '20px' }}>
  //       <UserCustomHeader tableProps={props} title='Contract Type' className='min-w-125px text-capitalize' />
  //     </div>
  //   ),
  //   id: 'userContractType.contractTypeName',
  //   Cell: ({ ...props }) => (
  //     <div style={{ marginLeft: '30px' }}>
  //       <ContractFileType userContract={props.data[props.row.index]} />
  //     </div>),
  // },
  {
    Header: (props) => (
      <div style={{ marginLeft: '20px', paddingTop: '20px' }}>
        <UserCustomHeader tableProps={props} title='DocType' className='min-w-125px text-capitalize' />
      </div>
    ),
    id: 'contractType.contractTypeName',
    Cell: ({ ...props }) => (
      <div style={{ marginLeft: '30px' }}>
        <DocType docType={props.data[props.row.index]} />
      </div>)
  },

  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='File Name' className='min-w-125px text-capitalize' />
    ),
    id: 'file_name',
    Cell: ({ ...props }) => <FileName data={props.data[props.row.index]} />,
  },
  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='Extention' className='min-w-125px text-capitalize' />
    ),
    id: 'file_type',
    Cell: ({ ...props }) => <FileType fileType={props.data[props.row.index]} />,
  },
  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='File Status' className='min-w-125px text-capitalize' />
    ),
    id: 'file_status',
    Cell: ({ ...props }) => <FileStatus fileStatus={props.data[props.row.index]} />,
  },
  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='Number of Pages' className='min-w-125px text-capitalize' />
    ),
    id: 'pages',
    Cell: ({ ...props }) => <FilePages filePages={props.data[props.row.index]} />,
  },
  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='Lock Status' className='min-w-125px text-capitalize' />
    ),
    id: 'lockStatus',
    Cell: ({ ...props }) => <LockStatus lockStatus={props.data[props.row.index]} />,
  },
  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='Actions' className='text-center min-w-70px text-capitalize' />
    ),
    id: 'actions',
    Cell: ({ ...props }) => <UserActionsCell actions={props.data[props.row.index]} />,
  },

]

export { usersColumns }
