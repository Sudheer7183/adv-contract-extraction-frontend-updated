// import axios from 'axios';
// import React, { useContext, useEffect, useState } from 'react'
// import {
//     AreaHighlight,
//     Highlight,
//     IHighlight,
//     NewHighlight,
//     PdfHighlighter,
//     PdfLoader,
//     Popup,
//     Tip
// } from '../react-pdf-highlighter';
// import { useParams } from 'react-router-dom';
// import { testHighlights as _testHighlights } from "../components/test-highlights";
// import { Spinner } from '../components/Spinner';
// import { Sidebar1 } from '../components/Viewer-Sidebar';
// import '../components/style/Viewer.css';
// import { ViewerNavbar } from '../components/ViewerNavbar';
// import { request, gql } from 'graphql-request'
// import { useLayout } from '../../../../../_metronic/layout/core';
// import AppContext from '../../../../AppContext';
// import { useAuth } from '../../../auth';
// import BASEURL from '../../../../config/baseurl';


// let sviewTo = (highlight: any) => { };

// let scrollViewerTo = sviewTo;

// let sviewToPage = (pageNumber: number) => { };

// let scrollViewerToPage = sviewToPage;

// const viewerFile = gql`
// query ViewerFile($id: String!){
//     viewerFile(id: $id){
//           id
//           fileName
//           project{
//             id
//             projectName
//             defaultContractType{
//                 id
//                 contractTypeName
//             }
//             catalogFile{
//                 id
//                 catalogName
//             }
//           }
//           pages
//           lock
//           contractType{
//             contractTypeName
//           }
//           userContractType{
//             contractTypeName
//           }
//     }
// }`

// const assignUser = gql`
// query AssignUserFile($id: String!){
//     assignUserFile(fileId: $id){
//       edges{
//         node{
//           id
//           file{
//             id
//             fileName
//             fileStatus
//           }
//           user{
//             id
//             username
//             email
//           }
//         }
//       }
//     }
//   }`


// const lockFile = gql`
// query Lock($id: String!, $user_id: String!) {
//   lock(id: $id, userId: $user_id) {
//     edges {
//       node {
//         pages
//         filePath
//         fileName
//         project{
//             id
//             projectName
//         }
//         fileStatus
//         lock
//         lockedBy {
//           email
//           username
//           role
//         }
//       }
//     }
//   }
// }`

// const catalogFields = gql`
// query fields($id: Int!, $documenttype: String!) {
//     fields(id: $id, documenttype: $documenttype) {
//       edges {
//         node {
//           fieldId
//           fieldName
//         }
//       }
//     }
//   }`

// function Viewer() {
//     const { id } = useParams();
//     const { currentUser } = useAuth()
//     const testHighlights: Record<string, Array<IHighlight>> = _testHighlights;
//     const getNextId = () => String(Math.random()).slice(2);
//     const { setViewerPageActive } = useContext(AppContext);
//     const [url, setUrl] = useState("");
//     const [data, setData] = useState<any[]>([])
//     const [highlights, setHighlights] = useState<any[]>([]);
//     const [PageNo, setPageNo] = useState(1);
//     const [field, setField] = useState<any[]>([]);
//     const [readMode, setReadMode] = useState(false)

//     const { config } = useLayout()
//     const { aside } = config
//     console.log("type of aside", typeof (aside));

//     console.log("aside mini", aside);

//     console.log("minimized", !aside.minimized);

//     const themeColor1 = localStorage.getItem("themeColor")
//     console.log("Viewer themeColor->", themeColor1);
//     const getBackgroundColor = (classNames: any) => {
//         const regex = /bg-(\w+)/;
//         if (typeof classNames === 'string' && classNames.trim() !== '') {
//             const match = classNames.match(regex);
//             if (match && match[1]) {
//                 return match[0];
//             }
//         }
//         return '';
//     };

//     const backgroundColor = getBackgroundColor(themeColor1);
//     console.log("backgroundColor", backgroundColor)
//     const bootstrapColorToHexMapThumb: any = {
//         'bg-white': '#ffffff',
//         'bg-primary': '#009ef7',
//         'bg-secondary': '#e1e3ea',
//         'bg-success': '#50cd89',
//         'bg-danger': '#f1416c',
//         'bg-warning': '#ffc700',
//         'bg-info': '#7239ea',
//         'bg-light': '#f8f9fa',
//         'bg-dark': '#343a40',
//     };

