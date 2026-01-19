import React, { useContext, useEffect, useMemo, useState } from 'react'
import { useTable, ColumnInstance, Row } from 'react-table'
import { CustomHeaderColumn } from '../table/columns/CustomHeaderColumn'
import { CustomRow } from '../table/columns/CustomRow'
import { usersColumns } from './columns/_columns'
import { User } from '../core/_models'
import { KTCardBody } from '../../../../../../_metronic/helpers'
import { request, gql } from 'graphql-request'
import _, { head } from 'lodash'
import { useParams } from 'react-router-dom'
import { useListView } from '../core/ListViewProvider'
import { useAuth } from '../../../../auth'
import { reviewusersColumns } from './columns/_reviewcolumns'
import BASEURL from '../../../../../config/baseurl'
import { useLayout } from '../../../../../../_metronic/layout/core'
import AppContext from '../../../../../AppContext'
import { UsersListLoading } from '../components/loading/UsersListLoading'
import Pagination from './columns/pagination'
import { Item1 } from '../../../../../../_metronic/partials/content/activity/Item1'
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

const repofiles = gql`
query{
  repoFilesDetail{
    project{
      projectfile{
        edges{
          node{
            id
            fileName
            filePath
            viewerPath
            clausesText
          }
        }
      }
    }
  }
}
`

