import React from 'react';
import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
import { PageLink, PageTitle } from '../../../../_metronic/layout/core'
import { UsersListWrapper } from './users-list/UsersList'
import { RequestedUsersListWrapper } from './requested-users/requested_users';
const UsersPage = () => {
  return (
    <Routes>
      <Route element={<Outlet />}>
        <Route
          path='users'
          element={
            <>
              <PageTitle >Users list</PageTitle>
              <UsersListWrapper />
            </>
          }
        />
      </Route>
      <Route
        path='requests'
        element={
          <>
            <PageTitle >Request</PageTitle>
            <RequestedUsersListWrapper />
          </>
        }
      />

      <Route index element={<Navigate to='/super-user-list/users' />} />
      <Route index element={<Navigate to='/super-user-list/requests' />} />
    </Routes>
  )
}

export default UsersPage
