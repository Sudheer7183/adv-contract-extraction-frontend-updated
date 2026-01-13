// @ts-nocheck
import React from 'react';
import { Column } from 'react-table'
import { UserInfoCell } from './UserInfoCell'
import { FileType, UserLastLoginCell } from './FileType'
// import { UserTwoStepsCell } from './UserTwoStepsCell'
// import { UserActionsCell } from './UserActionsCell'
import { UserFileOpenCell } from './UserFileOpenCell'
import { UserSelectionCell } from './UserSelectionCell'
import { UserCustomHeader } from './UserCustomHeader'
import { UserSelectionHeader } from './UserSelectionHeader'
import { User } from '../../core/_models'
import { FileName } from './FileName';
// import { FileType } from './FileType';
import { FileStatus } from './FileStatus';
import { FilePages } from './FilePage';
import { LockStatus } from './LockStatus';
import { Actions } from './Actions';
import { ProjectName } from './ProjectName';
import { DocType } from './DocType';
import { UserActionsCell } from './UserActionsCell';


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
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='Project Name' className='min-w-125px text-capitalize' />
    ),
    id: 'projectName',
    Cell: ({ ...props }) => <ProjectName projectName={props.data[props.row.index]} />,
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
      <UserCustomHeader tableProps={props} title='DocType' className='min-w-125px text-capitalize' />
    ),
    id: 'contractType.contractTypeName',
    Cell: ({ ...props }) => <DocType docType={props.data[props.row.index]} />,
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
      <UserCustomHeader tableProps={props} title='Actions' className='text-center min-w-100px text-capitalize' />
    ),
    id: 'actions',
    Cell: ({ ...props }) => <UserActionsCell actions={props.data[props.row.index]} />,
  },
]


export { usersColumns }
