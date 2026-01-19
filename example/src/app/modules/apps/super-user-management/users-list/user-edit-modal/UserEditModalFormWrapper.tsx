import React from 'react';
import { useQuery } from '@tanstack/react-query'
import { UserEditModalForm } from './UserEditModalForm'
import { isNotEmpty, QUERIES } from '../../../../../../_metronic/helpers'
import { useListView } from '../core/ListViewProvider'
import { getUserById } from '../core/_requests'
import { EditModalForm } from './EditModalForm'

const UserEditModalFormWrapper = () => {
  const { itemIdForUpdate, setItemIdForUpdate } = useListView()
  const enabledQuery: boolean = isNotEmpty(itemIdForUpdate)
  const {
    isLoading,
    data: user,
    error,
  } = useQuery({
  queryKey: [`${QUERIES.USERS_LIST}-user-${itemIdForUpdate}`],
  queryFn: () => getUserById(itemIdForUpdate),
  gcTime: 0,
  enabled: enabledQuery,
  // onError removed - use error state instead
})

  console.log("User edit Id---->", itemIdForUpdate)

  if (!itemIdForUpdate) {
    return <UserEditModalForm isUserLoading={isLoading} user={{ id: undefined }} />
  }

  console.log("IsLoadingggg --->", isLoading);


  if (itemIdForUpdate) {
    return <EditModalForm id={itemIdForUpdate} />
  }


  return null
}

export { UserEditModalFormWrapper }


