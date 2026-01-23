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
import { useNavigate } from 'react-router-dom'
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
  const navigate = useNavigate()
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
  const [viewMode, setViewMode] = useState<'card' | 'table'>('table');
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

  // Theme color functions
  const getCardGradient = () => {
    const defaultGradient = 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)';
    
    if (!backgroundColor && !themeColor1) {
      return defaultGradient;
    }
    
    const gradientMap: any = {
      'bg-primary': 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
      'bg-success': 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
      'bg-danger': 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
      'bg-warning': 'linear-gradient(135deg, #eab308 0%, #ca8a04 100%)',
      'bg-info': 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
      'bg-dark': 'linear-gradient(135deg, #374151 0%, #1f2937 100%)',
      'bg-secondary': 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)',
    };
    
    return gradientMap[backgroundColor] || defaultGradient;
  };

  const getStatusColor = (status: string) => {
    const statusMap: any = {
      'Being Reviewed': 'badge-light-primary',
      'Review Completed': 'badge-light-success',
      'Pending': 'badge-light-warning',
      'Processing': 'badge-light-info',
    };
    return statusMap[status] || 'badge-light-secondary';
  };

  const handleDocumentClick = (documentId: string) => {
    // Navigate to viewer or document detail page
    navigate(`/viewer-management/viewer/${id}/${documentId}`);
  };

  const filteredRows = rows.filter((item: any) =>
    filesearchValue === "" ||
    item.original.fileName?.toLowerCase().includes(filesearchValue.toLowerCase())
  );

  return (
    <>
      <KTCardBody className='py-4'>
        {/* View Toggle Buttons with Theme Color */}
        <div className='mb-4 d-flex justify-content-end'>
          <div 
            className='btn-group' 
            role='group'
            style={{
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.08)',
              borderRadius: '10px',
              overflow: 'hidden',
              border: '1px solid #e5e7eb'
            }}
          >
            <button
              type='button'
              className={`btn btn-sm ${viewMode === 'card' ? (backgroundColor || 'btn-primary') : 'btn-light'}`}
              onClick={() => setViewMode('card')}
              style={{
                padding: '10px 20px',
                fontSize: '14px',
                fontWeight: viewMode === 'card' ? '600' : '500',
                transition: 'all 0.2s ease',
                border: 'none',
                borderRight: '1px solid #e5e7eb',
                color: viewMode === 'card' ? 'white' : '#6b7280'
              }}
            >
              <i className='bi bi-grid-3x3-gap-fill me-2'></i>
              Card View
            </button>
            <button
              type='button'
              className={`btn btn-sm ${viewMode === 'table' ? (backgroundColor || 'btn-primary') : 'btn-light'}`}
              onClick={() => setViewMode('table')}
              style={{
                padding: '10px 20px',
                fontSize: '14px',
                fontWeight: viewMode === 'table' ? '600' : '500',
                transition: 'all 0.2s ease',
                border: 'none',
                color: viewMode === 'table' ? 'white' : '#6b7280'
              }}
            >
              <i className='bi bi-table me-2'></i>
              Table View
            </button>
          </div>
        </div>

        {/* Card View */}
        {viewMode === 'card' && (
          <div className='row g-6 mb-8'>
            {filteredRows.length > 0 ? (
              filteredRows.map((row: Row<User>, i) => {
                prepareRow(row);
                const document = row.original as any;
                const cardGradient = getCardGradient();
                
                return (
                  <div key={`card-${i}-${row.id}`} className='col-md-6 col-lg-4'>
                    <div 
                      className='card h-100 shadow-sm border-0 hover-shadow-lg transition-all'
                      style={{
                        transition: 'all 0.3s ease',
                        cursor: 'pointer',
                        borderRadius: '12px'
                      }}
                      onClick={() => handleDocumentClick(document.id)}
                    >
                      {/* Card Header with Theme Gradient */}
                      <div 
                        className='card-header border-0 pt-5 pb-5'
                        style={{
                          background: cardGradient,
                          position: 'relative',
                          overflow: 'hidden',
                          minHeight: '100px',
                          color: 'white',
                          borderTopLeftRadius: '12px',
                          borderTopRightRadius: '12px'
                        }}
                      >
                        <div 
                          className='card-hover-overlay'
                          style={{
                            position: 'absolute',
                            inset: 0,
                            background: 'rgba(0,0,0,0.05)',
                            opacity: 0,
                            transition: 'opacity 0.3s',
                            pointerEvents: 'none'
                          }}
                        ></div>
                        
                        <div className='d-flex align-items-start position-relative' style={{ zIndex: 2 }}>
                          <div 
                            className='d-flex align-items-center justify-content-center rounded-3' 
                            style={{
                              width: '48px',
                              height: '48px',
                              background: 'rgba(255,255,255,0.2)',
                              backdropFilter: 'blur(10px)',
                              marginRight: '12px',
                              flexShrink: 0
                            }}
                          >
                            <i className='bi bi-file-earmark-text fs-2' style={{ color: 'white' }}></i>
                          </div>
                          
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <h3 
                              className='fw-bold mb-1' 
                              style={{ 
                                fontSize: '15px',
                                color: 'white',
                                fontWeight: '600',
                                margin: 0,
                                marginBottom: '4px',
                                wordBreak: 'break-word',
                                lineHeight: '1.4'
                              }}
                              title={document.fileName}
                            >
                              {document.fileName || 'Untitled Document'}
                            </h3>
                            <p 
                              className='mb-0 small' 
                              style={{ 
                                color: 'rgba(255,255,255,0.8)',
                                fontSize: '12px',
                                margin: 0
                              }}
                            >
                              {document.fileType || 'Document'}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Card Body */}
                      <div className='card-body pt-4'>
                        {/* Contract Type */}
                        <div className='mb-3'>
                          <div className='d-flex align-items-center gap-2 mb-2'>
                            <i className='bi bi-bookmark fs-6 text-gray-600'></i>
                            <span className='small text-gray-600'>Contract Type</span>
                          </div>
                          <span className='fw-semibold text-gray-900'>
                            {document.userContractType?.contractTypeName || 'Not Assigned'}
                          </span>
                        </div>

                        {/* Document Info */}
                        <div className='d-flex align-items-center justify-content-between mb-3'>
                          <div className='d-flex align-items-center gap-2'>
                            <i className='bi bi-file-text text-gray-400'></i>
                            <span className='small text-gray-600'>{document.pages || 0} pages</span>
                          </div>
                          <div className='d-flex align-items-center gap-2'>
                            <i className='bi bi-globe text-gray-400'></i>
                            <span className='small text-gray-600'>{document.language || 'N/A'}</span>
                          </div>
                        </div>

                        {/* Status */}
                        <div className='d-flex align-items-center justify-content-between pt-3 border-top border-gray-200'>
                          <span className={`badge ${getStatusColor(document.fileStatus)}`}>
                            {document.fileStatus || 'Pending'}
                          </span>
                          {document.lock && (
                            <span className='badge badge-light-danger' title={`Locked by ${document.lockedBy?.username}`}>
                              <i className='bi bi-lock-fill me-1'></i>
                              Locked
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className='col-12'>
                <div className='card shadow-sm border-0'>
                  <div className='card-body text-center py-12'>
                    <div className='d-flex align-items-center justify-content-center mb-4' style={{
                      width: '80px',
                      height: '80px',
                      background: '#f8f9fa',
                      borderRadius: '50%',
                      margin: '0 auto'
                    }}>
                      <i className='bi bi-file-earmark-text text-gray-400 fs-2x'></i>
                    </div>
                    <h3 className='fw-bold text-gray-900 mb-2'>No documents found</h3>
                    <p className='text-gray-600 mb-0'>
                      {filesearchValue ? 'No matching documents found' : 'Upload documents to get started'}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Table View (Original) */}
        {viewMode === 'table' && (
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
        )}

        {/* Pagination */}
        <div className="float-start">
        </div>
        <div className="float-end">
          <div className='pagination'>
            <div className="float-end">
              <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePage} />
            </div>
          </div>
        </div>

        {isLoading && <UsersListLoading />}
        
        <style jsx>{`
          .hover-shadow-lg:hover {
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04) !important;
            transform: translateY(-4px);
          }
          
          .transition-all {
            transition: all 0.3s ease;
          }
          
          .card:hover .card-hover-overlay {
            opacity: 1 !important;
          }
          
          .card-header h3,
          .card-header p,
          .card-header i {
            color: white !important;
          }
        `}</style>
      </KTCardBody>
    </>
  )
}

export { UsersTable }