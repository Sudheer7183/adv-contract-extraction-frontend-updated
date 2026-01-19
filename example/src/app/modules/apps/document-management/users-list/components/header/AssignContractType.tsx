import React, { useEffect, useState } from 'react'
import { useListView } from '../../core/ListViewProvider';
import { Alert, Snackbar } from '@mui/material';
import request, { gql } from 'graphql-request';
import Select from 'react-select';
import BASEURL from '../../../../../../config/baseurl';

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
}
`
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


function AssignContractType() {
  const { selected, setUpdate, name, setSelected, setContractAssign } = useListView()
  const [ctypeval, setCTypeVal] = useState("");
  const [message, setMessage] = useState("")
  const [message1, setMessage1] = useState(false)
  const [open1, setOpen1] = useState(false);
  const [selectedOption2, setSelectedOption2] = useState<any[]>([]);
  const [data, setData] = useState([]);
  const [pro, setPro] = useState([]);


  let fileIdArr: any[] = []


  for (let i = 0; i < selected.length; i++) {
    console.log("selected array", selected[i]);
    fileIdArr.push({ fileId: selected[i] })
  }


  const handleCloseForm = () => {
    setContractAssign(false);
    setSelected([])
  }


  const handleClose1 = () => {
    setOpen1(false);
  };


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
  };


  const handleSave = (e: any) => {
    request(`${BASEURL}graphql/`, USER_CONTRACT_TYPE, { files: fileIdArr, userContractType: ctypeval }, {Authorization: `Bearer ${localStorage.getItem('Token')}`})
      .then((res: any) => {
        setOpen1(true);
        setMessage1(true)
        setMessage("Successfully Assigned the ContractType")
        setUpdate(true)
        setSelected([])
        console.log("res", res);
        setContractAssign(false)
      })
      .catch((error: any) => {
        setOpen1(true);
        setMessage("Something Went Wrong")
        setMessage1(false)
        console.log("Error Message", error)
        setContractAssign(true)
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
                placeholder="Assign Contract type"
                value={selectedOption2}
                isSearchable={true}
                onChange={handleChange2}
                options={option2}
              />
            </div>
            <div className='p-5'>
              <button
                type='submit'
                className={`${themec} btn btn-sm  me-3`}
                data-kt-users-modal-action='submit'
                disabled={selectedOption2.length === 0}
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


export default AssignContractType
