import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import request, { gql } from 'graphql-request';
import React, { FC, useEffect, useState } from 'react'
import BASEURL from '../../../../../../../config/baseurl';


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
const DEACTIVE_PROJECT = gql`
  mutation DeactiveProject($projectName: String!, $folder: String!) {
    deactiveProject(projectName: $projectName, folder: $folder) {
      ok
    }
  }
`;
const ProjectStatus: FC<Props> = ({ dataStatus }) => {
    console.log("dataStatus", dataStatus);
    const [fileStatus, setfileStatus] = useState([])
    console.log("fileStatus->", fileStatus);
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState("")
    const [message1, setMessage1] = useState(false)


    const openTable = () => {
        // setItemIdForUpdate(id)
        // nav("/document-management/document/" + dataStatus.node.id);

        let folder = "Delete"
        Handledelete(dataStatus.node.projectName, folder)



    }
    const handlereactive = (projectName: any) => {
        let folder = "Reactive"
        Handledelete(dataStatus.node.projectName, folder)
    }


    const handledeactive = (projectName: any) => {
        let folder = "Deactive"
        Handledelete(dataStatus.node.projectName, folder)
    }
    const handleClose = () => {
        setOpen(false);
    };
    const Handledelete = async (project_name: any, folder: any) => {
        // console.log("User_Email", email)
        request(`${BASEURL}graphql/`, DEACTIVE_PROJECT, { projectName: project_name, folder: folder }, {Authorization: `Bearer ${localStorage.getItem('Token')}`}).then((response: any) => {
            setOpen(true);
            if (response?.deactiveProject?.ok && folder == "Delete") {
                setMessage("Successfully Deleted")
                setMessage1(true)
            } else if (response?.deactiveProject?.ok && folder == "Reactive") {
                setMessage("Successfully Reactivated")
                setMessage1(true)
            } else if (response?.deactiveProject?.ok && folder == "Deactive") {
                setMessage("Successfully Deactivated")
                setMessage1(true)
            } else {
                setMessage("Something Went Wrong")
                setMessage1(false)
            }
        })
        // const response = await deactiveproject({ variables: { projectName: project_name, folder: folder } })
        // console.log("create", val)

    }
    useEffect(() => {
        request(`${BASEURL}graphql/`, FILES_DETAIL, {}, {Authorization: `Bearer ${localStorage.getItem('Token')}`}).then((res: any) => setfileStatus(res.filesDetail))
    }, [])


    return (
        <div className='d-flex align-items-center'>


            <div className='d-flex flex-column'>
                <a href='#' className='text-gray-800 text-hover-primary mb-1'>
                    {dataStatus.node.totalFiles == 0 ? <span className="svg-icon svg-icon-primary svg-icon-2x"><svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0 0 24 24" version="1.1">
                        <g onClick={openTable} stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                            <rect x="0" y="0" width="24" height="24" />
                            <path d="M6,8 L18,8 L17.106535,19.6150447 C17.04642,20.3965405 16.3947578,21 15.6109533,21 L8.38904671,21 C7.60524225,21 6.95358004,20.3965405 6.89346498,19.6150447 L6,8 Z M8,10 L8.45438229,14.0894406 L15.5517885,14.0339036 L16,10 L8,10 Z" fill="#000000" fill-rule="nonzero" />
                            <path d="M14,4.5 L14,3.5 C14,3.22385763 13.7761424,3 13.5,3 L10.5,3 C10.2238576,3 10,3.22385763 10,3.5 L10,4.5 L5.5,4.5 C5.22385763,4.5 5,4.72385763 5,5 L5,5.5 C5,5.77614237 5.22385763,6 5.5,6 L18.5,6 C18.7761424,6 19,5.77614237 19,5.5 L19,5 C19,4.72385763 18.7761424,4.5 18.5,4.5 L14,4.5 Z" fill="#000000" opacity="0.3" />
                        </g>
                    </svg></span> : dataStatus.node.active == false ? <p onClick={handlereactive}>ReAc</p> : (((fileStatus.filter((item: any) => item.projectName == dataStatus.node.projectName && item.fileStatus == "Review Completed")).length == dataStatus.node.totalFiles)) ? <p onClick={handledeactive}>DEA</p> : null}
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


export { ProjectStatus }
