import React from 'react';
import { useListView } from '../../core/ListViewProvider'
import { UsersListToolbar } from './UserListToolbar'
import { UsersListSearchComponent } from './UsersListSearchComponent'
import DocumentProcess from './DocumentProcess';

const UsersListHeader = () => {
  const { selected } = useListView()
  return (
    <div className='card-header border-0'>
      <UsersListSearchComponent />
      {/* {selected.length > 0 ? <UsersListGrouping /> : null} */}
      {/* begin::Card toolbar */}
      <div className='card-toolbar'>
        <div className='card-toolbar'>
          <UsersListToolbar />
          <DocumentProcess />
        </div>
      </div>
      {/* end::Card toolbar */}
    </div>
  )
}

export { UsersListHeader }
