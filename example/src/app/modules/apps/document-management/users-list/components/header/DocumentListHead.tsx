/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from 'react'
import request, { gql } from 'graphql-request';
import BASEURL from '../../../../../../config/baseurl';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Button, Box, LinearProgress } from '@mui/material';
import { useListView } from '../../core/ListViewProvider';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';


const DELETE_FILE = gql`
  mutation DeleteFile($ids: [String!]!) {
    deleteFile(ids: $ids) {
      ok
    }
  }
`;

const DocumentListHead = () => {
    const { isAllSelected, selected, setUpdate, setSelected, selectedStatus } = useListView()
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState("")
    const [message1, setMessage1] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [status, setStatus] = useState(false);


    const openTable = () => {
        setIsDeleteDialogOpen(true);
    }


    const confirmDelete = () => {
        setIsDeleteDialogOpen(false);
        // Handledelete(actions.id)
        selected.forEach((id) => {
            console.log("selected foreach", id);
            Handledelete(id);
        });
    }


    console.log("selected in deletefiles", selected, selectedStatus);


    const Handledelete = async (file_id: any) => {
        request(`${BASEURL}graphql/`, DELETE_FILE, { ids: file_id }, {Authorization: `Bearer ${localStorage.getItem('Token')}`})
            .then((response: any) => {
                setOpen(true);
                console.log("delete file response", response);
                if (response?.deleteFile?.ok) {
                    setMessage("Successfully Deleted")
                    setMessage1(true)
                    setTimeout(() => {
                        setUpdate(true)
                        setSelected([])
                    }, 500);
                } else {
                    setMessage("Something Went Wrong")
                    setMessage1(false)
                }
            })
            .catch((error) => {
                setOpen(true);
                console.log("Error in Handledelete", error);
                setMessage(error?.response?.errors[0]?.message);
                setMessage1(false);


            });


    }
    const handleClose = () => {
        setOpen(false);
    };


    console.log("status in documentlist", status);




    const handleProcessId = async (selectedFiles: any) => {
        console.log("Selected Files", selectedFiles);


        if (selectedFiles.length === 0) {
            console.log("No files are selected");
            return;
        }
        const ln = selected.length


        for (const file of selectedFiles) {
            try {
                console.log("Processing selected file", file);
                setOpen(true);
                setMessage1(true)
                setMessage(ln + ' File(s) Processing')
                const url = `${BASEURL}zuvaprocess/${file}/`;
                setStatus(true)
                const response = await axios.get(url, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('Token')}`
                    }
                });
                console.log("Response for file", file, response);
                setStatus(false)
                setOpen(true);
                setMessage("Completed...");
                setMessage1(true);
                setTimeout(() => {
                    setUpdate(true)
                    setSelected([])
                }, 500);
            } catch (error) {
                console.error("Error processing file", file, error);
                setOpen(true);
                setMessage("Failed...");
                setMessage1(false);
                setStatus(false)
            }
        }
    };


    const fileStatusValue = ["To be Processed", "Being Processed", "error in process"];



    const colorv = localStorage.getItem("themeColor")
    const themec = colorv != null ? colorv + " " + 'btn' : 'p-3 bg-primary text-white btn'






    return (
        <div className='card-title'>
            <div className='d-flex align-items-center position-relative my-1'>
                <div className='fw-bolder me-5'>
                    <span className='me-2'>{selected.length}</span> Selected
                </div>
                <button type='button' className='btn p-3 btn-danger' onClick={openTable} >
                    <DeleteIcon onClick={openTable} />
                </button>
                {/* {fileStatusValue.includes(selectedStatus) ?
                    <button type='button' className='btn p-3 btn-danger' onClick={openTable} >
                        <DeleteIcon onClick={openTable} />
                    </button> : null
                } */}
            </div>
            <div>
                {selectedStatus === "To be Processed" ? (
                    <>
                        {status ? (
                            <Box sx={{ position: 'absolute', top: '0' }} style={{ paddingTop: '4px', width: '96.5px', height: '24px' }}>
                                <LinearProgress />
                            </Box>
                        ) : null}
                        <button
                            className={themec}
                            style={{ marginLeft: "10px" }}
                            onClick={() => handleProcessId(selected)}
                        >
                            Process
                        </button>
                    </>
                ) : selectedStatus !== "Review Completed" && selectedStatus !== "All" && isAllSelected == false ? (
                    <>
                        {status ? (
                            <Box sx={{ position: 'absolute', top: '0' }} style={{ paddingTop: '4px', marginLeft: '11px', width: '96.5px', height: '24px' }}>
                                <LinearProgress />
                            </Box>
                        ) : null}
                        <button
                            className={themec}
                            style={{ marginLeft: "10px" }}
                            onClick={() => handleProcessId(selected)}
                        >
                            ReProcess
                        </button>
                    </>
                ) : null}
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
        </div >
    )
}


export { DocumentListHead }
