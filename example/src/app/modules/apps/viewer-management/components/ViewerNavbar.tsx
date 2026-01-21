import React, { useContext, useState } from 'react';
import { TbPlayerTrackPrev, TbPlayerTrackNext } from 'react-icons/tb'
import type { IHighlight } from "../react-pdf-highlighter";
import { Grid, IconButton, Toolbar } from "@mui/material";
import { MdOutlineClose } from 'react-icons/md';
// import { GiExitDoor } from 'react-icons/gi'
import { useNavigate } from 'react-router-dom';
import { Alert, Snackbar } from '@mui/material';
import { request, gql } from 'graphql-request'
import { useAuth } from '../../../auth';
import AppContext from '../../../../AppContext';
import BASEURL from '../../../../config/baseurl';
import Swal from 'sweetalert2';


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

const fileStatus = gql`
mutation FileStatus($fileId: String!) {
    fileStatus(fileId: $fileId) {
      file {
        filePath
        fileName
        fileType
        project{
          id
          projectName
        }
        pages
        viewerPath
        fileStatus
      }
    }
  }
`


interface Props {
    highlights: Array<IHighlight>;
    pages: number;
    onPageNo: number;
    scrollToView: () => void;
    togglebutton: (event: any) => void;
    nextPage: (pageNumber: number) => void;
    fileId: any;
    name: any;
    projectId: string;
    onChange: (fieldValue: String) => void;
    readOnly: boolean;
}


