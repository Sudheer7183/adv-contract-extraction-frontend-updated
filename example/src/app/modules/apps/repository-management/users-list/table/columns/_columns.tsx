// @ts-nocheck
import React from 'react';
import { Column } from 'react-table'

// import { UserLastLoginCell } from './UserLastLoginCell'



import { UserSelectionCell } from './UserSelectionCell'
import { UserCustomHeader } from './UserCustomHeader'
import { UserSelectionHeader } from './UserSelectionHeader'
import { User } from '../../core/_models'
import { FileName } from './FileName';
import { FileType, UserLastLoginCell } from './FileType'
import { FileStatus } from './FileStatus';


import { Actions } from './Actions';


import { Language } from './Language';
import { DocumentType } from './DocumentType';


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
      <UserCustomHeader tableProps={props} title='Document Name' className='min-w-125px text-capitalize' />
    ),
    accessor: 'document_title',
    
    // Cell: ({ ...props }) => <FileName data={props.data[props.row.index]} />,
  },
  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='FileName' className='min-w-125px text-capitalize' />
    ),
    accessor: 'fileName',
    // Cell: ({ ...props }) => <FileName data={props.data[props.row.index]} />,
  },
  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='Parties' className='min-w-125px text-capitalize' />
    ),
    accessor: 'parties',
    // Cell: ({ ...props }) => <FileStatus fileStatus={props.data[props.row.index]} />,
  },
  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='Effective Date' className='min-w-125px text-capitalize' />
    ),
    accessor: 'effective_date',
    // Cell: ({ ...props }) => <Language data={props.data[props.row.index]} />,
  },
  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='Expiry Date' className='min-w-125px text-capitalize' />
    ),
    accessor: '“maturity_date”/“termination_date”_definition',
    // Cell: ({ ...props }) => <Language data={props.data[props.row.index]} />,
  },

]

export { usersColumns }
