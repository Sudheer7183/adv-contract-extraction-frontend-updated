import React, { useContext, useEffect, useMemo, useState } from 'react'
import { useTable, ColumnInstance, Row } from 'react-table'
import { CustomHeaderColumn } from '../table/columns/CustomHeaderColumn'
import { CustomRow } from '../table/columns/CustomRow'
import { UserTableColumns } from './columns/_columns'
import { User } from '../core/_models'
import { KTCardBody } from '../../../../../../_metronic/helpers'
import { request, gql } from 'graphql-request'
import _ from 'lodash'
import { useParams } from 'react-router-dom'
import { useListView } from '../core/ListViewProvider'
import { useAuth } from '../../../../auth'
import { reviewusersColumns } from './columns/_reviewcolumns'
import BASEURL from '../../../../../config/baseurl'
import { useLayout } from '../../../../../../_metronic/layout/core'
import AppContext from '../../../../../AppContext'


const alldocuments = gql`
query userFiless($projectId: String!, $userId: String!) {
    userFiless(projectId: $projectId, userId: $userId) {
      edges {
        node {
          file{
            id
            fileName
            filePath
            zuvaFileId
            fileStatus
            fileType
            language
            documentType
            pages
            userContractType{
              contractTypeName
            }
            lock
            lockedBy {
              username
              email
              role
            }
          }
          user{
            id
            username
            firstName
            lastName
            role
          }
          project{
            id
            projectName
          }
        }
      }
    }
  }
`


const documents = gql`
query userFiless($projectId: String!, $userId: String!, $skip:Int!,$first:Int!) {
    userFiless(projectId: $projectId, userId: $userId, skip:$skip,first:$first) {
      edges {
        node {
          file{
            id
            fileName
            filePath
            zuvaFileId
            fileStatus
            fileType
            pages
            language
            documentType
            userContractType{
              contractTypeName
            }
            lock
            lockedBy {
              username
              email
              role
            }
          }
          project{
            id
            projectName
          }
          user{
            id
            username
            firstName
            lastName
            role
          }
        }
      }
    }
  }
`


const fileOrder = gql`
query userFiless($projectId: String!, $userId: String!, $orderBy: [String!]){
  userFiless(projectId: $projectId, userId: $userId, orderBy: $orderBy){
    edges{
      node{
        file{
          id
          fileName
          filePath
          zuvaFileId
          fileStatus
          fileType
          pages
          language
          documentType
          userContractType{
            contractTypeName
          }
          lock
          lockedBy {
            username
            email
            role
          }
        }
          project{
            id
            projectName
          }
          user{
            id
            username
            firstName
            lastName
            role
          }
      }
    }
  }
}`


