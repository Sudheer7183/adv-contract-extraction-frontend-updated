import React from 'react';
import { ListViewProvider, useListView } from './core/ListViewProvider'
import { QueryRequestProvider } from './core/QueryRequestProvider'
import { QueryResponseProvider } from './core/QueryResponseProvider'
import { ContractTypeHeader } from './components/header/ContractTypeHeader'
// import { UsersTable } from './table/UsersTable'
import { UserEditModal } from './user-edit-modal/UserEditModal'
import { KTCard } from '../../../../../../_metronic/helpers'
import { ContractTypeTable } from './table/ContractTypeTable';

const UsersList = () => {
  const { itemIdForUpdate } = useListView()
  return (
    <>
      <KTCard>
        <ContractTypeHeader />
        <ContractTypeTable />
      </KTCard>
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
