/* eslint-disable react/jsx-no-target-blank */
import { useIntl } from 'react-intl'
import { AsideMenuItem } from './AsideMenuItem'
import React from 'react';
import { useAuth } from '../../../../app/modules/auth';

export function AsideMenuMain() {
  const intl = useIntl()
  const { currentUser } = useAuth()

  console.log(" current user values--->", currentUser);
  console.log("User role", currentUser?.role);
  const isSuperuser = currentUser?.isSuperuser
  const Role = currentUser?.role

  return (
    <>

      {isSuperuser && !Role && (
        <>
          <AsideMenuItem to='/super-user-list/users' icon='profile-circle' title='Users' />
          <AsideMenuItem to='/super-user-list/requests' icon='notification' title='Requests'/>
        </>
      )}
      {Role == "Admin" && (
        <>
          <AsideMenuItem
            to='/dashboard'
            icon='element-11'
            title={intl.formatMessage({ id: 'MENU.DASHBOARD' })} />
          <AsideMenuItem to='/project-list/projects' icon='folder' title='Projects' />
          {/* <AsideMenuItem to='/data-management/dataview' icon='switch' title='Data View' /> */}
          {/* <AsideMenuItem to='/dataview-management/data' icon='file' title='Data View' /> */}
          <AsideMenuItem to='/dataexport/data' icon='data' title='Data Export' />
          {/* <AsideMenuItem to='/catalog-management/catalog' icon='profile-circle' title='Catalog Management' /> */}
          <AsideMenuItem to='/catalogManagement/ContractType' icon='book-square' title='Catalog' />
          <AsideMenuItem to='/configuration/site-settings' icon='setting-2' title='Configuration' />
          <AsideMenuItem to='/user-list/users' icon='profile-circle' title='Users' />
          <AsideMenuItem to='/repository' icon='file' title='Repository'/>
          <AsideMenuItem to='/notification/alerts' icon='notification' title='Notification' />

        </>
      )}
      {Role == "Manager" && (
        <>
          <AsideMenuItem
            to='/dashboard'
            icon='element-11'
            title={intl.formatMessage({ id: 'MENU.DASHBOARD' })} />
          <AsideMenuItem to='/project-list/projects' icon='folder' title='Projects' />
          {/* <AsideMenuItem to='/data-management/dataview' icon='switch' title='Data View' /> */}
          {/* <AsideMenuItem to='/dataview-management/data' icon='file' title='Data View' /> */}
          <AsideMenuItem to='/dataexport/data' icon='data' title='Data Export' />
          {/* <AsideMenuItem to='/catalog-management/catalog' icon='profile-circle' title='Catalog Management' /> */}
          <AsideMenuItem to='/catalogManagement/ContractType' icon='book-square' title='Catalog' />
          <AsideMenuItem to='/configuration/site-settings' icon='setting-2' title='Configuration' />
          <AsideMenuItem to='/repository' icon='file' title='Repository'/>
          <AsideMenuItem to='/notification/alerts' icon='notification' title='Notification' />

          {/* <AsideMenuItem to='/user-list/users' icon='profile-circle' title='Users' /> */}
        </>
      )}
      {Role == "Reviewer" && (
        <>
          <AsideMenuItem to='/project-list/projects' icon='folder' title='Projects' />
          {/* <AsideMenuItem to='/data-management/dataview' icon='switch' title='DataView' /> */}
          {/* <AsideMenuItem to='/dataview-management/data' icon='file' title='Data View' /> */}
          <AsideMenuItem to='/dataexport/data' icon='data' title='Data Export' />
        </>
      )}

    </>
  )
}
