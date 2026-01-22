// import React, { useEffect, useMemo, useState } from 'react';
// import { useTable, ColumnInstance, Row } from 'react-table';
// import { CustomHeaderColumn } from './columns/CustomHeaderColumn';
// import { CustomRow } from './columns/CustomRow';
// import { useQueryResponseLoading } from '../core/QueryResponseProvider';
// import { usersColumns } from './columns/_columns';
// import { User } from '../core/_models';
// import { UsersListLoading } from '../components/loading/UsersListLoading';
// import { useListView } from '../core/ListViewProvider';
// import { request, gql } from 'graphql-request';
// import BASEURL from '../../../../../config/baseurl';
// import {
//   ModernTable,
//   ModernTableHeader,
//   ModernTableBody,
//   ModernTableRow,
//   ModernTableCell,
//   ModernTableHeaderCell,
// } from '../../../../../components/modern-ui';
// import './ModernUsersTable.scss';

// const AllProjects = gql`
//   query {
//     allProjects {
//       id
//       projectId
//       projectName
//       active
//       description
//     }
//   }
// `;

// const allProject = gql`
//   query Projects($skip: Int!, $first: Int!) {
//     projects(skip: $skip, first: $first) {
//       edges {
//         node {
//           id
//           projectName
//           active
//           projectId
//           description
//           totalFiles
//         }
//       }
//     }
//   }
// `;

// const Project = gql`
//   query Project($name: String!) {
//     projects(searchValue: $name) {
//       edges {
//         node {
//           id
//           projectName
//           description
//           totalFiles
//           active
//         }
//       }
//     }
//   }
// `;

// const projectOrder = gql`
//   query Project($orderBy: [String!]) {
//     projects(orderBy: $orderBy) {
//       edges {
//         node {
//           id
//           projectName
//           totalFiles
//           description
//           active
//         }
//       }
//     }
//   }
// `;

// const ModernUsersTable = () => {
//   const [data2, setdata2] = useState<any[]>([]);
//   const [data3, setdata3] = useState<any[]>([]);
//   const [data4, setdata4] = useState<any[]>([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const { projectSearchValue, projectorder, projectsort, setUpdate, update } = useListView();
//   const isLoading = useQueryResponseLoading();
//   const [skip, setSkip] = useState(0);
//   const [first, setFirst] = useState(10);
//   const [proname, setProName] = useState(projectSearchValue);
//   const [next, setNext] = useState<any[]>([]);
//   const [pageFirst, setPageFirst] = useState(1);
//   const [pageNext, setPageNext] = useState(10);

//   const fetchData = () => {
//     request(
//       `${BASEURL}graphql/`,
//       allProject,
//       { skip: skip, first: first },
//       { Authorization: `Bearer ${localStorage.getItem('Token')}` }
//     ).then((res: any) => {
//       let projectArr: any = [];
//       if (res.projects.edges.length > 0) {
//         for (let k = 0; k < res.projects.edges.length; k++) {
//           projectArr.push(res.projects.edges[k]?.node);
//         }
//         setdata3(projectArr);
//       } else {
//         setdata3([]);
//       }
//     });

//     let sort = null;
//     if (projectorder != '' && projectsort != '') {
//       if (projectorder == 'asc') {
//         sort = projectsort;
//       } else {
//         sort = `-${projectsort}`;
//       }

//       request(
//         `${BASEURL}graphql/`,
//         projectOrder,
//         { orderBy: sort },
//         { Authorization: `Bearer ${localStorage.getItem('Token')}` }
//       ).then((res: any) => {
//         let dataArr: any = [];
//         if (res.projects.edges.length > 0) {
//           for (let k = 0; k < res.projects.edges.length; k++) {
//             dataArr.push(res.projects.edges[k]?.node);
//           }
//           setdata4(dataArr);
//         } else {
//           setdata4([]);
//         }
//       });
//     }

//     setProName(projectSearchValue);
//     let name = projectSearchValue;
//     if (name !== undefined) {
//       request(
//         `${BASEURL}graphql/`,
//         Project,
//         { name: proname },
//         { Authorization: `Bearer ${localStorage.getItem('Token')}` }
//       ).then((res: any) => {
//         let data3: any = [];
//         if (res.projects.edges.length > 0) {
//           for (let k = 0; k < res.projects.edges.length; k++) {
//             data3.push(res.projects.edges[k]?.node);
//           }
//           setdata2(data3);
//         } else {
//           setdata2([]);
//         }
//       });
//     }
//     setUpdate(false);
//   };

