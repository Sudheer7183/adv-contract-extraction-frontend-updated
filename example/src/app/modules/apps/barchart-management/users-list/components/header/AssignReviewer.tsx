import React, { useEffect, useState } from 'react'
import { useListView } from '../../core/ListViewProvider';
import Select from 'react-select';
import BASEURL from '../../../../../../config/baseurl';
import request, { gql } from 'graphql-request';
import { Alert, Snackbar } from '@mui/material';


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


function AssignReviewer() {
    const { selected, setSelected, setUpdate, setUserAssign, name } = useListView()
    const [users, setUsers] = useState<any>({});
    const [usrval, setUsrVal] = useState("");
    const [selectedOption, setSelectedOption] = useState<any[]>([]);
    const [showSave, setShowSave] = useState(false);
    const [message, setMessage] = useState("")
    const [message1, setMessage1] = useState(false)
    const [open1, setOpen1] = useState(false);

    let fileIdArr: any[] = []


    for (let i = 0; i < selected.length; i++) {
        console.log("selected array", selected[i]);
        fileIdArr.push({ fileId: selected[i] })
    }


    const handleCloseForm = () => {
        setUserAssign(false);
        setSelected([])
    }


    const handleClose1 = () => {
        setOpen1(false);
    };

    useEffect(() => {
        // request(`${BASEURL}graphql/`, reviewUser, { position: "Reviewer" }).then((user: any) => setUsers(user.reviewUser.edges))
        request(`${BASEURL}graphql/`, Project, { name: name }, {Authorization: `Bearer ${localStorage.getItem('Token')}`}).then((e: any) => {
            // setPro(e)
            request(`${BASEURL}graphql/`, Users, { projectId: e?.projects?.edges[0]?.node?.id }, {Authorization: `Bearer ${localStorage.getItem('Token')}`}).then((user: any) => setUsers(user.reviewUserDetail.edges))
        })

    }, [name]);


    // let option: any[] = [];
    // const lenn = users.length
    // for (let i = 0; i < lenn; i++) {
    //     const un = users[i]?.node?.username
    //     const id = users[i]?.node?.id
    //     option.push({ value: un, label: un, id: id });

    // }
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
        console.log("selectedOption handlechange", selectedOption);
        setUsrVal(selectedOption.id)
        // setSaveButtonDisabled(selectedOption === null);
    };


    const handleSave = (e: any) => {
        e.preventDefault();
        setShowSave(!showSave);
        request(`${BASEURL}graphql/`, USER_ASSIGN, { files: fileIdArr, userAssign: usrval }, {Authorization: `Bearer ${localStorage.getItem('Token')}`})
            .then((response: any) => {
                console.log("Successfully Assigned the user", response);
                setOpen1(true);
                setMessage1(true)
                setMessage("Successfully Assigned the user")
                setUpdate(true)
            })
            .catch((error: any) => {
                setOpen1(true);
                setMessage("Something Went Wrong")
                setMessage1(false)
                console.log("Something Went Wrong", error)
                // setUserAssign(true)
            });
    }
    const color = localStorage.getItem("themeColor")
    console.log("colorcolor", color)
    const themec = color != null ? color + " " + 'btn' : 'p-3 bg-primary text-white btn'
    console.log("themec", themec);


    return (
        <div>
            <div>
                <form onSubmit={handleSave}>
                    <div className='fw-bolder me-5' style={{ marginTop: '-10px' }}>
                        <span className='me-2'>{selected.length}</span> Selected
                    </div>
                    <div className='mx-xl-0 p-1 d-flex align-items-center justify-content-between'> {/* Use d-flex class to make them flex */}
                        <div style={{ flex: '1' }}> {/* Add this div to allow flex positioning */}
                            <Select
                                id="assignUserSelect"
                                className="dropdown"  // Add 'form-control' class to style the dropdown
                                placeholder="Assign Reviewer User"
                                value={selectedOption}
                                isSearchable={true}
                                onChange={handleChange3}
                                options={option}
                            />
                        </div>
                        <div className='p-5'>
                            <button
                                type='submit'
                                className={`${themec} btn btn-sm me-3`}
                                data-kt-users-modal-action='submit'
                                disabled={selectedOption.length === 0}
                            >
                                <span className='indicator-label'>Assign</span>
                            </button>
                            <button
                                type='reset'
                                onClick={() => handleCloseForm()}
                                className='btn btn-secondary btn-sm'
                                data-kt-users-modal-action='cancel'
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </form>

            </div>
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
    )
}


export default AssignReviewer
