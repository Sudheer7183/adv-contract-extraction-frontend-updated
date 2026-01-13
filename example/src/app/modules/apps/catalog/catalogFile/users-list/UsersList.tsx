import React from 'react';
import { ListViewProvider1, useListView } from './core/ListViewProvider1'
import { QueryRequestProvider1 } from './core/QueryRequestProvider1'
import { QueryResponseProvider1 } from './core/QueryResponseProvider1'
import { UserEditModal } from './user-edit-modal/UserEditModal'
import { KTCard } from '../../../../../../_metronic/helpers'
import { CatalogTable } from './table/CatalogTable';
import { CatalogHeader } from './components/header/CatalogHeader';

const UsersList = () => {
  const { itemIdForUpdate } = useListView()
  return (
    <>
      <KTCard>
        <CatalogHeader />
        <CatalogTable />
      </KTCard>
      {itemIdForUpdate !== undefined && <UserEditModal />}
    </>
  )
}

const UsersListWrapper = () => (
  <QueryRequestProvider1>
    <QueryResponseProvider1>
      <ListViewProvider1>
        <UsersList />
      </ListViewProvider1>
    </QueryResponseProvider1>
  </QueryRequestProvider1>
)

export { UsersListWrapper }
