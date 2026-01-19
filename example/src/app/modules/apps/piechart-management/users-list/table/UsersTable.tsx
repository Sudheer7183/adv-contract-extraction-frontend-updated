import React, { useEffect, useMemo, useState } from 'react'
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
import BASEURL from '../../../../../config/baseurl'

const ALL_PIECHART_FILES = gql`
query chartFiles($value: String!, $piechart: String!){
  chartFiles(value: $value, piechart: $piechart){
    edges{
      node{
        id
        project{
          id
          projectName
        }
      }
    }
  }
}`

const PIE_CHART_FILES = gql`
query chartFiles($value: String!, $piechart: String!,$skip:Int!,$first:Int!){
  chartFiles(value: $value, piechart: $piechart,skip:$skip,first:$first){
    edges{
      node{
        id
        project{
          id
          projectName
        }
        fileName
        fileType
        fileStatus
        contractType{
          contractTypeName
        }
        userContractType{
          contractTypeName
        }
        pages
        lock
        lockedBy{
          email
          username
        }
      }
    }
  }
}`

const pieFileSearch = gql`
query chartFiles($value: String!, $piechart: String!, $name: String!){
  chartFiles(value: $value, piechart: $piechart, search: $name){
    edges{
      node{
        id
        project{
          id
          projectName
        }
        fileName
        fileType
        fileStatus
        contractType{
          contractTypeName
        }
        userContractType{
          contractTypeName
        }
        pages
        lock
        lockedBy{
          email
          username
        }
      }
    }
  }
}`

const pieFileOrder = gql`
query chartFiles($value: String!, $piechart: String!, $orderBy: [String!]){
  chartFiles(value: $value, piechart: $piechart, orderBy: $orderBy){
    edges{
      node{
        id
        project{
          id
          projectName
        }
        fileName
        fileType
        fileStatus
        contractType{
          contractTypeName
        }
        userContractType{
          contractTypeName
        }
        pages
        lock
        lockedBy{
          email
          username
        }
      }
    }
  }
}`



const UsersTable = () => {
  const { label, chart } = useParams();
  const columns = useMemo(() => usersColumns, [])
  const { piefilesearchValue, piefilesort, piefileorder } = useListView()
  const [data2, setdata2] = useState<any[]>([])
  const [data3, setdata3] = useState<any[]>([]);
  const [data4, setdata4] = useState<any[]>([]);
  const [skip, setSkip] = useState(0);
  const [first, setFirst] = useState(5);
  const [pageFirst, setPageFirst] = useState(1)
  const [pageNext, setPageNext] = useState(5)
  const [currentPage, setCurrentPage] = useState(1);
  const [next, setNext] = useState<any[]>([]);

  useEffect(() => {
    request(`${BASEURL}graphql/`, ALL_PIECHART_FILES, { value: label, piechart: chart }, {Authorization: `Bearer ${localStorage.getItem('Token')}`}).then((res: any) => {
      console.log("response all", res.chartFiles);
      let Arr: any = []
      if (res.chartFiles.edges.length > 0) {
        for (let k = 0; k < res.chartFiles.edges.length; k++) {
          Arr.push(res.chartFiles.edges[k]?.node)
          setNext(Arr)
        }
      }
    })
  }, [])

  const totalPages = Math.ceil(next.length / first);
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

  useEffect(() => {
    request(`${BASEURL}graphql/`, PIE_CHART_FILES,
      { value: label, piechart: chart, skip: skip, first: first },
      {Authorization: `Bearer ${localStorage.getItem('Token')}`})
      .then((res: any) => {
        console.log(res.chartFiles.edges)
        let fileArr: any = []
        if (res.chartFiles.edges.length > 0) {
          for (let k = 0; k < res.chartFiles.edges.length; k++) {
            fileArr.push(res.chartFiles.edges[k]?.node)
            console.log("data arr", fileArr);
            setdata3(fileArr)
          }
        }
        else {
          setdata3([])
        }
      })
  }, [skip, first]);
  useEffect(() => {
    console.log("user table sort value---->", piefileorder, piefilesort);
    let sort = null
    if (piefileorder != "" && piefilesort != "") {
      if (piefileorder == "asc") {
        sort = piefilesort
      }
      else {
        sort = `-${piefilesort}`
      }
      console.log("order query variable", sort, typeof (sort));
      request(`${BASEURL}graphql/`, pieFileOrder, { value: label, piechart: chart, orderBy: sort }, {Authorization: `Bearer ${localStorage.getItem('Token')}`}).then((res: any) => {
        console.log("order res", res.chartFiles)
        console.log(res.chartFiles.edges)
        let dataArr: any = []
        if (res.chartFiles.edges.length > 0) {
          for (let k = 0; k < res.chartFiles.edges.length; k++) {
            dataArr.push(res.chartFiles.edges[k]?.node)
            console.log("data arr", dataArr);
            setdata4(dataArr)
          }
        }
        else {
          setdata4([])
        }
      })
    }
  }, [piefileorder, piefilesort])

  const [filename, setFileName] = useState(piefilesearchValue)

  useEffect(() => {
    setFileName(piefilesearchValue)
    console.log("file name search", filename);

    if (filename !== undefined) {
      request(`${BASEURL}graphql/`, pieFileSearch, { value: label, piechart: chart, name: filename }, {Authorization: `Bearer ${localStorage.getItem('Token')}`}).then((res: any) => {
        console.log("search result", res.chartFiles.edges)
        let data3: any = []
        if (res.chartFiles.edges.length > 0) {
          for (let k = 0; k < res.chartFiles.edges.length; k++) {
            data3.push(res.chartFiles.edges[k]?.node)
            console.log("data arr", data3);
            setdata2(data3)
          }
        }
        else {
          setdata2([])
        }

      })
    }
  }, [])

  let data = null

  if (piefilesearchValue == "" && piefileorder == "" && piefilesort == "") {
    data = data3
  }
  else if (piefilesearchValue !== "" && data2.length !== 0) {
    data = data2
  }
  else if (piefileorder !== "" && piefilesort !== "") {
    data = data4
  }
  else {
    data = []
  }


  console.log("Columns", columns)
  const { getTableProps, getTableBodyProps, headers, rows, prepareRow } = useTable({
    columns,
    data,
  })
  console.log("rows->", rows);

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
                    piefilesearchValue === "" ||
                    item.original.fileName.toLowerCase().includes(piefilesearchValue.toLowerCase())
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
        {/* <UsersListPagination data={data} /> */}
        {/* {isLoading && <UsersListLoading />} */}
      </KTCardBody>
    </>
  )
}


export { UsersTable }
