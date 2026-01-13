/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { FC, useEffect, useState } from 'react'
import { KTIcon } from '../../../../../../../_metronic/helpers'
import request, { gql } from 'graphql-request';
import axios from 'axios';
import BASEURL from '../../../../../../config/baseurl';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import { useListView } from '../../core/ListViewProvider';

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

const UserActionsCell: FC<Props> = ({ actions }) => {
  const { setName, setUpdate } = useListView()
  const [getId, setGetId] = useState("");
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("")
  const [message1, setMessage1] = useState(false)
  console.log("actions->", actions);
  const name = actions.project.projectName;
  console.log("actions name", name);

  useEffect(() => {
    setName(name)
  }, [name])

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
      setMessage("Already runing");
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

  const handleClose = () => {
    setOpen(false);
  };


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
        className='menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg-light-primary fw-bold fs-7 w-125px py-4'
        data-kt-menu='true'
      >
        {/* begin::Menu item */}
        <div className='menu-item px-3'>
          {actions.fileStatus === "To be Processed" ?
            <a className='menu-link px-3' onClick={() => { handleProcessId(actions.id, actions.fileName); }}>
              Process
            </a>
            : actions.fileStatus != "Review Completed" ?
              <a className='menu-link px-3' onClick={() => { handleProcessId(actions.id, actions.fileName); }}>
                Re-Process
              </a>
              : null}
          {/* <a className='menu-link px-3'>
            Process
          </a> */}
        </div>
        <div className='menu-item px-3'>
          {actions.lock === true ?
            <a className='menu-link px-3' onClick={() => handleLock(actions.id)}>
              Unlock
            </a> : null}
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
    </>
  )
}

export { UserActionsCell }

