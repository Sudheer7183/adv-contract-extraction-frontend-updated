import React, { useEffect, useMemo, useState } from 'react'
import { useTable, ColumnInstance, Row } from 'react-table'
import { CustomHeaderColumn } from '../table/columns/CustomHeaderColumn'
import { CustomRow } from '../table/columns/CustomRow'
import { User } from '../core/_models'
// import { UsersListLoading } from '../components/loading/UsersListLoading'
import { KTCardBody } from '../../../../../../_metronic/helpers'
import _ from 'lodash'
import { usersColumns } from './columns/_columns'
import { request, gql } from 'graphql-request'
import Select from 'react-select';
import { useListView } from '../core/ListViewProvider'
import { useAuth } from '../../../../auth'
import BASEURL from '../../../../../config/baseurl'

const Projects = gql`
query ReviewedProjects($userid: String!){
  reviewedProjects(userid: $userid){
    id
    projectName
  }
}`

const EXPORT_CONTRACT = gql`
query GetProject($id: String!){
  getProject(id: $id){
    projectName
    projectId
    id
    catalogFile{
      catalogName
      catalogdetail{
        userContractTypeMaster{
          contractTypeName
          id
        }
      }
    }
  }
}`

const LIST_FILES = gql`
query listFiles(
  $projectid: String!,
  $contracttype: String!,
  $filestatus: String!
){
  listFiles(
    projectid:$projectid,
    contracttype: $contracttype,
    filestatus: $filestatus
  ){
    project{
      id
      projectName
    }
    contractType{
      contractTypeName
    }
    fileStatus
    fileName
    id
  }
}`

const UsersTable = () => {
  const { currentUser } = useAuth()
  const { setProjectid, setDocType } = useListView()
  const [data, setData] = useState<any[]>([])
  const [selectedOption, setSelectedOption] = useState<any>(null);
  const [selectedOption1, setSelectedOption1] = useState<any>(null);
  const [proid, setProId] = useState("");
  const [ctype, setCType] = useState(0);
  const [export1, setExport1] = useState<any[]>([]);
  const [option1, setOption1] = useState<any[]>([]);

  let option: any[] = [];

  console.log("DataExport currentUser", currentUser);

  const userId = currentUser?.id


  useEffect(() => {
    request(`${BASEURL}graphql/`, Projects, { userid: userId }, {Authorization: `Bearer ${localStorage.getItem('Token')}`}).then((data: any) => {
      setExport1(data.reviewedProjects)
    })
  }, [userId])
  console.log("Data values in rsponse", export1)
  console.log("respo export1.length", export1.length);

  const uniqueProjectNames = new Set();

  for (let j = 0; j < export1.length; j++) {
    console.log("Data values in rsponse in for", export1[j])
    const proname = export1[j]?.projectName
    const id = export1[j]?.id

    if (proname && !uniqueProjectNames.has(proname)) {
      uniqueProjectNames.add(proname);
      option.push({ value: proname, label: proname, id: id });
    }
  }

  useEffect(() => {
    if (ctype) {
      let updatedOption1: any[] = [];
      for (let l = 0; l < ctype?.catalogFile?.catalogdetail.length; l++) {
        const ct = ctype?.catalogFile?.catalogdetail[l].userContractTypeMaster.contractTypeName;
        const ct1 = ctype?.catalogFile?.catalogdetail[l].userContractTypeMaster.contractTypeName;
        const dctId = ctype?.catalogFile?.catalogdetail[l].userContractTypeMaster.id;
        updatedOption1.push({ value: ct, label: ct1, id: dctId });
      }
      updatedOption1.unshift({ value: "All", label: "All", id: -1 });


      setOption1(updatedOption1); // Update the option1 state with the new values
    }
  }, [ctype]);
  console.log("option1 in respow", option1);

  const handleChange = (selectedOption: any) => {
    console.log(` respo Option selected:`, selectedOption);
    setSelectedOption(selectedOption);
    setProId(selectedOption.id)
    setProjectid(selectedOption.id)
    request(`${BASEURL}graphql/`, EXPORT_CONTRACT, { id: selectedOption.id }, {Authorization: `Bearer ${localStorage.getItem('Token')}`}).then((res: any) => {
      console.log("response in export data", res.getProject);
      setCType(res.getProject)
    })
  };

  const handleChange1 = (selectedOption: any) => {
    console.log("Default contract type selectedOption", selectedOption)
    setSelectedOption1(selectedOption);
    setDocType(selectedOption.value)
    if (proid != "") {
      request(`${BASEURL}graphql/`, LIST_FILES, { projectid: proid, contracttype: selectedOption.value, filestatus: "Review Completed" }, {Authorization: `Bearer ${localStorage.getItem('Token')}`}).then((res: any) => {
        console.log("response in export data handlechange1", res.listFiles);
        setData(res.listFiles)
      })
    }
  };

  const columns = useMemo(() => usersColumns, [])
  console.log("columns", columns);

  const { getTableProps, getTableBodyProps, headers, rows, prepareRow } = useTable({
    columns,
    data,
  })

  const themeColor1 = localStorage.getItem("themeColor")
  const getBackgroundColor = (classNames: any) => {
    const regex = /bg-(\w+)/;
    if (typeof classNames === 'string' && classNames.trim() !== '') {
      const match = classNames.match(regex);
      if (match && match[1]) {
        return match[0];
      }
    }
    return '';
  };


  const backgroundColor = getBackgroundColor(themeColor1);
  const tableHeader = themeColor1 != null ? `text-start fw-bolder gs-0 ${backgroundColor} bg-opacity-25` : 'text-start fw-bolder gs-0 bg-primary bg-opacity-25'


  return (
    <KTCardBody className='py-4'>
      <div className="d-flex flex-row w-80 mt-0 mb-0"
        style={{ width: '100%', margin: "auto" }}>
        <div style={{ display: "flex", gap: "1rem" }}>
          <span style={{ width: '200px' }}>
            <Select
              className="dropdown"
              placeholder="Select Project Name"
              value={selectedOption}
              isSearchable={true}
              onChange={handleChange}
              options={option}
            />
          </span>
          <span style={{ width: '200px' }}>
            <Select
              className="dropdown"
              placeholder="Select Contract Type"
              value={selectedOption1}
              isSearchable={true}
              onChange={handleChange1}
              options={option1}
            />
          </span>
        </div>
      </div><br />
      <div className='table-responsive'>
        <table
          id='kt_table_users'
          className='table table-hover align-middle table-row-dashed dataTable no-footer table-striped'
          {...getTableProps()}
        >
          <thead>
            <tr className={tableHeader} style={{ height: '50px' }}>
              {headers.map((column: ColumnInstance<User>) => (
                <CustomHeaderColumn key={column.id} column={column} />
              ))}
            </tr>
          </thead>
          <tbody className='text-gray-600 fw-bold' style={{ height: '50px' }} {...getTableBodyProps()}>
            {rows.length > 0 ? (
              rows.map((row: Row<User>, i: any) => {
                prepareRow(row)
                return <CustomRow row={row} key={`row-${i}-${row.id}`} />
              })
            ) : (
              <tr>
                <td colSpan={7}>
                  <div className='d-flex text-center w-100 align-content-center justify-content-center'>
                    No matching records found
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* <UsersListLoading /> */}
    </KTCardBody>
  )
}

export { UsersTable }
