import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import request, { gql } from 'graphql-request';
import React, { FC, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { FcUnlock } from 'react-icons/fc';
import { TiUserDelete } from 'react-icons/ti'
import { useListView } from '../../core/ListViewProvider';
import BASEURL from '../../../../../../config/baseurl';



type Props = {
    dataStatus?: any
}


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
const DEACTIVE_USER = gql`
mutation DeactiveUser($email: String!) {
  deactiveUser(email: $email) {
    ok
  }
}`

const UserStatus: FC<Props> = ({ dataStatus }) => {
    const { setUpdate } = useListView()
    const nav = useNavigate()
    console.log("dataStatus", dataStatus);
    const [fileStatus, setfileStatus] = useState<any[]>([])
    console.log("fileStatus->", fileStatus);
    const [open, setOpen] = useState(false);
    const [projectId, setProjectId] = useState("");
    const [projectArr, setProjectArr] = useState<any[]>([]);
    const [message, setMessage] = useState("")
    const [message1, setMessage1] = useState(false)

    const Handlelock = () => {
        fileStatus.filter((item: any) => item.lockedBy?.email == dataStatus.email ? setProjectId(item.project.projectName) : null)

    }

    console.log("catalog iddd--->", projectId);

    if (projectId != "") {
        nav(`/document-management/document/${projectId}`)
    }

    const handleClose = () => {
        setOpen(false);
    };

    const Handledelete = () => {
        console.log("User_Email", dataStatus.email)
        request(`${BASEURL}graphql/`, DEACTIVE_USER, { email: dataStatus.email }, {Authorization: `Bearer ${localStorage.getItem('Token')}`}).then((res: any) => {
            setOpen(true);
            if (res?.deactiveUser?.ok) {
                setMessage1(true)
                setMessage("Successfully Deactivated")
                setUpdate(true)
            } else {
                setMessage1(false)
                setMessage("Something Went Wrong")
            }
        })

    }

    useEffect(() => {
        request(`${BASEURL}graphql/`, FILES_DETAIL, {}, {Authorization: `Bearer ${localStorage.getItem('Token')}`}).then((res: any) => setfileStatus(res.filesDetail))
    }, [])

    return (
        <div className='d-flex align-items-center'>

            <div className='d-flex flex-column'>
                <a href='#' className='text-gray-800 text-hover-primary mb-1'>
                    {
                        ((fileStatus.filter((item: any) => item.lockedBy?.email == dataStatus.email)).length != 0) ?
                            <FcUnlock onClick={Handlelock} data-bs-toggle="tooltip-inverse" title='lock' /> :
                            ((fileStatus.filter((item: any) => item.lockedBy?.email == dataStatus.email)).length == 0 && dataStatus.isActive == false) ?
                                null : dataStatus.role == "Admin" ? null : <TiUserDelete onClick={Handledelete} data-bs-toggle="tooltip-inverse" title='DeActivate' />
                    }
                </a>

            </div>
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
        </div>
    )
}


export { UserStatus }
