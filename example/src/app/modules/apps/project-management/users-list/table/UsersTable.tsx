import React, { useEffect, useMemo, useState } from 'react'
import { useTable, ColumnInstance, Row } from 'react-table'
import { CustomHeaderColumn } from '../table/columns/CustomHeaderColumn'
import { CustomRow } from '../table/columns/CustomRow'
import { useQueryResponseData, useQueryResponseLoading } from '../core/QueryResponseProvider'
import { usersColumns } from './columns/_columns'
import { User } from '../core/_models'
import { UsersListLoading } from '../components/loading/UsersListLoading'
import { UsersListPagination } from '../components/pagination/UsersListPagination'
import { KTCardBody } from '../../../../../../_metronic/helpers'
import { request, gql } from 'graphql-request'
import { useListView } from '../core/ListViewProvider'
import _ from 'lodash'
import BASEURL from '../../../../../config/baseurl'

const AllProjects = gql`
query{
  allProjects{
    id
    projectId
    projectName
    active
    description
  }
}`


const allProject = gql`
query Projects($skip:Int!,$first:Int!){
  projects(skip:$skip,first:$first){
    edges{
      node{
        id
        projectName
        active
        projectId
        description
        totalFiles
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
      }
    }
  }
}`

const projectOrder = gql`
query Project($orderBy: [String!]){
  projects(orderBy: $orderBy){
    edges{
      node{
        id
        projectName
        totalFiles
        description
        active
      }
    }
  }
}`

const UsersTable = () => {
  const [data2, setdata2] = useState<any[]>([])
  const [data3, setdata3] = useState<any[]>([]);
  const [data4, setdata4] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const { projectSearchValue, projectorder, projectsort, setUpdate, update } = useListView()
  const isLoading = useQueryResponseLoading()
  const [skip, setSkip] = useState(0);
  const [first, setFirst] = useState(5);
  const [proname, setProName] = useState(projectSearchValue)
  const [next, setNext] = useState<any[]>([]);
  const [pageFirst, setPageFirst] = useState(1)
  const [pageNext, setPageNext] = useState(5)

  const fetchData = () => {
    request(`${BASEURL}graphql/`,
      allProject,
      { skip: skip, first: first },
      {Authorization: `Bearer ${localStorage.getItem('Token')}`}).then((res: any) => {
        // setdata3(res.projects.edges);
        console.log(res.projects.edges)
        let projectArr: any = []
        if (res.projects.edges.length > 0) {
          for (let k = 0; k < res.projects.edges.length; k++) {
            projectArr.push(res.projects.edges[k]?.node)
            console.log("data arr", projectArr);
            setdata3(projectArr)
          }
        }
        else {
          setdata3([])
        }
      })
    let sort = null
    if (projectorder != "" && projectsort != "") {
      if (projectorder == "asc") {
        sort = projectsort
      }
      else {
        sort = `-${projectsort}`
      }

      console.log("order query variable", sort, typeof (sort));
      request(`${BASEURL}graphql/`, projectOrder, { orderBy: sort }, {Authorization: `Bearer ${localStorage.getItem('Token')}`}).then((res: any) => {
        console.log("order res", res.projects)
        console.log(res.projects.edges)
        let dataArr: any = []
        if (res.projects.edges.length > 0) {
          for (let k = 0; k < res.projects.edges.length; k++) {
            dataArr.push(res.projects.edges[k]?.node)
            console.log("data arr", dataArr);
            setdata4(dataArr)
          }
        }
        else {
          setdata4([])
        }
      })
    }
    console.log('project name search value',projectSearchValue);
    
    setProName(projectSearchValue)
    let name=projectSearchValue
    if (name !== undefined) {
      console.log('i am inisde search loop');
      
      request(`${BASEURL}graphql/`, Project, { name: proname }, {Authorization: `Bearer ${localStorage.getItem('Token')}`}).then((res: any) => {
        console.log(res.projects.edges)
        let data3: any = []
        if (res.projects.edges.length > 0) {
          for (let k = 0; k < res.projects.edges.length; k++) {
            data3.push(res.projects.edges[k]?.node)
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

  // const reload = update ? fetchData() : null
  useEffect(() => {
    fetchData();
  }, [update, skip, first, projectorder, projectsort])

  useEffect(() => {
    request(`${BASEURL}graphql/`, AllProjects, {}, {Authorization: `Bearer ${localStorage.getItem('Token')}`}).then((res: any) => {
      console.log("response all", res.allProjects);
      setNext(res.allProjects)
    })
  }, [])



  console.log("data2---->", data2);
  console.log("searchvalue from projecrs",projectSearchValue)
  let data = null

  if (projectSearchValue == "" && projectorder == "" && projectsort == "") {
    data = data3
  }
  else if (projectSearchValue !== "" && data2.length !== 0) {
    data = data2
  }
  else if (projectorder !== "" && projectsort !== "") {
    data = data4
  }
  else {
    data = []
  }

  // const Pagination = (val: any) => {
  //   if (Math.sign(val) !== -1) { setSkip(val); }
  // }

  const totalPages = Math.ceil(next.length / first);
  console.log("totalpages", totalPages, first, next.length);
  const allDataLen = next.length

  const Pagination = (val: any) => {
    const newSkip = skip + val;
    if (newSkip >= 0 && newSkip < next.length) {
      setSkip(newSkip);
      const newPage = Math.ceil((newSkip + 1) / first);
      setCurrentPage(newPage);
      const newFrom = newSkip + 1;
      const newTo = Math.min(newSkip + first, next.length);
      setPageFirst(newFrom);
      setPageNext(newTo);
    } else if (newSkip >= next.length) {
      // Handle edge case when skip value exceeds total data length
      const lastPage = Math.ceil(next.length / first);
      const correctedSkip = (lastPage - 1) * first;
      setSkip(correctedSkip);
      const newFrom = correctedSkip + 1;
      const newTo = next.length;
      setPageFirst(newFrom);
      setPageNext(newTo);
      setCurrentPage(lastPage);
    }
  };

  const rowSize = (e: any) => {
    const newSize = Number(e.target.value);
    setFirst(newSize);
    setSkip(0); // Reset skip to the first page
    setCurrentPage(1); // Reset current page to 1
    setPageFirst(1); // Reset pageFirst
    setPageNext(Math.min(newSize, allDataLen)); // Reset pageNext
  };

  const columns = useMemo(() => usersColumns, [])
  console.log("Columns", columns)
  const { getTableProps, getTableBodyProps, headers, rows, prepareRow } = useTable({
    columns,
    data,
  })

  const Enable = currentPage === 1 ? "page-item disabled" : "page-item"
  const Disable = currentPage >= totalPages ? "page-item disabled" : "page-item"

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

  console.log("backgroundColor", backgroundColor);
  const tableHeader = themeColor1 != null ? `text-start fw-bolder gs-0 ${backgroundColor} bg-opacity-25` : 'text-start fw-bolder gs-0 bg-primary bg-opacity-25'


  return (
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
                  projectSearchValue === "" ||
                  item.original.projectName.toLowerCase().includes(projectSearchValue.toLowerCase())
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
        <p>{pageFirst}-{pageNext} of {allDataLen}</p>
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
      {/* <UsersListPagination /> */}
      {isLoading && <UsersListLoading />}
    </KTCardBody>
  )
}

export { UsersTable }