export function ViewerNavbar({
    highlights,
    pages,
    onPageNo,
    togglebutton,
    scrollToView,
    nextPage,
    fileId,
    name,
    projectId,
    onChange,
    readOnly,
}: Props) {

    console.log("Static bar project iddd--->", projectId);

    const TotalPage = pages;
    const nav = useNavigate()
    const { setViewerPageActive } = useContext(AppContext);
    // const [open, setOpen] = useState(null);
    const [open1, setOpen1] = useState(false);
    const [message, setMessage] = useState("")
    const [message1, setMessage1] = useState(false)
    const { currentUser } = useAuth()

    console.log("navbar currentuser", currentUser)

    const handleClose1 = () => {
        setOpen1(false);
    };

    const handelRAdioButtonChange = (event: any) => {
        togglebutton(event.target.value)
        // setRadioButton(event.target.value);
    };

    const updatedHash = (text: any) => {
        if (text != "All") {
            const Comment: any[] = highlights.filter((obj: any) => obj.comment.text.replace(/\(\d+\/\d+\)$/, '') === text);
            let id = Comment[0].id
            document.location.hash = `highlight-${id}`;
        }
    };
    const val1 = highlights.map(obj => obj.comment.text);
    const val2 = highlights.map(obj => obj.comment.text);
    const hideRepeatedValues = (val1: any) => {
        const counts: any = {};
        const unique = [];
        for (let i = 0; i < val1.length; i++) {
            const nestedArray = JSON.stringify(val1[i]);
            if (!counts[nestedArray]) {
                unique.push(val1[i]);
                counts[nestedArray] = true;
            }
        }
        console.log("unique", unique)
        const formattedUniqueItems: any = {};
        unique.forEach(item => {
            // console.log("unique item", item, item.replace(/\(\d+\/\d+\)$/, ''));
            const fieldName = item.replace(/\(\d+\/\d+\)$/, ''); // Extract the field name (e.g., "Title", "Liability", "Venue")

            if (!formattedUniqueItems[fieldName]) {
                formattedUniqueItems[fieldName] = 1;
            } else {
                formattedUniqueItems[fieldName]++;
            }
        });


        const result = Object.keys(formattedUniqueItems).map(fieldName => {
            const count = formattedUniqueItems[fieldName];
            return `${fieldName}(${count})`;
        });


        console.log("unique result", result);
        return result;
    }


    const uniqueItems = hideRepeatedValues(val1);

    console.log("uniqueItems->", uniqueItems);



    const Closed = () => {
        request(`${BASEURL}graphql/`, unlockFile, { fileId: fileId }, {Authorization: `Bearer ${localStorage.getItem('Token')}`}).then((res: any) => console.log(res.lockFile))
        setViewerPageActive(false)
        nav(`/document-management/document/${projectId}`)
    }

    const handleChange = async () => {
        console.log("val2", val2);
        const unique = val2.map((item: any) => item.replace(/ \(\d\/\d\)$/, ''));
        console.log("Unique", unique);

        function findDuplicates(arr: any) {
            return arr.filter((currentValue: any, currentIndex: any) =>
                arr.indexOf(currentValue) !== currentIndex);
        }

        const val: any = findDuplicates(unique);
        console.log("viewer-navbar occurence", val);


        if (val.length === 0) {
            request(`${BASEURL}graphql/`, fileStatus, { fileId: fileId }, {Authorization: `Bearer ${localStorage.getItem('Token')}`}).then((res: any) => {
                console.log(res.fileStatus)
                const val = Object.keys(res.fileStatus.file).length
                console.log("val", val)
                setOpen1(true);
                // alert('button click catched');
                if (val > 0) {
                    setMessage1(true)
                    setMessage("Successfully Reviewed")
                } else {
                    setMessage1(false)
                    setMessage("Something Went Wrong")
                }
            })

        } else {
            Swal.fire({
                title: `Hello ${currentUser.username || 'User'}`,
                text: 'Resolve No of Occurrence',
                icon: 'warning', // You can customize the icon
            });
            // window.alert(`Hello ${username || 'User'}`, 'Resolve No of Occurrence');
            // alert(`Hello ${username || 'User'}: Resolve No of Occurrence`);
            // alert('Resolve No of Occurrence')
        }
    }

    const handleNext = () => {
        if (onPageNo < TotalPage) {
            nextPage(onPageNo + 1)
        }
    }

    const handlePrevious = () => {
        if (onPageNo > 0) {
            nextPage(onPageNo - 1)
        }
    }

    const colorv = localStorage.getItem("themeColor")
    const themec = colorv != null ? colorv + " " + 'btn' + " " + 'bg-opacity-75' : 'p-3 bg-primary text-white btn bg-opacity-75'
    const color = colorv != null ? colorv + " " + 'bg-opacity-25' + " " + ' h-30px' : 'p-3 bg-primary text-white bg-opacity-25  h-30px'


    return (
        <>
            <Snackbar anchorOrigin={{
                vertical: "top",
                horizontal: "center",
            }} style={{ float: "right" }} open={open1} autoHideDuration={6000} onClose={handleClose1}>
                {message1 ?
                    <Alert onClose={handleClose1} variant="filled" severity="success" sx={{ width: '100%' }}>
                        {message}!
                    </Alert>
                    : <Alert onClose={handleClose1} variant="filled" severity="error" sx={{ width: '100%' }}>
                        {message}!
                    </Alert>}
            </Snackbar>
            <div style={{ position: 'fixed', width: "87.9%" }}>
                <Toolbar className={color}>
                    <Grid className='text-dark'>
                        <div style={{ width: '400px', overflow: 'hidden' }} title={name}>
                            <b><i>{name}</i></b>
                        </div>
                    </Grid>
                    <Grid
                        style={{ marginLeft: '20px' }}
                        container
                        item
                        md={4}
                        xs={12}
                        alignItems="center"
                        wrap="nowrap"
                    >
                        <div style={{ fontFamily: 'inherit' }}>
                            <button className={themec} onClick={handlePrevious} disabled={onPageNo === 1}>
                                <TbPlayerTrackPrev />&nbsp;<b>Prev</b>
                                {/* ‹ Previous */}
                            </button>&nbsp;
                            <span className="page-text">
                                Page {onPageNo} / {TotalPage}
                            </span>&nbsp;
                            <button className={themec} onClick={handleNext} disabled={onPageNo === TotalPage}>
                                <b>Next</b>&nbsp;<TbPlayerTrackNext />
                                {/* Next › */}
                            </button>
                        </div>
                    </Grid>
                    <Grid
                        style={{ marginLeft: '20px' }}
                        container
                        item
                        md={4}
                        xs={6}
                        wrap="nowrap"
                    >
                        <label className='text-dark'><i className="bi bi-arrow-right text-dark p-3" style={{ fontSize: "20px", display: "flex", alignItems: "center" }} title='Go to'></i></label>

                        <div>
                            <select className="form-select form-select-solid" style={{ width: '100%' }} onChange={(e) => {
                                updatedHash(e.target.value.replace(/\(\d+\)$/, ''));
                                scrollToView();
                                onChange(e.target.value.replace(/\(\d+\)$/, ''));
                            }}>
                                <option value="All">All</option>
                                {uniqueItems.map((highlight, i) => (
                                    <option key={i} className='dropdown_option'>{highlight}</option>
                                ))}
                            </select>
                        </div>
                    </Grid>
                    <Grid
                        container
                        item
                        md={4}
                        xs={6}
                        wrap="nowrap"
                    >
                        <label className='text-dark'><i className="bi bi-arrow-down-up text-dark p-3" style={{ fontSize: "20px", display: "flex", alignItems: "center" }} title='Sort'></i></label><br />

                        <div>
                            <select className="form-select form-select-solid" style={{ width: '100%' }} onChange={handelRAdioButtonChange}>
                                <option className='dropdown_option' value="PageNumber">Page Number</option>
                                <option className='dropdown_option' value="FieldName">Field Name</option>
                            </select>
                        </div>
                    </Grid>
                    {/* <Grid style={{ marginRight: '25px' }}>
                        <IconButton
                            title="Complete Review"
                            onClick={handleChange}
                        // style={{
                        //     backgroundColor: themec,
                        //     display: 'flex',
                        //     alignItems: 'center',
                        //     justifyContent: 'center',
                        // }}
                        >
                            <img
                                src='/media/icons/Stamp.png'
                                alt="Stamp Icon"
                                style={{ width: '35px', height: '35px' }}
                            />
                        </IconButton>
                    </Grid> */}
                    {readOnly ? null : (
                        <Grid style={{ marginRight: '25px' }}>
                            <IconButton
                                title="Complete Review"
                                onClick={handleChange}
                            >
                                <img
                                    src='/media/icons/Stamp.png'
                                    alt="Stamp Icon"
                                    style={{ width: '35px', height: '35px' }}
                                />
                            </IconButton>
                        </Grid>
                    )}
                    <Grid>
                        <IconButton aria-label={"Close Document"} style={{ marginLeft: '5%' }} title="Close Viewer">
                            <MdOutlineClose onClick={Closed} className='text-dark' />
                        </IconButton>
                    </Grid>
                </Toolbar>
            </div>
        </>
    );
};
