import React, { FC, useEffect, useRef, useState } from 'react'
import axios from 'axios'
import request, { gql } from "graphql-request";
import LinearProgress from "@mui/material/LinearProgress";
import { useListView } from '../core/ListViewProvider';
import BASEURL from '../../../../../config/baseurl';
import Select from 'react-select';

import useDrivePicker from 'react-google-drive-picker'

import { Dropbox } from 'dropbox';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogleDrive, faDropbox } from '@fortawesome/free-brands-svg-icons';
import { faLink, faFileUpload } from '@fortawesome/free-solid-svg-icons';

type Props = {
  id: any
}

const allUsers = gql`
query {
  users{
    edges{
      node{
        id
        username
        firstName
        email
        lastName
        role
        lastLogin
      }
    }
  }
}`

const reviewUser = gql`
query ReviewUser($position: String!) {
  reviewUser(position: $position) {
    edges {
      node {
        id
        username
        firstName
        lastName
        email
        role
      }
    }
  }
}`

const Users = gql`
query ReviewUserDetail($projectId: String!) {
    reviewUserDetail(projectId: $projectId){
      edges{
        node{
          id
          user{
            id
            username
            email
            role
          }
        }
      }
    }
  }`

const documents = gql`
query Filess($projectId: String!) {
    filess(projectId: $projectId) {
      edges {
        node {
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
    }
  }
`
const getProject = gql`
query GetProject($id: String!){
  getProject(id: $id){
    id
    projectName
    description
    active
  }
}`

const ACTIVE_CATALOGS = gql`
query ActiveCatalogs($isactive: Boolean!){
  activeCatalogs(isactive: $isactive){
    id
    catalogName
    active
    catalogdetail{
      id
      userContractTypeMaster{
        id
        contractTypeName
        usercontracttypedetail{
          edges{
            node{
              fieldId
              fieldName
            }
          }
        }
      }
    }
  }
}`

const Project = gql`
query Project($name: String!) {
  projects(searchValue: $name) {
    edges {
      node {
        id
        projectName
        description
        totalFiles
        active
        catalogFile{
          id
          catalogName
        }
        defaultContractType{
          id
          contractTypeName
          usercontracttypedetail{
            edges{
              node{
                fieldName
              }
            }
          }
        }
      }
    }
  }
}`



