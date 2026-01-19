import React, { useEffect, useMemo, useState } from 'react'
import { useTable } from 'react-table'
import { useQueryResponseLoading } from '../core/QueryResponseProvider'
import { usersColumns } from './columns/_columns'
import { request, gql } from 'graphql-request'
import ContractType from './contractType/ContractType'
import Catalog from './catalogType/CatalogType'
import BASEURL from '../../../../../config/baseurl'
// import { useQuery } from '@tanstack/react-query'

const allProject = gql`
query {
  allProjects {
    id
    projectName
    active
    projectId
    description
    totalFiles
    classificationFile {
      id
      jsonFile
    }
  }
}
`
const catalog_files = gql`
query{
  allCatalogfiles{
    id
    catalogName
    active
    catalogdetail{
      id
      userContractTypeMaster{
        id
        contractTypeName
        active
        usercontracttypedetail{
          id
          fieldId
          fieldName
        }
      }
    }
  }
}`

console.log("catalog", catalog_files);

const UsersTable = () => {
  const [data1, setdata1] = useState([])
  const isLoading = useQueryResponseLoading()
  const [show, setShow] = useState(false);
  console.log("setShow->", show);

  useEffect(() => {
    request(`${BASEURL}graphql/`, catalog_files, {}, {Authorization: `Bearer ${localStorage.getItem('Token')}`}).then((res: any) => setdata1(res.allCatalogfiles))
  }, [])

  const columns = useMemo(() => usersColumns, [])
  console.log("Columns", columns)

  const data = data1
  console.log("data", data)

  const { getTableProps, getTableBodyProps, headers, rows, prepareRow } = useTable({
    columns,
    data,
  })
  console.log("rowdata", rows)

  return (
    <>
      <div>
        <ul className="nav nav-tabs nav-line-tabs mb-5 fs-6">
          <li className="nav-item">
            <a className="nav-link active" data-bs-toggle="tab" href="#kt_tab_pane_7"
            // onClick={() => setShow(!show)} style={{ backgroundColor: show ? "none" : "white", padding: !show ? " 5px  100px" : "0px", border: show ? " 1px solid red" : "none", borderRadius: show ? "50px" : "none" }}
            >Catalog</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" data-bs-toggle="tab" href="#kt_tab_pane_8"
            // onClick={() => setShow(!show)} style={{ backgroundColor: !show ? "none" : "white", padding: !show ? " 5px  100px" : "none", border: !show ? " 1px solid red" : "none", borderRadius: !show ? "50px" : "none" }}
            >Contract Type</a>
          </li>
          {/* <li className="nav-item">
            <a className="nav-link" data-bs-toggle="tab" href="#kt_tab_pane_9">Link 3</a>
          </li>
          <li className="nav-item dropdown">
            <a className="nav-link dropdown-toggle" data-bs-toggle="dropdown" href="#" role="button" aria-expanded="false">Dropdown</a>
            <ul className="dropdown-menu">
              <li><a className="nav-link dropdown-item" data-bs-toggle="tab" href="#kt_tab_pane_10">Action</a></li>
            </ul>
          </li> */}
        </ul>
      </div>
      <div className="tab-content" id="myTabContent">
        <div className="tab-pane fade show active" id="kt_tab_pane_7" role="tabpanel">
          <Catalog />
        </div>
        <div className="tab-pane fade" id="kt_tab_pane_8" role="tabpanel">
          <ContractType />
        </div>
      </div>
      {/* <div style={{ paddingTop: "90px", color: 'white'}}>
        <div style={{ display: "flex", justifyContent: "space-around" }} className="tabStyle">
          <div onClick={() => setShow(!show)} style={{ backgroundColor: show ? "none" : "blue", padding: !show ? " 5px  100px" : "0px", border: show ? " 1px solid red" : "none", borderRadius: show ? "50px" : "none" }}>
            Catalog
          </div>
          <div onClick={() => setShow(!show)} style={{ backgroundColor: !show ? "none" : "blue", padding: !show ? " 5px  100px" : "none", border: !show ? " 1px solid red" : "none", borderRadius: !show ? "50px" : "none" }}>
            Contract
          </div>
          <div onClick={() => setShow(!show)} className={show ? "tabActive" : "tabNormal"}>
            Catalog
          </div>
          <div onClick={() => setShow(!show)} className={show ? "tabNormal" : "tabInActive"}>
            Contract
          </div>
        </div>
        <div style={{ display: !show ? "block" : "none", marginTop: "-50px" }}>
          <ContractType />
        </div>
        <div style={{ display: show ? "block" : "none", marginTop: "-50px" }}>
          <Catalog /> 
        </div>
      </div> */}
      {/* <KTCardBody className='py-4'>
      <ul className="nav nav-tabs nav-line-tabs mb-5 fs-6">
      <li className="nav-item">
        <a className="nav-link active" data-bs-toggle="tab" href="#kt_tab_pane_7">Catalog Type</a>
      </li>
      <li className="nav-item">
        <a className="nav-link" data-bs-toggle="tab" href="#kt_tab_pane_8">Contract Type</a>
      </li>
      <li className="nav-item">
        <a className="nav-link" data-bs-toggle="tab" href="#kt_tab_pane_9">Link 3</a>
      </li>
      <li className="nav-item dropdown">
        <a className="nav-link dropdown-toggle" data-bs-toggle="dropdown" href="#" role="button" aria-expanded="false">Dropdown</a>
        <ul className="dropdown-menu">
          <li><a className="nav-link dropdown-item" data-bs-toggle="tab" href="#kt_tab_pane_10">Action</a></li>
        </ul>
      </li>
    </ul>

      <div className="tab-content" id="myTabContent">
      <div className="tab-pane fade show active" id="kt_tab_pane_7" role="tabpanel">
        <div className='table-responsive'>
          <table
            id='kt_table_users'
            className='table align-middle table-row-dashed fs-6 gy-5 dataTable no-footer'
            {...getTableProps()}
          >
            <thead>
              <tr className='text-start text-muted fw-bolder fs-7 text-uppercase gs-0'>
                {headers.map((column: ColumnInstance<User>) => (
                  <CustomHeaderColumn key={column.id} column={column} />
                ))}
              </tr>
            </thead>
            <tbody className='text-gray-600 fw-bold' {...getTableBodyProps()}>
              <a
            href='/project-management/documents'
            className='btn btn-light btn-active-light-primary btn-sm'
            data-kt-menu-trigger='click'
            data-kt-menu-placement='bottom-end'
          >
            Actions
            <KTIcon className='fs-5 m-0' iconName={'btn'} />
          </a>
              {rows.length > 0 ? (
                rows.map((row: Row<User>, i) => {
                  prepareRow(row)
                  // console.log("row", row)
                  return <CustomRow row={row} key={`row-${i}-${row.id}`} />
                  // return <a href="#"><CustomRow row={row} key={`row-${i}-${row.id}`} /></a>
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
      </div>
      <div className="tab-pane fade" id="kt_tab_pane_8" role="tabpanel">
        <div className='table-responsive'>
          <table
            id='kt_table_users'
            className='table align-middle table-row-dashed fs-6 gy-5 dataTable no-footer'
            {...getTableProps()}
          >
            <thead>
              <tr className='text-start text-muted fw-bolder fs-7 text-uppercase gs-0'>
                {headers.map((column: ColumnInstance<User>) => (
                  <CustomHeaderColumn key={column.id} column={column} />
                ))}
              </tr>
            </thead>
            <tbody className='text-gray-600 fw-bold' {...getTableBodyProps()}>
              <a
            href='/project-management/documents'
            className='btn btn-light btn-active-light-primary btn-sm'
            data-kt-menu-trigger='click'
            data-kt-menu-placement='bottom-end'
          >
            Actions
            <KTIcon className='fs-5 m-0' iconName={'btn'} />
          </a>
              {rows.length > 0 ? (
                rows.map((row: Row<User>, i) => {
                  prepareRow(row)
                  console.log("row", row)
                  return <CustomRow row={row} key={`row-${i}-${row.original}`} />
                  // return <a href="#"><CustomRow row={row} key={`row-${i}-${row.id}`} /></a>
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
      </div>
    </div>



      <div className='table-responsive'>
      <table
        id='kt_table_users'
        className='table align-middle table-row-dashed fs-6 gy-5 dataTable no-footer'
        {...getTableProps()}
      >
        <thead>
          <tr className='text-start text-muted fw-bolder fs-7 text-uppercase gs-0'>
            {headers.map((column: ColumnInstance<User>) => (
              <CustomHeaderColumn key={column.id} column={column} />
            ))}
          </tr>
        </thead>
        <tbody className='text-gray-600 fw-bold' {...getTableBodyProps()}>
          <a
            href='/project-management/documents'
            className='btn btn-light btn-active-light-primary btn-sm'
            data-kt-menu-trigger='click'
            data-kt-menu-placement='bottom-end'
          >
            Actions
            <KTIcon className='fs-5 m-0' iconName={'btn'} />
          </a>
          {rows.length > 0 ? (
            rows.map((row: Row<User>, i) => {
              prepareRow(row)
              // console.log("row", row)
              return <CustomRow row={row} key={`row-${i}-${row.id}`} />
              // return <a href="#"><CustomRow row={row} key={`row-${i}-${row.id}`} /></a>
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
      <UsersListPagination />
    {isLoading && <UsersListLoading />}
    </KTCardBody> */}
    </>
  )
}

export { UsersTable }
