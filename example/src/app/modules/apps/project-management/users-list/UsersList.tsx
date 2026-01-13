import React from 'react';
import { ListViewProvider, useListView } from './core/ListViewProvider'
import { QueryRequestProvider } from './core/QueryRequestProvider'
import { QueryResponseProvider } from './core/QueryResponseProvider'
import { UsersListHeader } from './components/header/UsersListHeader'
import { UsersTable } from './table/UsersTable'
import { UserEditModal } from './user-edit-modal/UserEditModal'
import { KTCard } from '../../../../../_metronic/helpers'
import { useAuth } from '../../../auth';
import { ReviewTable } from './table/ReviewTable';

const UsersList = () => {
  const { itemIdForUpdate } = useListView()
  const { currentUser } = useAuth()

  console.log(" current user values--->", currentUser);
  console.log("User role", currentUser?.role);
  const Role = currentUser?.role

  return (
    <>
      {Role == "Admin" ? (
        <KTCard>
          <UsersListHeader />
          <UsersTable />
        </KTCard>
      )
        : Role == "Manager" ? (
          <KTCard>
            <UsersListHeader />
            <UsersTable />
          </KTCard>
        ) : <KTCard>
          <UsersListHeader />
          <ReviewTable />
        </KTCard>}
      {itemIdForUpdate !== undefined && <UserEditModal />}
    </>
  )
}

const UsersListWrapper = () => (
  <QueryRequestProvider>
    <QueryResponseProvider>
      <ListViewProvider>
        <UsersList />
      </ListViewProvider>
    </QueryResponseProvider>
  </QueryRequestProvider>
)

export { UsersListWrapper }