const UploadFormContract: FC<Props> = ({ id }) => {
  console.log("ida=->", id);
  const { setUpdate, setFileUpload, name, setItemIdForUpdate } = useListView()
  const [progress, setProgress] = useState(0)
  const [fname, setFName] = useState("");
  const [file1, setFile1] = useState<any[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef(null);
  const [percentage, setPercentage] = useState(0);
  const [message, setMessage] = useState<any[]>([]);
  const [err, setErr] = useState<any[]>([]);
  const [data, setData] = useState<any[]>([]);
  const [projectName, setProjectName] = useState("")
  const [selectedOption2, setSelectedOption2] = useState<any[]>([]);
  const [data1, setData1] = useState<any[]>([]);
  const [pro, setPro] = useState<any[]>([]);
  const [totalSize, setTotalSize] = useState(0);
  const [users, setUsers] = useState<any>({});
  const [selectedOption, setSelectedOption] = useState<any[]>([]);

  const [uploadSource, setUploadSource] = useState<'local' | 'link' | 'gdrive' | 'device' | 'dropbox'>('local');
  const [fileUrl, setFileUrl] = useState('');

  const [openPicker] = useDrivePicker();

  const [showDeviceInsteadOfLink, setShowDeviceInsteadOfLink] = useState(false);
  const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB

  const DROPBOX_APP_KEY = "aig0t6l3oradce9";

  useEffect(() => {
    // Inject Dropbox SDK dynamically
    const script = document.createElement('script');
    script.src = 'https://www.dropbox.com/static/api/2/dropins.js';
    script.id = 'dropboxjs';
    script.type = 'text/javascript';
    script.setAttribute('data-app-key', DROPBOX_APP_KEY);
    document.body.appendChild(script);
  }, []);

  const handleDrag = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    setErr([])
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };


  const filenew = (name: any) => {
    console.log("filenew func FileName", name)
    let value = null
    if (data.length == 0) {
      value = true
      return value
    }
    for (var j = 0; j < data.length; j++) {
      if (data.some(item => item.fileName === name.replace(/(\.\w+)+$/, ""))) {
        // setErr("File already Available");
        value = false
        return value
      } else {
        value = true
        return value
      }
    }
    console.log("Value-->", value)
    return value
  }

  const handleDrop = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    setErr([])
    setDragActive(false);
    console.log("dragActive", dragActive)
    console.log(e.dataTransfer.files)
    const items = [...file1];
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
    console.log("list1", items);
    // setDragFile(file)
    setFile1(items)
  };

  // triggers when file is selected with click
  const handleChange = (e: any) => {
    e.preventDefault();
    setErr([])
    console.log(e.target.files)
    const items = [...file1];
    // let totalSize = 0;
    let currentTotalSize = totalSize;
    console.log("uploaded file detail with size", totalSize, MAX_FILE_SIZE)
    for (var i = 0; i < e.target.files.length; i++) {
      console.log("names", e.target.files[i].name)
      currentTotalSize += e.target.files[i].size;
      console.log("uploaded file detail with size", currentTotalSize, MAX_FILE_SIZE)
      if (currentTotalSize > MAX_FILE_SIZE) {
        setErr((prevMessage) => [...prevMessage, 'Total file size exceeds 20MB']);
        break; // Exit the loop when total size exceeds the limit
      }

      if (filenew(e.target.files[i].name)) {
        setFName(e.target.files[i].name)
        items.push(e.target.files[i]);
      } else {
        setErr((prevMessage) => ([
          ...prevMessage,
          "File already Available",
        ]));
      }
    }
    setTotalSize(currentTotalSize);
    console.log("list1", items);
    setFile1(items)
  };

  const handleDropboxChoose = () => {
    (window as any).Dropbox.choose({
      success: (files: any[]) => {
        const newFiles = [...file1];
        let currentTotalSize = totalSize;

        for (let file of files) {
          const fileName = file.name;
          const fileSize = file.bytes || 0; // in bytes
          const fileType = file.name.split('.').pop() || "unknown";

          // Check for duplicates
          if (!filenew(fileName)) {
            setErr((prev) => [...prev, `File "${fileName}" already available.`]);
            continue;
          }

          // Check total size limit (e.g., 20MB)
          currentTotalSize += fileSize;
          if (currentTotalSize > MAX_FILE_SIZE) {
            setErr((prev) => [...prev, "Total file size exceeds 20MB."]);
            break;
          }

          setPercentage(100);
          setFName(fileName);

          newFiles.push({
            id: file.link, // no real ID from Dropbox Chooser, so using link
            name: fileName,
            size: fileSize,
            type: fileType,
            driveFile: false,       // it's not from Google Drive
            dropboxFile: true,      // custom flag to track source
            downloadUrl: file.link, // direct download URL
          });
        }

        console.log("Dropbox selected files:", newFiles);
        setFile1(newFiles);
        setTotalSize(currentTotalSize);
      },
      cancel: () => {
        console.log('Dropbox chooser cancelled');
      },
      linkType: 'direct',
      multiselect: true, // match Google Drive behavior
      extensions: ['.pdf', '.jpg', '.png', '.jpeg'],
    });
  };

  const handleFileLink = async (e: any) => {
    console.log("file link value", e.target.value);
    setFileUrl(e.target.value);
    const Files = [...file1];

    const access_Token = "*****";

    const extractFileId = (url: string): string | null => {
      const match = url.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
      return match ? match[1] : null;
    };

    const fileId = extractFileId(e.target.value);

    if (fileId) {

      try {
        const metadataRes = await fetch(
          `https://www.googleapis.com/drive/v3/files/${fileId}?fields=id,name,size,mimeType`,
          {
            headers: {
              Authorization: `Bearer ${access_Token}`,
            },
          }
        );

        if (!metadataRes.ok) {
          throw new Error(`Metadata fetch failed: ${metadataRes.statusText}`);
        }

        const metadata = await metadataRes.json();

        console.log("from link metadata", metadata);


        Files.push({
          id: metadata.id,
          name: metadata.name,
          size: metadata.size,
          type: metadata.mimeType,
          linkFile: true,
        });

        console.log("📁 Google Drive File Info:", Files);

        setFName(metadata.name);

        // Now push this to your file1 array or any state
        setFile1(Files);

      } catch (err) {
        console.error("❌ Failed to get file metadata:", err);
      }
    } else {
      // Handle public direct file link
      const fileName = e.target.value.split('/').pop()?.split('?')[0];

      Files.push({
        id: e.target.value, // use URL as ID
        name: fileName,
        size: null,
        type: 'application/pdf',
        linkFile: true,
        publicFile: true, // ✅ distinguish browser links
      });

      console.log(" from link public url fileItem------>", Files);
      setFName(fileName);
      setFile1(Files);
    }
  }

  const handleGoogleDrivePicker = () => {
    openPicker({
      clientId: "*****",
      developerKey: "****",
      viewId: "DOCS",
      showUploadView: true,
      showUploadFolders: true,
      supportDrives: true,
      multiselect: true,
      callbackFunction: (data) => {

        if (data.action === 'picked' && data.docs.length > 0) {
          const newFiles = [...file1];
          let currentTotalSize = totalSize;
          console.log("Selected files:", data.docs);
          for (let doc of data.docs) {
            const file_id = doc.id;
            const fileName = doc.name;
            const fileSize = doc.sizeBytes ? doc.sizeBytes : 0;
            const fileType = doc.mimeType;

            // Check for duplicates
            if (!filenew(fileName)) {
              setErr((prev) => [...prev, `File "${fileName}" already available.`]);
              continue;
            }

            // Check size limit
            currentTotalSize += fileSize;
            if (currentTotalSize > MAX_FILE_SIZE) {
              setErr((prev) => [...prev, "Total file size exceeds 20MB."]);
              break;
            }

            setPercentage(100);
            setFName(fileName);
            newFiles.push({
              id: file_id,
              name: fileName,
              size: fileSize,
              type: fileType,
              driveFile: true, // mark as from Drive
            });
          }

          console.log("list the drive selected files", newFiles, typeof (newFiles));

          setFile1(newFiles);
          setTotalSize(currentTotalSize);
        }
      },
    })
  }


  const handleChange2 = (selectedOption: any) => {
    console.log("user-contract-type", selectedOption)
    setSelectedOption2(selectedOption);
  };

  const Schema_name = localStorage.getItem('Schema')
  console.log("file_name", fname)
  // let path1 = 'frontend/adv-metronic';
  let path1 ='D:/sudheer/Sudheer downloads/adv-updated-frontend-2/adv-metronic'
  let v_path = `${path1}/example/public/${Schema_name}/${projectName}/`

  console.log("Viewer_Path", v_path)
  console.log("list", file1);


  const fetchGoogleDriveFileAsBlob = async (fileMeta: any, accessToken: string): Promise<File> => {
    const fileId = fileMeta.id;
    const fileName = fileMeta.name;

    const downloadUrl = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`;

    const response = await fetch(downloadUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const blob = await response.blob();
    const file = new File([blob], fileName, { type: blob.type });
    return file;
  };

  const fetchLinkFileAsBlob = async (fileMeta: any, accessToken: string): Promise<File> => {
    const fileId = fileMeta.id;
    const fileName = fileMeta.name;

    const downloadUrl = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`;

    const response = await fetch(downloadUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const blob = await response.blob();
    const file = new File([blob], fileName, { type: blob.type });
    return file;
  };

  const fetchPublicFileAsBlob = async (fileMeta: any): Promise<File> => {
    const proxyUrl = `${BASEURL}proxy-download/?url=${encodeURIComponent(fileMeta.id)}`;
    const response = await fetch(proxyUrl);
    const blob = await response.blob();
    const fileName = fileMeta.name || "downloaded.pdf";
    return new File([blob], fileName, { type: blob.type });
  };

  const fetchDropboxFile = async (fileMeta: any, accessToken: string): Promise<File> => {
    // const fileId = fileMeta.id
    const downloadUrl = fileMeta.downloadUrl
    const fileName = fileMeta.name;


    console.log('download url', downloadUrl);

    const response = await fetch(downloadUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (!response.ok) {
      console.error(`Error occurred while fetching the URL: ${response.statusText}`);

    }
    const blob = await response.blob();
    const file = new File([blob], fileName, { type: blob.type });

    console.log('file after downloading', file);

    return file

  }

  const handleSubmit = async (event: any) => {
    event.preventDefault()
    for (var i = 0; i < file1.length; i++) {
      console.log("user-contract-type-->", selectedOption2)
      console.log(file1[i]);
      const url = `${BASEURL}files/`;
      const formData = new FormData();
      // formData.append('file_path', file1[i]);
      const fileItem = file1[i];
      let actualFile = fileItem;
      const accessToken = "*****";
      const access_Token = "****";
      const Dropbox_accessToken = "s*****"


      if (uploadSource === 'link' && fileItem.linkFile) {
        if (fileUrl.includes("drive.google.com")) {
          // Google Drive logic
          actualFile = await fetchLinkFileAsBlob(fileItem, access_Token);
        } else {
          // Public file URL
          actualFile = await fetchPublicFileAsBlob(fileItem);
        }

      }

      if (fileItem.driveFile) {
        // You must obtain the OAuth 2 access token used for Google Picker
        actualFile = await fetchGoogleDriveFileAsBlob(fileItem, accessToken);
      }

      if (fileItem.downloadUrl) {
        actualFile = await fetchDropboxFile(fileItem, Dropbox_accessToken)
      }

      formData.append("file_path", actualFile); // always a File

      formData.append('project', projectName);
      formData.append('file_status', "To be Processed");
      formData.append('file_name', file1[i].name.replace(/(\.\w+)+$/, ""));
      formData.append('file_type', "PDF");
      formData.append('contract_type', "");
      formData.append('viewer_path', v_path);
      // formData.append('user_contract_type', selectedOption2.value);
      if (Array.isArray(selectedOption2) && selectedOption2.length === 0) {
        formData.append('user_contract_type', "");
      } else {
        formData.append('user_contract_type', selectedOption2.value);
      }
      if (Array.isArray(selectedOption) && selectedOption.length === 0) {
        formData.append('assign_user', "");
      } else {
        formData.append('assign_user', selectedOption.id);
      }
      // formData.append("assign_user", selectedOption.id)

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
        console.log("file upload response", response.data);
        setMessage((prevMessage) => ([
          ...prevMessage,
          "Uploaded the file successfully",
        ]));
        setTimeout(() => {
          setUpdate(true)
          setFileUpload(false)
        }, 500);
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
      setTimeout(() => {
        setItemIdForUpdate(undefined)
      }, 1000);
    }
  }
  useEffect(() => {
    request(`${BASEURL}graphql/`, documents, { projectId: id }, {Authorization: `Bearer ${localStorage.getItem('Token')}`}).then((data: any) => {
      let fileArr: any = []
      for (let k = 0; k < data.filess.edges.length; k++) {
        fileArr.push(data.filess.edges[k]?.node)
        console.log("data arr", fileArr);
        setData(fileArr)
      }
    })
    request(`${BASEURL}graphql/`, getProject, { id: id }, {Authorization: `Bearer ${localStorage.getItem('Token')}`}).then((res: any) => setProjectName(res.getProject.projectName))
  }, [id])
  let option2: any[] = [];
  useEffect(() => {
    request(`${BASEURL}graphql/`, ACTIVE_CATALOGS, { isactive: true }, {Authorization: `Bearer ${localStorage.getItem('Token')}`}).then((data: any) => setData1(data.activeCatalogs))
    request(`${BASEURL}graphql/`, Project, { name: name }, {Authorization: `Bearer ${localStorage.getItem('Token')}`}).then((e: any) => {
      setPro(e)
    })
    request(`${BASEURL}graphql/`, Users, { projectId: id }, {Authorization: `Bearer ${localStorage.getItem('Token')}`}).then((user: any) => setUsers(user.reviewUserDetail.edges))
  }, [name]);

  const cf = pro && pro?.projects?.edges[0]?.node?.catalogFile?.id
  console.log("data1 in file upload", data1);

  for (let l = 0; l < data1?.length; l++) {
    if (data1[l].id == cf) {
      console.log("default Contract Type array", data1[l].catalogdetail)
      let length = data1[l].catalogdetail.length
      console.log("lenth", length);
      for (let j = 0; j < length; j++) {
        const ct = data1[l].catalogdetail[j].userContractTypeMaster.contractTypeName
        const ct1 = data1[l].catalogdetail[j].userContractTypeMaster.contractTypeName
        const dctId = data1[l].catalogdetail[j].userContractTypeMaster.id
        option2.push({ value: ct, label: ct1, id: dctId });
      }
    }
  }
  // let option: any[] = [];
  // const lenn = users.length
  // for (let i = 0; i < lenn; i++) {
  //     const un = users[i]?.node?.user?.username
  //     const id = users[i]?.node?.user?.id
  //     option.push({ value: un, label: un, id: id });
  // }

  // console.log("dropdown option", option);

  let option: any[] = [];
  const lenn = users.length;
  const uniqueSet = new Set();

  for (let i = 0; i < lenn; i++) {
    const un = users[i]?.node?.user?.username;
    const id = users[i]?.node?.user?.id;

    // Check if the username is already in the unique set before adding it
    if (!uniqueSet.has(un)) {
      option.push({ value: un, label: un, id: id });
      uniqueSet.add(un);
    }
  }

  // Convert the Set back to an array
  const uniqueOption = Array.from(option);

  console.log("dropdown option", uniqueOption);



  const handleChange3 = (selectedOption: any) => {
    setSelectedOption(selectedOption);
  };

  const fileNamesFromDetails = file1.map((fileDetail) => fileDetail.name).join('\n');
  console.log("datass->", data);
  const colorv = localStorage.getItem("themeColor")
  const themec = colorv != null ? colorv + " " + 'btn' : 'p-3 bg-primary text-white btn'

  return (
    <>
      <div>
        <div>
          <form
            id="form-file-upload1"
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            onSubmit={handleSubmit}
          >

            {/* <input ref={inputRef} type="file" id="input-file-upload" multiple={true} accept=".pdf, .zip" onChange={handleChange} /> */}

            {uploadSource === 'local' && (
              <input
                ref={inputRef}
                type="file"
                id="input-file-upload"
                multiple
                accept=".pdf, .zip"
                onChange={handleChange}
              />
            )}

            {uploadSource === 'link' && (
              <input
                type="text"
                placeholder="Paste file URL"
                value={fileUrl}
                onChange={handleFileLink}
                className='FromLink'
              />
            )}

            {uploadSource === 'dropbox' && (
              <button type="button" className={themec} onClick={handleDropboxChoose}>
                Select from DropBox
              </button>
            )}


            {uploadSource === 'gdrive' && (
              <button type="button" className={themec} onClick={handleGoogleDrivePicker}>
                Select from Google Drive
              </button>
            )}
            {uploadSource === 'local' && (
              <label id="label-file-upload1" htmlFor="input-file-upload" className={dragActive ? "drag-active" : ""} title={fileNamesFromDetails}>
                <div>
                  <p><br/>
                    <LinearProgress variant="determinate" value={progress} /><br />
                    <p style={{ color: 'black' }}>{percentage}%</p>
                    Drag and drop file here, or click to select file(s)<br />
                    <p>Maximum upload file size: 20MB</p>
                    <b>{file1.length} Files</b>&nbsp;&nbsp;
                  </p>
                </div>
              </label>
            )}
            {dragActive && <div id="drag-file-element"></div>}

            <div className="divider">or</div>
            <div className="upload-source-options" style={{gap:"10px",display:"flex",justifyContent:"center"}}>
            {showDeviceInsteadOfLink ? (
                <button
                  type="button"
                  onClick={() => {
                    setUploadSource('local');
                    setShowDeviceInsteadOfLink(false);
                  }}
                  className={`${themec} ${uploadSource === 'local' ? 'selected' : ''}`}
                >
                  <div className="icon-with-tooltip">
                    <FontAwesomeIcon icon={faFileUpload} size="lg" className='jelly-icon' />
                    <span className="tooltip-text">From Device</span>
                  </div>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setUploadSource('link');
                    setShowDeviceInsteadOfLink(true);
                  }}
                  className={`${themec} ${uploadSource === 'link' ? 'selected' : ''}`}
                >
                  <div className="icon-with-tooltip">
                    <FontAwesomeIcon icon={faLink} size="lg" className='jelly-icon' />
                    <span className="tooltip-text">Link Source</span>
                  </div>
                </button>
              )
            }
              <button
                type="button"
                onClick={() => setUploadSource('gdrive')}
                className={`${themec} ${uploadSource === 'gdrive' ? 'selected' : ''}`}
              >
                <div className="icon-with-tooltip">
                    <FontAwesomeIcon icon={faGoogleDrive} size="lg" className='jelly-icon ' />
                    <span className="tooltip-text">Google Drive</span>
                  </div>
              </button>

              <button
                type="button"
                onClick={() => setUploadSource('dropbox')}
                className={`${themec} ${uploadSource === 'dropbox' ? 'selected' : ''}`}
              >
                <div className="icon-with-tooltip">
                  <FontAwesomeIcon icon={faDropbox} size="lg" className='jelly-icon ' />
                  <span className="tooltip-text">DropBox</span>
                </div>
              </button>
            </div>
            <div style={{margin:"15px"}}>
            <Select
              className="dropdown"
              placeholder="Assign Contract Type"
              value={selectedOption2}
              isSearchable={true}
              onChange={handleChange2}
              options={option2}
            /><br />
            <Select
              className="dropdown"
              placeholder="Assign Reviewer User"
              value={selectedOption}
              isSearchable={true}
              onChange={handleChange3}
              options={option} /><br />

            </div>

            <button className={themec} disabled={!fname} >upload</button>
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


export default UploadFormContract
