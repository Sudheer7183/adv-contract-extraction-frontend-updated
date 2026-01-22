// import React from 'react';
// import { useListView } from '../../core/ListViewProvider'
// import { UsersListToolbar } from './UserListToolbar'
// import { UsersListGrouping } from './UsersListGrouping'
// import { UsersListSearchComponent } from './UsersListSearchComponent'
// import { useAuth } from '../../../../../auth';

// const UsersListHeader = () => {
//   const { selected } = useListView()
//   const { currentUser } = useAuth()

//   console.log(" current user values--->", currentUser);
//   console.log("User role", currentUser?.role);
//   const Role = currentUser?.role

//   return (
//     <div className='card-header border-0'>
//       <UsersListSearchComponent />
//       {/* begin::Card toolbar */}
//       {(Role === "Admin" || Role === "Manager") ?
//         <div className='card-toolbar'>
//           {/* begin::Group actions */}
//           <UsersListToolbar />
//           {/* {selected.length > 0 ? <UsersListGrouping /> : <UsersListToolbar />} */}
//           {/* end::Group actions */}
//         </div> : null}
//       {/* end::Card toolbar */}
//     </div>
//   )
// }

// export { UsersListHeader }


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
    <div className='card-header border-0 pt-6 pb-4'>
      <div className='d-flex align-items-center justify-content-between w-100 flex-wrap gap-4'>
        {/* Search Component */}
        <div className='d-flex align-items-center gap-4 flex-grow-1'>
          <UsersListSearchComponent />
        </div>

        {/* Toolbar */}
        {(Role === "Admin" || Role === "Manager") && (
          <div className='d-flex align-items-center gap-3'>
            <UsersListToolbar />
          </div>
        )}
      </div>
    </div>
  )
}

export { UsersListHeader }