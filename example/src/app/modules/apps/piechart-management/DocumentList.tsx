import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import { Box, Button, LinearProgress } from '@mui/material';
import { Alert, Snackbar } from '@mui/material';
import LockPersonIcon from '@mui/icons-material/LockPerson';
import { MaterialReactTable } from 'material-react-table';
import request, { gql } from 'graphql-request';
import { useAuth } from '../../auth';
import { VscServerProcess } from 'react-icons/vsc';
import { MdOutlineFileOpen } from 'react-icons/md';
import BASEURL from '../../../config/baseurl';


const UNLOCK_FILE = gql`
  mutation UnLockFile($foldername: String!, $filename: String) {
    unlockFile(foldername: $foldername, filename: $filename) {
      files {
        pages
        filePath
        fileName
        projectName
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


const FILE_PIE = gql`
query{
  fileStatusPiechart{
    id
    fileStatus
    count
    percentage
  }
}`


const documents = gql`
query Filess($name: String!) {
    filess(name: $name) {
      edges {
        node {
          id
          filePath
          fileName
          projectName
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
    }
  }
`
const DocumentList = () => {
    const { id } = useParams();
    console.log("idd->", id);

    const variables = {
        name: id,
    }
    const { name } = useParams();
    const { currentUser } = useAuth()

    const Role = currentUser?.role
    const UserName = currentUser?.username
    const [status, setStatus] = useState(false);
    const [getId, setGetId] = useState("");
    const [data, setData] = useState<any[]>([]);
    const [fileStatus, setFileStatus] = useState<any[]>([]);
    const [fileProcess, setFileProcess] = useState(false);
    const [fileCount, setFileCount] = useState(0);
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState("")
    const [message1, setMessage1] = useState(false)

    console.log("fileProcess1->", data);

    useEffect(() => {
        request(`${BASEURL}graphql/`, documents, variables, {Authorization: `Bearer ${localStorage.getItem('Token')}`}).then((data: any) => setData(data))
        request(`${BASEURL}graphql/`, FILE_PIE, {}, {Authorization: `Bearer ${localStorage.getItem('Token')}`}).then((data: any) => setFileStatus(data))


        // const lenn = fileStatus.fileStatusPiechart.length
        // console.log("lenn",lenn);

        // // for (let i = 0; i < lenn; i++) {
        // //     const fs = fileStatus?.fileStatusPiechart[i].fileStatus
        // //     const cnt = fileStatus?.fileStatusPiechart[i].count
        // //     console.log("fs,cnt", fs, cnt)
        // //     // if (fs == "To be Processed") {
        // //     //     console.log("cnt", cnt)
        // //     //     setFileCount(cnt)
        // //     // }
        // // }
    }, []);


    console.log("Count", fileCount)


    const files: any[] = [];


    for (let k = 0; k < data?.filess?.edges.length; k++) {
        files.push(data?.filess?.edges[k].node)
    }
    console.log("files-->", files)

    const columns = useMemo(
        //column definitions...
        () => [
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


    const handleLock = async (filename: string, name: string) => {
        console.log("filename", filename, name)
        // const data1 = await file({ variables: { foldername: name, filename: filename } })
        // const val = Object.keys(data1?.data.unlockFile.files).length
        // console.log("val", val)
        const variables = {
            foldername: name,
            filename: filename
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
        }).catch((error: any) => {
            setOpen(true);
            setMessage("Failed...")
            setMessage1(false)
            setFileProcess(false)
            setStatus(false)
            console.log("Error Message", error)
        });
    }


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


    // console.log("GetStatus-->", getStatus)
    // console.log("Status -->", status)


    // if (loading) return <> Loading...</>
    // if (error) return <>{error.message}</>


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
        {Role == "Admin" ?
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
                            {Role == "Admin" && fileCount > 0 ?
                                <Button
                                    color="primary"
                                    //export all data that is currently in the table (ignore pagination, sorting, filtering, etc.)
                                    onClick={handleProcess}
                                    // startIcon={<GrAdd />}
                                    variant="contained"
                                    disabled={fileProcess}
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
                                <Button data-bs-toggle="tooltip-inverse" title='Open' ><Link to={'/viewer-management/viewer/' + row.original.id}><MdOutlineFileOpen /></Link></Button>
                                : row.original.fileStatus == "To be Processed" ?
                                    <Button data-bs-toggle="tooltip-inverse" title='Open' ><Link to={""}><MdOutlineFileOpen /></Link></Button>
                                    : row.original.lock == true && row.original.lockedBy?.username == UserName ?
                                        <Button data-bs-toggle="tooltip-inverse" title='Open' ><Link to={'/viewer-management/viewer/' + row.original.id}><MdOutlineFileOpen /></Link></Button>
                                        : <Button data-bs-toggle="tooltip-inverse" title='Open' ><Link to={""}><MdOutlineFileOpen /></Link></Button>
                            }
                            {row.original.lock == true ?
                                <Button data-bs-toggle="tooltip-inverse" title='File Unlock' style={{ width: '10%' }}><LockPersonIcon className='file_unlock' onClick={() => handleLock(row.original.fileName, row.original.projectName)} /></Button>
                                : null}
                            {row.original.fileStatus == "To be Processed" ?
                                <Button style={{ width: '10%' }} data-bs-toggle="tooltip-inverse" title='File process' disabled={fileProcess} onClick={() => { handleProcessId(row.original.id, row.original.fileName); }}> <VscServerProcess /></Button>
                                : null}
                        </Box>

                        // <Box sx={{ display: 'flex', gap: '1rem' }}>
                        //     {row.original.lock == false && row.original.fileStatus != "To be Processed" ?
                        //         <Button style={{ wordBreak: 'break-word', width: '10%' }}><Link to={'/viewer-management/viewer/' + row.original.id}>open</Link></Button>
                        //         : row.original.fileStatus == "To be Processed" ?
                        //             <Button style={{ wordBreak: 'break-word', width: '10%' }}><Link to={""}>open</Link></Button>
                        //             : row.original.lock == true && row.original.lockedBy?.username == UserName ?
                        //                 <Button style={{ wordBreak: 'break-word', width: '10%' }}><Link to={'/viewer-management/viewer/' + row.original.id}>open</Link></Button>
                        //                 : <Button style={{ wordBreak: 'break-word', width: '10%' }}><Link to={""}>open</Link></Button>
                        //     }
                        //     {row.original.lock == true ?
                        //         <Button style={{ width: '10%' }}><LockPersonIcon className='file_unlock' onClick={() => handleLock(row.original.fileName, row.original.projectName)} /></Button>
                        //         : null}
                        //     {row.original.fileStatus == "To be Processed" ?
                        //         <Button style={{ width: '10%' }} disabled={fileProcess} onClick={() => { handleProcessId(row.original.id, row.original.fileName); }}> Process</Button>
                        //         : null}
                        // </Box>
                    )}


                />
            </div> :
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
                            size: 60,
                        },
                        'mrt-row-actions': {
                            size: 80,
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
                                <Button data-bs-toggle="tooltip-inverse" title='Open'><Link to={'/viewer-management/viewer/' + row.original.id}><MdOutlineFileOpen /></Link></Button>
                                : row.original.fileStatus == "To be Processed" ?
                                    <Button data-bs-toggle="tooltip-inverse" title='Open'><Link to={""}><MdOutlineFileOpen /></Link></Button>
                                    : row.original.lock == true && row.original.lockedBy?.username == UserName ?
                                        <Button data-bs-toggle="tooltip-inverse" title='Open'><Link to={'/viewer-management/viewer/' + row.original.id}><MdOutlineFileOpen /></Link></Button>
                                        : <Button data-bs-toggle="tooltip-inverse" title='Open'><Link to={""}><MdOutlineFileOpen /></Link></Button>
                            }
                        </Box>
                        // <Box sx={{ display: 'flex', gap: '1rem' }}>
                        //     {row.original.lock == false && row.original.fileStatus != "To be Processed" ?
                        //         <Button style={{ wordBreak: 'break-word', width: '10%' }}><Link to={'/viewer-management/viewer/' + row.original.id}>open</Link></Button>
                        //         : row.original.fileStatus == "To be Processed" ?
                        //             <Button style={{ wordBreak: 'break-word', width: '10%' }}><Link to={""}>open</Link></Button>
                        //             : row.original.lock == true && row.original.lockedBy?.username == UserName ?
                        //                 <Button style={{ wordBreak: 'break-word', width: '10%' }}><Link to={'/viewer-management/viewer/' + row.original.id}>open</Link></Button>
                        //                 : <Button style={{ wordBreak: 'break-word', width: '10%' }}><Link to={""}>open</Link></Button>
                        //     }
                        // </Box>
                    )}
                />
            </div>
        }
    </React.Fragment>)




}


export default DocumentList