//   useEffect(() => {
//     fetchData();
//   }, [update, skip, first, projectorder, projectsort]);

//   useEffect(() => {
//     request(
//       `${BASEURL}graphql/`,
//       AllProjects,
//       {},
//       { Authorization: `Bearer ${localStorage.getItem('Token')}` }
//     ).then((res: any) => {
//       setNext(res.allProjects);
//     });
//   }, []);

//   let data = null;

//   if (projectSearchValue == '' && projectorder == '' && projectsort == '') {
//     data = data3;
//   } else if (projectSearchValue !== '' && data2.length !== 0) {
//     data = data2;
//   } else if (projectorder !== '' && projectsort !== '') {
//     data = data4;
//   } else {
//     data = [];
//   }

//   const totalPages = Math.ceil(next.length / first);
//   const allDataLen = next.length;

//   const Pagination = (val: any) => {
//     const newSkip = skip + val;
//     if (newSkip >= 0 && newSkip < next.length) {
//       setSkip(newSkip);
//       const newPage = Math.ceil((newSkip + 1) / first);
//       setCurrentPage(newPage);
//       const newFrom = newSkip + 1;
//       const newTo = Math.min(newSkip + first, next.length);
//       setPageFirst(newFrom);
//       setPageNext(newTo);
//     } else if (newSkip >= next.length) {
//       const lastPage = Math.ceil(next.length / first);
//       const correctedSkip = (lastPage - 1) * first;
//       setSkip(correctedSkip);
//       const newFrom = correctedSkip + 1;
//       const newTo = next.length;
//       setPageFirst(newFrom);
//       setPageNext(newTo);
//       setCurrentPage(lastPage);
//     }
//   };

//   const rowSize = (e: any) => {
//     const newSize = Number(e.target.value);
//     setFirst(newSize);
//     setSkip(0);
//     setCurrentPage(1);
//     setPageFirst(1);
//     setPageNext(Math.min(newSize, allDataLen));
//   };

//   const columns = useMemo(() => usersColumns, []);
//   const { getTableProps, getTableBodyProps, headers, rows, prepareRow } = useTable({
//     columns,
//     data,
//   });

//   const Enable = currentPage === 1;
//   const Disable = currentPage >= totalPages;

//   return (
//     <div className='modern-users-table-wrapper'>
//       <ModernTable striped hoverable>
//         <ModernTableHeader>
//           <ModernTableRow>
//             {headers.map((column: ColumnInstance<User>) => (
//               <CustomHeaderColumn key={column.id} column={column} />
//             ))}
//           </ModernTableRow>
//         </ModernTableHeader>
//         <ModernTableBody>
//           {rows.length > 0 ? (
//             (() => {
//               const filteredRows = rows.filter(
//                 (item: any) =>
//                   projectSearchValue === '' ||
//                   item.original.projectName.toLowerCase().includes(projectSearchValue.toLowerCase())
//               );

//               if (filteredRows.length === 0) {
//                 return (
//                   <ModernTableRow>
//                     <ModernTableCell colSpan={7}>
//                       <div className='modern-table-empty-state'>
//                         <div className='empty-icon'>📭</div>
//                         <div className='empty-text'>No matching records found</div>
//                       </div>
//                     </ModernTableCell>
//                   </ModernTableRow>
//                 );
//               }

//               return filteredRows.map((row: Row<User>, i) => {
//                 prepareRow(row);
//                 return <CustomRow row={row} key={`row-${i}-${row.id}`} />;
//               });
//             })()
//           ) : (
//             <ModernTableRow>
//               <ModernTableCell colSpan={7}>
//                 <div className='modern-table-empty-state'>
//                   <div className='empty-icon'>📂</div>
//                   <div className='empty-text'>No projects available</div>
//                   <div className='empty-subtext'>Create your first project to get started</div>
//                 </div>
//               </ModernTableCell>
//             </ModernTableRow>
//           )}
//         </ModernTableBody>
//       </ModernTable>

//       <div className='modern-table-pagination'>
//         <div className='pagination-left'>
//           <select value={first} onChange={rowSize} className='modern-pagination-select'>
//             <option value='5'>5 per page</option>
//             <option value='10'>10 per page</option>
//             <option value='15'>15 per page</option>
//             <option value='20'>20 per page</option>
//           </select>
//           <span className='pagination-info'>
//             {pageFirst}-{pageNext} of {allDataLen} items
//           </span>
//         </div>

