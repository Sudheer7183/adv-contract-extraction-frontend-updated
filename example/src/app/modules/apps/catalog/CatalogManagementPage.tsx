import React from 'react';
import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
import { PageLink, PageTitle } from '../../../../_metronic/layout/core'
import { CatalogManagementListWrapper } from './CatalogManagementList'


const usersBreadcrumbs: Array<PageLink> = [
  {
    title: 'Catalog-Management',
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

const UsersPage = () => {
  return (
    <Routes>
      <Route element={<Outlet />}>
        <Route
          path='ContractType'
          element={
            <>
              <PageTitle >Catalog list</PageTitle>
              <CatalogManagementListWrapper />
            </>
          }
        />
        {/* <Route
          path='Catalog'
          element={
            <>
              <PageTitle breadcrumbs={usersBreadcrumbs}>Catalog list</PageTitle>
              <CatalogManagementListWrapper1 />
            </>
          }
        /> */}
      </Route>
      <Route index element={<Navigate to='/catalogManagement/ContractType' />} />
    </Routes>
  )
}

export default UsersPage
