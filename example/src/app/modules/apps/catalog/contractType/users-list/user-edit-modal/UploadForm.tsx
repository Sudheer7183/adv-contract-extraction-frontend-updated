import React, { FC, useEffect, useRef, useState } from 'react'
import axios from 'axios'
import request, { gql } from "graphql-request";
import LinearProgress from "@mui/material/LinearProgress";
import { useParams } from "react-router-dom";
import BASEURL from '../../../../../../config/baseurl';

type Props = {
    id: number
}


const documents = gql`
query Files($name: String!) {
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


const UploadForm: FC<Props> = ({ id }) => {
    // const {id} =useParams()
    console.log("ida=->", id);

    const [progress, setProgress] = useState(0)
    const [fname, setFName] = useState(null);
    const [file1, setFile1] = useState<any[]>([]);
    // const [err, setErr] = useState("")
    let items: any[] = [];
    // const [name1, setName1] = useState(null);
    const [dragActive, setDragActive] = useState(false);
    const inputRef = useRef(null);
    const [percentage, setPercentage] = useState(0);
    const [message, setMessage] = useState<any[]>([]);
    const [err, setErr] = useState<any[]>([]);
    const [data, setData] = useState<any[]>([]);

    const variables = {
        name: id,
    }
    const handleDrag = (e: any) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };


    const filenew = (name: any) => {
        console.log("filenew func FileName", name)
        let value = null
        if (data?.files?.edges?.length == 0) {
            value = true
            return value
        }
        for (var j = 0; j < data?.files?.edges?.length; j++) {
            console.log("data.files.edges[j].node.fileName", data.files.edges[j].node.fileName);
            if (data.files.edges[j].node.fileName !== name.replace(/(\.\w+)+$/, "")) {
                // setErr("File already Available");
                value = true
                return value
            } else {
                value = false
                return value
            }
        }
        console.log("Value-->", value)
        return value
    }

    const handleDrop = (e: any) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        console.log("dragActive", dragActive)
        console.log(e.dataTransfer.files)
        for (var i = 0; i < e.dataTransfer.files.length; i++) {
            console.log("names", e.dataTransfer.files[i].name)
            if (filenew(e.dataTransfer.files[i].name)) {
                setFName(e.dataTransfer.files[i].name)
                items.push(e.dataTransfer.files[i]);

            } else {
                // setErr("File already Available");
                setErr((prevMessage) => ([
                    ...prevMessage,
                    "File already Available",
                ]));
            }


        }
        // console.log("setName", name1)
        console.log("list1", items);
        setFile1(items)
    };


    // triggers when file is selected with click
    const handleChange = (e: any) => {
        e.preventDefault();
        console.log(e.target.files)
        for (var i = 0; i < e.target.files.length; i++) {
            console.log("names", e.target.files[i].name)
            if (filenew(e.target.files[i].name)) {
                setFName(e.target.files[i].name)
                items.push(e.target.files[i]);


            } else {
                // setErr("File already Available");
                setErr((prevMessage) => ([
                    ...prevMessage,
                    "File already Available",
                ]));
            }


        }
        // console.log("setName", name1)
        console.log("list1", items);
        setFile1(items)


    };




    console.log("file_name", fname)
    let path1 = 'frontend/aavanam-document-viewer';


    let v_path = `/public/`


    console.log("Viewer_Path", v_path)
    console.log("list", file1);

    const handleSubmit = (event: any) => {
        event.preventDefault()
        for (var i = 0; i < file1.length; i++) {
            console.log(file1[i]);
            const url = `${BASEURL}files/`;
            const formData = new FormData();
            formData.append('file_path', file1[i]);
            formData.append('project_name', projectName);
            formData.append('file_status', "To be Processed");
            formData.append('file_name', file1[i].name.replace(/(\.\w+)+$/, ""));
            formData.append('file_type', "PDF");
            formData.append('doctype', "Yet to Classified");
            formData.append('viewer_path', v_path);


            axios.post(url, formData, {
                headers: {
                    'content-type': 'multipart/form-data',
                    'Authorization': `Bearer ${localStorage.getItem('Token')}`,
                },
                onUploadProgress: (progressEvent) => {
                    const load = Math.round((100 * progressEvent.loaded) / progressEvent.total)
                    console.log("Load", load)
                    setProgress(load)
                    const { loaded, total } = progressEvent;
                    const percent = Math.floor((loaded * 100) / total);
                    console.log("percent%", percent)


                    if (percent <= 100) {
                        setPercentage(percent);
                    }
                },
            }).then((response: any) => {
                console.log(response.data);
                setMessage((prevMessage) => ([
                    ...prevMessage,
                    "Uploaded the file successfully: " + response.data.file_name,
                ]));
            }).catch((error: any) => {
                setErr((prevMessage) => ([
                    ...prevMessage,
                    "Could not upload the file: " + error,
                ]));




            });


            axios.get(url, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('Token')}`
                }
            }).then((response: any) => {
                console.log(response.data);
            });
            setFName(null)
            // setName1(null)
        }
        // nav("/home/documents");


    }
    useEffect(() => {
        request(`${BASEURL}graphql/`, documents, variables, {Authorization: `Bearer ${localStorage.getItem('Token')}`}).then((data: any) => setData(data))
    }, [])
    console.log("datass->", data);


    return (
        <>
            <div><br />
                {/* {fname && <LinearProgress variant="determinate" value={progress} />}<br /> */}
                <div>
                    <form id="form-file-upload1" onDragEnter={handleDrag} onSubmit={handleSubmit}>
                        <input ref={inputRef} type="file" id="input-file-upload" multiple={true} accept=".pdf" onChange={handleChange} />
                        <label id="label-file-upload1" htmlFor="input-file-upload" className={dragActive ? "drag-active" : ""}>
                            <div>
                                <p>
                                    <LinearProgress variant="determinate" value={progress} /><br />
                                    <p style={{ color: 'black' }}>{percentage}%</p>
                                    Drag and drop | <b>{file1.length} Files</b>&nbsp;&nbsp;<button className='btn #4dd0e1 cyan lighten-2' disabled={!fname} >upload</button>
                                </p>
                            </div>
                        </label>
                        {dragActive && <div id="drag-file-element" onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}></div>}
                    </form>
                </div>
                {message.length > 0 && (
                    <div className="alert alert-secondary" role="alert">
                        <ul style={{ color: 'blue', backgroundColor: 'white' }}>
                            {message.map((item, i) => {
                                return <li key={i}><i>{item}</i></li>;
                            })}
                        </ul>
                    </div>)}
                {err.length > 0 && (
                    <div className="alert alert-secondary" role="alert">
                        <ul style={{ color: 'red' }}>
                            {err.map((item, i) => {
                                return <li key={i}><i>{item}</i></li>;
                            })}
                        </ul>
                    </div>)}
            </div>
        </>
    )
}


export default UploadForm
