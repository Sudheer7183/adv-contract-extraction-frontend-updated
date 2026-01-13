import React from 'react';
import { useListView } from '../../core/ListViewProvider'
import { UsersListToolbar } from './UserListToolbar'
import { UsersListGrouping } from './UsersListGrouping'
import { UsersListSearchComponent } from './UsersListSearchComponent'
import { useAuth } from '../../../../../auth';

const UsersListHeader = () => {
  const { selected } = useListView()
  const { currentUser } = useAuth()

  console.log(" current user values--->", currentUser);
  console.log("User role", currentUser?.role);
  const Role = currentUser?.role

  return (
    <div className='card-header border-0'>
      <UsersListSearchComponent />
      {/* begin::Card toolbar */}
      {(Role === "Admin" || Role === "Manager") ?
        <div className='card-toolbar'>
          {/* begin::Group actions */}
          <UsersListToolbar />
          {/* {selected.length > 0 ? <UsersListGrouping /> : <UsersListToolbar />} */}
          {/* end::Group actions */}
        </div> : null}
      {/* end::Card toolbar */}
    </div>
  )
}

export { UsersListHeader }
