/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { FC, useEffect, useRef, useState } from 'react'
import { KTIcon } from '../../../../../../../_metronic/helpers'
import { useListView } from '../../core/ListViewProvider';
import request, { gql } from 'graphql-request';
import BASEURL from '../../../../../../config/baseurl';
import axios from 'axios';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Button } from '@mui/material';
import { MenuComponent } from "../../../../../../../_metronic/assets/ts/components";

type Props = {
  actions?: any
}

const UNLOCK_FILE = gql`
  mutation UnLockFile($fileId: String!) {
    unlockFile(fileId: $fileId) {
      files {
        pages
        filePath
        fileName
        project{
          id
          projectName
        }
        fileStatus
        lock
        lockedBy {
          email
          username
          role
        }
      }
    }
  }
`;

const DELETE_FILE = gql`
  mutation DeleteFile($ids: [String!]!) {
    deleteFile(ids: $ids) {
      ok
    }
  }
`;


const UserActionsCell: FC<Props> = ({ actions }) => {
  const { setName, setUpdate } = useListView()
  const [getId, setGetId] = useState("");
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("")
  const [message1, setMessage1] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  console.log("actions->", actions);
  const name = actions.project.projectName;
  console.log("actions name", name);
  const menuRef = useRef(null);
  useEffect(() => {
    setName(name)
  }, [name])

   useEffect(() => {
    if (menuRef.current) {
      MenuComponent.createInstances('[data-kt-menu]');
    }
  }, []);

  const handleProcessId = (id: any, name: any) => {
    console.log("Id value", id)
    setOpen(true);
    setMessage1(true)
    setMessage(name)
    const url = `${BASEURL}zuvaprocess/${id}/`;
    if (getId === "") {
      setGetId(id);
      axios.get(url, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('Token')}`
        }
    }).then((response: any) => {
        setOpen(true);
        setMessage("Completed...")
        setMessage1(true)
        setGetId("");
        setUpdate(true)
        console.log(response);
      }).catch((error: any) => {
        setOpen(true);
        setMessage("Failed...");
        setMessage1(false)
        setGetId("");
      });
    } else {
      setOpen(true);
      setMessage("Already running");
      setMessage1(false)
    }
  }

  const handleLock = async (fileId: string) => {
    console.log("fileId", fileId)
    const variables = {
      fileId: fileId
    }
    request(`${BASEURL}graphql/`, UNLOCK_FILE, variables, {Authorization: `Bearer ${localStorage.getItem('Token')}`}).then((res: any) => {
      console.log(res)
      console.log(res.unlockFile)
      const val = Object.keys(res.unlockFile.files).length
      console.log("val", val)
      setOpen(true);
      if (val > 0) {
        setMessage1(true)
        setMessage("Successfully Unlocked File")
        setUpdate(true)
      } else {
        setMessage1(false)
        setMessage("Something Went Wrong")
      }
    })
    // setOpen(true);
  }

  const openTable = () => {
    setIsDeleteDialogOpen(true);
  }

  const confirmDelete = () => {
    setIsDeleteDialogOpen(false);
    Handledelete(actions.id)
  }

  const Handledelete = async (file_id: any) => {
    request(`${BASEURL}graphql/`, DELETE_FILE, { ids: file_id }, {Authorization: `Bearer ${localStorage.getItem('Token')}`}).then((response: any) => {
      setOpen(true);
      console.log("delete file response", response);
      if (response?.deleteFile?.ok) {
        setMessage("Successfully Deleted")
        setMessage1(true)
        setTimeout(() => {
          setUpdate(true)
        }, 500);
      } else {
        setMessage("Something Went Wrong")
        setMessage1(false)
      }
    })
  }
  const handleClose = () => {
    setOpen(false);
  };
  const colorv = localStorage.getItem("themeColor")
  const themec = colorv != null ? colorv + " " + 'btn' : 'p-3 bg-primary text-white btn'

  console.log("FileStatus action", actions.fileStatus);

  const MoveToRepository=async()=>{
    console.log('repo selected value ',actions)
    const url = `${BASEURL}repository/project/file`
    const data= actions
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',  // Indicates the data is in JSON format
        'Authorization': `Bearer ${localStorage.getItem('Token')}`  // Add the Authorization token from localStorage
      },
      body: JSON.stringify(data)  // Convert the data object into a JSON string
    });
    console.log('response from moving section',response)
    if (response.ok){
      const responseData = await response.json();
      console.log('File successfully moved:', responseData);
    }else{
      const errorData = await response.json();
      console.error('Error:', errorData);
    }
  }

  return (
    <>
      {actions.fileStatus === "Review Completed" ? (
        <button
          className="btn btn-light btn-sm"
          disabled
        >
          Select
          <KTIcon iconName="down" className="fs-5 m-0" />
        </button>
      ) : (
        <a
          href='#'
          className='btn btn-light btn-active-light-primary btn-sm'
          data-kt-menu-trigger='click'
          data-kt-menu-placement='bottom-end'
        >
          Select
          <KTIcon iconName='down' className='fs-5 m-0' />
        </a>
      )}
      {/* begin::Menu */}
      <div
        ref={menuRef}
        className='menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg-light-primary fw-bold fs-7 w-125px py-4'
        data-kt-menu='true'
      >
        {/* begin::Menu item */}
        <div className='menu-item px-3'>
          {actions.fileStatus === "To be Processed" && actions.project.active ?
          (<a className='menu-link px-3' onClick={() => { handleProcessId(actions.id, actions.fileName); }}>
              Process
            </a>
            
          )
            : actions.fileStatus != "Review Completed" && actions.project.active ?
              <a className='menu-link px-3' onClick={() => { handleProcessId(actions.id, actions.fileName); }}>
                Re-Process
              </a>
              : null}
        </div>
        <div className='menu-item px-3'>
          {actions.lock === true ?
            <a className='menu-link px-3' onClick={() => handleLock(actions.id)}>
              Unlock
            </a> : null}
        </div>
        <div className='menu-item px-3'>
          {actions.fileStatus != "Review Completed" ?
            <a className='menu-link px-3' onClick={openTable}>
              Delete
            </a> : null}
        </div>
        {/* <div className='menu-item px-3'>
          <a className='menu-link px-3' onClick={MoveToRepository}>
            Move to repository
          </a>
        </div> */}
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
      >
        <DialogTitle>Delete Confirmation</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this file?
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
    </>
  )
}

export { UserActionsCell }

