import React, { useEffect, useMemo, useState } from 'react'
import { useTable, ColumnInstance, Row } from 'react-table'
import { CustomHeaderColumn } from '../table/columns/CustomHeaderColumn'
import { CustomRow } from '../table/columns/CustomRow'
import { useQueryResponseLoading } from '../core/QueryResponseProvider'
import { User } from '../core/_models'
import { UsersListLoading } from '../components/loading/UsersListLoading'
import { KTCardBody } from '../../../../../../_metronic/helpers'
import { request, gql } from 'graphql-request'
import { reviewusersColumns } from './columns/_reviewcolumns'
import { useAuth } from '../../../../auth'
import { useListView } from '../core/ListViewProvider'
import BASEURL from '../../../../../config/baseurl'


const all_assignedProject = gql`
query assignProjectUserid($id: String!){
  assignProjectUserid(id: $id){
    edges{
      node{
        id
        project{
          id
          projectName
          totalFiles
        }
        file{
          id
          fileName
        }
      }
    }  
  }
}`

const assignedProject = gql`
query assignProjectUserid($id: String!, $skip:Int!,$first:Int!){
  assignProjectUserid(id: $id, skip:$skip,first:$first){
    edges{
      node{
        id
        project{
          id
          projectName
          totalFiles
        }
      }
    }  
  }
}`

const projectOrder = gql`
query assignProjectUserid($id: String!, $orderBy: [String!]){
  assignProjectUserid(id: $id, orderBy: $orderBy){
    edges{
      node{
        id
        project{
          id
          projectName
          totalFiles
        }
      }
    }
  }
}`

const Project = gql`
query assignProjectUserid($id: String!, $searchValue: String!) {
  assignProjectUserid(id: $id, searchValue: $searchValue) {
    edges {
      node {
        id
        project{
          id
          projectName
          totalFiles
        }
      }
    }
  }
}`

const ModernReviewTable = () => {
  const [data2, setdata2] = useState<any[]>([])
  const [data3, setdata3] = useState<any[]>([]);
  const [data4, setdata4] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [next, setNext] = useState<any[]>([]);
  const { projectSearchValue, projectorder, projectsort } = useListView()
  const [skip, setSkip] = useState(0);
  const [first, setFirst] = useState(5);
  const [proname, setProName] = useState(projectSearchValue)
  const isLoading = useQueryResponseLoading()
  const { currentUser } = useAuth()

  const userId = currentUser?.id

  const fetchData = () => {
    console.log("User id", currentUser?.id);
    request(`${BASEURL}graphql/`, assignedProject, { id: userId, skip: skip, first: first }, {Authorization: `Bearer ${localStorage.getItem('Token')}`}).then((res: any) => {
      console.log(res.assignProjectUserid.edges)
      let projectArr: any = []
      if (res.assignProjectUserid.edges.length > 0) {
        for (let k = 0; k < res.assignProjectUserid.edges.length; k++) {
          projectArr.push(res.assignProjectUserid.edges[k]?.node.project)
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
      request(`${BASEURL}graphql/`, projectOrder, { id: userId, orderBy: sort }, {Authorization: `Bearer ${localStorage.getItem('Token')}`}).then((res: any) => {
        let dataArr: any = []
        if (res.assignProjectUserid.edges.length > 0) {
          for (let k = 0; k < res.assignProjectUserid.edges.length; k++) {
            dataArr.push(res.assignProjectUserid.edges[k]?.node.project)
            console.log("data arr", dataArr);
            setdata4(dataArr)
          }
        }
        else {
          setdata4([])
        }
      })
    }

    setProName(projectSearchValue)
    if (proname !== undefined) {
      request(`${BASEURL}graphql/`, Project, { id: userId, searchValue: proname }, {Authorization: `Bearer ${localStorage.getItem('Token')}`}).then((res: any) => {
        console.log(res.assignProjectUserid.edges)
        let data3: any = []
        if (res.assignProjectUserid.edges.length > 0) {
          for (let k = 0; k < res.assignProjectUserid.edges.length; k++) {
            data3.push(res.assignProjectUserid.edges[k]?.node.project)
            console.log("data arr", data3);
            setdata2(data3)
          }
        }
        else {
          setdata2([])
        }

      })
    }
  }

  useEffect(() => {
    fetchData();
  }, [userId, skip, first, projectorder, projectsort, projectSearchValue])

  useEffect(() => {
    request(`${BASEURL}graphql/`, all_assignedProject, { id: userId }, {Authorization: `Bearer ${localStorage.getItem('Token')}`}).then((res: any) => {
      console.log("response all", res.assignProjectUserid);
      let Arr: any = []
      if (res.assignProjectUserid.edges.length > 0) {
        for (let k = 0; k < res.assignProjectUserid.edges.length; k++) {
          const project = res.assignProjectUserid.edges[k]?.node.project
          const file = res.assignProjectUserid.edges[k]?.node.file
          if (file && project) {
            Arr.push(project);
          }
          // Arr.push(res.assignProjectUserid.edges[k]?.node.project)
          setNext(Arr)
        }
      }
    })
  }, [userId])

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

  console.log("assignedProject-->", data, next)

  const projectNameCountMap = new Map();

  next.forEach((item) => {
    const { id, projectName } = item;
    if (projectNameCountMap.has(id)) {
      projectNameCountMap.set(id, {
        projectName,
        count: projectNameCountMap.get(id).count + 1,
      });
    } else {
      projectNameCountMap.set(id, {
        projectName,
        count: 1,
      });
    }
  });

  // Create an array from the map for the table
  const tableData = Array.from(projectNameCountMap).map(([id, { projectName, count }], index) => ({
    id: id,
    projectName,
    count,
  }));

  console.log("assignedProject---->", tableData)
  const totalPages = Math.ceil(tableData.length / first);

  const Pagination = (val: any) => {
    const newSkip = skip + val;
    if (newSkip >= 0 && newSkip < tableData.length) {
      setSkip(newSkip);
      const newPage = Math.ceil((newSkip + 1) / first);
      setCurrentPage(newPage);
    }
  };

  const rowSize = (e: any) => {
    setFirst(Number(e.target.value));
  }

  const columns = useMemo(() => reviewusersColumns, [])
  console.log("Columns", columns)
  const { getTableProps, getTableBodyProps, headers, rows, prepareRow } = useTable({
    columns,
    data: tableData,
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
      {/* <UsersListPagination /> */}
      {isLoading && <UsersListLoading />}
    </KTCardBody>
  )
}

export { ModernReviewTable }
