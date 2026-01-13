import React, { useEffect, useState } from 'react';
// import { useQueryClient, useMutation } from '@tanstack/react-query'
// import { QUERIES } from '../../../../../../../_metronic/helpers'
import { useListView } from '../../core/ListViewProvider'
// import { useQueryResponse } from '../../core/QueryResponseProvider'
// import { deleteSelectedUsers } from '../../core/_requests'
import request, { gql } from 'graphql-request';
import Select from 'react-select';
import BASEURL from '../../../../../../config/baseurl';




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


const PROJECT = gql`
  query Project($name: String!) {
    projects(search: $name) {
      edges {
        node {
          id
          projectName
          description
          active
          catalogFile{
            id
            catalogName
          }
          defaultContractType{
            id
            contractTypeName
            usercontracttypedetail{
              fieldName
            }
          }
          classificationFile {
            id
            jsonFile
          }
        }
      }
    }
  }
`;


const USER_CONTRACT_TYPE = gql`
mutation userContractType(
  $files: [FilesInput]!
  $userContractType: String!
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
      userContractType
      project{
        id
        projectName
      }
    }
  }
}
`


const UsersListGrouping = () => {
  const { selected, name } = useListView()
  const [data, setData] = useState([]);
  const [pro, setPro] = useState([]);
  const [showSave, setShowSave] = useState(false);
  const [selectedOption2, setSelectedOption2] = useState<any[]>([]);
  const [ctype, setCType] = useState([]);
  const [ctypeval, setCTypeVal] = useState("");

  const Active = true
  const variables = { isactive: Active }

  const variable = { name: name }

  let option2: any[] = [];

  useEffect(() => {
    request(`${BASEURL}graphql/`, ACTIVE_CATALOGS, variables, {Authorization: `Bearer ${localStorage.getItem('Token')}`}).then((data: any) => setData(data.activeCatalogs))
    request(`${BASEURL}graphql/`, PROJECT, variable, {Authorization: `Bearer ${localStorage.getItem('Token')}`}).then((e: any) => {
      setPro(e)
    })
  }, []);


  const cf = pro && pro?.projects?.edges[0]?.node?.catalogFile?.id

  for (let l = 0; l < data?.length; l++) {
    if (data[l].id == cf) {
      console.log("default Contract Type array", data[l].catalogdetail)
      let length = data[l].catalogdetail.length
      console.log("lenth", length);
      for (let j = 0; j < length; j++) {
        const ct = data[l].catalogdetail[j].userContractTypeMaster.contractTypeName
        const ct1 = data[l].catalogdetail[j].userContractTypeMaster.contractTypeName
        const dctId = data[l].catalogdetail[j].userContractTypeMaster.id
        option2.push({ value: ct, label: ct1, id: dctId });
      }
    }
  }

  const handleChange2 = (selectedOption: any) => {
    console.log("contract type selectedOption", selectedOption)
    console.log("contract type selectedOption value", selectedOption.value)
    setSelectedOption2(selectedOption);
    setCTypeVal(selectedOption.value)
  };


  let fileIdArr: any[] = []

  for (let i = 0; i < selected.length; i++) {
    console.log("selected array", selected[i]);
    fileIdArr.push({ fileId: selected[i] })
  }

  console.log("filesId Array", fileIdArr)

  const handleSave = (e: any) => {
    setShowSave(!showSave);
    request(`${BASEURL}graphql/`, USER_CONTRACT_TYPE, { files: fileIdArr, userContractType: ctypeval }, {Authorization: `Bearer ${localStorage.getItem('Token')}`}).then((type: any) => { setCType(type) })
    console.log("Saved ");
  }

  const colorv = localStorage.getItem("themeColor")
  console.log("colorcolor", colorv)
  const themec = colorv != null ? colorv + " " + 'btn' : 'p-3 bg-primary text-white btn'

  return (
    <div className='d-flex justify-content-end align-items-center'>
      <div className='fw-bolder me-5'>
        <span className='me-2'>{selected.length}</span> Selected
      </div>
      <Select
        className="dropdown"
        value={selectedOption2}
        isSearchable={true}
        onChange={handleChange2}
        options={option2}
      />&nbsp;&nbsp;


      <button
        type='button'
        className={themec}
        disabled={selectedOption2.length === 0}
        onClick={handleSave}
      >
        Save
      </button>
    </div>
  )
}

export { UsersListGrouping }