//         <div className='pagination-right'>
//           <button
//             className='modern-pagination-btn'
//             onClick={() => Pagination(-Number(first))}
//             disabled={Enable}
//           >
//             <span>←</span> Previous
//           </button>
//           <span className='pagination-page-info'>
//             Page {currentPage} of {totalPages}
//           </span>
//           <button
//             className='modern-pagination-btn'
//             onClick={() => Pagination(Number(first))}
//             disabled={Disable}
//           >
//             Next <span>→</span>
//           </button>
//         </div>
//       </div>

//       {isLoading && <UsersListLoading />}
//     </div>
//   );
// };

// export { ModernUsersTable };


import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
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
import { UserActionsCell } from './columns/UserActionsCell'
import './CardHeaderFix.css'
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
        modifiedAt
        
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

function timeAgo(dateString) {
  if (!dateString) return '';

  const now = new Date();
  const past = new Date(dateString);
  const diffInSeconds = Math.floor((now - past) / 1000);

  const units = [
    { name: 'year', seconds: 31536000 },
    { name: 'month', seconds: 2592000 },
    { name: 'day', seconds: 86400 },
    { name: 'hour', seconds: 3600 },
    { name: 'minute', seconds: 60 },
    { name: 'second', seconds: 1 },
  ];

  for (const unit of units) {
    const value = Math.floor(diffInSeconds / unit.seconds);
    if (value >= 1) {
      return new Intl.RelativeTimeFormat('en', { numeric: 'auto' })
        .format(-value, unit.name);
    }
  }

  return 'just now';
}
const ModernUsersTable = () => {
  const navigate = useNavigate()
  const [data2, setdata2] = useState<any[]>([])
  const [data3, setdata3] = useState<any[]>([]);
  const [data4, setdata4] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const { projectSearchValue, projectorder, projectsort, setUpdate, update, setItemIdForUpdate, setIsEdit } = useListView()
  const isLoading = useQueryResponseLoading()
  const [skip, setSkip] = useState(0);
  const [first, setFirst] = useState(5);
  const [proname, setProName] = useState(projectSearchValue)
  const [next, setNext] = useState<any[]>([]);
  const [pageFirst, setPageFirst] = useState(1)
  const [pageNext, setPageNext] = useState(5)
  const [viewMode, setViewMode] = useState<'card' | 'table'>('card');
  const [showActionsMenu, setShowActionsMenu] = useState<string | null>(null);
  

  const fetchData = () => {
    request(`${BASEURL}graphql/`,
      allProject,
      { skip: skip, first: first },
      {Authorization: `Bearer ${localStorage.getItem('Token')}`}).then((res: any) => {
        console.log('new design response data',res.projects.edges)
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
    setSkip(0);
    setCurrentPage(1);
    setPageFirst(1);
    setPageNext(Math.min(newSize, allDataLen));
  };

  const columns = useMemo(() => usersColumns, [])
  const { getTableProps, getTableBodyProps, headers, rows, prepareRow } = useTable({
    columns,
    data,
  })

  console.log("projects data from the new design",rows);
  

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

  // Custom theme color gradients based on your exact colors
  const getCardGradient = () => {
    if (!themeColor1) return 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)'; // Default blue
    
    // Map your exact theme colors to gradients
    const gradientMap: any = {
      'bg-primary': 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',     // Blue
      'bg-success': 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',     // Green
      'bg-danger': 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',      // Red
      'bg-warning': 'linear-gradient(135deg, #eab308 0%, #ca8a04 100%)',     // Yellow
      'bg-info': 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',        // Violet
      'bg-dark': 'linear-gradient(135deg, #374151 0%, #1f2937 100%)',        // Dark
      'bg-secondary': 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)',   // Gray
    };

    // Also support direct color names
    const colorNameMap: any = {
      'Blue': 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
      'Green': 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
      'Red': 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
      'Yellow': 'linear-gradient(135deg, #eab308 0%, #ca8a04 100%)',
      'Violet': 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
    };

    return gradientMap[backgroundColor] || colorNameMap[themeColor1] || 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)';
  };

  // Get theme-based color for progress bar
  const getProgressBarColor = () => {
    if (!themeColor1) return 'bg-primary';
    return backgroundColor || 'bg-primary';
  };

  // Get status badge styling
  const getStatusBadge = (active: boolean) => {
    return active 
      ? 'inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold bg-green-100 text-green-700'
      : 'inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700';
  };

  // Calculate progress
  const calculateProgress = (totalFiles: number) => {
    return totalFiles > 0 ? Math.min(Math.round((totalFiles / 20) * 100), 100) : 0;
  };

  // Navigate to document management page
  const navigateToDocumentManagement = (projectId: string, projectName: string) => {
    // Store project info in localStorage for the document management page
    localStorage.setItem('selectedProjectId', projectId);
    localStorage.setItem('selectedProjectName', projectName);
    
    // Navigate to document management page
    navigate(`/document-management/document/${projectId}`);
  };

  // Handle card click - Navigate to document management
  const handleCardClick = (project: any) => {
    navigateToDocumentManagement(project.id, project.projectName);
  };

  // Handle edit button - Open edit modal
  const handleEditClick = (e: React.MouseEvent, projectId: string) => {
    e.stopPropagation();
    setShowActionsMenu(null);
    setItemIdForUpdate(projectId);
    setIsEdit(true);
  };

  // Toggle actions menu
  const toggleActionsMenu = (e: React.MouseEvent, projectId: string) => {
    e.stopPropagation();
    setShowActionsMenu(showActionsMenu === projectId ? null : projectId);
  };

  // Close actions menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setShowActionsMenu(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const filteredRows = rows.filter((item: any) =>
    projectSearchValue === "" ||
    item.original.projectName.toLowerCase().includes(projectSearchValue.toLowerCase())
  );

  return (
    <KTCardBody className='py-4'>
      {/* View Toggle Button */}
      <div className='mb-4 d-flex justify-content-end'>
        <div className='btn-group' role='group'>
          <button
            type='button'
            className={`btn btn-sm ${viewMode === 'card' ? 'btn-primary' : 'btn-light'}`}
            onClick={() => setViewMode('card')}
          >
            <i className='bi bi-grid-3x3-gap-fill'></i> Card View
          </button>
          <button
            type='button'
            className={`btn btn-sm ${viewMode === 'table' ? 'btn-primary' : 'btn-light'}`}
            onClick={() => setViewMode('table')}
          >
            <i className='bi bi-table'></i> Table View
          </button>
        </div>
      </div>

      {/* Card View */}
      {viewMode === 'card' && (
        <div className='row g-6 mb-8'>
          {filteredRows.length > 0 ? (
            filteredRows.map((row: Row<User>, i) => {
              prepareRow(row);
              const project = row.original as any;
              
              const progress = calculateProgress(project.totalFiles || 0);
              const cardGradient = getCardGradient();
              const progressColor = getProgressBarColor();
              
              return (
                <div key={`card-${i}-${row.id}`} className='col-md-6 col-lg-4'>
                  <div 
                    className='card h-100 shadow-sm border-0 hover-shadow-lg transition-all' 
                    style={{
                      transition: 'all 0.3s ease',
                      cursor: 'pointer'
                    }}
                    onClick={() => handleCardClick(project)}
                  >
                    {/* Card Header with Theme-based Gradient */}
                    <div 
                      className='card-header border-0 pt-6 pb-6' 
                      style={{
                        background: getCardGradient(),
                        position: 'relative',
                        overflow: 'hidden',
                        borderTopLeftRadius: '12px',
                        borderTopRightRadius: '12px',
                        minHeight: '100px' // Ensure header has height
                      }}
                    >
                      <div style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'rgba(0,0,0,0.05)',
                        opacity: 0,
                        transition: 'opacity 0.3s'
                      }} className='card-hover-overlay'></div>
                      
                      <div className='d-flex align-items-start justify-content-between position-relative' style={{ zIndex: 1 }}>
                        <div className='d-flex align-items-center gap-3'>
                          <div className='d-flex align-items-center justify-content-center rounded-3' style={{
                            width: '48px',
                            height: '48px',
                            background: 'rgba(255,255,255,0.2)',
                            backdropFilter: 'blur(10px)'
                          }}>
                            <i className='bi bi-folder text-white fs-2' style={{ color: 'white' }}></i>
                          </div>
                          <div>
                            <h3 
                              className='text-white fw-bold mb-1' 
                              style={{ 
                                fontSize: '16px',
                                color: 'white',  // Inline style as backup
                                fontWeight: '600'
                              }}
                            >
                              {project.projectName || 'Untitled Project'}
                            </h3>
                            <p 
                              className='text-white-50 mb-0 small' 
                              style={{ 
                                color: 'rgba(255,255,255,0.75)',  // Inline style as backup
                                fontSize: '12px' 
                              }}
                            >
                              Project
                            </p>
                          </div>
                        </div>
                        {/* ... three dots menu ... */}
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className='card-body pt-4'>
                      {/* Stats */}
                      <div className='d-flex align-items-center justify-content-between mb-4'>
                        <div className='d-flex align-items-center gap-2 text-gray-600'>
                          <i className={`bi bi-file-earmark-text fs-5 ${progressColor.replace('bg-', 'text-')}`}></i>
                          <span className='fw-semibold text-gray-900'>{project.totalFiles || 0}</span>
                          <span className='small'>files</span>
                        </div>
                        <div className='d-flex align-items-center gap-2 text-gray-600 small'>
                          <i className='bi bi-clock text-gray-400'></i>
                          {timeAgo(project.modifiedAt)}
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className='mb-4'>
                        <div className='d-flex align-items-center justify-content-between mb-2'>
                          <span className='small fw-medium text-gray-700'>Progress</span>
                          <span className={`small fw-bold ${progressColor.replace('bg-', 'text-')}`}>{progress}%</span>
                        </div>
                        <div className={`progress h-8px ${progressColor} bg-opacity-10`}>
                          <div 
                            className={`progress-bar ${progressColor}`}
                            role='progressbar'
                            style={{ width: `${progress}%` }}
                            aria-valuenow={progress}
                            aria-valuemin={0}
                            aria-valuemax={100}
                          ></div>
                        </div>
                      </div>

                      {/* Status and Actions */}
                      <div className='d-flex align-items-center justify-content-between pt-4 border-top border-gray-200'>
                        <span className={getStatusBadge(project.active)}>
                          {project.active ? 'Open' : 'Closed'}
                        </span>
                        <button 
                          className={`btn btn-sm fw-medium text-decoration-none ${progressColor.replace('bg-', 'btn-')}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCardClick(project);
                          }}
                        >
                          View Details →
                        </button>
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
                    <i className='bi bi-folder text-gray-400 fs-2x'></i>
                  </div>
                  <h3 className='fw-bold text-gray-900 mb-2'>No projects found</h3>
                  <p className='text-gray-600 mb-0'>
                    {projectSearchValue ? 'No matching records found' : 'Get started by creating your first project'}
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

      {/* Modern Pagination */}
      <div className='card shadow-sm border-0 mt-6'>
        <div className='card-body p-6'>
          <div className='d-flex align-items-center justify-content-between flex-wrap gap-4'>
            {/* Items per page & info */}
            <div className='d-flex align-items-center gap-4 flex-wrap'>
              <select 
                value={first} 
                onChange={rowSize} 
                className='form-select form-select-sm w-auto'
                style={{ minWidth: '120px' }}
              >
                <option value='5'>5 per page</option>
                <option value='10'>10 per page</option>
                <option value='15'>15 per page</option>
                <option value='20'>20 per page</option>
              </select>
              {/* <p className='mb-0 text-gray-600 small'>
                Showing <span className='fw-semibold text-gray-900'>{pageFirst}-{pageNext}</span> of <span className='fw-semibold text-gray-900'>{allDataLen}</span> projects
              </p> */}
            </div>

            {/* Pagination buttons */}
            {/* <div>
              <nav aria-label='pagination'>
                <ul className='pagination pagination-sm mb-0'>
                  <li className={Enable}>
                    <button 
                      className='page-link d-flex align-items-center gap-2'
                      onClick={() => Pagination(-Number(first))}
                      disabled={currentPage === 1}
                      style={{ minWidth: '100px' }}
                    >
                      <i className='bi bi-chevron-left'></i>
                      Previous
                    </button>
                  </li>
                  <li className='page-item disabled'>
                    <span className='page-link'>
                      Page {currentPage} of {totalPages}
                    </span>
                  </li>
                  <li className={Disable}>
                    <button 
                      className='page-link d-flex align-items-center gap-2'
                      onClick={() => Pagination(Number(first))}
                      disabled={currentPage >= totalPages}
                      style={{ minWidth: '100px' }}
                    >
                      Next
                      <i className='bi bi-chevron-right'></i>
                    </button>
                  </li>
                </ul>
              </nav>
            </div> */}
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
      `}</style>
    </KTCardBody>
  )
}

export { ModernUsersTable }