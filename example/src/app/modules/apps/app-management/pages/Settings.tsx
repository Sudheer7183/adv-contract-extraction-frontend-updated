import React, { useEffect, useState } from 'react'
import { Form } from 'react-bootstrap';
import { request, gql } from 'graphql-request'
import { Alert, Snackbar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import BASEURL from '../../../../config/baseurl';

const SiteDetail = gql`
query{
    allSiteSetting{
      id
      companyName
      companyLogo
    }
  }`

const Settings = () => {
    const nav = useNavigate();
    const [open1, setOpen1] = useState(false);
    const [message, setMessage] = useState("")
    const [message1, setMessage1] = useState(false)
    const [companyName, setCompanyName] = useState("")
    const [image, setImage] = useState("")
    const [logo, setLogo] = useState("")

    const fetchData = () => {
        request(`${BASEURL}graphql/`, SiteDetail, {}, {Authorization: `Bearer ${localStorage.getItem('Token')}`}).then((res: any) => {
            console.log(res.allSiteSetting)
            setCompanyName(res?.allSiteSetting[0]?.companyName)
            // setLogo(res?.allSiteSetting[0]?.companyLogo)
            const fullImagePath = res?.allSiteSetting[0]?.companyLogo;
            if (fullImagePath) {
                const parts = fullImagePath.split('/');
                const fileName = parts[parts.length - 1];
                setLogo(fileName);
                setImage(fullImagePath)
            }
        })
    }

    useEffect(() => {
        fetchData();
    }, [])

    const updateCompanyName = (e: any) => {
        console.log("companyName", e.target.value);
        setCompanyName(e.target.value)
    }
    const acceptedTypes = ["image/png", "image/jpeg", "image/jpg"];

    const handleChange = (e: any) => {
        e.preventDefault();
        for (var i = 0; i < e.target.files.length; i++) {
            const file = e.target.files[i];
            if (acceptedTypes.includes(file.type)) {
                console.log("uploaded data", e.target.files);
                console.log("names", file.name, file);
                setImage(file);
            } else {
                console.log("File type not supported:", file.type);
                setOpen1(true)
                setMessage("file type is not supported.choose jpg,jpeg or png files")
                setMessage1(false)
            }
        }
    };


    const handleClose1 = () => {
        setOpen1(false);
    };

    const handleCancel = () => {
        nav("/configuration/site-settings");
        setCompanyName("");
        setImage("");
    };

    const onSubmit = async (e: any) => {
        e.preventDefault()
        const url = `${BASEURL}site/setting/`;
        const formData = new FormData();
        formData.append('company_name', companyName);
        formData.append('company_logo', image);

        axios.post(url, formData, {
            headers: {
                'content-type': 'multipart/form-data',
                'Authorization': `Bearer ${localStorage.getItem('Token')}`,
            }
        }).then((response: any) => {
            console.log(response.data);
            setOpen1(true);
            setMessage1(true)
            setMessage("Successfully Saved")
            setTimeout(() => {
                window.location.reload();
            }, 500);
        }).catch((error: any) => {
            setOpen1(true);
            setMessage("Something Went Wrong")
            setMessage1(false)
            console.log("error", error)
        });
    }
    const colorv = localStorage.getItem("themeColor")
    const themec = colorv != null ? colorv + " " + 'btn' : 'p-3 bg-primary text-white btn'


    return (
        <>
            {/* <Home /> */}
            <div className='container my-container'>
                <div className="cproject">
                    <form onSubmit={onSubmit}>
                        <label className="required form-label fs-6 mb-2"><b>Enter Company Name:</b></label>
                        <input
                            type="text"
                            className="form-control form-control mb-3 mb-lg-0"
                            placeholder='Enter Company Name'
                            onChange={updateCompanyName}
                            value={companyName}
                            name="name"
                            required
                        /><br />
                        <label className="form-label fs-6 mb-2"><b>Upload Company Logo:</b></label>
                        <div className="custom-file">
                            <input
                                type="file"
                                className="custom-file-input form-control form-control mb-3 mb-lg-0"
                                id="logoInput"
                                onChange={handleChange}
                            />
                            <label className="custom-file-label" htmlFor="logoInput">
                                {logo}
                            </label>
                        </div>
                        <br />
                        <button type="button" className="btn btn-secondary me-3" onClick={handleCancel}>Cancel</button>&nbsp;&nbsp;
                        <button type="submit" className={themec}>Save</button>
                    </form>
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
                            </Alert>
                        }
                    </Snackbar>
                </div><br /><br />
            </div>
        </>
    )
}


export default Settings