//     const bootstrapColorToHexMapTrack: any = {
//         'bg-white': '#ffffff',
//         'bg-primary': '#f1faff',
//         'bg-secondary': '#f9f9f9',
//         'bg-success': '#c9f7f5',
//         'bg-danger': '#ffe2e5',
//         'bg-warning': '#fff4de',
//         'bg-info': '#eee5ff',
//         'bg-light': '#f8f9fa',
//         'bg-dark': '#f8f9fa',
//     };

//     const TrackhexCode = bootstrapColorToHexMapTrack[backgroundColor] || '#f1faff';
//     const ThumbhexCode = bootstrapColorToHexMapThumb[backgroundColor] || '#0080FF';



//     function changeScrollbarColor(trackcolor: any, thumbcolor: any) {
//         const styleElement = document.createElement('style');
//         styleElement.innerHTML = `
//         .PdfHighlighter::-webkit-scrollbar-track {
//             background-color: ${trackcolor} !important;
//         }
//         .PdfHighlighter::-webkit-scrollbar-thumb {
//             background-color: ${thumbcolor} !important;
//         }
//         .v_sidebar::-webkit-scrollbar-track {
//             background-color: ${trackcolor} !important;
//         }
//         .v_sidebar::-webkit-scrollbar-thumb {
//             background-color: ${thumbcolor} !important;
//         }
//         `;
//         document.head.appendChild(styleElement);
//     }

//     changeScrollbarColor(TrackhexCode, ThumbhexCode);


//     useEffect(() => {
//         if (!aside.minimized) {
//             document.body.setAttribute('data-kt-aside-minimize', 'on')
//             setViewerPageActive(true)

//         }
//         request(`${BASEURL}graphql/`, viewerFile, { id: id }, {Authorization: `Bearer ${localStorage.getItem('Token')}`}).then((res: any) => {
//             setData(res.viewerFile)
//         })
//         request(`${BASEURL}graphql/`, assignUser, { id: id }, {Authorization: `Bearer ${localStorage.getItem('Token')}`}).then((res: any) => {
//             // setData(res.viewerFile)
//             console.log("Assign user detail--->", res.assignUserFile);

//             let role = currentUser?.role
//             console.log("user role", role);

//             if (role == "Admin") {
//                 const assignedUser = res.assignUserFile?.edges[0].node.user;
//                 const currentUserId = currentUser?.email;
//                 console.log("Assign user detail assign detail", assignedUser, currentUserId, currentUser);

//                 if (assignedUser && assignedUser.email !== currentUserId) {
//                     // If assigned to another user, set the viewer screen to read mode
//                     setReadMode(true);
//                 }
//             }
//         })
//     }, [])
//     console.log("Viewer detail -->", data);
//     const name = data?.fileName
//     const foldername = data?.project?.projectName
//     const defaultContractType = data?.project?.defaultContractType?.contractTypeName
//     const totalPage = data?.pages
//     const usercontractType = data?.userContractType?.contractTypeName
//     const projectid = data?.project?.id
//     const catalogId = data?.project?.catalogFile?.id
//     console.log("filename", name);
//     console.log("defaultctype", defaultContractType);
//     console.log("userctype", usercontractType)

//     let contractType: any = null

//     if (usercontractType == null) {
//         contractType = defaultContractType
//     }
//     else {
//         contractType = usercontractType
//     }

//     console.log("contractType fields", contractType);




//     useEffect(() => {
//         console.log("Folder path valuesssss----", name, foldername)
//         if (name !== undefined && foldername !== undefined) {
//             getData(name, foldername);
//         }
//         request(`${BASEURL}graphql/`, lockFile, { id: id, user_id: currentUser?.id }, {Authorization: `Bearer ${localStorage.getItem('Token')}`}).then((res: any) => console.log(res.lock))
//     }, [name, foldername, id])

//     useEffect(() => {
//         console.log("iddd", catalogId, contractType);
//         if (catalogId !== undefined) {
//             request(`${BASEURL}graphql/`, catalogFields, { id: catalogId, documenttype: contractType }, {Authorization: `Bearer ${localStorage.getItem('Token')}`}).then((res: any) => setField(res.fields))
//         }
//     }, [catalogId, contractType])
//     console.log("Fieldsss--->", field);

