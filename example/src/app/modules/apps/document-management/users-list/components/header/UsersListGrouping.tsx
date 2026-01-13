import React, { useEffect, useState } from 'react';
import { useListView } from '../../core/ListViewProvider'
import { Alert, Snackbar } from '@mui/material';
import request, { gql } from 'graphql-request';
import Select from 'react-select';
import BASEURL from '../../../../../../config/baseurl';
import { Form } from 'react-bootstrap';

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

const USER_CONTRACT_TYPE = gql`
mutation userContractType(
  $files: [FilesInput]!
  $userContractType: Int!
){
  userContractType(
    input:{
      files: $files
      userContractType: $userContractType
    }
  ){
    userContract{
      fileName
      fileType
      filePath
      userContractType{
        contractTypeName
      }
      project{
        id
        projectName
      }
    }
  }
}`

const USER_ASSIGN = gql`
mutation userAssign(
  $files: [FilesInput]!
  $userAssign: String!
){
  userAssign(
    input:{
      files: $files
      userAssign: $userAssign
    }
  ){
    userAssign{
      id
      user{
        id
        username
        role
      }
      file{
        id
        fileName
        fileType
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



const UsersListGrouping = () => {
  const { selected, name, setUpdate, setSelected } = useListView()
  console.log("NAME id ->", name, selected);
  const [data, setData] = useState([]);
  const [pro, setPro] = useState([]);
  const [showSave, setShowSave] = useState(false);
  const [selectedOption2, setSelectedOption2] = useState<any[]>([]);
  const [ctypeval, setCTypeVal] = useState("");
  const [message, setMessage] = useState("")
  const [message1, setMessage1] = useState(false)
  const [open1, setOpen1] = useState(false);
  const [users, setUsers] = useState<any>({});
  const [usrval, setUsrVal] = useState("");
  const [selectedOption, setSelectedOption] = useState<any[]>([]);
  const [showUserAssignment, setShowUserAssignment] = useState(false);
  const [isSaveButtonDisabled, setSaveButtonDisabled] = useState(true);
  const [showUserContractType, setShowUserContractType] = useState(true);

  let option2: any[] = [];

  useEffect(() => {
    request(`${BASEURL}graphql/`, ACTIVE_CATALOGS, { isactive: true }, {Authorization: `Bearer ${localStorage.getItem('Token')}`}).then((data: any) => setData(data.activeCatalogs))
    request(`${BASEURL}graphql/`, Project, { name: name }, {Authorization: `Bearer ${localStorage.getItem('Token')}`}).then((e: any) => {
      setPro(e)
    })
  }, [name]);


  const cf = pro && pro?.projects?.edges[0]?.node?.catalogFile?.id

  for (let l = 0; l < data?.length; l++) {
    if (data[l].id == cf) {
      console.log("default Contract Type array", data[l].catalogdetail)
      let length = data[l].catalogdetail.length
      console.log("lenth", length);
      for (let j = 0; j < length; j++) {
        const ct = data[l].catalogdetail[j].userContractTypeMaster.contractTypeName
        const dctId = data[l].catalogdetail[j].userContractTypeMaster.id
        option2.push({ value: ct, label: ct, id: dctId });
      }
    }
  }

  const handleChange2 = (selectedOption: any) => {
    console.log("Assign contract type--->", selectedOption);
    setSelectedOption2(selectedOption);
    setCTypeVal(selectedOption.id)
    setSaveButtonDisabled(selectedOption === null);
  };


  let fileIdArr: any[] = []

  for (let i = 0; i < selected.length; i++) {
    console.log("selected array", selected[i]);
    fileIdArr.push({ fileId: selected[i] })
  }

  console.log("filesId Array", fileIdArr)
  const handleClose1 = () => {
    setOpen1(false);
  };

  useEffect(() => {
    request(`${BASEURL}graphql/`, reviewUser, { position: "Reviewer" }, {Authorization: `Bearer ${localStorage.getItem('Token')}`}).then((user: any) => setUsers(user.reviewUser.edges))
  }, []);


  let option: any[] = [];
  const lenn = users.length
  for (let i = 0; i < lenn; i++) {
    const un = users[i]?.node?.username
    const id = users[i]?.node?.id
    option.push({ value: un, label: un, id: id });
  }

  const handleChange3 = (selectedOption: any) => {
    setSelectedOption(selectedOption);
    console.log("selectedOption handlechange", selectedOption);
    setUsrVal(selectedOption.id)
    setSaveButtonDisabled(selectedOption === null);
  };


  const handleSave = (e: any) => {
    e.preventDefault();
    setShowSave(!showSave);
    if (showUserAssignment) {
      request(`${BASEURL}graphql/`, USER_ASSIGN, { files: fileIdArr, userAssign: usrval }, {Authorization: `Bearer ${localStorage.getItem('Token')}`})
        .then((response: any) => {
          console.log("Successfully Assigned the user", response);
          setOpen1(true);
          setMessage1(true)
          setMessage("Successfully Assigned the user")
          setUpdate(true)
          setSelected([])
        })
        .catch((error: any) => {
          setOpen1(true);
          setMessage("Something Went Wrong")
          setMessage1(false)
          console.log("Something Went Wrong", error)
        });
    }

    if (showUserContractType) {
      request(`${BASEURL}graphql/`, USER_CONTRACT_TYPE, { files: fileIdArr, userContractType: ctypeval }, {Authorization: `Bearer ${localStorage.getItem('Token')}`})
        .then((res: any) => {
          setOpen1(true);
          setMessage1(true)
          setMessage("Successfully Assigned the ContractType")
          setUpdate(true)
          setSelected([])
          console.log("res", res);
        })
        .catch((error: any) => {
          setOpen1(true);
          setMessage("Something Went Wrong")
          setMessage1(false)
          console.log("Error Message", error)
        });
    }
  }

  const colorv = localStorage.getItem("themeColor")
  console.log("colorcolor", colorv)
  const themec = colorv != null ? colorv + " " + 'btn' : 'p-3 bg-primary text-white btn'

  const handleToggleUserAssignment = () => {
    setShowUserAssignment(!showUserAssignment);
    setSaveButtonDisabled(!showUserAssignment);
    setShowUserContractType(!showUserContractType);
  };


  return (
    <>
      <div className='d-flex justify-content-end align-items-center'>
        <Form.Check
          type="switch"
          id="userAssignmentSwitch"
          label={showUserAssignment ? "User Assign" : "Contract Type"}
          checked={showUserAssignment}
          onChange={handleToggleUserAssignment}
        />&nbsp;&nbsp;
        <div className='fw-bolder me-5'>
          <span className='me-2'>{selected.length}</span> Selected
        </div>
        {showUserAssignment ? (
          <div style={{ paddingTop: '20px' }}>
            <Select
              className="dropdown"
              placeholder="Assign Reviewer User"
              value={selectedOption}
              isSearchable={true}
              onChange={handleChange3}
              options={option}
            /><br />
          </div>
        ) : (
          <div style={{ paddingTop: '20px' }}>
            <Select
              className="dropdown"
              placeholder="Assign Contract Type"
              value={selectedOption2}
              isSearchable={true}
              onChange={handleChange2}
              options={option2} />&nbsp;&nbsp;
          </div>
        )} &nbsp;
        <button
          type='button'
          className={themec}
          disabled={isSaveButtonDisabled}
          onClick={handleSave}
        >
          Save
        </button>


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
      </div>
    </>

  )
}

export { UsersListGrouping }
