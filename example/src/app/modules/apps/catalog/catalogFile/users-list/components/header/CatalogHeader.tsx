import React from 'react';
import { useListView } from '../../core/ListViewProvider1'
import { UsersListToolbar } from './UserListToolbar'
import { UsersListGrouping } from './UsersListGrouping'
import { UsersListSearchComponent } from './UsersListSearchComponent'

const CatalogHeader = () => {
  const { selected } = useListView()
  return (
    <div className='card-header border-0'>
      <UsersListSearchComponent />
      {/* begin::Card toolbar */}
      <div className='card-toolbar'>
        {/* begin::Group actions */}
        <UsersListToolbar />
        {/* {selected.length > 0 ? <UsersListGrouping /> : <UsersListToolbar />} */}
        {/* end::Group actions */}
      </div>
      {/* end::Card toolbar */}
    </div>
  )
}

export { CatalogHeader }
