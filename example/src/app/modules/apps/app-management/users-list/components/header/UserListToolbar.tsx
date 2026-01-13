import React from 'react';
import { KTIcon } from '../../../../../../../_metronic/helpers'
import { useListView } from '../../core/ListViewProvider'
import { useNavigate } from 'react-router-dom';

const UsersListToolbar = () => {
  const { setItemIdForUpdate } = useListView()
  const nav = useNavigate()
  const openAddUserModal = () => {
    setItemIdForUpdate(null)
    nav("/configuration/site-settings/addservicedetail")
  }

  const colorv = localStorage.getItem("themeColor")
  console.log("colorcolor", colorv)
  const themec = colorv != null ? colorv + " " + 'btn' : 'p-3 bg-primary text-white btn'

  return (
    <div className='d-flex justify-content-end' data-kt-user-table-toolbar='base'>
      <button type='button' className={themec} onClick={openAddUserModal}>
        <KTIcon iconName='plus' className='fs-2' />
        Add Service Detail
      </button>
    </div>
  )
}

export { UsersListToolbar }
