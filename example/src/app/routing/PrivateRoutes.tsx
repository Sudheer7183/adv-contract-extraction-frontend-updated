import React, { FC, lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom'
import { MasterLayout } from '../../_metronic/layout/MasterLayout'
import TopBarProgress from 'react-topbar-progress-indicator'
import { DashboardWrapper } from '../pages/dashboard/DashboardWrapper'
import { getCSSVariableValue } from '../../_metronic/assets/ts/_utils'
import { WithChildren } from '../../_metronic/helpers'
import CreateCatalog from '../modules/apps/catalog-management/users-list/table/catalogType/CreateCatalog';
import CreateContractType from '../modules/apps/catalog-management/users-list/table/contractType/CreateContractType';
import { useAuth } from '../modules/auth';
import Services from '../modules/apps/app-management/pages/Services';
import EditContractType from '../modules/apps/catalog-management/users-list/table/contractType/EditContractType';
import EditCatalog from '../modules/apps/catalog-management/users-list/table/catalogType/EditCatalog';
import ErrorBoundary from '../ErrorBoundary';


const PrivateRoutes = () => {
  const ProjectsPage = lazy(() => import('../modules/apps/project-management/UsersPage'))
  const UsersPage = lazy(() => import('../modules/apps/user-management/UsersPage'))
  const ViewerPage = lazy(() => import('../modules/apps/viewer-management/ViewersPage'))
  const CatalogPage = lazy(() => import('../modules/apps/catalog-management/UsersPage'))
  const DocumentsPage = lazy(() => import('../modules/apps/document-management/UsersPage'))
  const BarChartDocument = lazy(() => import('../modules/apps/barchart-management/UsersPage'))
  const PieChartDocument = lazy(() => import('../modules/apps/piechart-management/UsersPage'))
  const Catalog = lazy(() => import('../modules/apps/catalog/CatalogManagementPage'))
  const SettingsPage = lazy(() => import('../modules/apps/app-management/SettingsPage'))
  const DataviewPage = lazy(() => import('../modules/apps/dataview/DataviewPage'))
  const SuperUsersPage = lazy(() => import('../modules/apps/super-user-management/UsersPage'))
  const RepositoryPage =lazy(()=>import('../modules/apps/repository-management/RepositoryPage'))

  const { currentUser } = useAuth()
  const NotificationPage = lazy(() => import('../modules/apps/notification-management/NotificationPage'))
  console.log(" current user values--->", currentUser);
  console.log("User role in route", currentUser?.role);
  const userRole = currentUser?.role
  const isSuperuser = currentUser?.isSuperuser

  return (
    <Routes>
      <Route element={<MasterLayout />}>
        {/* Redirect to Dashboard after success login/registartion */}
        {isSuperuser && !userRole && (
          <>
            <Route path='auth/*' element={<Navigate to='/super-user-list/users' />} />
          </>
        )}
        {userRole == "Admin" ?
          <Route path='auth/*' element={<Navigate to='/dashboard' />} />
          : <Route path='auth/*' element={<Navigate to='/project-list/projects' />} />
        }
        {/* Pages */}
        <Route path='dashboard' element={<DashboardWrapper />} />
        <Route
          path='/project-list/*'
          element={
            <SuspensedView>
              <ProjectsPage />
            </SuspensedView>
          }
        />
        <Route
          path='/document-management/*'
          element={
            <SuspensedView>
              <DocumentsPage />
            </SuspensedView>
          }
        />
        <Route
          path='/user-list/*'
          element={
            <SuspensedView>
              <UsersPage />
            </SuspensedView>
          }
        />
        <Route
          path='/super-user-list/*'
          element={
            <SuspensedView>
              <SuperUsersPage />
            </SuspensedView>
          }
        />
        <Route
          path='/catalog-management/*'
          element={
            <SuspensedView>
              <CatalogPage />
            </SuspensedView>
          }
        />
        <Route
          path='/viewer-management/*'
          element={
            <ErrorBoundary>
              <SuspensedView>
                <ViewerPage />
              </SuspensedView>
            </ErrorBoundary>

          }
        />

        <Route
          path='/piechart-management/*'
          element={
            <SuspensedView>
              <BarChartDocument />
            </SuspensedView>
          }
        />
        <Route
          path='/piechart1-management/*'
          element={
            <SuspensedView>
              <PieChartDocument />
            </SuspensedView>
          }
        />
        <Route
          path='/catalogManagement/*'
          element={
            <SuspensedView>
              <Catalog />
            </SuspensedView>
          }
        />
        <Route
          path='/dataexport/*'
          element={
            <SuspensedView>
              <DataviewPage />
            </SuspensedView>
          }
        />
        <Route
          path='/configuration/*'
          element={
            <SuspensedView>
              <SettingsPage />
            </SuspensedView>
          }
        />
        <Route
        path='/repository/*'
        element={
          <SuspensedView>
            <RepositoryPage/>
          </SuspensedView>
        }
        />
        <Route
          path='/notification/*'
          element={
            <SuspensedView>
              <NotificationPage />
            </SuspensedView>
          }
        />
        <Route path='/catalog-management/catalog/createcontract' element={<CreateContractType />} />
        <Route path='/catalog-management/catalog/createcatalog' element={<CreateCatalog />} />
        <Route path='/document-management/piefiles/:label/:chart' element={<PieChartDocument />} />
        <Route path='/document-management/barfiles/:label/:chart/:doctype' element={<BarChartDocument />} />
        <Route path='/configuration/site-settings/addservicedetail' element={<Services />} />
        <Route path='/catalog-management/catalog/editcontract/:id' element={<EditContractType />} />
        <Route path='/catalog-management/catalog/editcatalog/:id' element={<EditCatalog />} />

        {/* Page Not Found */}
        <Route path='*' element={<Navigate to='/error/404' />} />
      </Route>
    </Routes>
  )
}

const SuspensedView: FC<WithChildren> = ({ children }) => {
  const baseColor = getCSSVariableValue('--bs-primary')
  TopBarProgress.config({
    barColors: {
      '0': baseColor,
    },
    barThickness: 1,
    shadowBlur: 5,
  })
  return <Suspense fallback={<TopBarProgress />}>{children}</Suspense>
}

export { PrivateRoutes }
