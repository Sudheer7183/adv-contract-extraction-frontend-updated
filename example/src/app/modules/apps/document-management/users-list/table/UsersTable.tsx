import React, { useContext, useEffect, useMemo, useState } from 'react'
import { useTable, ColumnInstance, Row } from 'react-table'
import { CustomHeaderColumn } from '../table/columns/CustomHeaderColumn'
import { CustomRow } from '../table/columns/CustomRow'
import { usersColumns } from './columns/_columns'
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
import { UsersListLoading } from '../components/loading/UsersListLoading'
import Pagination from './columns/pagination'

const alldocuments = gql`
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
            active
          }
        }
      }
    }
  }
`

const documents = gql`
query Filess($projectId: String!, $skip:Int!,$first:Int!) {
    filess(projectId: $projectId, skip:$skip,first:$first) {
      edges {
        node {
          id
          filePath
          fileName
          project{
            id
            projectName
            active
          }
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
      }
    }
  }
`

const fileOrder = gql`
query Filess($projectId: String!, $orderBy: [String!]){
  filess(projectId: $projectId, orderBy: $orderBy){
    edges{
      node{
        id
          filePath
          fileName
          project{
            id
            projectName
            active
          }
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
    }
  }
}`

const FileSearch = gql`
query Filess($projectId: String!, $name: String!) {
  filess(projectId: $projectId, search: $name) {
    edges {
      node {
        id
          filePath
          fileName
          project{
            id
            projectName
            active
          }
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
    }
  }
}`
// const pageSize = 1;
const UsersTable = () => {
  const { currentUser } = useAuth()
  const { id } = useParams();
  const { setViewerPageActive } = useContext(AppContext);
  const { config } = useLayout()
  const { aside } = config
  console.log("type of aside", typeof (aside));
  const { clicked, setClicked } = useListView()

  console.log("aside mini", aside);

  console.log("minimized", !aside.minimized);
  console.log("idd->", id);
  const { filesearchValue, filesort, fileorder, setProjectid, setUpdate, update, setProjectName, selected, selected1 } = useListView()
  useEffect(() => {
    if (!aside.minimized) {
      document.body.setAttribute('data-kt-aside-minimize', 'off')
      setViewerPageActive(false)
    }
    setProjectid(id)
  }, [id])

  const [skip, setSkip] = useState(0);
  const [first, setFirst] = useState(5);
  const [pageFirst, setPageFirst] = useState(1)
  const [pageNext, setPageNext] = useState(5)

  const variables = {
    projectId: id,
    skip: skip,
    first: first
  }
  const Role: any = currentUser?.role
  console.log("user role in doc table", Role);
  let columns: any = []
  if (Role === "Admin" || Role === "Manager") {
    columns = useMemo(() => usersColumns, [])
  } else {
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
  const [isLoading, setIsLoading] = useState(false)

  const fetchData = () => {
    request(`${BASEURL}graphql/`, documents, variables, {Authorization: `Bearer ${localStorage.getItem('Token')}`}).then((res: any) => {
      console.log(res.filess.edges)
      console.log("multiple request");
      setProjectName(res.filess?.edges[0]?.node?.project?.projectName)
      let fileArr: any = []
      if (res.filess.edges.length > 0) {
        for (let k = 0; k < res.filess.edges.length; k++) {
          fileArr.push(res.filess.edges[k]?.node)
          console.log("data arr", fileArr);
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
      request(`${BASEURL}graphql/`, fileOrder, { projectId: id, orderBy: sort }, {Authorization: `Bearer ${localStorage.getItem('Token')}`}).then((res: any) => {
        console.log("order res", res.filess)
        console.log(res.filess.edges)
        let dataArr: any = []
        if (res.filess.edges.length > 0) {
          for (let k = 0; k < res.filess.edges.length; k++) {
            dataArr.push(res.filess.edges[k]?.node)
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
      request(`${BASEURL}graphql/`, FileSearch, { projectId: id, name: filename }, {Authorization: `Bearer ${localStorage.getItem('Token')}`}).then((res: any) => {
        console.log("search result", res.filess.edges)
        console.log("multiple request")
        let data3: any = []
        if (res.filess.edges.length > 0) {
          for (let k = 0; k < res.filess.edges.length; k++) {
            data3.push(res.filess.edges[k]?.node)
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
    request(`${BASEURL}graphql/`, alldocuments, { projectId: id }, {Authorization: `Bearer ${localStorage.getItem('Token')}`}).then((res: any) => {
      console.log("response all", res.filess);
      let DocArr: any = []
      if (res.filess.edges.length > 0) {
        for (let k = 0; k < res.filess.edges.length; k++) {
          DocArr.push(res.filess.edges[k]?.node)
          setNext(DocArr)
        }
      }
    })
  }, [update, id])


  const totalPages = Math.ceil(next.length / first);
  console.log("totalpages", totalPages, first, next.length);

  const handlePage = (page: number) => {
    setCurrentPage(page)
    setSkip((page - 1) * first)
  }


  // const Pagination = (val: any) => {
  //   const newSkip = skip + val;
  //   if (newSkip >= 0 && newSkip < next.length) {
  //     setSkip(newSkip);
  //     const newPage = Math.ceil((newSkip + 1) / first);
  //     setCurrentPage(newPage);
  //     const newFrom = newSkip + 1;
  //     const newTo = Math.min(newSkip + first, next.length);
  //     setPageFirst(newFrom)
  //     setPageNext(newTo)
  //   }
  // };

  // const rowSize = (e: any) => {
  //   // setFirst(e.target.value);
  //   setFirst(Number(e.target.value));
  //   setPageNext(Number(e.target.value))
  // }
  // const Pagination = (val: any) => {
  //   const newSkip = skip + val;
  //   if (newSkip >= 0 && newSkip < next.length) {
  //     setSkip(newSkip);
  //     const newPage = Math.ceil((newSkip + 1) / first);
  //     setCurrentPage(newPage);
  //     const newFrom = newSkip + 1;
  //     const newTo = Math.min(newSkip + first, next.length);
  //     setPageFirst(newFrom);
  //     setPageNext(newTo);
  //   } else if (newSkip >= next.length) {
  //     // Handle edge case when skip value exceeds total data length
  //     const lastPage = Math.ceil(next.length / first);
  //     const correctedSkip = (lastPage - 1) * first;
  //     setSkip(correctedSkip);
  //     const newFrom = correctedSkip + 1;
  //     const newTo = next.length;
  //     setPageFirst(newFrom);
  //     setPageNext(newTo);
  //     setCurrentPage(lastPage);
  //   }
  // };

  // const rowSize = (e: any) => {
  //   const newSize = Number(e.target.value);
  //   setFirst(newSize);
  //   setSkip(0); // Reset skip to the first page
  //   setCurrentPage(1); // Reset current page to 1
  //   setPageFirst(1); // Reset pageFirst
  //   setPageNext(Math.min(newSize, allDataLen)); // Reset pageNext
  // };

  const allDataLen = next.length
  console.log("all data length", allDataLen);


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

  // const dataToShow = selected.length > 0 ? data.filter(item => selected.includes(item.id)) : data;
  let dataToShow;

  console.log("selected1 value--->", selected1);



  if (selected1.length > 0) {
    dataToShow = [...data];
  }
  else if (selected.length > 0) {
    dataToShow = [...data.filter(item => selected.includes(item.id))];
  }
  else {
    dataToShow = data;
  }


  const { getTableProps, getTableBodyProps, headers, rows, prepareRow } = useTable({
    columns,
    data: dataToShow,
  })
  // const Enable = currentPage === 1 ? "page-item disabled" : "page-item "
  // const Disable = currentPage >= totalPages ? "page-item disabled" : "page-item "

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

  useEffect(() => {
    // refreshTable()
    if (clicked) {
      console.log("Refreshing table...");
      setIsLoading(true)
      fetchData();
      // setIsLoading(false)
      console.log('refreshed the table');
      setTimeout(() => {
        setIsLoading(false)
      }, 500);

    }
    // setIsLoading(false)
    setClicked(false)
  }, [clicked])


  const backgroundColor = getBackgroundColor(themeColor1);
  const tableHeader = themeColor1 != null ? `text-start fw-bolder gs-0 ${backgroundColor} bg-opacity-25` : 'text-start fw-bolder gs-0 bg-primary bg-opacity-25'

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
                    item.original.fileName.toLowerCase().includes(filesearchValue.toLowerCase())
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
          {/* <div className='pagination'>
            <select value={first} onChange={rowSize} className='form-select h-38px'>
              <option value='5'>5</option>
              <option value='10'>10</option>
              <option value='15'>15</option>
              <option value='20'>20</option>
            </select>
          </div> */}
          {/* <p>{pageFirst}-{pageNext} of {allDataLen}</p> */}
        </div>
        <div className="float-end">
          <div className='pagination'>
            <div className="float-end">
              <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePage} />
            </div>
          </div>
        </div>

        {/* <div className="float-end">
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
        </div> */}
        {/* <UsersListPagination data={data} /> */}
        {isLoading && <UsersListLoading />}
      </KTCardBody>
    </>
  )
}


export { UsersTable }