//     const getData = async (filename: any, projectname: any) => {
//         console.log("useefff Folder path values", filename, projectname)
//         const schema_name = localStorage.getItem('Schema') 
//         const pdfURL = `/${schema_name}/${projectname}/${filename}.pdf`
//         // const url1 = `/${projectname}/${filename}.json`
//         const url1 = `${BASEURL}jsonfile/${projectname}/${filename}/`;
//         setUrl(pdfURL)
//         const queryParams = {
//             user_id: currentUser?.id,
//         };
//         axios.get(url1, {
//             params: queryParams,
//             headers: {
//                 'content-type': "application/json",
//                 'Authorization': `Bearer ${localStorage.getItem('Token')}`
//             }
//         }).then(response => {
//             setHighlights(response.data);
//             console.log(response.data)
//         })
//             .catch(err => console.log(err));
//     }

//     const user = currentUser?.email



//     // console.log("Viewer current user role, lock", role, lock);


//     let setSearchVal = (searchVal: String) => { };

//     const parseIdFromHash = () =>
//         document.location.hash.slice("#highlight-".length);

//     const resetHash = () => {
//         document.location.hash = "";
//     };

//     const HighlightPopup = ({
//         comment,
//     }: {
//         comment: { text: string; emoji: string };
//     }) =>
//         comment.text ? (
//             <div className="Highlight__popup">
//                 {comment.emoji} {comment.text}
//             </div>
//         ) : null;

//     const resetHighlights = () => {
//         setHighlights([])
//     };



//     const SECONDARY_PDF_URL = "https://arxiv.org/pdf/1604.02480.pdf";
//     const toggleDocument = () => {
//         const newUrl =
//             url === SECONDARY_PDF_URL ? "/pdf/Abrexa Pharmaceuticals Mutual Confidentiality and Non-Disclosure Agreement (2way_general) d. 6.8.18.pdf" : SECONDARY_PDF_URL;
//         setUrl(newUrl);
//         setHighlights(testHighlights[newUrl] ? [...testHighlights[newUrl]] : [])

//     };

//     const getHighlightById = (id: string) => {

//         return highlights.find((highlight) => highlight.id === id);
//     }

//     const addHighlight = (highlight: NewHighlight) => {
//         console.log("Saving highlight", highlight);
//         // setHighlights([highlight])
//         setHighlights([{ ...highlight, id: getNextId() }, ...highlights])
//         // Handlesave([{ ...highlight, id: getNextId() }, ...highlights])
//         Handlesave({ ...highlight, id: getNextId() })
//     }

//     const updateHighlight = (highlightId: string, position: Object, content: Object) => {
//         console.log("Updating highlight", highlightId, position, content);

//         setHighlights(highlights.map((h) => {
//             const {
//                 id,
//                 position: originalPosition,
//                 content: originalContent,
//                 ...rest
//             } = h;
//             return id === highlightId
//                 ? {
//                     id,
//                     position: { ...originalPosition, ...position },
//                     content: { ...originalContent, ...content },
//                     ...rest,
//                 }
//                 : h;
//         }),)
//     }

//     const scrollToHighlightFromHash = () => {
//         const highlight = getHighlightById(parseIdFromHash());
//         if (highlight && scrollViewerTo != sviewTo) {
//             scrollViewerTo(highlight);
//         }
//     };

//     console.log("Folder path values", name, foldername)
//     console.log("pdfURL", url);

//     const onPageNo = (e: any) => {
//         console.log("onPageNo-->", e);
//         setPageNo(e);
//     }
//     console.log("Highlights", highlights)

//     const togglebutton = async (value: any) => {
//         console.log("ToggleButton", value)
//         const url = `${BASEURL}jsonfilesort/${foldername}/${name}/${value}/`
//         // const url = `${http://127.0.0.1:8000/api/}jsonfilesort/${foldername}/${name}/${value}/`;

//         axios.get(url, {
//             headers: {
//                 'Authorization': `Bearer ${localStorage.getItem('Token')}`
//             }
//         }).then((response: any) => {
//             setHighlights(response.data);
//         });
//     };

//     const Handlesave = (highlight: any) => {
//         console.log("HandleSaving highlight", highlight);
//         const url2 = `${BASEURL}jsonfile/${foldername}/${name}/`
//         // const url2 = `${http://127.0.0.1:8000/api/}jsonfile/${foldername}/${name}/`;
//         axios.post(url2, highlight, {
//             headers: {
//                 'content-type': "application/json",
//                 'Authorization': `Bearer ${localStorage.getItem('Token')}`,
//             }
//         }).then(response => { setHighlights(response.data); console.log(response) });
//     }

