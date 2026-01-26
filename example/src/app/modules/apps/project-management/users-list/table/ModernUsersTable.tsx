import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTable, ColumnInstance, Row } from 'react-table';
import { CustomHeaderColumn } from './columns/CustomHeaderColumn';
import { CustomRow } from './columns/CustomRow';
import { useQueryResponseLoading } from '../core/QueryResponseProvider';
import { usersColumns } from './columns/_columns';
import { User } from '../core/_models';
import { UsersListLoading } from '../components/loading/UsersListLoading';
import { useListView } from '../core/ListViewProvider';
import { request, gql } from 'graphql-request';
import BASEURL from '../../../../../config/baseurl';
import {
  ModernTable,
  ModernTableHeader,
  ModernTableBody,
  ModernTableRow,
  ModernTableCell,
  ModernTableHeaderCell,
} from '../../../../../components/modern-ui';
import './ModernUsersTable.scss';

const AllProjects = gql`
  query {
    allProjects {
      id
      projectId
      projectName
      active
      description
    }
  }
`;

const allProject = gql`
  query Projects($skip: Int!, $first: Int!) {
    projects(skip: $skip, first: $first) {
      edges {
        node {
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
`;

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
  }
`;

const projectOrder = gql`
  query Project($orderBy: [String!]) {
    projects(orderBy: $orderBy) {
      edges {
        node {
          id
          projectName
          totalFiles
          description
          active
        }
      }
    }
  }
