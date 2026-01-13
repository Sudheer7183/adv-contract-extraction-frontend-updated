import React, { useEffect, useMemo, useState } from 'react'
import { useTable, ColumnInstance, Row } from 'react-table'
import { CustomHeaderColumn } from './columns/CustomHeaderColumn'
import { CustomRow } from './columns/CustomRow'
import { usersColumns } from './columns/_columns'
import { User } from '../core/_models'
import { KTCardBody } from '../../../../../../../_metronic/helpers'
import { request, gql } from 'graphql-request'
import _ from 'lodash'
import { useListView } from '../core/ListViewProvider'
import BASEURL from '../../../../../../config/baseurl'

const AllContractTypes = gql`
query {
  allContractTypes{
    id
    active
    contractTypeName
  }
}`
const all_contract_types = gql`
query allContractTypes($skip:Int!,$first:Int!){
  allContractTypes(skip:$skip,first:$first){
    id
    active
    contractTypeName
    usercontracttypedetail{
      edges{
        node{
          id
          fieldName
          fieldId
          originalPrompt
          currentPrompt
        }
      }
    }
  }
}`


const contract_types = gql`
query allContractTypes($name: String!){
  allContractTypes(search: $name){
    id
    active
    contractTypeName
    usercontracttypedetail{
      edges{
        node{
          id
          fieldName
          fieldId
          originalPrompt
          currentPrompt
        }
      }
    }
  }
}`

const contracttypeOrder = gql`
query allContractTypes($orderBy: [String!]){
  allContractTypes(orderBy: $orderBy){
    id
    active
    contractTypeName
    usercontracttypedetail{
      edges{
        node{
          id
          fieldName
          fieldId
          originalPrompt
          currentPrompt
        }
      }
    }
  }
}`


const ContractTypeTable = () => {
  const { contractSearchValue, contractorder, contractsort, update, setUpdate } = useListView()

  const columns = useMemo(() => usersColumns, [])
  const [data2, setdata2] = useState<any[]>([])
  const [data3, setdata3] = useState<any[]>([]);
  const [data4, setdata4] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [count, setCount] = useState(0);
  const [skip, setSkip] = useState(0);
  const [first, setFirst] = useState(5);
  const [pageFirst, setPageFirst] = useState(1)
  const [pageNext, setPageNext] = useState(5)
  const [cname, setCName] = useState(contractSearchValue)
  const [next, setNext] = useState<any[]>([]);

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

  const fetchData = () => {
    request(`${BASEURL}graphql/`,
      all_contract_types,
      { skip: skip, first: first },
      {Authorization: `Bearer ${localStorage.getItem('Token')}`}
    ).then((res: any) => {
      // Calculate the count value for each contract type and update the data
      const updatedData = res.allContractTypes.map((contractType: any) => ({
        ...contractType,
        count: contractType.usercontracttypedetail.edges.length, // Calculate the count value
      }));
      setdata3(updatedData);
    }
      // setdata3(res.allContractTypes)
    )

    let sort = null
    if (contractorder != "" && contractsort != "") {
      if (contractorder == "asc") {
        sort = contractsort
      }
      else {
        sort = `-${contractsort}`
      }

      request(`${BASEURL}graphql/`, contracttypeOrder, { orderBy: sort }, {Authorization: `Bearer ${localStorage.getItem('Token')}`})
        .then((res: any) => setdata4(res.allContractTypes))
    }
    setCName(contractSearchValue)

    if (cname !== undefined) {
      request(`${BASEURL}graphql/`, contract_types, { name: cname }, {Authorization: `Bearer ${localStorage.getItem('Token')}`})
        .then((res: any) => setdata2(res.allContractTypes))
    }
    setUpdate(false)
  }

  // const reload = update ? fetchData() : null
  useEffect(() => {
    fetchData();
  }, [update, skip, first, contractorder, contractsort])

  useEffect(() => {
    request(`${BASEURL}graphql/`, AllContractTypes, {}, {Authorization: `Bearer ${localStorage.getItem('Token')}`}).then((res: any) => {
      console.log("response all", res.allContractTypes);
      setNext(res.allContractTypes)
    })
  }, [])

  let data = null

  if (contractSearchValue == "" && contractorder == "" && contractsort == "") {
    data = data3
  }
  else if (contractSearchValue !== "" && data2.length !== 0) {
    data = data2
  }
  else if (contractorder !== "" && contractsort !== "") {
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
  const Enable = currentPage === 1 ? "page-item disabled" : "page-item "
  const Disable = currentPage >= totalPages ? "page-item disabled" : "page-item "

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
            <tbody className='text-gray-600 fw-bold' {...getTableBodyProps()}>
              {rows.length > 0 ? (
                (() => {
                  const filteredRows = rows.filter((item: any) =>
                    contractSearchValue === "" ||
                    item.original.contractTypeName.toLowerCase().includes(contractSearchValue.toLowerCase())
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
              {/* {rows.length > 0 ? (
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
              )} */}
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

export { ContractTypeTable }