//     const Handleedit = (text: any, id: any) => {
//         // console.log("Val", val)
//         console.log("Edited_text", text)
//         console.log("Edit_HighlightId", id)
//         const url2 = `${BASEURL}jsonfile/${foldername}/${name}/${id}/`
//         // const url2 = `${http://127.0.0.1:8000/api/}jsonfile/${foldername}/${name}/${id}/`;
//         axios.put(url2, { text, user},
//             { headers: {
//                 'content-type': "text/plain",
//                 'Authorization': `Bearer ${localStorage.getItem('Token')}`,
//             } 
//         }).then(response => { setHighlights(response.data); console.log(response) });
//     }

//     const Handledelete = (highlight: any, id: any) => {
//         console.log("highlight", highlight)
//         console.log("HighlightId", id)
//         const url2 = `${BASEURL}jsonfile/${foldername}/${name}/${id}/`
//         axios.delete(url2,
// {            headers: {
//                 'content-type': "text/plain",
//                 'Authorization': `Bearer ${localStorage.getItem('Token')}`,
//             }}
//         )
//             .then((response: any) => { setHighlights(response.data); console.log(response); });

//     }

//     console.log("viewer data", url, highlights);



//     return (
//         <>
//             <ViewerNavbar
//                 onChange={(fieldValue) => {
//                     setSearchVal(fieldValue)
//                 }}
//                 highlights={highlights}
//                 onPageNo={PageNo}
//                 pages={totalPage}
//                 togglebutton={togglebutton}
//                 // close={close}    
//                 fileId={id}
//                 name={name}
//                 projectId={projectid}
//                 nextPage={(pageNumber) => {
//                     scrollViewerToPage(pageNumber);
//                 }}
//                 scrollToView={scrollToHighlightFromHash}
//                 readOnly={readMode}
//             />
//             <div style={{ display: "flex", height: "75.5vh", paddingTop: '68px' }}>
//                 <div
//                     style={{
//                         // height: "88vh",
//                         // width: "75vw",
//                         width:"calc(75vw - 80px)",
//                         position: "relative",
//                         zIndex: '99',
//                     }}
//                 >
//                     <PdfLoader url={url} beforeLoad={<Spinner />}>
//                         {(pdfDocument) => (
//                             <PdfHighlighter
//                                 pdfDocument={pdfDocument}
//                                 enableAreaSelection={(event) => event.altKey}
//                                 onPageNo={onPageNo}
//                                 onScrollChange={resetHash}
//                                 // pdfScaleValue="page-width"
//                                 scrollRef={(scrollTo, scrollToPage) => {
//                                     scrollViewerTo = scrollTo;
//                                     scrollViewerToPage = scrollToPage;
//                                     scrollToHighlightFromHash();
//                                 }}
//                                 onSelectionFinished={(
//                                     position,
//                                     content,
//                                     hideTipAndSelection,
//                                     transformSelection
//                                 ) => (
//                                     <Tip
//                                         onOpen={transformSelection}
//                                         fields={field}
//                                         docType={usercontractType}
//                                         readMode={readMode}
//                                         onConfirm={(comment) => {
//                                             addHighlight({ content, position, comment });

//                                             hideTipAndSelection();
//                                         }} />
//                                 )}
//                                 highlightTransform={(
//                                     highlight,
//                                     index,
//                                     setTip,
//                                     hideTip,
//                                     viewportToScaled,
//                                     screenshot,
//                                     isScrolledTo
//                                 ) => {
//                                     const isTextHighlight = !Boolean(
//                                         highlight.content && highlight.content.image
//                                     );

//                                     const component = isTextHighlight ? (
//                                         <Highlight
//                                             isScrolledTo={isScrolledTo}
//                                             highlight={highlights}
//                                             position={highlight.position}
//                                             comment={highlight.comment}
//                                             scrollToView={scrollToHighlightFromHash} />
//                                     ) : (
//                                         <AreaHighlight
//                                             isScrolledTo={isScrolledTo}
//                                             highlight={highlight}
//                                             onChange={(boundingRect) => {
//                                                 updateHighlight(
//                                                     highlight.id,
//                                                     { boundingRect: viewportToScaled(boundingRect) },
//                                                     { image: screenshot(boundingRect) }
//                                                 );
//                                             }} />
//                                     );

