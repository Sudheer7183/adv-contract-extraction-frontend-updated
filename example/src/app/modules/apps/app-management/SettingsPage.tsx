import React from 'react';
import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
import { PageLink, PageTitle } from '../../../../_metronic/layout/core'
// import Settings from './pages/Settings';
import { ConfigurationWrapper } from './Configuration';


const usersBreadcrumbs: Array<PageLink> = [
    {
        title: 'Configuration',
        path: '/configuration/site-settings',
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
                    path='site-settings'
                    element={
                        <>
                            <PageTitle>Configuration</PageTitle>
                            <ConfigurationWrapper />
                        </>
                    }
                />
            </Route>
            <Route index element={<Navigate to='/configuration/site-settings' />} />
        </Routes>
    )
}

export default UsersPage
