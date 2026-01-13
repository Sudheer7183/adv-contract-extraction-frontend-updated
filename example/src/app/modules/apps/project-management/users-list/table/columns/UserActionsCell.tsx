/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { FC, useEffect, useState } from 'react'
import { MenuComponent } from '../../../../../../../_metronic/assets/ts/components'
import { ID, KTIcon } from '../../../../../../../_metronic/helpers'
import { useListView } from '../../core/ListViewProvider'
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import request, { gql } from 'graphql-request';
import { BsFolderCheck, BsFolderX } from 'react-icons/bs'
import BASEURL from '../../../../../../config/baseurl';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Button } from '@mui/material';


type Props = {
  id: ID
}

const Get_Project = gql`
query GetProject($id: String!){
  getProject(id: $id){
    id
    projectName
    description
    active
    totalFiles
  }
}`

const FILES_DETAIL = gql`
  query {
    filesDetail {
      id
      filePath
      fileName
      project{
        id
        projectName
      }
      zuvaFileId
      fileStatus
      fileType
      pages
      lock
      lockedBy {
        username
        email
        role
      }
    }
  }
`;
const DEACTIVE_PROJECT = gql`
  mutation DeactiveProject($id: String!, $folder: String!) {
    deactiveProject(id: $id, folder: $folder) {
      ok
    }
  }
`;


const UserActionsCell: FC<Props> = ({ id }) => {
  console.log("get project in action", id);

  const { setItemIdForUpdate } = useListView()
  const { setIsEdit } = useListView()


  useEffect(() => {
    MenuComponent.reinitialization()
  }, [])

  const openEditModal = () => {
    setItemIdForUpdate(id)
    setIsEdit(true)

  }
  const { setUpdate } = useListView()
  const [fileStatus, setfileStatus] = useState([])
  const [project, setProject] = useState([])
  console.log("fileStatus->", fileStatus);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("")
  const [message1, setMessage1] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeactivateDialogOpen, setIsDeactivateDialogOpen] = useState(false);
  const [actionToPerform, setActionToPerform] = useState('');


  // const openTable = () => {
  //   let folder = "Delete"
  //   Handledelete(id, folder)
  // }

  // const handledeactive = (id: any) => {
  //   let folder = "Deactive"
  //   Handledelete(id, folder)
  // }
  const openTable = () => {
    setIsDeleteDialogOpen(true);
    setActionToPerform('Delete');
  }

  const handledeactive = () => {
    setIsDeactivateDialogOpen(true);
    setActionToPerform('Deactive');
  }

  const confirmDelete = () => {
    // Check the actionToPerform variable
    if (actionToPerform === 'Delete') {
      // Perform the deletion operation here
      let folder = "Delete";
      Handledelete(id, folder);
      setIsDeleteDialogOpen(false); // Close the confirmation dialog
    }
  }

  const confirmDeactivate = () => {
    // Check the actionToPerform variable
    if (actionToPerform === 'Deactive') {
      // Perform the deactivation operation here
      let folder = "Deactive";
      Handledelete(id, folder);
      setIsDeactivateDialogOpen(false); // Close the confirmation dialog
    }
  }

  const handleClose = () => {
    setOpen(false);
  };
  const Handledelete = async (project_id: any, folder: any) => {
    console.log("Handle Delete", project_id, folder)
    request(`${BASEURL}graphql/`, DEACTIVE_PROJECT, { id: project_id, folder: folder }, {Authorization: `Bearer ${localStorage.getItem('Token')}`}).then((response: any) => {
      setOpen(true);
      if (response?.deactiveProject?.ok && folder == "Delete") {
        setMessage("Successfully Deleted")
        setMessage1(true)
        setUpdate(true)
      } else if (response?.deactiveProject?.ok && folder == "Deactive") {
        setMessage("Successfully Deactivated")
        setMessage1(true)
        setUpdate(true)
      } else {
        setMessage("Something Went Wrong")
        setMessage1(false)
      }
    })
  }
  useEffect(() => {
    request(`${BASEURL}graphql/`, Get_Project, { id: id }, {Authorization: `Bearer ${localStorage.getItem('Token')}`}).then((res: any) => setProject(res.getProject))
    request(`${BASEURL}graphql/`, FILES_DETAIL, {}, {Authorization: `Bearer ${localStorage.getItem('Token')}`}).then((res: any) => setfileStatus(res.filesDetail))
  }, [id])

  console.log("get project in action", project);
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
        <div className='menu-item px-3'>
          {project.totalFiles == 0 ? <a className='menu-link px-3' onClick={openTable}>
            Delete
          </a> : (((fileStatus.filter((item: any) => item.project.projectName == project.projectName && item.fileStatus == "Review Completed")).length == project.totalFiles) && project.active == true) ?
            <a className='menu-link px-3' onClick={() => handledeactive(project.id)}>
              Deactive
            </a> : project.active == false ? null : null}
        </div>
        {/* end::Menu item */}
      </div>
      {/* end::Menu */}
      <Snackbar anchorOrigin={{
        vertical: "top",
        horizontal: "center",
      }} style={{ float: "right" }} open={open} autoHideDuration={6000} onClose={handleClose}>
        {message1 ?
          <Alert onClose={handleClose} variant="filled" severity="success" sx={{ width: '100%' }}>
            {message}!
          </Alert>
          : <Alert onClose={handleClose} variant="filled" severity="error" sx={{ width: '100%' }}>
            {message}!
          </Alert>
        }
      </Snackbar>
      <Dialog
        open={isDeleteDialogOpen}
      // onClose={() => setIsDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Confirmation</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this project?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDeleteDialogOpen(false)} className='btn btn-secondary me-3'>
            Cancel
          </Button>
          <Button onClick={confirmDelete} className={themec}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>


      <Dialog
        open={isDeactivateDialogOpen}
      // onClose={() => setIsDeactivateDialogOpen(false)}
      >
        <DialogTitle>Deactivate Confirmation</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to deactive this project?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDeactivateDialogOpen(false)} className='btn btn-secondary me-3'>
            Cancel
          </Button>
          <Button onClick={confirmDeactivate} className={themec}>
            Deactive
          </Button>
        </DialogActions>
      </Dialog>

    </>
  )
}

export { UserActionsCell }

