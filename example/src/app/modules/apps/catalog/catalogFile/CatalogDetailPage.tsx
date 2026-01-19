import React from 'react';
import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
import { PageLink, PageTitle } from '../../../../../_metronic/layout/core'
// import { UsersListWrapper } from './users-list/UsersList'
// import DocumentList from './DocumentList'
import { UsersListWrapper } from './users-list/UsersList'

const CatalogDetailPage = () => {
  return (
    <>
      <PageTitle >Catalog-list</PageTitle>
      <UsersListWrapper />
    </>
  )
}

export default CatalogDetailPage
