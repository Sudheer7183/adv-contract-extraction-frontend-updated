import React from 'react';
import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
import { PageLink, PageTitle } from '../../../../_metronic/layout/core'
import { UsersListWrapper } from './users-list/UsersList'
import { ModernUsersListWrapper } from './users-list/ModernUsersList'

const usersBreadcrumbs: Array<PageLink> = [
  {
    title: 'Project Management',
    path: '/project-management/projects',
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
          path='projects'
          element={
            <>
              <PageTitle>Projects list</PageTitle>
              <ModernUsersListWrapper />
            </>
          }
        />
      </Route>
      <Route index element={<Navigate to='/project-list/projects' />} />
    </Routes>
  )
}

export default UsersPage