const filteredRepoFiles = gql`
query filterdRepoFileDetail($input:String!){
  filterdRepoFileDetail(search:$input){
    contractName
    documentName
    parties
    EffectiveDate
    ExpireyDate
  }
}
`
// const pageSize = 1;
const UsersTable = () => {
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
  const CaughtsearchType = localStorage.getItem('searchType');
  const { filesearchValue, filesort, fileorder, setProjectid, setUpdate, update, setProjectName, selected, selected1, setfilesearchValue, smartsearchType, setSmartSearchType } = useListView()
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

  const fetchData = () => {
    console.log('fetch dara smart search type-->', smartsearchType);

    // request(`${BASEURL}graphql/`, repofiles, {}, {
    //       Authorization: `Bearer ${localStorage.getItem('Token')}`,
    //     })
    //       .then((res: any) => {
    //         console.log("Response:", res);
    //         console.log("Multiple request:", res);

    //         // Set the project name (assuming there is at least one file)
    //         setProjectName(res.repoFilesDetail?.[0]?.contractName);

    //         let fileArr: any = [];
    //         if (res.repoFilesDetail?.length > 0) {


    //           res.repoFilesDetail.forEach(repo => {
    //             if (repo.project?.projectfile?.edges?.length > 0) {
    //               fileArr = fileArr.concat(repo.project?.projectfile?.edges);
    //             }
    //           });
    //           const flattenedData = fileArr.map(edge => edge.node);
    //           setdata3(flattenedData);
    //           // console.log("Data array:", fileArr);
    //           // setdata3(fileArr);
    //         } else {
    //           setdata3([]);
    //         }
    //       })
    //       .catch((error) => {
    //         console.error("Error fetching data:", error); // Handle errors gracefully
    //       });

    request(`${BASEURL}graphql/`, repofiles, {}, {
      Authorization: `Bearer ${localStorage.getItem('Token')}`,
    })
      .then(async (res: any) => {
        console.log("Response:", res);

        // Optional: Set project name
        setProjectName(res.repoFilesDetail?.[0]?.contractName);

        let fileArr: any = [];

        if (res.repoFilesDetail?.length > 0) {
          res.repoFilesDetail.forEach(repo => {
            if (repo.project?.projectfile?.edges?.length > 0) {
              fileArr = fileArr.concat(repo.project?.projectfile?.edges);
            }
          });

          // Flatten edges to get node objects (each file)
          const flattenedData = fileArr.map(edge => edge.node);

          // STEP 1: Fetch the JSON content for each file
          const enrichedData = await Promise.all(
            flattenedData.map(async (file) => {
              const extractPublicPath = (fullPath) => {
                const idx = fullPath.indexOf('public/');
                if (idx === -1) return ''; // safety fallback
                return '/' + fullPath.substring(idx + 'public/'.length); // ensures path starts with '/'
              };

              const publicPath = extractPublicPath(file.viewerPath);
              const fullPath = `${publicPath}${file.fileName}.json`; // ensure BASEURL points to your media/static location
              console.log('file path from frontend', fullPath);

              try {
                const response = await fetch(fullPath);
                const buffer = await response.arrayBuffer();

                // Decode UTF-16 LE bytes to string
                const decoder = new TextDecoder('utf-16le');
                const text = decoder.decode(buffer);

                console.log('Decoded text:', text);

                const json = JSON.parse(text);
                console.log('Parsed JSON:', json);
                const formFields: Record<string, any> = {};
                console.log('form fileds', { ...formFields });
                json.forEach((item: any) => {
                  const components = item?.position?.form?.components || [];
                  components.forEach((component: any) => {
                    const key = component?.key || component?.label || 'unknown';
                    formFields[key] = component?.defaultValue || '';
                  });
                });

                // STEP 3: Merge with original file data
                console.log('form fileds', { ...formFields });
                return {
                  ...file,       // fileName, filePath, etc.
                  ...formFields, // dynamically added fields like effective_date, indemnity, etc.
                };

              } catch (err) {
                console.error(`Failed to read JSON for file: ${file.fileName}`, err);
                return {
                  ...file,
                  error: true,
                  errorMsg: 'Failed to load JSON',
                };
              }
            })
          );

          // STEP 4: Set the final enriched data


          console.log("✅ Final enriched data:", enrichedData);
          setdata3(enrichedData);

        } else {
          setdata3([]);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
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
      // request(`${BASEURL}graphql/`, fileOrder, { projectId: id, orderBy: sort }, {Authorization: `Bearer ${localStorage.getItem('Token')}`}).then((res: any) => {
      //   console.log("order res", res.filess)
      //   console.log(res.filess.edges)
      //   let dataArr: any = []
      //   if (res.filess.edges.length > 0) {
      //     for (let k = 0; k < res.filess.edges.length; k++) {
      //       dataArr.push(res.filess.edges[k]?.node)
      //       console.log("data arr", dataArr);
      //       setdata4(dataArr)
      //     }
      //   }
      //   else {
      //     setdata4([])
      //   }
      // })
    }
    setFileName(filesearchValue)
    console.log('i am logging search value', filesearchValue)

    if (filename !== undefined && !smartsearchType) {
      request(`${BASEURL}graphql/`, filteredRepoFiles, { input: filename }, { Authorization: `Bearer ${localStorage.getItem('Token')}` }).then((res: any) => {
        console.log("search result", res)
        console.log("multiple request")
        let data3: any = []
        console.log('i am here');
        if (res?.filterdRepoFileDetail && res.filterdRepoFileDetail.length > 0) {  // Make sure you're accessing the 'data' property first
          console.log('i am here 1');

          for (let k = 0; k < res?.filterdRepoFileDetail?.length; k++) {
            console.log('i am here 2');

            data3.push(res?.filterdRepoFileDetail[k])
            console.log("data arr", data3);
          }
          setdata2(data3)
        } else {
          setdata2([])  // If no data found, set it to an empty array
        }

      })
    }
    else if (filesearchValue !== undefined && smartsearchType == 'semantic') {
      semanticSearch()
    }
    else if (filesearchValue !== undefined && smartsearchType == 'ai-risk') {
      elasticSearch()
    }
    setUpdate(false)
  }

  useEffect(() => {
    fetchData();
  }, [update, skip, first, fileorder, filesort, filesearchValue, smartsearchType]);

  useEffect(() => {
    // Make the GraphQL request with the Authorization header
    request(
      `${BASEURL}graphql/`,
      repofiles, {}, { Authorization: `Bearer ${localStorage.getItem('Token')}`, }
    )
      .then((res: any) => {
        console.log("response all", res.repoFilesDetail); // Accessing repoFilesDetail instead of filess

        // If repoFilesDetail is not empty, populate DocArr with the result
        let DocArr: any = [];
        if (res.repoFilesDetail.length > 0) {
          // Push all file details into DocArr
          DocArr = res.repoFilesDetail;
          setNext(DocArr); // Update the state
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error); // Handle errors gracefully
      });
  }, [update, id]); // Dependency array

  const totalPages = Math.ceil(next.length / first);
  console.log("totalpages", totalPages, first, next.length);

  const handlePage = (page: number) => {
    setCurrentPage(page)
    setSkip((page - 1) * first)
  }

  const semanticSearch = async () => {
    const url = `${BASEURL}repository/semantic`
    const data = {
      'search_value': filesearchValue,
      'search_type': smartsearchType
    }
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',  // Indicates the data is in JSON format
        'Authorization': `Bearer ${localStorage.getItem('Token')}`  // Add the Authorization token from localStorage
      },
      body: JSON.stringify(data)
    })

    if (response.ok) {
      const result = await response.json(); // 👈 parse the response
      console.log('Parsed semantic search result:', result);

      // Example: if the result looks like this:
      // { documents: [ { contract_name: ..., matched_content: ... }, ... ] }
      // you could do:
      if (result?.length > 0) {
        console.log('i am here at result documents');

        console.log('result documents', result.retrieved);

        //   const normalized = result.retrieved.map((doc: any) => ({
        //   original: {
        //     contractName: doc.contract_name, // map snake_case to camelCase
        //     matchedClauses: doc.matched_clauses,
        //     scores: doc.scores
        //   }
        // }))
        setdata2(result)// set your frontend state
      } else {
        setdata2([]); // no matches
      }

    }
    else {
      'error while fetching the data'
    }
  }

  const elasticSearch = async () => {
    const url = `${BASEURL}repository/filebasedsearch`
    const data = {
      'search_value': filesearchValue,
      'search_type': smartsearchType
    }
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',  // Indicates the data is in JSON format
        'Authorization': `Bearer ${localStorage.getItem('Token')}`  // Add the Authorization token from localStorage
      },
      body: JSON.stringify(data)
    })

    if (response.ok) {
      const result = await response.json(); // 👈 parse the response
      console.log('Parsed semantic search result:', result);

      // Example: if the result looks like this:
      // { documents: [ { contract_name: ..., matched_content: ... }, ... ] }
      // you could do:
      if (result?.results?.length > 0) {
        console.log('i am here at result documents');

        console.log('result documents', result.results);

        //   const normalized = result.results.map((doc: any) => ({
        //   original: {
        //     contractName: doc.contract_name, // map snake_case to camelCase
        //     matchedClauses: doc.matched_clauses,
        //     scores: doc.scores
        //   }
        // }))
        setdata2(result.results)// set your frontend state
      } else {
        setdata2([]); // no matches
      }

    }
    else {
      'error while fetching the data'
    }
  }
  // semanticSearch()


  // const Pagination = (val: any) => {
  //   const newSkip = skip + val;
  //   if (newSkip >= 0 && newSkip < next.length) {
  //     setSkip(newSkip);
  //     const newPage = Math.ceil((newSkip + 1) / first);
  //     setCurrentPage(newPage);
  //     const newFrom = newSkip + 1;
  //     const newTo = Math.min(newSkip + first, next.length);
  //     setPageFirst(newFrom)
  //     setPageNext(newTo)
  //   }
  // };

  // const rowSize = (e: any) => {
  //   // setFirst(e.target.value);
  //   setFirst(Number(e.target.value));
  //   setPageNext(Number(e.target.value))
  // }
  // const Pagination = (val: any) => {
  //   const newSkip = skip + val;
  //   if (newSkip >= 0 && newSkip < next.length) {
  //     setSkip(newSkip);
  //     const newPage = Math.ceil((newSkip + 1) / first);
  //     setCurrentPage(newPage);
  //     const newFrom = newSkip + 1;
  //     const newTo = Math.min(newSkip + first, next.length);
  //     setPageFirst(newFrom);
  //     setPageNext(newTo);
  //   } else if (newSkip >= next.length) {
  //     // Handle edge case when skip value exceeds total data length
  //     const lastPage = Math.ceil(next.length / first);
  //     const correctedSkip = (lastPage - 1) * first;
  //     setSkip(correctedSkip);
  //     const newFrom = correctedSkip + 1;
  //     const newTo = next.length;
  //     setPageFirst(newFrom);
  //     setPageNext(newTo);
  //     setCurrentPage(lastPage);
  //   }
  // };

  // const rowSize = (e: any) => {
  //   const newSize = Number(e.target.value);
  //   setFirst(newSize);
  //   setSkip(0); // Reset skip to the first page
  //   setCurrentPage(1); // Reset current page to 1
  //   setPageFirst(1); // Reset pageFirst
  //   setPageNext(Math.min(newSize, allDataLen)); // Reset pageNext
  // };

  const allDataLen = next.length
  console.log("all data length", allDataLen);


  let data = null
  console.log('filtered search value', filesearchValue);
  console.log('data 2 value', data2)
  if (filesearchValue == "" && fileorder == "" && filesort == "") {
    data = data3
  }
  else if (filesearchValue !== "" && data2.length !== 0) {
    console.log('i am here and setting value of data to ', data2);

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
              {rows.length > 0 ? (() => {
                const GlobalsearchType = smartsearchType
                console.log('search type -->', GlobalsearchType);

                const searchTerm = filesearchValue?.toLowerCase() || "";

                const filteredRows = rows.filter((item: any) => {
                  const data = item.original;
                  console.log('item data ---->', data);

                  if (!searchTerm) return true;

                  if (GlobalsearchType == "semantic") {
                    console.log('i am here inside the semantic if condi-->');
                    console.log("searchTerm -->", searchTerm);
                    return true;


                  } else if (GlobalsearchType === "ai-risk") {
                    console.log("I am here inside the ai-risk else-if condition -->");
                    console.log("searchTerm -->", searchTerm);
                    return true;
                  }
                  else {
                    return (
                      (data.contractName?.toLowerCase() || "").includes(searchTerm) ||
                      (data.parties?.toLowerCase() || "").includes(searchTerm) ||
                      (data.documentName?.toLowerCase() || "").includes(searchTerm) ||
                      (data.EffectiveDate?.toLowerCase() || "").includes(searchTerm) ||
                      (data.ExpireyDate?.toLowerCase() || "").includes(searchTerm)
                    );
                  }
                });

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

                return filteredRows.map((row: Row<User>, i: number) => {
                  prepareRow(row);
                  return <CustomRow row={row} key={`row-${i}-${row.id}`} />;
                });
              })() : (
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
          {/* Uncomment row size or page info if needed */}
        </div>

        <div className="float-end">
          <div className='pagination'>
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePage} />
          </div>
        </div>

        {isLoading && <UsersListLoading />}
      </KTCardBody>
    </>
  );
}


export { UsersTable }