const FileSearch = gql`
query userFiless($projectId: String!, $userId: String!, $name: String!) {
  userFiless(projectId: $projectId, userId: $userId, search: $name) {
    edges {
      node {
        file{
          id
          fileName
          filePath
          zuvaFileId
          fileStatus
          fileType
          pages
          language
          documentType
          userContractType{
            contractTypeName
          }
          lock
          lockedBy {
            username
            email
            role
          }
        }
          project{
            id
            projectName
          }
          user{
            id
            username
            firstName
            lastName
            role
          }
      }
    }
  }
}`
// const pageSize = 1;
const ReviewTable = () => {
  const { currentUser } = useAuth()
  const { id } = useParams();
  const { setViewerPageActive } = useContext(AppContext);
  const { config } = useLayout()
  const { aside } = config
  console.log("type of aside", typeof (aside));
  const userId = currentUser.id


  console.log("aside mini", aside);


  console.log("minimized", !aside.minimized);
  console.log("idd->", id);
  const { filesearchValue, filesort, fileorder, setProjectid, setUpdate, update, setProjectName } = useListView()
  useEffect(() => {
    if (!aside.minimized) {
      document.body.setAttribute('data-kt-aside-minimize', 'off')
      setViewerPageActive(false)
    }
    setProjectid(id)
  }, [id])


  const [skip, setSkip] = useState(0);
  const [first, setFirst] = useState(5);


  const variables = {
    projectId: id,
    userId: userId,
    skip: skip,
    first: first
  }
  let Role: any = currentUser?.role
  console.log("user role in doc table", Role);


  // const UserColumns = UserTableColumns();


  let columns: any = []
  // if (Role == "Admin") {
  //     columns = useMemo(() => UserColumns, [])
  // } else {
  //     columns = useMemo(() => reviewusersColumns, [])
  // }


  if (Role = "Reviewer") {
    columns = useMemo(() => reviewusersColumns, [])
  }




  console.log("column", columns);


  // const columns = { Role == "Admin" ? useMemo(() => usersColumns, []) : useMemo(() => reviewusersColumns, [])}
  const [data2, setdata2] = useState<any[]>([])
  const [data3, setdata3] = useState<any[]>([]);
  const [data4, setdata4] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filename, setFileName] = useState(filesearchValue)
  const [next, setNext] = useState<any[]>([]);


  const fetchData = () => {
    request(`${BASEURL}graphql/`, documents, variables, {Authorization: `Bearer ${localStorage.getItem('Token')}`}).then((res: any) => {
      console.log("response innnn", res)
      console.log("multiple request");
      setProjectName(res.userFiless?.edges[0]?.node?.project?.projectName)
      let fileArr: any = []
      if (res.userFiless.edges.length > 0) {
        for (let k = 0; k < res.userFiless.edges.length; k++) {
          // fileArr.push(res.userFiless.edges[k]?.node)
          console.log("data arr", fileArr);
          const project = res.userFiless.edges[k]?.node.project
          const file = res.userFiless.edges[k]?.node.file
          if (file && project) {
            fileArr.push(res.userFiless.edges[k]?.node);
          }
          setdata3(fileArr)
        }
      }
      else {
        setdata3([])
      }
    })
    console.log("user table sort value---->", fileorder, filesort);
    let sort = null
    if (fileorder != "" && filesort != "") {
      if (fileorder == "asc") {
        sort = filesort
      }
      else {
        sort = `-${filesort}`
      }
      console.log("order query variable", sort, typeof (sort));
      request(`${BASEURL}graphql/`, fileOrder, { projectId: id, userId: userId, orderBy: sort }, {Authorization: `Bearer ${localStorage.getItem('Token')}`}).then((res: any) => {
        console.log("order res", res.userFiless)
        console.log(res.userFiless.edges)
        let dataArr: any = []
        if (res.userFiless.edges.length > 0) {
          for (let k = 0; k < res.userFiless.edges.length; k++) {
            dataArr.push(res.userFiless.edges[k]?.node)
            console.log("data arr", dataArr);
            setdata4(dataArr)
          }
        }
        else {
          setdata4([])
        }
      })
    }
    setFileName(filesearchValue)


    if (filename !== undefined) {
      request(`${BASEURL}graphql/`, FileSearch, { projectId: id, userId: userId, name: filename }, {Authorization: `Bearer ${localStorage.getItem('Token')}`}).then((res: any) => {
        console.log("search result", res.userFiless.edges)
        console.log("multiple request")
        let data3: any = []
        if (res.userFiless.edges.length > 0) {
          for (let k = 0; k < res.userFiless.edges.length; k++) {
            data3.push(res.userFiless.edges[k]?.node)
            console.log("data arr", data3);
            setdata2(data3)
          }
        }
        else {
          setdata2([])
        }


      })
    }
    setUpdate(false)
  }


  useEffect(() => {
    fetchData();
  }, [update, skip, first, fileorder, filesort]);


  useEffect(() => {
    request(`${BASEURL}graphql/`, alldocuments, { projectId: id, userId: userId }, {Authorization: `Bearer ${localStorage.getItem('Token')}`}).then((res: any) => {
      console.log("response all", res.userFiless);
      let DocArr: any = []
      if (res.userFiless.edges.length > 0) {
        for (let k = 0; k < res.userFiless.edges.length; k++) {
          DocArr.push(res.userFiless.edges[k]?.node)
          setNext(DocArr)
        }
      }
    })
  }, [update, id])




  const totalPages = Math.ceil(next.length / first);
  console.log("totalpages", totalPages, first, next.length);


  const Pagination = (val: any) => {
    const newSkip = skip + val;
    if (newSkip >= 0 && newSkip < next.length) {
      setSkip(newSkip);
      const newPage = Math.ceil((newSkip + 1) / first);
      setCurrentPage(newPage);
    }
  };


  const rowSize = (e: any) => {
    // setFirst(e.target.value);
    setFirst(Number(e.target.value));
  }




  let data = null


  if (filesearchValue == "" && fileorder == "" && filesort == "") {
    data = data3
  }
  else if (filesearchValue !== "" && data2.length !== 0) {
    data = data2
  }
  else if (fileorder !== "" && filesort !== "") {
    data = data4
  }
  else {
    data = []
  }


  console.log("columns", columns);




  const { getTableProps, getTableBodyProps, headers, rows, prepareRow } = useTable({
    columns,
    data,
  })
  const Enable = currentPage === 1 ? "page-item disabled" : "page-item "
  const Disable = currentPage >= totalPages ? "page-item disabled" : "page-item "


  const themeColor1 = localStorage.getItem("themeColor")
  console.log("Viewer themeColor->", themeColor1);
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


  console.log("datatataa", data);




  const backgroundColor = getBackgroundColor(themeColor1);
  const tableHeader = themeColor1 != null ? `text-start fw-bolder gs-0 ${backgroundColor} bg-opacity-25` : 'text-start fw-bolder gs-0 bg-primary bg-opacity-25'



  console.log("reviewer row values", rows);
  

  return (
    <>
      <KTCardBody className='py-4'>
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
                (() => {
                  const filteredRows = rows.filter((item: any) =>
                    filesearchValue === "" ||
                    (item.original && item.original.fileName && item.original.fileName.toLowerCase().includes(filesearchValue.toLowerCase()))
                  );


                  if (filteredRows.length === 0) {
                    return (
                      <tr>
                        <td colSpan={7}>
                          <div className='d-flex text-center w-100 align-content-center justify-content-center'>
                            No matching records found
                          </div>
                        </td>
                      </tr>
                    );
                  }


                  return filteredRows.map((row: Row<User>, i) => {
                    prepareRow(row);
                    return <CustomRow row={row} key={`row-${i}-${row.id}`} />;
                  });
                })()
              ) : (
                <tr>
                  <td colSpan={7}>
                    <div className='d-flex text-center w-100 align-content-center justify-content-center'>
                      No data available
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="float-start">
          <div className='pagination'>
            <select value={first} onChange={rowSize} className='form-select h-38px'>
              <option value='5'>5</option>
              <option value='10'>10</option>
              <option value='15'>15</option>
              <option value='20'>20</option>
            </select>
          </div>
        </div>
        <div className="float-end">
          <nav aria-label="...">
            <ul className="pagination">
              <li className={`page-item ${Enable}`}>
                <a className="page-link" onClick={() => Pagination(- Number(first))}>Previous</a>
              </li>
              <li className={`page-item ${Disable}`}>
                <a className="page-link" onClick={() => Pagination(Number(first))}>Next</a>
              </li>
            </ul>
          </nav>
        </div>
      </KTCardBody>
    </>
  )
}

export { ReviewTable }
