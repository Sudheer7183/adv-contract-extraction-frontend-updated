import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Alert, Box, LinearProgress, Snackbar } from '@mui/material';
import request, { gql } from 'graphql-request';
import { useAuth } from '../../../../../auth';
import BASEURL from '../../../../../../config/baseurl';
import { useListView } from '../../core/ListViewProvider';

const Process_All_Files = gql`
query ProcessAllFile($projectId: String!){
    processAllFile(projectId: $projectId){
      edges{
        node{
          id
          project{
            projectName
          }
          fileStatus
          fileName
        }
      }
    }
  }`

function DocumentProcess() {
    const { setUpdate, projectid } = useListView()
    const [status, setStatus] = useState(false);
    const [fileProcess, setFileProcess] = useState(false);
    const [fileCount, setFileCount] = useState(0);
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState("")
    const [message1, setMessage1] = useState(false)
    console.log("process all project id", projectid);

    useEffect(() => {
        if (projectid != "") {
            request(`${BASEURL}graphql/`, Process_All_Files, { projectId: projectid }, {Authorization: `Bearer ${localStorage.getItem('Token')}`}).then((res: any) => {
                if (res.processAllFile.edges.length > 0) {
                    console.log("toBP count for process all", res.processAllFile.edges.length);
                    const cnt = res.processAllFile.edges.length
                    setFileCount(cnt)
                }
            })
        }
    }, [projectid]);

    console.log("Count", fileCount)
    const { currentUser } = useAuth()
    const Role = currentUser?.role
    const handleProcess = (event: any) => {
        event.preventDefault()
        const url = `${BASEURL}zuvaprocessall/${projectid}/`;
        setStatus(true)
        setOpen(true);
        setFileProcess(true)
        setMessage1(true)
        setMessage(`Backend Process Running ${fileCount} Files...`)
        axios.get(url, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('Token')}`
            }
        }).then((response: any) => {
            console.log(response);
            setStatus(false)
            setOpen(true);
            setMessage("Completed...")
            setMessage1(true)
            setUpdate(true)
        }).catch((error: any) => {
            setOpen(true);
            setMessage("Failed...")
            setMessage1(false)
            setFileProcess(false)
            setStatus(false)
            console.log("Error Message", error)
        });
    }

    const handleClose = () => {
        setOpen(false);
    };

    const color = localStorage.getItem("themeColor")
    const themec = color != null ? color + " " + 'btn' : 'p-3 bg-primary text-white btn'
    console.log("themec", themec);


    return (
        <div>
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
            {status ?
                <Box sx={{ position: 'absolute', top: '0' }}
                    style={{ paddingTop: '4px', marginLeft: '11px', width: '96.5px', height: '24px' }}>
                    <LinearProgress />
                </Box>
                : null}

            {(Role === "Admin" || Role === "Manager") && fileCount > 0 ?
                <button type='button' className={themec} style={{ marginLeft: "10px" }}
                    onClick={handleProcess}
                    disabled={fileProcess}
                ><b>Process All</b></button>
                : null
            }
        </div>
    )
}

export default DocumentProcess


