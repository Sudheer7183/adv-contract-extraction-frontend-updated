import React from 'react';
import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
import { PageLink, PageTitle } from '../../../../_metronic/layout/core'
import { UsersListWrapper } from './users-list/UsersList';


const usersBreadcrumbs: Array<PageLink> = [
    {
        title: 'Data Export',
        path: '/dataexport/data',
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
                    path='data'
                    element={
                        <>
                            <PageTitle>Data Export</PageTitle>
                            <UsersListWrapper />

                        </>
                    }
                />
            </Route>
            <Route index element={<Navigate to='/dataexport/data' />} />
        </Routes>
    )
}

export default UsersPage
