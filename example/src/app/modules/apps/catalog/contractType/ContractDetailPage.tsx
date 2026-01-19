// import React from 'react';
// import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
// import { PageLink, PageTitle } from '../../../../_metronic/layout/core'
// import { UsersListWrapper } from './users-list/UsersList'

// const usersBreadcrumbs: Array<PageLink> = [
//   {
//     title: 'DV Management',
//     path: '/dataview-management/data',
//     isSeparator: false,
//     isActive: false,
//   },
//   {
//     title: '',
//     path: '',
//     isSeparator: true,
//     isActive: false,
//   },
// ]

// const UsersPage = () => {
//   return (
//     <Routes>
//       <Route element={<Outlet />}>
//         <Route
//           path='data'
//           element={
//             <>
//               <PageTitle breadcrumbs={usersBreadcrumbs}>Data view</PageTitle>
//               <UsersListWrapper />
//             </>
//           }
//         />
//       </Route>
//       <Route index element={<Navigate to='/project-management/projects' />} />
//     </Routes>
//   )
// }

// export default UsersPage
import React from 'react';
import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
import { PageLink, PageTitle } from '../../../../../_metronic/layout/core'
// import { UsersListWrapper } from './users-list/UsersList'
// import DocumentList from './DocumentList'
import { UsersListWrapper } from './users-list/UsersList'



const ContractDetailPage = () => {
  const usersBreadcrumbs: Array<PageLink> = [
    {
      title: 'Catalog Management',
      path: '/catalogManagement/ContractType',
      isSeparator: false,
      isActive: false,
    },
    {
      title: '',
      path: '',
      isSeparator: true,
      isActive: false,
    },
  ]

  return (
    <>
      <PageTitle >Catalog-list</PageTitle>
      <UsersListWrapper />
    </>
  )
}

export default ContractDetailPage
