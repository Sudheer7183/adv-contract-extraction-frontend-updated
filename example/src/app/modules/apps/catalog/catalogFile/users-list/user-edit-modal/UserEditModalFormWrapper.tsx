import React from 'react';
import { useQuery } from '@tanstack/react-query'
import { UserEditModalForm } from './UserEditModalForm'
import { isNotEmpty, QUERIES } from '../../../../../../../_metronic/helpers'
import { useListView } from '../core/ListViewProvider1'
import { getUserById } from '../core/_requests'
import { ProjectEditModalForm } from './ProjectEditModalForm'
// import { useListViewinUpload } from '../core/ListViewProviderinUpload'
import UploadForm from './UploadForm'


const UserEditModalFormWrapper = () => {
  const { itemIdForUpdate, setItemIdForUpdate, isEdit, setIsEdit, Hide } = useListView()
  // const {itemIdForUpdateinUpload, setItemIdForUpdateinUpload} = useListViewinUpload()
  const enabledQuery: boolean = isNotEmpty(itemIdForUpdate)
  console.log("ishide->", Hide);

  const {
    isLoading,
    data: user,
    error,
  } = useQuery(
    `${QUERIES.USERS_LIST}-user-${itemIdForUpdate}`,
    () => {
      return getUserById(itemIdForUpdate)
    },
    {
      gcTime: 0,
      enabled: enabledQuery,
      onError: (err) => {
        setItemIdForUpdate(undefined)
        console.error(err)
      },
    }
  )

  console.log("isEdit->", isEdit);


  // if (!itemIdForUpdate) {
  //   return <UserEditModalForm isUserLoading={isLoading} user={{id: undefined}} />
  // }


  // if (!isLoading && !error && user) {
  //   return <UserEditModalForm isUserLoading={isLoading} user={user} />
  // }
  if (!itemIdForUpdate) {
    return <UserEditModalForm isUserLoading={isLoading} user={{ id: undefined }} />
  }

  if (itemIdForUpdate && isEdit === true) {
    return <ProjectEditModalForm id={itemIdForUpdate} />
  }


  if (itemIdForUpdate && isEdit === false) {
    return <UploadForm id={itemIdForUpdate} />
  }


  return null
}


export { UserEditModalFormWrapper }



