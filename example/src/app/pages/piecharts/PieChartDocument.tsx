import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import { Box, Button, LinearProgress } from '@mui/material';
import { Alert, Snackbar } from '@mui/material';
import LockPersonIcon from '@mui/icons-material/LockPerson';
import { MaterialReactTable } from 'material-react-table';
import request, { gql } from 'graphql-request';
import BASEURL from '../../config/baseurl';


const PIE_CHART_FILES = gql`
query chartFiles($value: String!, $piechart: String!){
  chartFiles(value: $value, piechart: $piechart){
    edges{
      node{
        id
        project{
            id
            projectName
        }
        fileName
        fileType
        fileStatus
        contractType{
            contractTypeName
        }
        pages
        lock
        lockedBy{
          email
          username
        }
      }
    }
  }
}`


const FILE_PIE = gql`
query{
  fileStatusPiechart{
    id
    fileStatus
    count
    percentage
  }
}`


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


const PieChartDocument = () => {
    const { label, chart } = useParams();
    const [data, setData] = useState<any>([])
    const [status, setStatus] = useState(false);
    const [getId, setGetId] = useState("");
    const [fileCount, setFileCount] = useState(0);
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState("")
    const [message1, setMessage1] = useState(false)
    const [fileStatus, setFileStatus] = useState(false);
    console.log("Filestatus1", fileStatus, data);

    const val1: any = () => {
        for (let i = 0; i < fileStatus.length; i++) {
            const fs = fileStatus[i].fileStatus
            const cnt = fileStatus[i].count
            console.log("fs,cnt", fs, cnt)
            if (fs == "To be Processed") {
                console.log("cnt", cnt)
                setFileCount(cnt)
            }
        }
    }
    useEffect(() => {
        request(`${BASEURL}graphql/`, FILE_PIE, {}, {Authorization: `Bearer ${localStorage.getItem('Token')}`}).then((res: any) => setFileStatus(res.fileStatusPiechart))
        request(`${BASEURL}graphql/`, PIE_CHART_FILES, { value: label, piechart: chart }, {Authorization: `Bearer ${localStorage.getItem('Token')}`}).then((res: any) => setData(res))


    }, [val1]);


    console.log("Filestatus", setFileStatus);
    console.log("Count", fileCount)


    const files: any[] = [];


    for (let k = 0; k < data?.chartFiles?.edges.length; k++) {
        files.push(data?.chartFiles?.edges[k].node)
    }
    console.log("files-->", files)




    const UserName = localStorage.getItem("UserName");




    const columns = useMemo(
        //column definitions...
        () => [
            {
                accessorKey: 'project.projectName',
                header: 'Project Name',
            },
            {
                accessorKey: 'fileName',
                header: 'File Name',
            },
            {
                accessorKey: 'fileType',
                header: 'Extension',
            },
            {
                accessorKey: 'fileStatus',
                header: 'Status',
            },
            {
                accessorKey: 'contractType.contractTypeName',
                header: 'File Type',
            },
            {
                accessorKey: 'pages',
                header: 'Number of Pages',
            },
            {
                accessorKey: 'lockedBy.username',
                header: 'LockedBy',
            },
        ],
        [],
    );


    const handleClose = () => {
        setOpen(false);
    };


    const handleLock = async (fileId: string) => {
        console.log("fileId", fileId)
        // const data1 = await file({ variables: { foldername: name, filename: filename } })
        // const val = Object.keys(data1?.data.unlockFile.files).length
        // console.log("val", val)
        const variables = {
            fileId: fileId
        }
        request(`${BASEURL}graphql/`, UNLOCK_FILE, variables, {Authorization: `Bearer ${localStorage.getItem('Token')}`}).then((response: any) => {
            console.log(response.unlockFile)
            const val = Object.keys(response.unlockFile.files).length
            setOpen(true);
            if (val > 0) {
                setMessage("Successfully Unlocked File")
                setMessage1(true)
            } else {
                setMessage("Something Went Wrong")
                setMessage1(false)
            }
        })

    }
    console.log("Message --> ", message)


    const handleProcess = (event: any) => {
        event.preventDefault()
        const url = `${BASEURL}zuvaprocess/`;
        setStatus(true)
        setOpen(true);
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
        }).catch((error: any) => {
            setOpen(true);
            setMessage("Failed...")
            setMessage1(false)
            setStatus(false)
            console.log("Error Message", error)
        });
    }


    const handleProcessId = (id: any, name: any) => {


        console.log("Id value", id)
        setOpen(true);
        setMessage1(true)
        setMessage(name)
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

    return (<React.Fragment>
        {/* <Home /> */}
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
        <div className='table_top'>
            <MaterialReactTable
                columns={columns}
                data={files ?? []}
                muiTableHeadCellProps={{
                    sx: (theme) => ({
                        background: 'rgba(52, 210, 235, 0.1)',
                        borderRight: '1px solid rgba(224,224,224,1)',
                        color: theme.palette.text.primary,
                    }),
                }}
                renderTopToolbarCustomActions={({ table }) => (
                    <Box
                        sx={{ display: 'flex', gap: '1rem', p: '0.5rem', flexWrap: 'wrap' }}
                    >
                        {fileCount > 0 ?
                            <Button
                                color="primary"
                                //export all data that is currently in the table (ignore pagination, sorting, filtering, etc.)
                                onClick={handleProcess}
                                // startIcon={<GrAdd />}
                                variant="contained"
                            >
                                Process All
                            </Button> : null
                        }
                        {status ?
                            <Box sx={{ width: '30%' }} style={{ paddingTop: '20px' }}>
                                <LinearProgress />
                                {/* <CircularProgress /> */}
                            </Box>
                            : null}
                        {/* <p style={{ color: 'black', whiteSpace: 'nowrap', width: '450px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{fileName}</p> */}
                    </Box>
                )}
                displayColumnDefOptions={{
                    'mrt-row-numbers': {
                        enableColumnOrdering: true,
                        enableResizing: true,
                        muiTableHeadCellProps: {
                            sx: {
                                fontSize: '1.2rem',
                            },
                        },
                    },
                    'mrt-row-select': {
                        enableColumnActions: true,
                        enableHiding: true,
                        size: 100,
                    },
                    'mrt-row-actions': {
                        size: 150,
                        muiTableHeadCellProps: {
                            align: 'center',
                        },
                    },
                }}
                enableColumnResizing
                enableRowActions
                renderRowActions={({ row }) => (
                    <Box sx={{ display: 'flex', gap: '1rem' }}>
                        {row.original.lock == false && row.original.fileStatus != "To be Processed" ?
                            <Button style={{ wordBreak: 'break-word', width: '10%' }}><Link to={'/viewer-management/viewer/' + row.original.id}>open</Link></Button>
                            : row.original.fileStatus == "To be Processed" ?
                                <Button style={{ wordBreak: 'break-word', width: '10%' }}><Link to={""}>open</Link></Button>
                                : row.original.lock == true && row.original.lockedBy?.username == UserName ?
                                    <Button style={{ wordBreak: 'break-word', width: '10%' }}><Link to={'/viewer-management/viewer/' + row.original.id}>open</Link></Button>
                                    : <Button style={{ wordBreak: 'break-word', width: '10%' }}><Link to={""}>open</Link></Button>
                        }
                        {row.original.lock == true ?
                            <Button style={{ width: '10%' }}><LockPersonIcon className='file_unlock' onClick={() => handleLock(row.original.id)} /></Button>
                            : null}
                        {row.original.fileStatus == "To be Processed" ?
                            <Button style={{ width: '10%' }} onClick={() => { handleProcessId(row.original.id, row.original.fileName); }}>
                                {/* <VscServerProcess className='zoom' onClick={() => { handleProcessId(row.original.id, row.original.fileName); }} /> */}
                            </Button>
                            : null}
                    </Box>
                )}


            />
        </div>
    </React.Fragment>)

}


export default PieChartDocument

