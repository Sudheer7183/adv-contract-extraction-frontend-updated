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
// import { useQuery } from '@tanstack/react-query'
// import { useQuery } from '@tanstack/react-query'
import { request, gql } from 'graphql-request'
import { useAuth } from '../../../../auth'
import { useListView } from '../core/ListViewProvider'
import _ from 'lodash'
import BASEURL from '../../../../../config/baseurl'

const allNotification = gql`
query{
  getNotifications{
    id
    title
    message
    ruleType
    isRead
    createdAt
    filename
    repository{
      id
      ExpireyDate
      documentName
    }
  }
}`


const UsersTable = () => {
  const [data2, setdata2] = useState<any[]>([])
  const [data3, setdata3] = useState<any[]>([]);
  const [data4, setdata4] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const { searchValue, usersort, userorder, setUpdate, update } = useListView()
  const isLoading = useQueryResponseLoading()
  const [skip, setSkip] = useState(0);
  const [first, setFirst] = useState(5);
  const [pageFirst, setPageFirst] = useState(1)
  const [pageNext, setPageNext] = useState(5)
  const [next, setNext] = useState<any[]>([]);

  const [userEmail, setUserEmail] = useState(searchValue)

  const fetchData = () => {
    request(`${BASEURL}graphql/`, allNotification, { }, {Authorization: `Bearer ${localStorage.getItem('Token')}`}).then((res: any) => {
      console.log(res.getNotifications)
      let userArr: any = []
      if (res.getNotifications.length > 0) {
        for (let k = 0; k < res.getNotifications.length; k++) {
          userArr.push(res.getNotifications[k])
          console.log("data arr", userArr);
          setdata3(userArr)
        }
      }
      else {
        setdata3([])
      }
    })
    let sort = null
    // if (userorder != "" && usersort != "") {
    //   if (userorder == "asc") {
    //     sort = usersort
    //   }
    //   else {
    //     sort = `-${usersort}`
    //   }
    //   console.log("order query variable", sort, typeof (sort));
    //   request(`${BASEURL}graphql/`, userOrder, { orderBy: sort }, {Authorization: `Bearer ${localStorage.getItem('Token')}`}).then((res: any) => {
    //     console.log("order res", res.user)
    //     console.log(res.user.edges)
    //     let dataArr: any = []
    //     if (res.user.edges.length > 0) {
    //       for (let k = 0; k < res.user.edges.length; k++) {
    //         dataArr.push(res.user.edges[k]?.node)
    //         console.log("data arr", dataArr);
    //         setdata4(dataArr)
    //       }
    //     }
    //     else {
    //       setdata4([])
    //     }
    //   })
    // }
    setUserEmail(searchValue)
    // if (userEmail !== undefined) {
    //   request(`${BASEURL}graphql/`, USER, { email: userEmail }, {Authorization: `Bearer ${localStorage.getItem('Token')}`}).then((res: any) => {
    //     console.log(res.userDetail.edges)
    //     let data3: any = []
    //     if (res.userDetail.edges.length > 0) {
    //       for (let k = 0; k < res.userDetail.edges.length; k++) {
    //         data3.push(res.userDetail.edges[k]?.node)
    //         console.log("data arr", data3);
    //         setdata2(data3)
    //       }
    //     }
    //     else {
    //       setdata2([])
    //     }

    //   })
    // }
    setUpdate(false)
  }

  // const reload = update ? fetchData() : null
  useEffect(() => {
    fetchData();
  }, [update, userorder, usersort, skip, first])

  useEffect(() => {
    request(`${BASEURL}graphql/`, allNotification, {}, {Authorization: `Bearer ${localStorage.getItem('Token')}`}).then((res: any) => {
      console.log("response all", res.getNotifications);
      let userArr: any = []
      if (res.getNotifications.length > 0) {
        for (let k = 0; k < res.getNotifications.length; k++) {
          userArr.push(res.getNotifications[k])
          console.log("data arr", userArr);
          // setdata3(userArr)
          setNext(userArr)
        }
      }
    })
  }, [])


  // const Pagination = (val: any) => {
  //   if (Math.sign(val) !== -1) { setSkip(val); }
  // }

  const totalPages = Math.ceil(next.length / first);
  const allDataLen = next.length
  console.log("totalpages", totalPages, first, next.length);

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

  console.log("data2---->", data2);
  console.log("data4---->", data4);

  let data = null

  if (searchValue == "" && userorder == "" && usersort == "") {
    data = data3
  }
  else if (searchValue !== "" && data2.length !== 0) {
    data = data2
  }
  else if (userorder !== "" && usersort !== "") {
    data = data4
  }
  else {
    data = []
  }

  const Enable = currentPage === 1 ? "page-item disabled" : "page-item "
  const Disable = currentPage >= totalPages ? "page-item disabled" : "page-item "

  console.log("UserData", data)
  const columns = useMemo(() => usersColumns, [])
  console.log("Columns", columns)
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
                  searchValue === "" ||
                  item.original.email.toLowerCase().includes(searchValue.toLowerCase())
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
