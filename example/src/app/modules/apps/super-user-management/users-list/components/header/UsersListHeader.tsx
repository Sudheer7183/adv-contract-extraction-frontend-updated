import React from 'react';
import { useListView } from '../../core/ListViewProvider'
import { UsersListToolbar } from './UserListToolbar'

import { UsersListSearchComponent } from './UsersListSearchComponent'

const UsersListHeader = () => {
  const { selected } = useListView()
  return (
    <div className='card-header border-0'>
      <UsersListSearchComponent />
      {/* begin::Card toolbar */}
      <div className='card-toolbar'>
        {/* begin::Group actions */}
        <UsersListToolbar />
      </div>
      {/* end::Card toolbar */}
    </div>
  )
}

export { UsersListHeader }
