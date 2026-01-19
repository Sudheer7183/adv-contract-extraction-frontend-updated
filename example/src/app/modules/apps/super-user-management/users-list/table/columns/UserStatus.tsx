import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import request, { gql } from 'graphql-request';
import React, { FC, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { FcUnlock } from 'react-icons/fc';
import { TiUser, TiUserDelete } from 'react-icons/ti'
import { useListView } from '../../core/ListViewProvider';
import BASEURL from '../../../../../../config/baseurl';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';



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
mutation DeactiveUser($id: String!) {
  deactiveUser(id: $id) {
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
    const [message, setMessage] = useState("")
    const [message1, setMessage1] = useState(false)
    const [isDeactivateDialogOpen, setIsDeactivateDialogOpen] = useState(false);
    const [deactivateUserId, setDeactivateUserId] = useState("");

    const Handlelock = () => {
        fileStatus.filter((item: any) => item.lockedBy?.email == dataStatus.email ? setProjectId(item.project.id) : null)
    }

    console.log("catalog iddd--->", projectId);

    if (projectId != "") {
        nav(`/document-management/document/${projectId}`)
    }

    const handleClose = () => {
        setOpen(false);
    };

    const Handledelete = () => {
        setIsDeactivateDialogOpen(true); // Open the confirmation dialog
        setDeactivateUserId(dataStatus.id); // Store the user ID to deactivate
    }


    const confirmDeactivate = () => {
        // Perform the deactivation and close the dialog
        request(`${BASEURL}graphql/`, DEACTIVE_USER, { id: deactivateUserId }, {Authorization: `Bearer ${localStorage.getItem('Token')}`}).then((res: any) => {
            setOpen(true);
            if (res?.deactiveUser?.ok) {
                setMessage1(true);
                setMessage("Successfully Deactivated");
                setUpdate(true);
            } else {
                setMessage1(false);
                setMessage("Something Went Wrong");
            }
        });
        setIsDeactivateDialogOpen(false); // Close the dialog
    };


    // const Handledelete = () => {
    //     console.log("User_Email", dataStatus.email)
    //     request(`${BASEURL}graphql/`, DEACTIVE_USER, { id: dataStatus.id }).then((res: any) => {
    //         setOpen(true);
    //         if (res?.deactiveUser?.ok) {
    //             setMessage1(true)
    //             setMessage("Successfully Deactivated")
    //             setUpdate(true)
    //         } else {
    //             setMessage1(false)
    //             setMessage("Something Went Wrong")
    //         }
    //     })

    // }

    useEffect(() => {
        request(`${BASEURL}graphql/`, FILES_DETAIL, {}, {Authorization: `Bearer ${localStorage.getItem('Token')}`}).then((res: any) => setfileStatus(res.filesDetail))
    }, [])

    console.log("FileStatus---->", fileStatus, fileStatus.filter((item: any) => item.lockedBy?.email == dataStatus.email));

    const colorv = localStorage.getItem("themeColor")
    const themec = colorv != null ? colorv + " " + 'btn' : 'p-3 bg-primary text-white btn'


    return (
        <div className='d-flex align-items-center'>
            <div className='d-flex flex-column'>
                {
                    ((fileStatus.filter((item: any) => item.lockedBy?.email == dataStatus.email)).length != 0) ? <FcUnlock onClick={Handlelock} data-bs-toggle="tooltip-inverse" title='lock' /> :
                        ((fileStatus.filter((item: any) => item.lockedBy?.email == dataStatus.email)).length == 0 && dataStatus.isActive == true) ?
                            <TiUser data-bs-toggle="tooltip-inverse" title='Active User' /> : <TiUserDelete data-bs-toggle="tooltip-inverse" title='InActive User' />
                }
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
            <Dialog open={isDeactivateDialogOpen} onClose={() => setIsDeactivateDialogOpen(false)}>
                <DialogTitle>Deactivate Confirmation</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to deactivate this user?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsDeactivateDialogOpen(false)} className='btn btn-secondary me-3'>
                        Cancel
                    </Button>
                    <Button onClick={confirmDeactivate} className={themec}>
                        Deactivate
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}


export { UserStatus }
