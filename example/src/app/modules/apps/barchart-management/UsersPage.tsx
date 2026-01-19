import React from 'react';
import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
import { PageLink, PageTitle } from '../../../../_metronic/layout/core'
// import { UsersListWrapper } from './users-list/UsersList'
import DocumentList from './DocumentList'
import { UsersListWrapper } from './users-list/UsersList';


const usersBreadcrumbs: Array<PageLink> = [
  {
    title: 'Bar Management',
    path: '/piechart-management/barfiles/:label/:chart/:doctype',
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
          path='barfiles/:label/:chart/:doctype'
          element={
            <>
              <PageTitle>Document List</PageTitle>
              <UsersListWrapper />
            </>
          }
        />
      </Route>
      <Route index element={<Navigate to='/piechart-management/barfiles/:label/:chart/:doctype' />} />
    </Routes>
  )
}

export default UsersPage
