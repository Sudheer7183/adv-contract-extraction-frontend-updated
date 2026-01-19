import React from 'react';
import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
import { PageLink, PageTitle } from '../../../../_metronic/layout/core'
import Viewer from './pages/Viewer';
import { UsersListWrapper } from './viewer-list/ViewerList';
// import { UsersListWrapper } from './users-list/UsersList'

const usersBreadcrumbs: Array<PageLink> = [
    {
        title: 'Viewer Management',
        path: '/viewer-management/viewer/:id',
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
                    path='viewer/:id'
                    element={
                        <>
                            {/* <PageTitle breadcrumbs={usersBreadcrumbs}>Document Viewer</PageTitle> */}
                            <Viewer />
                            {/* <UsersListWrapper /> */}
                        </>
                    }
                />
            </Route>
            <Route index element={<Navigate to='/viewer-management/viewer/:id' />} />
        </Routes>
    )
}

export default UsersPage
