import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import axios from 'axios';
import request, { gql } from 'graphql-request';
import React, { FC, useEffect, useState } from 'react'
import { Button } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { useListView } from '../../core/ListViewProvider';
import BASEURL from '../../../../../../config/baseurl';


type Props = {
    actions?: any
}


const unlockFile = gql`
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


const Actions: FC<Props> = ({ actions }) => {
    const { setName } = useListView()
    console.log("actions->", actions);
    // const variables = {
    //   name: id,
    // }
    // const { name } = useParams();
    console.log("name->>>", actions.project.projectName);
    const name = actions.project.projectName;

    useEffect(() => {
        setName(name)
    }, [name])

    const [getId, setGetId] = useState("");
    // const [data, setData] = useState<any[]>([]);
    // const [fileStatus, setFileStatus] = useState<any[]>([]);
    const [fileProcess, setFileProcess] = useState(false);
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState("")
    const [message1, setMessage1] = useState(false)

    const handleProcessId = (id: any, name: any) => {
        console.log("Id value", id)
        setOpen(true);
        setMessage1(true)
        setMessage(name)
        setFileProcess(true)
        const url = `${BASEURL}zuvaprocess/${id}/`;
        setStatus(true)
        if (getId === "") {
            setGetId(id);
            axios.get(url, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('Token')}`
                }
            }).then((response: any) => {
                setStatus(false)
                setOpen(true);
                setMessage("Completed...")
                setMessage1(true)
                setGetId("");
                console.log(response);
            }).catch((error: any) => {
                setStatus(false)
                // setGetStatus("Failed...")
                setOpen(true);
                setMessage("Failed...");
                setFileProcess(false)
                setMessage1(false)
                setGetId("");
                // console.log("Error Message", error)
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
        setOpen(true);
        request(`${BASEURL}graphql/`, unlockFile, variables, {Authorization: `Bearer ${localStorage.getItem('Token')}`}).then((response: any) => {
            setMessage("Completed...")
            setMessage1(true)
            console.log(response)
        }).catch((err: any) => {
            setMessage("Failed...");
            setMessage1(false)
        })

    }
    const handleClose = () => {
        setOpen(false);
    };

    const colorv = localStorage.getItem("themeColor")
    console.log("colorcolor", colorv)
    const themec = colorv != null ? colorv + " " + 'btn' : 'p-3 bg-primary text-white btn'

    return (
        <div className='badge  fw-bolder' >
            {actions.lock == true ? <i className="bi bi-lock" style={{ marginRight: "20px" }} onClick={() => handleLock(actions.id)}></i>
                : null}
            {actions.fileStatus == "To be Processed" ?
                <Button disabled={fileProcess} onClick={() => { handleProcessId(actions.id, actions.fileName); }} className={themec}> Process</Button>
                : null}
            {/* {actions.lockedBy} */}
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

export { Actions }


