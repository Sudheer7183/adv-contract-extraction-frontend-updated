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

const ALL_BARCHART_FILES = gql`
query barchartFiles($value: String!, $barchart: String!, $classificationType: String!){
  barchartFiles(value: $value, barchart: $barchart, classificationType: $classificationType){
    edges{
      node{
        id
        fileName
        project{
          id
          projectName
        }
      }
    }
  }
}`

const BAR_CHART_FILES = gql`
query barchartFiles($value: String!, $barchart: String!, $classificationType: String!,$skip:Int!,$first:Int!){
  barchartFiles(value: $value, barchart: $barchart, classificationType: $classificationType,skip:$skip,first:$first){
    edges{
      node{
        id
        fileName
        project{
          id
          projectName
        }
        fileType
        fileStatus
        pages
        contractType{
          contractTypeName
        }
        lock
        lockedBy{
          username
        }
      }
    }
  }
}`

const barFileSearch = gql`
query barchartFiles($value: String!, $barchart: String!, $classificationType: String!, $name: String!){
  barchartFiles(value: $value, barchart: $barchart, classificationType: $classificationType, search: $name){
    edges{
      node{
        id
        fileName
        project{
          id
          projectName
        }
        fileType
        fileStatus
        pages
        contractType{
          contractTypeName
        }
        lock
        lockedBy{
          username
        }
      }
    }
  }
}`

const barFileOrder = gql`
query barchartFiles($value: String!, $barchart: String!, $classificationType: String!, $orderBy: [String!]){
  barchartFiles(value: $value, barchart: $barchart, classificationType: $classificationType, orderBy: $orderBy){
    edges{
      node{
        id
        fileName
        project{
          id
          projectName
        }
        fileType
        fileStatus
        pages
        contractType{
          contractTypeName
        }
        lock
        lockedBy{
          username
        }
      }
    }
  }
}`

const UsersTable = () => {
  const { label, chart, doctype } = useParams();

  const columns = useMemo(() => usersColumns, [])
  const { barfilesearchValue, barfilesort, barfileorder, setFileid, setFirst1, setSkip1, setVal, setChart, setDtype
  } = useListView()

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
    request(`${BASEURL}graphql/`, ALL_BARCHART_FILES, { value: label, barchart: chart, classificationType: doctype }, {Authorization: `Bearer ${localStorage.getItem('Token')}`}).then((res: any) => {
      console.log("response all", res.barchartFiles);
      let Arr: any = []
      if (res.barchartFiles.edges.length > 0) {
        for (let k = 0; k < res.barchartFiles.edges.length; k++) {
          Arr.push(res.barchartFiles.edges[k]?.node)
          setNext(Arr)
        }
      }
    })
  }, [])

  // const Pagination = (val: any) => {
  //   if (Math.sign(val) !== -1) { setSkip(val); }
  // }
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
    request(`${BASEURL}graphql/`, BAR_CHART_FILES,
      { value: label, barchart: chart, classificationType: doctype, skip: skip, first: first },
      {Authorization: `Bearer ${localStorage.getItem('Token')}`})
      .then((res: any) => {
        console.log(res.barchartFiles.edges)
        let fileArr: any = []
        if (res.barchartFiles.edges.length > 0) {
          for (let k = 0; k < res.barchartFiles.edges.length; k++) {
            fileArr.push(res.barchartFiles.edges[k]?.node)
            console.log("data arr", fileArr);
            setdata3(fileArr)
          }
        }
        else {
          setdata3([])
        }
      })
    setVal(label)
    setChart(chart)
    setDtype(doctype)
    setFirst1(first)
    setSkip1(skip)

  }, [skip, first]);

  useEffect(() => {
    console.log("user table sort value---->", barfileorder, barfilesort);
    let sort = null
    if (barfileorder != "" && barfilesort != "") {
      if (barfileorder == "asc") {
        sort = barfilesort
      }
      else {
        sort = `-${barfilesort}`
      }
      console.log("order query variable", sort, typeof (sort));
      request(`${BASEURL}graphql/`, barFileOrder, { value: label, barchart: chart, classificationType: doctype, orderBy: sort }, {Authorization: `Bearer ${localStorage.getItem('Token')}`}).then((res: any) => {
        console.log("order res", res.barchartFiles)
        console.log(res.barchartFiles.edges)
        let dataArr: any = []
        if (res.barchartFiles.edges.length > 0) {
          for (let k = 0; k < res.barchartFiles.edges.length; k++) {
            dataArr.push(res.barchartFiles.edges[k]?.node)
            console.log("data arr", dataArr);
            setdata4(dataArr)
          }
        }
        else {
          setdata4([])
        }
      })
    }
  }, [barfileorder, barfilesort])

  const [filename, setFileName] = useState(barfilesearchValue)

  useEffect(() => {
    setFileName(barfilesearchValue)
    console.log("file name search", filename);

    if (filename !== undefined) {
      request(`${BASEURL}graphql/`, barFileSearch, { value: label, barchart: chart, classificationType: doctype, name: filename }, {Authorization: `Bearer ${localStorage.getItem('Token')}`}).then((res: any) => {
        console.log("search result", res.barchartFiles.edges)
        let data3: any = []
        if (res.barchartFiles.edges.length > 0) {
          for (let k = 0; k < res.barchartFiles.edges.length; k++) {
            data3.push(res.barchartFiles.edges[k]?.node)
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

  if (barfilesearchValue == "" && barfileorder == "" && barfilesort == "") {
    data = data3
  }
  else if (barfilesearchValue !== "" && data2.length !== 0) {
    data = data2
  }
  else if (barfileorder !== "" && barfilesort !== "") {
    data = data4
  }
  else {
    data = []
  }


  const { getTableProps, getTableBodyProps, headers, rows, prepareRow } = useTable({
    columns,
    data,
  })
  console.log("rows->", rows);
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
                    barfilesearchValue === "" ||
                    item.original.fileName.toLowerCase().includes(barfilesearchValue.toLowerCase())
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

