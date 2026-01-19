import React, { useEffect, useMemo, useState } from 'react';
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
  const [data2, setdata2] = useState<any[]>([]);
  const [data3, setdata3] = useState<any[]>([]);
  const [data4, setdata4] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const { projectSearchValue, projectorder, projectsort, setUpdate, update } = useListView();
  const isLoading = useQueryResponseLoading();
  const [skip, setSkip] = useState(0);
  const [first, setFirst] = useState(10);
  const [proname, setProName] = useState(projectSearchValue);
  const [next, setNext] = useState<any[]>([]);
  const [pageFirst, setPageFirst] = useState(1);
  const [pageNext, setPageNext] = useState(10);

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

  return (
    <div className='modern-users-table-wrapper'>
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
              const filteredRows = rows.filter(
                (item: any) =>
                  projectSearchValue === '' ||
                  item.original.projectName.toLowerCase().includes(projectSearchValue.toLowerCase())
              );

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
