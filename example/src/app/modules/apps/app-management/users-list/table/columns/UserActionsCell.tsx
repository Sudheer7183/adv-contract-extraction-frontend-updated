/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { FC, useEffect, useState } from 'react'
import { MenuComponent } from '../../../../../../../_metronic/assets/ts/components'
import { KTIcon } from '../../../../../../../_metronic/helpers'
import { useListView } from '../../core/ListViewProvider'
import request, { gql } from 'graphql-request'
import BASEURL from '../../../../../../config/baseurl'
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';


type Props = {
  id: string
}

const deleteService = gql`
mutation DeleteService($id: String!){
  deleteService(id: $id){
    ok
  }
}
`

const UserActionsCell: FC<Props> = ({ id }) => {
  const { setItemIdForUpdate, setUpdate } = useListView();
  const [openDeleteConfirmation, setOpenDeleteConfirmation] = useState(false);


  useEffect(() => {
    MenuComponent.reinitialization()
  }, [])

  const openEditModal = () => {
    setItemIdForUpdate(id)
  }

  const handleServiceDelete = () => {
    setOpenDeleteConfirmation(true);
  };


  const handleDeleteConfirmed = async () => {
    try {
      const response = await request(`${BASEURL}graphql/`, deleteService, { id: id }, {Authorization: `Bearer ${localStorage.getItem('Token')}`});
      console.log('Delete contract type in userActionCell', response);
      setUpdate(true);
    } catch (error) {
      console.error('Error deleting service:', error);
    }
    setOpenDeleteConfirmation(false);
  };


  // const serviceDelete = (id: any) => {
  //   request(`${BASEURL}graphql/`, deleteService, { id: id }).then((res: any) => {
  //     console.log("Delete contract type in userActionCell", res);
  //     setUpdate(true)
  //   })
  // }

  const colorv = localStorage.getItem("themeColor")
  const themec = colorv != null ? colorv + " " + 'btn' : 'p-3 bg-primary text-white btn'

  return (
    <>
      <a
        href='#'
        className='btn btn-light btn-active-light-primary btn-sm'
        data-kt-menu-trigger='click'
        data-kt-menu-placement='bottom-end'
      >
        Select
        <KTIcon iconName='down' className='fs-5 m-0' />
      </a>
      {/* begin::Menu */}
      <div
        className='menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg-light-primary fw-bold fs-7 w-125px py-4'
        data-kt-menu='true'
      >
        {/* begin::Menu item */}
        <div className='menu-item px-3'>
          <a className='menu-link px-3' onClick={openEditModal}>
            Edit
          </a>
        </div>
        {/* end::Menu item */}

        {/* begin::Menu item */}
        <div className='menu-item px-3'>
          <a
            className='menu-link px-3'
            data-kt-users-table-filter='delete_row'
            onClick={handleServiceDelete}
          >
            Delete
          </a>
        </div>
        {/* end::Menu item */}
      </div>
      {/* end::Menu */}
      <Dialog
        open={openDeleteConfirmation}
        onClose={() => setOpenDeleteConfirmation(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Confirmation
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this item?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button type='button' className='btn btn-secondary me-3'
            onClick={() => setOpenDeleteConfirmation(false)}
            data-dismiss='modal'>Cancel</Button>
          <Button type='button' className={themec} onClick={handleDeleteConfirmed} autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export { UserActionsCell }