//                                     return (
//                                         <Popup
//                                             popupContent={<HighlightPopup {...highlight} />}
//                                             onMouseOver={(popupContent) => setTip(highlight, (highlight) => popupContent)}
//                                             onMouseOut={hideTip}
//                                             key={index}
//                                             children={component} />
//                                     );
//                                 }}
//                                 highlights={highlights} />
//                         )}
//                     </PdfLoader>
//                 </div>
//                 <Sidebar1
//                     highlights={highlights}
//                     pages={totalPage}
//                     resetHighlights={resetHighlights}
//                     toggleDocument={toggleDocument}
//                     Handledelete={(highlight, id) => Handledelete(highlight, id)}
//                     Handleedit={(text, id) => Handleedit(text, id)}
//                     scrollToView={scrollToHighlightFromHash}
//                     onInit={(setSearch) => {
//                         setSearchVal = setSearch
//                     }}
//                     readOnly={readMode}
//                 />
//             </div>
//         </>

//     )
// }

// export default Viewer


import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import {
    AreaHighlight,
    Highlight,
    IHighlight,
    NewHighlight,
    PdfHighlighter,
    PdfLoader,
    Popup,
    Tip
} from '../react-pdf-highlighter';
import { useParams } from 'react-router-dom';
import { testHighlights as _testHighlights } from "../components/test-highlights";
import { Spinner } from '../components/Spinner';
import { Sidebar1 } from '../components/Viewer-Sidebar';
import '../components/style/Viewer.css';
import { ViewerNavbar } from '../components/ViewerNavbar';
import { request, gql } from 'graphql-request'
import { useLayout } from '../../../../../_metronic/layout/core';
import AppContext from '../../../../AppContext';
import { useAuth } from '../../../auth';
import BASEURL from '../../../../config/baseurl';


let sviewTo = (highlight: any) => { };

let scrollViewerTo = sviewTo;

let sviewToPage = (pageNumber: number) => { };

let scrollViewerToPage = sviewToPage;

const viewerFile = gql`
query ViewerFile($id: String!){
    viewerFile(id: $id){
          id
          fileName
          project{
            id
            projectName
            defaultContractType{
                id
                contractTypeName
            }
            catalogFile{
                id
                catalogName
            }
          }
          pages
          lock
          contractType{
            contractTypeName
          }
          userContractType{
            contractTypeName
          }
    }
}`

const assignUser = gql`
query AssignUserFile($id: String!){
    assignUserFile(fileId: $id){
      edges{
        node{
          id
          file{
            id
            fileName
            fileStatus
          }
          user{
            id
            username
            email
          }
        }
      }
    }
  }`


const lockFile = gql`
query Lock($id: String!, $user_id: String!) {
  lock(id: $id, userId: $user_id) {
    edges {
      node {
        pages
        filePath
        fileName
        project{
            id
            projectName
        }
        fileStatus
        lock
        lockedBy {
          email
          username
          role
        }
      }
    }
  }
}`

const catalogFields = gql`
query fields($id: Int!, $documenttype: String!) {
    fields(id: $id, documenttype: $documenttype) {
      edges {
        node {
          fieldId
          fieldName
        }
      }
    }
  }`

