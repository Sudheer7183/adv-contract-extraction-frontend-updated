import React from 'react';
import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
import { PageLink, PageTitle } from '../../../../_metronic/layout/core'
// import { UsersListWrapper } from './users-list/UsersList'
import DocumentList from './DocumentList'
import { UsersListWrapper } from './users-list/UsersList';


const usersBreadcrumbs: Array<PageLink> = [
  {
    title: 'PieChartDocument',
    path: '/piechart1-management/barfiles/:label/:chart',
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


const UsersPage = () => {
  return (
    <Routes>
      <Route element={<Outlet />}>
        <Route
          path='barfiles/:label/:chart'
          element={
            <>
              <PageTitle >Document List</PageTitle>
              <UsersListWrapper />
              {/* <DocumentList /> */}
            </>
          }
        />
      </Route>
      <Route index element={<Navigate to='/piechart1-management/barfiles/:label/:chart' />} />
    </Routes>
  )
}


export default UsersPage


