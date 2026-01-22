// import React from 'react';
// import { KTIcon } from '../../../../../../../_metronic/helpers'
// import { useListView } from '../../core/ListViewProvider'
// import { UsersListFilter } from './UsersListFilter'

// const UsersListToolbar = () => {
//   const { setItemIdForUpdate } = useListView()
//   const openAddUserModal = () => {
//     setItemIdForUpdate(null)
//   }

//   const colorv = localStorage.getItem("themeColor")
//   console.log("colorcolor", colorv)
//   const themec = colorv != null ? colorv + " " + 'btn' : 'p-3 bg-primary text-white btn'

//   return (
//     <div className='d-flex justify-content-end' data-kt-user-table-toolbar='base'>
//       {/* <UsersListFilter /> */}

//       {/* begin::Export */}
//       {/* <button type='button' className='btn btn-light-primary me-3'>
//         <KTIcon iconName='exit-up' className='fs-2' />
//         Export
//       </button> */}
//       {/* end::Export */}

//       {/* begin::Add user */}
//       <button type='button' className={themec} onClick={openAddUserModal}>
//         <KTIcon iconName='plus' className='fs-2' />
//         Add Project
//       </button>
//       {/* end::Add user */}
//     </div>
//   )
// }

// export { UsersListToolbar }


import React from 'react';
import { KTIcon } from '../../../../../../../_metronic/helpers'
import { useListView } from '../../core/ListViewProvider'
import { UsersListFilter } from './UsersListFilter'

const UsersListToolbar = () => {
  const { setItemIdForUpdate } = useListView()
  const openAddUserModal = () => {
    setItemIdForUpdate(null)
  }

  const colorv = localStorage.getItem("themeColor")
  const themec = colorv != null ? colorv + " " + 'btn' : 'btn btn-primary'

  return (
    <div className='d-flex justify-content-end align-items-center gap-3' data-kt-user-table-toolbar='base'>
      {/* Add Project Button with Modern Style */}
      <button 
        type='button' 
        className={`${themec} d-flex align-items-center gap-2 px-6`}
        onClick={openAddUserModal}
        style={{
          height: '48px',
          borderRadius: '12px',
          fontSize: '15px',
          fontWeight: '600',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          transition: 'all 0.2s ease',
          border: 'none'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
        }}
      >
        <i className='bi bi-plus-lg fs-4'></i>
        <span>Add Project</span>
      </button>
    </div>
  )
}

export { UsersListToolbar }