function Viewer() {
    const { id } = useParams();
    const { currentUser } = useAuth()
    const testHighlights: Record<string, Array<IHighlight>> = _testHighlights;
    const getNextId = () => String(Math.random()).slice(2);
    const { setViewerPageActive } = useContext(AppContext);
    const [url, setUrl] = useState("");
    const [data, setData] = useState<any[]>([])
    const [highlights, setHighlights] = useState<any[]>([]);
    const [PageNo, setPageNo] = useState(1);
    const [field, setField] = useState<any[]>([]);
    const [readMode, setReadMode] = useState(false)

    const { config } = useLayout()
    const { aside } = config
    console.log("type of aside", typeof (aside));

    console.log("aside mini", aside);

    console.log("minimized", !aside.minimized);

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
    console.log("backgroundColor", backgroundColor)
    const bootstrapColorToHexMapThumb: any = {
        'bg-white': '#ffffff',
        'bg-primary': '#009ef7',
        'bg-secondary': '#e1e3ea',
        'bg-success': '#50cd89',
        'bg-danger': '#f1416c',
        'bg-warning': '#ffc700',
        'bg-info': '#7239ea',
        'bg-light': '#f8f9fa',
        'bg-dark': '#343a40',
    };

    const bootstrapColorToHexMapTrack: any = {
        'bg-white': '#ffffff',
        'bg-primary': '#f1faff',
        'bg-secondary': '#f9f9f9',
        'bg-success': '#c9f7f5',
        'bg-danger': '#ffe2e5',
        'bg-warning': '#fff4de',
        'bg-info': '#eee5ff',
        'bg-light': '#f8f9fa',
        'bg-dark': '#f8f9fa',
    };

    const TrackhexCode = bootstrapColorToHexMapTrack[backgroundColor] || '#f1faff';
    const ThumbhexCode = bootstrapColorToHexMapThumb[backgroundColor] || '#0080FF';



    function changeScrollbarColor(trackcolor: any, thumbcolor: any) {
        const styleElement = document.createElement('style');
        styleElement.innerHTML = `
        .PdfHighlighter::-webkit-scrollbar-track {
            background-color: ${trackcolor} !important;
        }
        .PdfHighlighter::-webkit-scrollbar-thumb {
            background-color: ${thumbcolor} !important;
        }
        .v_sidebar::-webkit-scrollbar-track {
            background-color: ${trackcolor} !important;
        }
        .v_sidebar::-webkit-scrollbar-thumb {
            background-color: ${thumbcolor} !important;
        }
        `;
        document.head.appendChild(styleElement);
    }

    changeScrollbarColor(TrackhexCode, ThumbhexCode);


    useEffect(() => {
        if (!aside.minimized) {
            document.body.setAttribute('data-kt-aside-minimize', 'on')
            setViewerPageActive(true)

        }
        request(`${BASEURL}graphql/`, viewerFile, { id: id }, {Authorization: `Bearer ${localStorage.getItem('Token')}`}).then((res: any) => {
            setData(res.viewerFile)
        })
        request(`${BASEURL}graphql/`, assignUser, { id: id }, {Authorization: `Bearer ${localStorage.getItem('Token')}`}).then((res: any) => {
            // setData(res.viewerFile)
            console.log("Assign user detail--->", res.assignUserFile);

            let role = currentUser?.role
            console.log("user role", role);

            if (role == "Admin") {
                const assignedUser = res.assignUserFile?.edges[0].node.user;
                const currentUserId = currentUser?.email;
                console.log("Assign user detail assign detail", assignedUser, currentUserId, currentUser);

                if (assignedUser && assignedUser.email !== currentUserId) {
                    // If assigned to another user, set the viewer screen to read mode
                    setReadMode(true);
                }
            }
        })
    }, [])
    console.log("Viewer detail -->", data);
    const name = data?.fileName
    const foldername = data?.project?.projectName
    const defaultContractType = data?.project?.defaultContractType?.contractTypeName
    const totalPage = data?.pages
    const usercontractType = data?.userContractType?.contractTypeName
    const projectid = data?.project?.id
    const catalogId = data?.project?.catalogFile?.id
    console.log("filename", name);
    console.log("defaultctype", defaultContractType);
    console.log("userctype", usercontractType)

    let contractType: any = null

    if (usercontractType == null) {
        contractType = defaultContractType
    }
    else {
        contractType = usercontractType
    }

    console.log("contractType fields", contractType);




    useEffect(() => {
        console.log("Folder path valuesssss----", name, foldername)
        if (name !== undefined && foldername !== undefined) {
            getData(name, foldername);
        }
        request(`${BASEURL}graphql/`, lockFile, { id: id, user_id: currentUser?.id }, {Authorization: `Bearer ${localStorage.getItem('Token')}`}).then((res: any) => console.log(res.lock))
    }, [name, foldername, id])

    useEffect(() => {
        console.log("iddd", catalogId, contractType);
        if (catalogId !== undefined) {
            request(`${BASEURL}graphql/`, catalogFields, { id: catalogId, documenttype: contractType }, {Authorization: `Bearer ${localStorage.getItem('Token')}`}).then((res: any) => setField(res.fields))
        }
    }, [catalogId, contractType])
    console.log("Fieldsss--->", field);

    const getData = async (filename: any, projectname: any) => {
        console.log("useefff Folder path values", filename, projectname)
        const schema_name = localStorage.getItem('Schema') 
        const pdfURL = `/${schema_name}/${projectname}/${filename}.pdf`
        // const url1 = `/${projectname}/${filename}.json`
        const url1 = `${BASEURL}jsonfile/${projectname}/${filename}/`;
        setUrl(pdfURL)
        const queryParams = {
            user_id: currentUser?.id,
        };
        axios.get(url1, {
            params: queryParams,
            headers: {
                'content-type': "application/json",
                'Authorization': `Bearer ${localStorage.getItem('Token')}`
            }
        }).then(response => {
            setHighlights(response.data);
            console.log(response.data)
        })
            .catch(err => console.log(err));
    }

    const user = currentUser?.email



    // console.log("Viewer current user role, lock", role, lock);


    let setSearchVal = (searchVal: String) => { };

    const parseIdFromHash = () =>
        document.location.hash.slice("#highlight-".length);

    const resetHash = () => {
        document.location.hash = "";
    };

    const HighlightPopup = ({
        comment,
    }: {
        comment: { text: string; emoji: string };
    }) =>
        comment.text ? (
            <div className="Highlight__popup">
                {comment.emoji} {comment.text}
            </div>
        ) : null;

    const resetHighlights = () => {
        setHighlights([])
    };



    const SECONDARY_PDF_URL = "https://arxiv.org/pdf/1604.02480.pdf";
    const toggleDocument = () => {
        const newUrl =
            url === SECONDARY_PDF_URL ? "/pdf/Abrexa Pharmaceuticals Mutual Confidentiality and Non-Disclosure Agreement (2way_general) d. 6.8.18.pdf" : SECONDARY_PDF_URL;
        setUrl(newUrl);
        setHighlights(testHighlights[newUrl] ? [...testHighlights[newUrl]] : [])

    };

    const getHighlightById = (id: string) => {

        return highlights.find((highlight) => highlight.id === id);
    }

    const addHighlight = (highlight: NewHighlight) => {
        console.log("Saving highlight", highlight);
        // setHighlights([highlight])
        setHighlights([{ ...highlight, id: getNextId() }, ...highlights])
        // Handlesave([{ ...highlight, id: getNextId() }, ...highlights])
        Handlesave({ ...highlight, id: getNextId() })
    }

    const updateHighlight = (highlightId: string, position: Object, content: Object) => {
        console.log("Updating highlight", highlightId, position, content);

        setHighlights(highlights.map((h) => {
            const {
                id,
                position: originalPosition,
                content: originalContent,
                ...rest
            } = h;
            return id === highlightId
                ? {
                    id,
                    position: { ...originalPosition, ...position },
                    content: { ...originalContent, ...content },
                    ...rest,
                }
                : h;
        }),)
    }

    const scrollToHighlightFromHash = () => {
        const highlight = getHighlightById(parseIdFromHash());
        if (highlight && scrollViewerTo != sviewTo) {
            scrollViewerTo(highlight);
        }
    };

    console.log("Folder path values", name, foldername)
    console.log("pdfURL", url);

    const onPageNo = (e: any) => {
        console.log("onPageNo-->", e);
        setPageNo(e);
    }
    console.log("Highlights", highlights)

    const togglebutton = async (value: any) => {
        console.log("ToggleButton", value)
        const url = `${BASEURL}jsonfilesort/${foldername}/${name}/${value}/`
        // const url = `${http://127.0.0.1:8000/api/}jsonfilesort/${foldername}/${name}/${value}/`;

        axios.get(url, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('Token')}`
            }
        }).then((response: any) => {
            setHighlights(response.data);
        });
    };

    const Handlesave = (highlight: any) => {
        console.log("HandleSaving highlight", highlight);
        const url2 = `${BASEURL}jsonfile/${foldername}/${name}/`
        // const url2 = `${http://127.0.0.1:8000/api/}jsonfile/${foldername}/${name}/`;
        axios.post(url2, highlight, {
            headers: {
                'content-type': "application/json",
                'Authorization': `Bearer ${localStorage.getItem('Token')}`,
            }
        }).then(response => { setHighlights(response.data); console.log(response) });
    }

    const Handleedit = (text: any, id: any) => {
        // console.log("Val", val)
        console.log("Edited_text", text)
        console.log("Edit_HighlightId", id)
        const url2 = `${BASEURL}jsonfile/${foldername}/${name}/${id}/`
        // const url2 = `${http://127.0.0.1:8000/api/}jsonfile/${foldername}/${name}/${id}/`;
        axios.put(url2, { text, user},
            { headers: {
                'content-type': "text/plain",
                'Authorization': `Bearer ${localStorage.getItem('Token')}`,
            } 
        }).then(response => { setHighlights(response.data); console.log(response) });
    }

    const Handledelete = (highlight: any, id: any) => {
        console.log("highlight", highlight)
        console.log("HighlightId", id)
        const url2 = `${BASEURL}jsonfile/${foldername}/${name}/${id}/`
        axios.delete(url2,
{            headers: {
                'content-type': "text/plain",
                'Authorization': `Bearer ${localStorage.getItem('Token')}`,
            }}
        )
            .then((response: any) => { setHighlights(response.data); console.log(response); });

    }

    console.log("viewer data", url, highlights);



    return (
        <>
            <ViewerNavbar
                onChange={(fieldValue) => {
                    setSearchVal(fieldValue)
                }}
                highlights={highlights}
                onPageNo={PageNo}
                pages={totalPage}
                togglebutton={togglebutton}
                // close={close}    
                fileId={id}
                name={name}
                projectId={projectid}
                nextPage={(pageNumber) => {
                    scrollViewerToPage(pageNumber);
                }}
                scrollToView={scrollToHighlightFromHash}
                readOnly={readMode}
            />
            <div style={{ display: "flex", height: "75.5vh", paddingTop: '68px' }}>
                <div
                    id="pdf-viewer-container"
                    style={{
                        // height: "88vh",
                        // width: "75vw",
                        width:"calc(100% - 350px)",
                        position: "relative",
                        zIndex: '99',
                        transition: 'width 0.3s ease',
                    }}
                >
                    <PdfLoader url={url} beforeLoad={<Spinner />}>
                        {(pdfDocument) => (
                            <PdfHighlighter
                                pdfDocument={pdfDocument}
                                enableAreaSelection={(event) => event.altKey}
                                onPageNo={onPageNo}
                                onScrollChange={resetHash}
                                // pdfScaleValue="page-width"
                                scrollRef={(scrollTo, scrollToPage) => {
                                    scrollViewerTo = scrollTo;
                                    scrollViewerToPage = scrollToPage;
                                    scrollToHighlightFromHash();
                                }}
                                onSelectionFinished={(
                                    position,
                                    content,
                                    hideTipAndSelection,
                                    transformSelection
                                ) => (
                                    <Tip
                                        onOpen={transformSelection}
                                        fields={field}
                                        docType={usercontractType}
                                        readMode={readMode}
                                        onConfirm={(comment) => {
                                            addHighlight({ content, position, comment });

                                            hideTipAndSelection();
                                        }} />
                                )}
                                highlightTransform={(
                                    highlight,
                                    index,
                                    setTip,
                                    hideTip,
                                    viewportToScaled,
                                    screenshot,
                                    isScrolledTo
                                ) => {
                                    const isTextHighlight = !Boolean(
                                        highlight.content && highlight.content.image
                                    );

                                    const component = isTextHighlight ? (
                                        <Highlight
                                            isScrolledTo={isScrolledTo}
                                            highlight={highlights}
                                            position={highlight.position}
                                            comment={highlight.comment}
                                            scrollToView={scrollToHighlightFromHash} />
                                    ) : (
                                        <AreaHighlight
                                            isScrolledTo={isScrolledTo}
                                            highlight={highlight}
                                            onChange={(boundingRect) => {
                                                updateHighlight(
                                                    highlight.id,
                                                    { boundingRect: viewportToScaled(boundingRect) },
                                                    { image: screenshot(boundingRect) }
                                                );
                                            }} />
                                    );

                                    return (
                                        <Popup
                                            popupContent={<HighlightPopup {...highlight} />}
                                            onMouseOver={(popupContent) => setTip(highlight, (highlight) => popupContent)}
                                            onMouseOut={hideTip}
                                            key={index}
                                            children={component} />
                                    );
                                }}
                                highlights={highlights} />
                        )}
                    </PdfLoader>
                </div>
                <Sidebar1
                    highlights={highlights}
                    pages={totalPage}
                    resetHighlights={resetHighlights}
                    toggleDocument={toggleDocument}
                    Handledelete={(highlight, id) => Handledelete(highlight, id)}
                    Handleedit={(text, id) => Handleedit(text, id)}
                    scrollToView={scrollToHighlightFromHash}
                    onInit={(setSearch) => {
                        setSearchVal = setSearch
                    }}
                    readOnly={readMode}
                />
            </div>
        </>

    )
}

export default Viewer