`;

const ModernUsersTable = () => {
  const navigate = useNavigate();
  const [data2, setdata2] = useState<any[]>([]);
  const [data3, setdata3] = useState<any[]>([]);
  const [data4, setdata4] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const { projectSearchValue, projectorder, projectsort, setUpdate, update, setItemIdForUpdate, setIsEdit } = useListView();
  const isLoading = useQueryResponseLoading();
  const [skip, setSkip] = useState(0);
  const [first, setFirst] = useState(10);
  const [proname, setProName] = useState(projectSearchValue);
  const [next, setNext] = useState<any[]>([]);
  const [pageFirst, setPageFirst] = useState(1);
  const [pageNext, setPageNext] = useState(10);

  // View mode state with localStorage persistence
  const [viewMode, setViewMode] = useState<'card' | 'table'>(() => {
    const saved = localStorage.getItem('projectViewMode');
    return (saved as 'card' | 'table') || 'table';
  });

  const [showActionsMenu, setShowActionsMenu] = useState<string | null>(null);

  // Persist view mode to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('projectViewMode', viewMode);
  }, [viewMode]);

  const fetchData = () => {
    request(
      `${BASEURL}graphql/`,
      allProject,
      { skip: skip, first: first },
      { Authorization: `Bearer ${localStorage.getItem('Token')}` }
    ).then((res: any) => {
      let projectArr: any = [];
      if (res.projects.edges.length > 0) {
        for (let k = 0; k < res.projects.edges.length; k++) {
          projectArr.push(res.projects.edges[k]?.node);
        }
        setdata3(projectArr);
      } else {
        setdata3([]);
      }
    });

    let sort = null;
    if (projectorder != '' && projectsort != '') {
      if (projectorder == 'asc') {
        sort = projectsort;
      } else {
        sort = `-${projectsort}`;
      }

      request(
        `${BASEURL}graphql/`,
        projectOrder,
        { orderBy: sort },
        { Authorization: `Bearer ${localStorage.getItem('Token')}` }
      ).then((res: any) => {
        let dataArr: any = [];
        if (res.projects.edges.length > 0) {
          for (let k = 0; k < res.projects.edges.length; k++) {
            dataArr.push(res.projects.edges[k]?.node);
          }
          setdata4(dataArr);
        } else {
          setdata4([]);
        }
      });
    }

    setProName(projectSearchValue);
    let name = projectSearchValue;
    if (name !== undefined) {
      request(
        `${BASEURL}graphql/`,
        Project,
        { name: proname },
        { Authorization: `Bearer ${localStorage.getItem('Token')}` }
      ).then((res: any) => {
        let data3: any = [];
        if (res.projects.edges.length > 0) {
          for (let k = 0; k < res.projects.edges.length; k++) {
            data3.push(res.projects.edges[k]?.node);
          }
          setdata2(data3);
        } else {
          setdata2([]);
        }
      });
    }
    setUpdate(false);
  };

  useEffect(() => {
    fetchData();
  }, [update, skip, first, projectorder, projectsort]);

  useEffect(() => {
    request(
      `${BASEURL}graphql/`,
      AllProjects,
      {},
      { Authorization: `Bearer ${localStorage.getItem('Token')}` }
    ).then((res: any) => {
      setNext(res.allProjects);
    });
  }, []);

  let data = null;

  if (projectSearchValue == '' && projectorder == '' && projectsort == '') {
    data = data3;
  } else if (projectSearchValue !== '' && data2.length !== 0) {
    data = data2;
  } else if (projectorder !== '' && projectsort !== '') {
    data = data4;
  } else {
    data = [];
  }

  const totalPages = Math.ceil(next.length / first);
  const allDataLen = next.length;

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

  const columns = useMemo(() => usersColumns, []);
  const { getTableProps, getTableBodyProps, headers, rows, prepareRow } = useTable({
    columns,
    data,
  });

  const Enable = currentPage === 1;
  const Disable = currentPage >= totalPages;

  // Get theme color for card gradients
  const themeColor1 = localStorage.getItem("themeColor");

  // Helper function to get gradient based on theme color
  const getCardGradient = () => {
    const gradientMap: Record<string, string> = {
      'bg-primary': 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
      'bg-success': 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
      'bg-danger': 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
      'bg-warning': 'linear-gradient(135deg, #eab308 0%, #ca8a04 100%)',
      'bg-info': 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
      'bg-dark': 'linear-gradient(135deg, #374151 0%, #1f2937 100%)',
      'bg-secondary': 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)',
    };

    // Get background color from theme
    const getBackgroundColor = (classNames: any) => {
      const regex = /bg-(\w+)/;
      if (typeof classNames === 'string' && classNames.trim() !== '') {
        const match = classNames.match(regex);
        if (match && match[0]) {
          return match[0];
        }
      }
      return '';
    };

    const backgroundColor = getBackgroundColor(themeColor1);
    return gradientMap[backgroundColor] || 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)';
  };

  // Calculate progress for a project
  const calculateProgress = (totalFiles: number) => {
    return totalFiles > 0 ? Math.min(Math.round((totalFiles / 20) * 100), 100) : 0;
  };

  // Get status badge styling
  const getStatusBadge = (active: boolean) => {
    return active
      ? 'inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold bg-green-100 text-green-700'
      : 'inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700';
  };

  // Navigate to document management
  const navigateToDocumentManagement = (projectId: string, projectName: string) => {
    localStorage.setItem('selectedProjectId', projectId);
    localStorage.setItem('selectedProjectName', projectName);
    navigate(`/document-management/document/${projectId}`);
  };

  // Handle card click
  const handleCardClick = (project: any) => {
    navigateToDocumentManagement(project.id, project.projectName);
  };

  // Handle edit button
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

  // Filter rows for rendering
  const filteredRows = rows.filter(
    (item: any) =>
      projectSearchValue === '' ||
      item.original.projectName.toLowerCase().includes(projectSearchValue.toLowerCase())
  );

  return (
    <div className='modern-users-table-wrapper'>
      {/* View Toggle Buttons */}
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
        <div className='row g-6 mb-6'>
          {filteredRows.length > 0 ? (
            filteredRows.map((row: Row<User>, i) => {
              prepareRow(row);
              const project = row.original as any;
              const progress = calculateProgress(project.totalFiles || 0);
              const cardGradient = getCardGradient();

              return (
                <div key={`card-${i}-${row.id}`} className='col-md-6 col-lg-4'>
                  <div
                    className='card h-100 shadow-sm border-0'
                    style={{
                      transition: 'all 0.3s ease',
                      cursor: 'pointer',
                    }}
                    onClick={() => handleCardClick(project)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.style.boxShadow =
                        '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '';
                    }}
                  >
                    {/* Card Header with Gradient */}
                    <div
                      className='card-header border-0 pt-6 pb-6'
                      style={{
                        background: cardGradient,
                        position: 'relative',
                        overflow: 'hidden',
                        minHeight: '100px',
                      }}
                    >
                      <div
                        className='d-flex align-items-start justify-content-between position-relative'
                        style={{ zIndex: 1 }}
                      >
                        <div className='d-flex align-items-center gap-3'>
                          <div
                            className='d-flex align-items-center justify-content-center rounded-3'
                            style={{
                              width: '48px',
                              height: '48px',
                              background: 'rgba(255,255,255,0.2)',
                              backdropFilter: 'blur(10px)',
                            }}
                          >
                            <i className='bi bi-folder text-white fs-2'></i>
                          </div>
                          <div>
                            <h3 className='text-white fw-bold mb-1' style={{ fontSize: '1.1rem' }}>
                              {project.projectName}
                            </h3>
                            <span className={getStatusBadge(project.active)}>
                              {project.active ? '✓ Active' : '○ Inactive'}
                            </span>
                          </div>
                        </div>
                        <div className='position-relative'>
                          <button
                            className='btn btn-sm btn-icon btn-light-primary'
                            onClick={(e) => toggleActionsMenu(e, project.id)}
                            style={{
                              background: 'rgba(255,255,255,0.2)',
                              border: 'none',
                              color: 'white',
                            }}
                          >
                            <i className='bi bi-three-dots-vertical'></i>
                          </button>
                          {showActionsMenu === project.id && (
                            <div
                              className='dropdown-menu dropdown-menu-end show position-absolute'
                              style={{ right: 0, top: '100%', zIndex: 1000 }}
                            >
                              <button
                                className='dropdown-item'
                                onClick={(e) => handleEditClick(e, project.id)}
                              >
                                <i className='bi bi-pencil me-2'></i>Edit
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className='card-body'>
                      <div className='mb-4'>
                        <p className='text-gray-600 mb-0' style={{ fontSize: '0.875rem' }}>
                          {project.description || 'No description available'}
                        </p>
                      </div>

                      <div className='d-flex align-items-center justify-content-between mb-3'>
                        <span className='text-gray-500 fw-semibold' style={{ fontSize: '0.875rem' }}>
                          Files Progress
                        </span>
                        <span className='fw-bold text-gray-800'>{progress}%</span>
                      </div>

                      <div
                        className='progress'
                        style={{
                          height: '8px',
                          borderRadius: '4px',
                          background: '#f3f4f6',
                        }}
                      >
                        <div
                          className='progress-bar'
                          role='progressbar'
                          style={{
                            width: `${progress}%`,
                            background: cardGradient,
                            borderRadius: '4px',
                          }}
                          aria-valuenow={progress}
                          aria-valuemin={0}
                          aria-valuemax={100}
                        ></div>
                      </div>

                      <div className='mt-4 d-flex align-items-center gap-4'>
                        <div>
                          <div className='text-gray-500' style={{ fontSize: '0.75rem' }}>
                            Total Files
                          </div>
                          <div className='fw-bold text-gray-800' style={{ fontSize: '1.25rem' }}>
                            {project.totalFiles || 0}
                          </div>
                        </div>
                        <div>
                          <div className='text-gray-500' style={{ fontSize: '0.75rem' }}>
                            Project ID
                          </div>
                          <div className='fw-semibold text-gray-600' style={{ fontSize: '0.875rem' }}>
                            #{project.projectId}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className='col-12'>
              <div className='modern-table-empty-state text-center py-8'>
                <div className='empty-icon' style={{ fontSize: '3rem' }}>
                  📂
                </div>
                <div className='empty-text mt-3'>No projects available</div>
                <div className='empty-subtext'>Create your first project to get started</div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Table View */}
      {viewMode === 'table' && (
        <ModernTable striped hoverable>
          <ModernTableHeader>
            <ModernTableRow>
              {headers.map((column: ColumnInstance<User>) => (
                <CustomHeaderColumn key={column.id} column={column} />
              ))}
            </ModernTableRow>
          </ModernTableHeader>
          <ModernTableBody>
            {rows.length > 0 ? (
              (() => {
                if (filteredRows.length === 0) {
                  return (
                    <ModernTableRow>
                      <ModernTableCell colSpan={7}>
                        <div className='modern-table-empty-state'>
                          <div className='empty-icon'>📭</div>
                          <div className='empty-text'>No matching records found</div>
                        </div>
                      </ModernTableCell>
                    </ModernTableRow>
                  );
                }

                return filteredRows.map((row: Row<User>, i) => {
                  prepareRow(row);
                  return <CustomRow row={row} key={`row-${i}-${row.id}`} />;
                });
              })()
            ) : (
              <ModernTableRow>
                <ModernTableCell colSpan={7}>
                  <div className='modern-table-empty-state'>
                    <div className='empty-icon'>📂</div>
                    <div className='empty-text'>No projects available</div>
                    <div className='empty-subtext'>Create your first project to get started</div>
                  </div>
                </ModernTableCell>
              </ModernTableRow>
            )}
          </ModernTableBody>
        </ModernTable>
      )}

      <div className='modern-table-pagination'>
        <div className='pagination-left'>
          <select value={first} onChange={rowSize} className='modern-pagination-select'>
            <option value='5'>5 per page</option>
            <option value='10'>10 per page</option>
            <option value='15'>15 per page</option>
            <option value='20'>20 per page</option>
          </select>
          <span className='pagination-info'>
            {pageFirst}-{pageNext} of {allDataLen} items
          </span>
        </div>

        <div className='pagination-right'>
          <button
            className='modern-pagination-btn'
            onClick={() => Pagination(-Number(first))}
            disabled={Enable}
          >
            <span>←</span> Previous
          </button>
          <span className='pagination-page-info'>
            Page {currentPage} of {totalPages}
          </span>
          <button
            className='modern-pagination-btn'
            onClick={() => Pagination(Number(first))}
            disabled={Disable}
          >
            Next <span>→</span>
          </button>
        </div>
      </div>

      {isLoading && <UsersListLoading />}
    </div>
  );
};

export { ModernUsersTable };
