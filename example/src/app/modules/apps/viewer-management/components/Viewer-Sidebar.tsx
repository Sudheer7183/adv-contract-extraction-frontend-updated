// import React, { useEffect, useState } from "react";
// import type { IHighlight } from "../react-pdf-highlighter";
// import { AiFillDelete } from "react-icons/ai";
// import { MdEdit, MdOutlineClose } from "react-icons/md";
// import { FcCheckmark } from "react-icons/fc";
// import Modal from '@mui/material/Modal';
// import { Form } from '@tsed/react-formio';
// import Box from '@mui/material/Box';
// import Button from '@mui/material/Button';
// import { Theme } from "@mui/system";
// import clsx from 'clsx'

// const Backdrop = React.forwardRef<
//   HTMLDivElement,
//   { open?: boolean; className: string }
// >((props, ref) => {
//   const { open, className, ...other } = props;
//   return (
//     <div
//       className={clsx({ 'MuiBackdrop-open': open })}
//       ref={ref}
//       {...other}
//     />
//   );
// });

// const style = (theme: Theme) => ({
//   position: 'absolute' as 'absolute',
//   top: '50%',
//   left: '85%',
//   transform: 'translate(-50%, -50%)',
//   width: 400,
//   backgroundColor: theme.palette.mode === 'dark' ? '#0A1929' : 'white',
//   border: '1px solid #000',
//   boxShadow: '0 0 25px rgba(0, 0, 0, 0.6)',
//   // boxShadow: 24,
//   p: 1,
// });

// interface Props {
//   highlights: Array<IHighlight>;
//   pages: number;
//   resetHighlights: () => void;
//   toggleDocument: () => void;
//   Handledelete: (highlight: any, id: any) => void;
//   Handleedit: (text: any, id: any) => void;
//   scrollToView: () => void;
//   onInit: (setState: any) => void;
//   readOnly: boolean;
// }

// const updateHash = (highlight: IHighlight) => {
//   // console.log("Index_Value", highlight.id)
//   document.location.hash = `highlight-${highlight.id}`;
// };


// export function Sidebar1({
//   highlights,
//   pages,
//   toggleDocument,
//   resetHighlights,
//   Handledelete,
//   Handleedit,
//   scrollToView,
//   onInit,
//   readOnly,
// }: Props) {

//   const [search, setSearch] = useState("");
//   const [showSave, setShowSave] = useState(false);
//   const [open3, setOpen3] = useState(false);
//   const [text, setText] = useState("");
//   const [id, setId] = useState("");
//   const [idx, setIdx] = useState(0);
//   const [openWarning, setOpenWarning] = useState(false);
//   const [highlightToDelete, setHighlightToDelete] = useState<IHighlight | null>(null);
//   const [openConfirm, setOpenConfirm] = useState(false);
//   const [fieldName, setFieldName] = useState("")
//   const [selectedOccurrences, setSelectedOccurrences] = useState<any>({});
//   console.log("go to oninit", onInit);

//   if (onInit != null) {
//     onInit(setSearch);
//   }

//   if (search == "All") {
//     setSearch("")
//   }

//   function handlesearch(e: any) {
//     setSearch(e.target.value);
//   }

//   const handleSave = (e: any) => {
//     setShowSave(!showSave);
//     console.log("edit save", text, id);
//     Handleedit(text, id);
//     setOpen3(false);
//   }

//   const handleChange = (c: any, id: any) => {
//     // console.log(c.currentTarget.textContent, id);
//     setText(c.currentTarget.textContent);
//     setId(id);
//   }

//   const handleOpen1 = (id: any) => {
//     let index = highlights.findIndex(obj => obj.id === id)
//     console.log("open index", index);
//     setOpen3(true);
//     setIdx(index)
//   }
//   const handleClose1 = () => setOpen3(false);

//   const handleOpen2 = (highlight: IHighlight) => {
//     setHighlightToDelete(highlight);
//     setFieldName(highlight.comment.text.replace(/\(\d+\/\d+\)$/, ''))
//     setOpenWarning(true);
//   };
//   const handleDeleteClick = (highlight: IHighlight) => {
//     setHighlightToDelete(highlight);
//     setOpenConfirm(true);
//   };
//   const handleDeleteOk = async () => {
//     if (highlightToDelete) {
//       console.log("handleDeleteOk", highlightToDelete);
//       try {
//         await Handledelete(highlightToDelete, highlightToDelete.id);
//       } catch (error) {
//         console.error('Error deleting data:', error);
//       }
//     }
//     setOpenConfirm(false)
//   };

//   const handleCloseWarning = () => {
//     setOpenWarning(false);
//   };

//   const handleDeleteConfirmed = async () => {
//     // Perform the delete operation here
//     if (highlightToDelete) {
//       console.log("Delete the other occurrence", highlightToDelete);
//       const fieldName = highlightToDelete.comment.text.replace(/\(\d+\/\d+\)$/, '');
//       console.log("delete fieldName", fieldName);
//       const remainingOccurrences = highlights.filter(item => item.comment.text.replace(/\(\d+\/\d+\)$/, '') === fieldName);
//       console.log("delete remaining occurence", remainingOccurrences);
//       let deleteCount = 0;
//       for (const item of remainingOccurrences) {
//         if (item.id !== highlightToDelete.id && deleteCount < remainingOccurrences.length) {
//           console.log("Delete Remove", item);
//           await new Promise(resolve => setTimeout(resolve, 500)); // Introduce a delay of 1000 milliseconds (1 second)
//           try {
//             await Handledelete(item, item.id);
//             deleteCount++;
//           } catch (error) {
//             console.error('Error deleting data:', error);
//           }
//         }
//       }
//     }
//     setOpenWarning(false);
//   }

//   const handleSubmit = (data: any) => {
//     console.log("datavalue", data.changed.value);
//     const val = highlights.filter((obj, index): any => index == idx)
//     console.log("val->", val[0].id)
//     setText(data.changed.value);
//     setId(val[0].id);
//   }
//   console.log("highlights", highlights[idx]?.position?.form);
//   const f1 = highlights[idx]?.position?.form


//   const counts: any = []
//   const TotalPage = pages;

//   highlights.forEach(function (highlight) { counts[highlight.comment.text] = (counts[highlight.comment.text] || 0) + 1; });
//   const highlighter: any = highlights.map(ele => {
//     const noOccurence = highlights.filter(obj => obj.comment.text === ele.comment.text).length;
//     if (counts[ele.comment.text] > 1) {
//       let Totalfieldcounts = counts[ele.comment.text] || 1;

//       const fieldcount = Totalfieldcounts - noOccurence + 1
//       ele.comment.text = `${ele.comment.text} (${fieldcount}/${Totalfieldcounts})`
//       counts[ele.comment.text] = Totalfieldcounts + 1;
//     }
//     return ele;
//   })
//   const updatedHash = (id: any) => {
//     console.log("Index_Value", id)
//     document.location.hash = `highlight-${id}`;
//   };

//   const updateHash1 = (text: any) => {
//     console.log("Index_Value", text)
//     // document.location.hash = `highlight-${highlight.id}`;
//     const Comment: any[] = highlights.filter((obj: any) => obj.comment.text === text);
//     console.log("Index comment", Comment)
//     let id = Comment[0].id
//     document.location.hash = `highlight-${id}`;
//   };

//   const uniqueFieldNames = [...new Set(highlights.map((highlight) => {
//     // Remove the occurrence count (e.g., (1/2)) if it exists
//     return highlight.comment.text.replace(/\(\d+\/\d+\)$/, '');
//   }))];
//   console.log("uniqueFieldNames", uniqueFieldNames);


//   useEffect(() => {
//     const initialSelectedOccurrences: any = {};
//     uniqueFieldNames.forEach((fieldName) => {
//       const fieldOccurrences = highlights.filter(
//         (highlight) =>
//           highlight.comment.text.replace(/\(\d+\/\d+\)$/, '') === fieldName
//       );
//       if (fieldOccurrences.length > 1) {
//         // Set the default value for the dropdown to the ID of the first occurrence
//         initialSelectedOccurrences[fieldName] = fieldOccurrences[0].id;
//       }
//     });
//     setSelectedOccurrences(initialSelectedOccurrences);
//   }, [highlights]);


//   const handleFieldDropdownChange = (fieldName: any, selectedValue: any) => {
//     // Create a copy of the selectedOccurrences object
//     const updatedSelectedOccurrences = { ...selectedOccurrences };
//     // Update the selected value for the fieldName
//     updatedSelectedOccurrences[fieldName] = selectedValue;
//     setSelectedOccurrences(updatedSelectedOccurrences);


//     // Handle any other actions you need here
//     updatedHash(selectedValue);
//     scrollToView();
//   };


//   console.log("newMyArr", highlighter);
//   return (
//     <>
//       <div className="v_sidebar" style={{ width: "32vw" }}>
//         <div className="description" style={{ padding: "4px" }}>
//           <p style={{ fontSize: "15px" }}>
//             <div>
//               <input
//                 type="text"
//                 className='search-input form-control ps-13 fs-7 h-35px'
//                 value={search}
//                 placeholder="Search Field Name Here..."
//                 onChange={handlesearch}
//                 readOnly={readOnly}
//               />
//             </div>
//           </p>
//           <p>
//             <small>
//               To add new field, highlight the required text.
//             </small>
//           </p>
//         </div>
//         <ul className="sidebar__highlights">
//           {uniqueFieldNames
//             .filter((fieldName: any) => {
//               console.log("fieldname", fieldName);
//               if (search === "") {
//                 return true; // Show all field names if search is empty
//               } else {
//                 // Use the includes() method to check if the field name includes the search term
//                 return fieldName.toLowerCase().includes(search.toLowerCase());
//               }
//             })
//             .map((fieldName: any) => {
//               const fieldOccurrences = highlights.filter(
//                 (highlight) =>
//                   highlight.comment.text.replace(/\(\d+\/\d+\)$/, "") === fieldName);
//               // Check if there are multiple occurrences for this field
//               if (fieldOccurrences.length > 1) {
//                 console.log("fieldoccur", fieldOccurrences);
//                 return (
//                   <li key={fieldName}>
//                     <div>
//                       <tr>
//                         <td style={{ width: '10%' }}>
//                           <select
//                             // className="form-select form-select-solid"
//                             // style={{ width: '100%', background: '#f8c8dc' }}
//                             onChange={(e) => {
//                               handleFieldDropdownChange(fieldName, e.target.value)
//                             }}
//                             value={selectedOccurrences[fieldName]}
//                           // disabled={readOnly}
//                           >
//                             {fieldOccurrences.map((occurrence) => (
//                               <option key={occurrence.id} value={occurrence.id}>
//                                 {occurrence.comment.text}
//                               </option>
//                             ))}
//                           </select>
//                         </td>
//                         <td className="sidebar__td">
//                           {/* <FcCheckmark
//                             className="sidebar__edit"
//                             onClick={() => {
//                               handleOpen2(fieldOccurrences[0]);
//                               updateHash(fieldOccurrences[0]);
//                               scrollToView();
//                             }}
//                           /> */}
//                           {readOnly ? null : (
//                             <MdEdit
//                               className="sidebar__edit"
//                               onClick={() => {
//                                 if (!readOnly) { // Only allow edit if not in read-only mode
//                                   const selectedOccurrence = fieldOccurrences.find(
//                                     (occurrence) => occurrence.id === selectedOccurrences[fieldName]
//                                   );
//                                   if (selectedOccurrence) {
//                                     handleOpen1(selectedOccurrence.id);
//                                     updateHash(selectedOccurrence);
//                                     scrollToView();
//                                   }
//                                 }
//                               }}
//                             />
//                           )}
//                           {/* <MdEdit
//                             className="sidebar__edit"
//                             onClick={() => {
//                               const selectedOccurrence = fieldOccurrences.find(
//                                 (occurrence) => occurrence.id === selectedOccurrences[fieldName]
//                               );
//                               if (selectedOccurrence) {
//                                 handleOpen1(selectedOccurrence.id);
//                                 updateHash(selectedOccurrence);
//                                 scrollToView();
//                               }
//                             }}
//                           /> */}
//                           {/* <AiFillDelete
//                             className="sidebar__delete"
//                             onClick={() => {
//                               const selectedOccurrence = fieldOccurrences.find(
//                                 (occurrence) => occurrence.id === selectedOccurrences[fieldName]
//                               );
//                               if (selectedOccurrence) {
//                                 handleDeleteClick(selectedOccurrence);
//                               }
//                             }}
//                           /> */}
//                           {readOnly ? null : (
//                             <AiFillDelete
//                               className="sidebar__delete"
//                               onClick={() => {
//                                 if (!readOnly) { // Only allow delete if not in read-only mode
//                                   const selectedOccurrence = fieldOccurrences.find(
//                                     (occurrence) => occurrence.id === selectedOccurrences[fieldName]
//                                   );
//                                   if (selectedOccurrence) {
//                                     handleDeleteClick(selectedOccurrence);
//                                   }
//                                 }
//                               }}
//                             />
//                           )}
//                           <div>
//                             <Modal
//                               open={open3}
//                               onClose={handleClose1}
//                               aria-labelledby="modal-modal-title"
//                               aria-describedby="modal-modal-description"
//                               slots={{ backdrop: Backdrop }}
//                             >
//                               <Box sx={style}>
//                                 <Form form={f1} onChange={handleSubmit} />
//                                 <div style={{ marginLeft: '60%' }}>
//                                   <tr>
//                                     <td style={{ color: "black" }}><Button onClick={handleClose1}><MdOutlineClose />&nbsp;Cancel</Button></td>
//                                     <td style={{ color: "black" }}><Button onClick={handleSave}><FcCheckmark />&nbsp;Ok</Button></td>
//                                   </tr>
//                                 </div>
//                               </Box>
//                             </Modal>
//                           </div>
//                         </td>
//                       </tr>
//                     </div>
//                     <div className="sidebar__highlight"
//                       onClick={() => {
//                         updatedHash(selectedOccurrences[fieldName]);
//                         scrollToView();
//                       }}
//                     >
//                       {fieldOccurrences
//                         .filter((occurrence) => occurrence.id === selectedOccurrences[fieldName])
//                         .map((selectedOccurrence) => (
//                           <>
//                             <p key={selectedOccurrence.id}>
//                               {selectedOccurrence.content.text}
//                             </p><div className="highlight__location">
//                               <b>Page {selectedOccurrence.position.pageNumber}/{TotalPage}</b>
//                             </div>
//                           </>
//                         ))}


//                     </div>
//                   </li>
//                 );
//               } else {
//                 // Render without a dropdown if there's only one occurrence
//                 return (
//                   <li key={fieldName}>
//                     <div>
//                       <tr>
//                         <td style={{ width: '10%' }}>
//                           <b style={{ fontSize: "15px" }}>{fieldName}</b>
//                         </td>
//                         <td className="sidebar__td">
//                           {/* <FcCheckmark
//                             className="sidebar__edit"
//                             onClick={() => {
//                               handleOpen2(fieldOccurrences[0]);
//                               updateHash(fieldOccurrences[0]);
//                               scrollToView();
//                             }}
//                           /> */}
//                           {/* <MdEdit
//                             className="sidebar__edit"
//                             onClick={() => {
//                               handleOpen1(fieldOccurrences[0].id);
//                               updateHash(fieldOccurrences[0]);
//                               scrollToView();
//                             }}
//                           />
//                           <AiFillDelete
//                             className="sidebar__delete"
//                             onClick={() => {
//                               handleDeleteClick(fieldOccurrences[0]);
//                             }}
//                           /> */}
//                           {readOnly ? null : (
//                             <MdEdit
//                               className="sidebar__edit"
//                               onClick={() => {
//                                 if (!readOnly) { // Only allow edit if not in read-only mode
//                                   handleOpen1(fieldOccurrences[0].id);
//                                   updateHash(fieldOccurrences[0]);
//                                   scrollToView();
//                                 }
//                               }}
//                             />
//                           )}
//                           {readOnly ? null : (
//                             <AiFillDelete
//                               className="sidebar__delete"
//                               onClick={() => {
//                                 if (!readOnly) { // Only allow delete if not in read-only mode
//                                   handleDeleteClick(fieldOccurrences[0]);
//                                 }
//                               }}
//                             />
//                           )}
//                           <div>
//                             <Modal
//                               open={open3}
//                               onClose={handleClose1}
//                               aria-labelledby="modal-modal-title"
//                               aria-describedby="modal-modal-description"
//                               slots={{ backdrop: Backdrop }}
//                             >
//                               <Box sx={style}>
//                                 <Form form={f1} onChange={handleSubmit} />
//                                 <div style={{ marginLeft: '60%' }}>
//                                   <tr>
//                                     <td style={{ color: "black" }}><Button onClick={handleClose1}><MdOutlineClose />&nbsp;Cancel</Button></td>
//                                     <td style={{ color: "black" }}><Button onClick={handleSave}><FcCheckmark />&nbsp;Ok</Button></td>
//                                   </tr>
//                                 </div>
//                               </Box>
//                             </Modal>
//                           </div>
//                         </td>
//                       </tr>
//                     </div>
//                     <div className="sidebar__highlight" onClick={() => {
//                       updateHash1(fieldName);
//                       scrollToView();
//                     }}>
//                       {fieldOccurrences.map((occurrence) => (
//                         <>
//                           <p key={occurrence.id}>
//                             {occurrence.content.text}
//                           </p>
//                           <div className="highlight__location">
//                             <b>Page {occurrence.position.pageNumber}/{TotalPage}</b>
//                           </div>
//                           {/* <div
//                             className="highlight__image"
//                             style={{ marginTop: "0.5rem" }}
//                           >
//                             <img src={occurrence.content.image} alt={"Screenshot"} />
//                           </div> */}
//                         </>
//                       ))}
//                     </div>
//                   </li>
//                 );
//               }
//             })}
//         </ul>
//         {/* <ul className="sidebar__highlights">
//           {highlights
//             .filter((highlight: any) => {
//               if (search == "") {
//                 return highlight;
//               } else if (
//                 highlight.comment.text.toLowerCase().includes(search.toLowerCase())
//               ) {
//                 console.log("search value", highlight)
//                 return highlight;
//               }
//             })
//             .map((highlight, index) => (
//               <li
//                 key={index}
//               >
//                 <div>
//                   <tr>
//                     <td style={{ width: '10%' }}><b style={{ fontSize: "15px" }}>{highlight.comment.text}</b></td>
//                     <td className="sidebar__td">
//                       {highlight.comment.text.match(/\((\d+)\/(\d+)\)$/) ?
//                         <FcCheckmark className="sidebar__edit" onClick={() => { handleOpen2(highlight); updateHash(highlight); scrollToView(); }} />
//                         : null} &nbsp;
//                       <MdEdit className="sidebar__edit" onClick={() => {
//                         handleOpen1(highlight.id); updateHash(highlight);
//                         scrollToView();
//                       }} />&nbsp;
//                       <AiFillDelete className="sidebar__delete" onClick={() => {
//                         handleDeleteClick(highlight)
//                       }} />
//                       <div>
//                         <Modal
//                           open={open3}
//                           onClose={handleClose1}
//                           aria-labelledby="modal-modal-title"
//                           aria-describedby="modal-modal-description"
//                           slots={{ backdrop: Backdrop }}
//                         >
//                           <Box sx={style}>
//                             <Form form={f1} onChange={handleSubmit} />
//                             <div style={{ marginLeft: '60%' }}>
//                               <tr>
//                                 <td style={{ color: "black" }}><Button onClick={handleClose1}><MdOutlineClose />&nbsp;Cancel</Button></td>
//                                 <td style={{ color: "black" }}><Button onClick={handleSave}><FcCheckmark />&nbsp;Ok</Button></td>
//                               </tr>
//                             </div>
//                           </Box>
//                         </Modal>
//                       </div>
//                     </td>
//                   </tr>

//                 </div>

//                 <div className="sidebar__highlight" onClick={() => {
//                   updateHash(highlight);
//                   scrollToView();
//                 }}>
//                   {highlight.content.text ? (
//                     <p style={{ marginTop: "0.5rem" }}
//                       onInput={(e) => { handleChange(e, highlight.id) }}
//                     >
//                       {`${highlight.content.text.slice(0, 100).trim()}…`}
//                     </p>
//                   ) : null}
//                   {highlight.content.image ? (
//                     <div
//                       className="highlight__image"
//                       style={{ marginTop: "0.5rem" }}
//                     >
//                       <img src={highlight.content.image} alt={"Screenshot"} />
//                     </div>
//                   ) : null}
//                   <div className="highlight__location">
//                     <b>Page {highlight.position.pageNumber}/{TotalPage}</b>
//                   </div>
//                 </div>
//               </li>
//             ))}
//         </ul> */}
//         <Modal
//           open={openWarning}
//           onClose={handleCloseWarning}
//           aria-labelledby="modal-modal-title"
//           aria-describedby="modal-modal-description"
//           slots={{ backdrop: Backdrop }}
//         >
//           <Box sx={style}>
//             <h3>Warning!</h3>
//             <p style={{ color: 'black' }}>Are you sure want to delete the other " {fieldName}" field occurences?</p>
//             <div style={{ marginLeft: '60%' }}>
//               <Button onClick={handleCloseWarning}>
//                 <MdOutlineClose onClick={handleCloseWarning} />&nbsp;Cancel
//               </Button>
//               <Button onClick={handleDeleteConfirmed}>
//                 <FcCheckmark onClick={handleDeleteConfirmed} />&nbsp;Ok
//               </Button>
//             </div>
//           </Box>
//         </Modal>
//         <Modal
//           open={openConfirm}
//           onClose={() => setOpenConfirm(false)}
//           aria-labelledby="modal-modal-title"
//           aria-describedby="modal-modal-description"
//           slots={{ backdrop: Backdrop }}
//         >
//           <Box sx={style}>
//             <h3>Warning!</h3>
//             <p style={{ color: 'black' }}>Are you sure want to delete the selected field?</p>
//             <div style={{ marginLeft: '55%' }}>
//               <Button onClick={() => setOpenConfirm(false)}>
//                 <MdOutlineClose onClick={() => setOpenConfirm(false)} />&nbsp;Cancel
//               </Button>
//               <Button onClick={handleDeleteOk}>
//                 <FcCheckmark onClick={handleDeleteOk} />&nbsp;Ok
//               </Button>
//             </div>
//           </Box>
//         </Modal>
//       </div>
//     </>
//   );
// }



// import React, { useEffect, useState } from "react";
// import type { IHighlight } from "../react-pdf-highlighter";
// import { AiFillDelete } from "react-icons/ai";
// import { MdEdit, MdOutlineClose, MdExpandMore, MdExpandLess, MdChevronLeft, MdChevronRight } from "react-icons/md";
// import { FcCheckmark } from "react-icons/fc";
// import { BiChevronDown, BiChevronRight } from "react-icons/bi";
// import Modal from '@mui/material/Modal';
// import { Form } from '@tsed/react-formio';
// import Box from '@mui/material/Box';
// import Button from '@mui/material/Button';
// import { Theme } from "@mui/system";
// import clsx from 'clsx'
// import './EnhancedSidebar.css';

// const Backdrop = React.forwardRef<
//   HTMLDivElement,
//   { open?: boolean; className: string }
// >((props, ref) => {
//   const { open, className, ...other } = props;
//   return (
//     <div
//       className={clsx({ 'MuiBackdrop-open': open })}
//       ref={ref}
//       {...other}
//     />
//   );
// });

// const style = (theme: Theme) => ({
//   position: 'absolute' as 'absolute',
//   top: '50%',
//   left: '85%',
//   transform: 'translate(-50%, -50%)',
//   width: 400,
//   backgroundColor: theme.palette.mode === 'dark' ? '#0A1929' : 'white',
//   border: '1px solid #000',
//   boxShadow: '0 0 25px rgba(0, 0, 0, 0.6)',
//   p: 1,
// });

// interface Props {
//   highlights: Array<IHighlight>;
//   pages: number;
//   resetHighlights: () => void;
//   toggleDocument: () => void;
//   Handledelete: (highlight: any, id: any) => void;
//   Handleedit: (text: any, id: any) => void;
//   scrollToView: () => void;
//   onInit: (setState: any) => void;
//   readOnly: boolean;
// }

// const updateHash = (highlight: IHighlight) => {
//   document.location.hash = `highlight-${highlight.id}`;
// };

// export function Sidebar1({
//   highlights,
//   pages,
//   toggleDocument,
//   resetHighlights,
//   Handledelete,
//   Handleedit,
//   scrollToView,
//   onInit,
//   readOnly,
// }: Props) {

//   const [search, setSearch] = useState("");
//   const [showSave, setShowSave] = useState(false);
//   const [open3, setOpen3] = useState(false);
//   const [text, setText] = useState("");
//   const [id, setId] = useState("");
//   const [idx, setIdx] = useState(0);
//   const [openWarning, setOpenWarning] = useState(false);
//   const [highlightToDelete, setHighlightToDelete] = useState<IHighlight | null>(null);
//   const [openConfirm, setOpenConfirm] = useState(false);
//   const [fieldName, setFieldName] = useState("")
//   const [selectedOccurrences, setSelectedOccurrences] = useState<any>({});
  
//   const [expandedFields, setExpandedFields] = useState<{ [key: string]: boolean }>({});
//   const [showDescription, setShowDescription] = useState<{ [key: string]: boolean }>({});
  
//   // State for sidebar collapse
//   const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

//   console.log("go to oninit", onInit);

//   if (onInit != null) {
//     onInit(setSearch);
//   }

//   if (search == "All") {
//     setSearch("")
//   }

//   function handlesearch(e: any) {
//     setSearch(e.target.value);
//   }

//   const handleSave = (e: any) => {
//     setShowSave(!showSave);
//     console.log("edit save", text, id);
//     Handleedit(text, id);
//     setOpen3(false);
//   }

//   const toggleFieldExpansion = (fieldName: string) => {
//     setExpandedFields(prev => ({
//       ...prev,
//       [fieldName]: !prev[fieldName]
//     }));
//   };

//   const toggleDescription = (fieldName: string) => {
//     setShowDescription(prev => ({
//       ...prev,
//       [fieldName]: !prev[fieldName]
//     }));
//   };

//   // Toggle sidebar and adjust PDF viewer width
//   const toggleSidebarCollapse = () => {
//     setIsSidebarCollapsed(prev => {
//       const newState = !prev;
      
//       // Adjust PDF viewer width
//       const pdfContainer = document.getElementById('pdf-viewer-container');
//       if (pdfContainer) {
//         if (newState) {
//           // Collapsed: PDF takes more space
//           pdfContainer.style.width = 'calc(100% - 50px)';
//         } else {
//           // Expanded: PDF normal width
//           pdfContainer.style.width = 'calc(100% - 350px)';
//         }
//       }
      
//       return newState;
//     });
//   };

//   const TotalPage = pages;
//   const f1: any = {
//     components: [
//       {
//         "label": `Edit ${fieldName}`,
//         "autoExpand": false,
//         "tableView": true,
//         "key": "panel",
//         "type": "panel",
//         "input": false,
//         "components": [
//           {
//             "label": "Text",
//             "autoExpand": false,
//             "tableView": true,
//             "key": "text",
//             "type": "textarea",
//             "input": true
//           }
//         ]
//       }
//     ]
//   };

//   const handleSubmit = (e: any) => {
//     setText(e.data.text)
//   }

//   const handleOpen1 = (ids: any) => {
//     setOpen3(true);
//     setId(ids);
//     setIdx(idx + 1);
//   };

//   const handleClose1 = () => {
//     setOpen3(false);
//   };

//   const handleDeleteClick = (highlight: IHighlight) => {
//     setHighlightToDelete(highlight);
//     setOpenWarning(true);
//   };

//   const handleCloseWarning = () => {
//     setOpenWarning(false);
//     setHighlightToDelete(null);
//   };

//   const handleConfirmDelete = () => {
//     if (highlightToDelete) {
//       Handledelete(highlightToDelete, highlightToDelete.id);
//       setOpenWarning(false);
//       setHighlightToDelete(null);
//       setOpenConfirm(true);
//     }
//   };

//   const updatedHash = (highlightId: any) => {
//     const highlight = highlights.find((h) => h.id === highlightId);
//     if (highlight) {
//       updateHash(highlight);
//     }
//   };

//   const groupedHighlights = highlights.reduce((acc: any, highlight) => {
//     const fieldNameWithoutOccurrence = highlight.comment.text.replace(/\(\d+\/\d+\)$/, '').trim();
//     if (!acc[fieldNameWithoutOccurrence]) {
//       acc[fieldNameWithoutOccurrence] = [];
//     }
//     acc[fieldNameWithoutOccurrence].push(highlight);
//     return acc;
//   }, {});

//   useEffect(() => {
//     const initialSelections: any = {};
//     const initialExpanded: any = {};
//     Object.keys(groupedHighlights).forEach((fieldName) => {
//       const fieldOccurrences = groupedHighlights[fieldName];
//       if (fieldOccurrences.length > 0) {
//         initialSelections[fieldName] = fieldOccurrences[0].id;
//         initialExpanded[fieldName] = false;
//       }
//     });
//     setSelectedOccurrences(initialSelections);
//     setExpandedFields(initialExpanded);
//   }, [highlights]);

//   const handleOccurrenceChange = (fieldName: string, selectedId: string) => {
//     setSelectedOccurrences((prev: any) => ({
//       ...prev,
//       [fieldName]: selectedId,
//     }));
//   };

//   const filteredHighlights = Object.keys(groupedHighlights)
//     .filter((fieldName) => fieldName.toLowerCase().includes(search.toLowerCase()))
//     .reduce((acc: any, fieldName) => {
//       acc[fieldName] = groupedHighlights[fieldName];
//       return acc;
//     }, {});

//   return (
//     <div style={{ 
//       position: 'relative', 
//       display: 'flex',
//       height: '100%',
//       width: isSidebarCollapsed ? '50px' : '350px',
//       transition: 'width 0.3s ease'
//     }}>
//       {/* Toggle Button - On LEFT side of sidebar (right edge of PDF) */}
//       <button
//         onClick={toggleSidebarCollapse}
//         style={{
//           position: 'absolute',
//           left: '-16px', // Position on left edge (overlaps PDF)
//           top: '50%',
//           transform: 'translateY(-50%)',
//           zIndex: 1001,
//           backgroundColor: '#3b82f6',
//           color: 'white',
//           border: 'none',
//           borderRadius: '50%',
//           width: '32px',
//           height: '32px',
//           cursor: 'pointer',
//           display: 'flex',
//           alignItems: 'center',
//           justifyContent: 'center',
//           boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
//           transition: 'all 0.3s ease'
//         }}
//         title={isSidebarCollapsed ? "Expand Fields" : "Collapse Fields"}
//       >
//         {isSidebarCollapsed ? <MdChevronLeft size={20} /> : <MdChevronRight size={20} />}
//       </button>

//       {/* Sidebar Content */}
//       <div 
//         className="enhanced-sidebar v_sidebar" 
//         style={{ 
//           width: '100%',
//           height: "67.8vh",
//           overflowY: isSidebarCollapsed ? "hidden" : "auto",
//           overflowX: "hidden",
//           borderLeft: '1px solid #e5e7eb'
//         }}
//       >
//         {!isSidebarCollapsed && (
//           <>
//             <div className="sidebar-search-container" style={{ 
//               backgroundColor: "#fff", 
//               padding: "12px", 
//               borderBottom: "1px solid #e5e7eb"
//             }}>
//               <input
//                 type="text"
//                 placeholder="Search Field Name Here..."
//                 className="form-control"
//                 value={search}
//                 onChange={handlesearch}
//                 style={{
//                   width: "100%",
//                   padding: "8px 12px",
//                   border: "1px solid #d1d5db",
//                   borderRadius: "6px",
//                   fontSize: "14px"
//                 }}
//               />
//               <div style={{ 
//                 marginTop: "8px", 
//                 fontSize: "12px", 
//                 color: "#6b7280",
//                 fontStyle: "italic"
//               }}>
//                 To add new field, highlight the required text.
//               </div>
//             </div>

//             <ul className="sidebar__highlights" style={{ padding: "8px", margin: 0 }}>
//               {Object.keys(filteredHighlights).map((fieldName) => {
//                 const fieldOccurrences = filteredHighlights[fieldName];
//                 const isExpanded = expandedFields[fieldName];
//                 const showDesc = showDescription[fieldName];
//                 const selectedOccurrence = fieldOccurrences.find(
//                   (occ: any) => occ.id === selectedOccurrences[fieldName]
//                 ) || fieldOccurrences[0];

//                 return (
//                   <li key={fieldName} className="field-item" style={{ 
//                     marginBottom: "8px",
//                     border: "1px solid #e5e7eb",
//                     borderRadius: "8px",
//                     overflow: "hidden",
//                     backgroundColor: "#fff"
//                   }}>
//                     <div 
//                       className="field-header"
//                       style={{
//                         padding: "12px",
//                         backgroundColor: "#f9fafb",
//                         borderBottom: isExpanded ? "1px solid #e5e7eb" : "none",
//                         cursor: "pointer",
//                         display: "flex",
//                         justifyContent: "space-between",
//                         alignItems: "center"
//                       }}
//                       onClick={() => toggleFieldExpansion(fieldName)}
//                     >
//                       <div style={{ display: "flex", alignItems: "center", gap: "8px", flex: 1 }}>
//                         {isExpanded ? (
//                           <BiChevronDown size={20} style={{ color: "#6b7280" }} />
//                         ) : (
//                           <BiChevronRight size={20} style={{ color: "#6b7280" }} />
//                         )}
//                         <span style={{ fontWeight: 600, fontSize: "14px", color: "#1f2937" }}>
//                           {fieldName}
//                         </span>
//                       </div>
                      
//                       {fieldOccurrences.length > 1 && (
//                         <select
//                           className="form-select form-select-sm"
//                           value={selectedOccurrences[fieldName]}
//                           onChange={(e) => {
//                             e.stopPropagation();
//                             handleOccurrenceChange(fieldName, e.target.value);
//                           }}
//                           onClick={(e) => e.stopPropagation()}
//                           style={{
//                             width: "auto",
//                             fontSize: "12px",
//                             padding: "4px 8px",
//                             border: "1px solid #d1d5db",
//                             borderRadius: "4px"
//                           }}
//                         >
//                           {fieldOccurrences.map((occurrence: any) => (
//                             <option key={occurrence.id} value={occurrence.id}>
//                               {occurrence.comment.text}
//                             </option>
//                           ))}
//                         </select>
//                       )}

//                       <span style={{ 
//                         fontSize: "12px", 
//                         color: "#6b7280",
//                         marginLeft: "8px",
//                         whiteSpace: "nowrap"
//                       }}>
//                         Page {selectedOccurrence?.position.pageNumber || 1}/{TotalPage}
//                       </span>
//                     </div>

//                     {isExpanded && (
//                       <div className="field-content" style={{ padding: "12px" }}>
//                         <div style={{ 
//                           display: "flex", 
//                           justifyContent: "flex-end", 
//                           gap: "8px",
//                           marginBottom: "8px"
//                         }}>
//                           {!readOnly && (
//                             <>
//                               <button
//                                 className="action-btn edit-btn"
//                                 onClick={(e) => {
//                                   e.stopPropagation();
//                                   setFieldName(fieldName);
//                                   handleOpen1(selectedOccurrence.id);
//                                   updateHash(selectedOccurrence);
//                                   scrollToView();
//                                 }}
//                                 style={{
//                                   padding: "6px 12px",
//                                   border: "1px solid #3b82f6",
//                                   borderRadius: "4px",
//                                   backgroundColor: "#fff",
//                                   color: "#3b82f6",
//                                   fontSize: "12px",
//                                   cursor: "pointer",
//                                   display: "flex",
//                                   alignItems: "center",
//                                   gap: "4px"
//                                 }}
//                               >
//                                 <MdEdit size={10} /> 
//                               </button>
//                               <button
//                                 className="action-btn delete-btn"
//                                 onClick={(e) => {
//                                   e.stopPropagation();
//                                   handleDeleteClick(selectedOccurrence);
//                                 }}
//                                 style={{
//                                   padding: "6px 12px",
//                                   border: "1px solid #ef4444",
//                                   borderRadius: "4px",
//                                   backgroundColor: "#fff",
//                                   color: "#ef4444",
//                                   fontSize: "10px",
//                                   cursor: "pointer",
//                                   display: "flex",
//                                   alignItems: "center",
//                                   gap: "4px"
//                                 }}
//                               >
//                                 <AiFillDelete size={10} /> 
//                               </button>
//                             </>
//                           )}
//                         </div>

//                         <div style={{ 
//                           backgroundColor: "#f9fafb",
//                           padding: "12px",
//                           borderRadius: "6px",
//                           border: "1px solid #e5e7eb"
//                         }}>
//                           <div style={{ 
//                             display: "flex", 
//                             justifyContent: "space-between", 
//                             alignItems: "center",
//                             marginBottom: showDesc ? "8px" : "0"
//                           }}>
//                             <span style={{ 
//                               fontSize: "12px", 
//                               fontWeight: 600, 
//                               color: "#6b7280" 
//                             }}>
//                               Extracted Text:
//                             </span>
//                             <button
//                               onClick={(e) => {
//                                 e.stopPropagation();
//                                 toggleDescription(fieldName);
//                               }}
//                               style={{
//                                 background: "none",
//                                 border: "none",
//                                 cursor: "pointer",
//                                 padding: "4px",
//                                 display: "flex",
//                                 alignItems: "center",
//                                 color: "#6b7280"
//                               }}
//                             >
//                               {showDesc ? <MdExpandLess size={20} /> : <MdExpandMore size={20} />}
//                             </button>
//                           </div>
                          
//                           {showDesc && (
//                             <p
//                               onClick={() => {
//                                 updatedHash(selectedOccurrence.id);
//                                 scrollToView();
//                               }}
//                               style={{
//                                 margin: 0,
//                                 fontSize: "13px",
//                                 lineHeight: "1.6",
//                                 color: "#374151",
//                                 cursor: "pointer",
//                                 padding: "8px",
//                                 backgroundColor: "#fff",
//                                 borderRadius: "4px",
//                                 maxHeight: "200px",
//                                 overflowY: "auto"
//                               }}
//                             >
//                               {selectedOccurrence?.content.text}
//                             </p>
//                           )}
                          
//                           {!showDesc && (
//                             <p
//                               onClick={() => {
//                                 updatedHash(selectedOccurrence.id);
//                                 scrollToView();
//                               }}
//                               style={{
//                                 margin: 0,
//                                 fontSize: "13px",
//                                 color: "#6b7280",
//                                 fontStyle: "italic",
//                                 cursor: "pointer"
//                               }}
//                             >
//                               Click to expand...
//                             </p>
//                           )}
//                         </div>
//                       </div>
//                     )}
//                   </li>
//                 );
//               })}
//             </ul>
//           </>
//         )}

//         {isSidebarCollapsed && (
//           <div style={{
//             display: 'flex',
//             flexDirection: 'column',
//             alignItems: 'center',
//             justifyContent: 'center',
//             height: '100%',
//             gap: '16px',
//             backgroundColor: '#f9fafb'
//           }}>
//             <div style={{
//               transform: 'rotate(-90deg)',
//               whiteSpace: 'nowrap',
//               fontSize: '14px',
//               fontWeight: 600,
//               color: '#6b7280'
//             }}>
//               Fields
//             </div>
//             <div style={{
//               backgroundColor: '#3b82f6',
//               color: 'white',
//               borderRadius: '50%',
//               width: '32px',
//               height: '32px',
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'center',
//               fontSize: '14px',
//               fontWeight: 600
//             }}>
//               {Object.keys(groupedHighlights).length}
//             </div>
//           </div>
//         )}
//       </div>

//       <Modal
//         open={open3}
//         onClose={handleClose1}
//         aria-labelledby="modal-modal-title"
//         aria-describedby="modal-modal-description"
//         slots={{ backdrop: Backdrop }}
//       >
//         <Box sx={style}>
//           <Form form={f1} onChange={handleSubmit} />
//           <div style={{ marginLeft: '60%' }}>
//             <tr>
//               <td style={{ color: "black" }}>
//                 <Button onClick={handleClose1}>
//                   <MdOutlineClose />&nbsp;Cancel
//                 </Button>
//               </td>
//               <td style={{ color: "black" }}>
//                 <Button onClick={handleSave}>
//                   <FcCheckmark />&nbsp;Ok
//                 </Button>
//               </td>
//             </tr>
//           </div>
//         </Box>
//       </Modal>

//       <Modal
//         open={openWarning}
//         onClose={handleCloseWarning}
//         aria-labelledby="warning-modal-title"
//         aria-describedby="warning-modal-description"
//       >
//         <Box sx={{
//           position: 'absolute',
//           top: '50%',
//           left: '50%',
//           transform: 'translate(-50%, -50%)',
//           width: 400,
//           bgcolor: 'background.paper',
//           boxShadow: 24,
//           p: 4,
//           borderRadius: 2
//         }}>
//           <h3 id="warning-modal-title" style={{ marginTop: 0 }}>Confirm Delete</h3>
//           <p id="warning-modal-description">
//             Are you sure you want to delete this highlight?
//           </p>
//           <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '20px' }}>
//             <Button variant="outlined" onClick={handleCloseWarning}>
//               Cancel
//             </Button>
//             <Button variant="contained" color="error" onClick={handleConfirmDelete}>
//               Delete
//             </Button>
//           </div>
//         </Box>
//       </Modal>
//     </div>
//   );
// }


// import React, { useEffect, useState } from "react";
// import type { IHighlight } from "../react-pdf-highlighter";
// import { AiFillDelete } from "react-icons/ai";
// import { MdEdit, MdOutlineClose } from "react-icons/md";
// import { FcCheckmark } from "react-icons/fc";
// import Modal from '@mui/material/Modal';
// import { Form } from '@tsed/react-formio';
// import Box from '@mui/material/Box';
// import Button from '@mui/material/Button';
// import { Theme } from "@mui/system";
// import clsx from 'clsx'

// const Backdrop = React.forwardRef<
//   HTMLDivElement,
//   { open?: boolean; className: string }
// >((props, ref) => {
//   const { open, className, ...other } = props;
//   return (
//     <div
//       className={clsx({ 'MuiBackdrop-open': open })}
//       ref={ref}
//       {...other}
//     />
//   );
// });

// const style = (theme: Theme) => ({
//   position: 'absolute' as 'absolute',
//   top: '50%',
//   left: '85%',
//   transform: 'translate(-50%, -50%)',
//   width: 400,
//   backgroundColor: theme.palette.mode === 'dark' ? '#0A1929' : 'white',
//   border: '1px solid #000',
//   boxShadow: '0 0 25px rgba(0, 0, 0, 0.6)',
//   // boxShadow: 24,
//   p: 1,
// });

// interface Props {
//   highlights: Array<IHighlight>;
//   pages: number;
//   resetHighlights: () => void;
//   toggleDocument: () => void;
//   Handledelete: (highlight: any, id: any) => void;
//   Handleedit: (text: any, id: any) => void;
//   scrollToView: () => void;
//   onInit: (setState: any) => void;
//   readOnly: boolean;
// }

// const updateHash = (highlight: IHighlight) => {
//   // console.log("Index_Value", highlight.id)
//   document.location.hash = `highlight-${highlight.id}`;
// };


// export function Sidebar1({
//   highlights,
//   pages,
//   toggleDocument,
//   resetHighlights,
//   Handledelete,
//   Handleedit,
//   scrollToView,
//   onInit,
//   readOnly,
// }: Props) {

//   const [search, setSearch] = useState("");
//   const [showSave, setShowSave] = useState(false);
//   const [open3, setOpen3] = useState(false);
//   const [text, setText] = useState("");
//   const [id, setId] = useState("");
//   const [idx, setIdx] = useState(0);
//   const [openWarning, setOpenWarning] = useState(false);
//   const [highlightToDelete, setHighlightToDelete] = useState<IHighlight | null>(null);
//   const [openConfirm, setOpenConfirm] = useState(false);
//   const [fieldName, setFieldName] = useState("")
//   const [selectedOccurrences, setSelectedOccurrences] = useState<any>({});
//   console.log("go to oninit", onInit);

//   if (onInit != null) {
//     onInit(setSearch);
//   }

//   if (search == "All") {
//     setSearch("")
//   }

//   function handlesearch(e: any) {
//     setSearch(e.target.value);
//   }

//   const handleSave = (e: any) => {
//     setShowSave(!showSave);
//     console.log("edit save", text, id);
//     Handleedit(text, id);
//     setOpen3(false);
//   }

//   const handleChange = (c: any, id: any) => {
//     // console.log(c.currentTarget.textContent, id);
//     setText(c.currentTarget.textContent);
//     setId(id);
//   }

//   const handleOpen1 = (id: any) => {
//     let index = highlights.findIndex(obj => obj.id === id)
//     console.log("open index", index);
//     setOpen3(true);
//     setIdx(index)
//   }
//   const handleClose1 = () => setOpen3(false);

//   const handleOpen2 = (highlight: IHighlight) => {
//     setHighlightToDelete(highlight);
//     setFieldName(highlight.comment.text.replace(/\(\d+\/\d+\)$/, ''))
//     setOpenWarning(true);
//   };
//   const handleDeleteClick = (highlight: IHighlight) => {
//     setHighlightToDelete(highlight);
//     setOpenConfirm(true);
//   };
//   const handleDeleteOk = async () => {
//     if (highlightToDelete) {
//       console.log("handleDeleteOk", highlightToDelete);
//       try {
//         await Handledelete(highlightToDelete, highlightToDelete.id);
//       } catch (error) {
//         console.error('Error deleting data:', error);
//       }
//     }
//     setOpenConfirm(false)
//   };

//   const handleCloseWarning = () => {
//     setOpenWarning(false);
//   };

//   const handleDeleteConfirmed = async () => {
//     // Perform the delete operation here
//     if (highlightToDelete) {
//       console.log("Delete the other occurrence", highlightToDelete);
//       const fieldName = highlightToDelete.comment.text.replace(/\(\d+\/\d+\)$/, '');
//       console.log("delete fieldName", fieldName);
//       const remainingOccurrences = highlights.filter(item => item.comment.text.replace(/\(\d+\/\d+\)$/, '') === fieldName);
//       console.log("delete remaining occurence", remainingOccurrences);
//       let deleteCount = 0;
//       for (const item of remainingOccurrences) {
//         if (item.id !== highlightToDelete.id && deleteCount < remainingOccurrences.length) {
//           console.log("Delete Remove", item);
//           await new Promise(resolve => setTimeout(resolve, 500)); // Introduce a delay of 1000 milliseconds (1 second)
//           try {
//             await Handledelete(item, item.id);
//             deleteCount++;
//           } catch (error) {
//             console.error('Error deleting data:', error);
//           }
//         }
//       }
//     }
//     setOpenWarning(false);
//   }

//   const handleSubmit = (data: any) => {
//     console.log("datavalue", data.changed.value);
//     const val = highlights.filter((obj, index): any => index == idx)
//     console.log("val->", val[0].id)
//     setText(data.changed.value);
//     setId(val[0].id);
//   }
//   console.log("highlights", highlights[idx]?.position?.form);
//   const f1 = highlights[idx]?.position?.form


//   const counts: any = []
//   const TotalPage = pages;

//   highlights.forEach(function (highlight) { counts[highlight.comment.text] = (counts[highlight.comment.text] || 0) + 1; });
//   const highlighter: any = highlights.map(ele => {
//     const noOccurence = highlights.filter(obj => obj.comment.text === ele.comment.text).length;
//     if (counts[ele.comment.text] > 1) {
//       let Totalfieldcounts = counts[ele.comment.text] || 1;

//       const fieldcount = Totalfieldcounts - noOccurence + 1
//       ele.comment.text = `${ele.comment.text} (${fieldcount}/${Totalfieldcounts})`
//       counts[ele.comment.text] = Totalfieldcounts + 1;
//     }
//     return ele;
//   })
//   const updatedHash = (id: any) => {
//     console.log("Index_Value", id)
//     document.location.hash = `highlight-${id}`;
//   };

//   const updateHash1 = (text: any) => {
//     console.log("Index_Value", text)
//     // document.location.hash = `highlight-${highlight.id}`;
//     const Comment: any[] = highlights.filter((obj: any) => obj.comment.text === text);
//     console.log("Index comment", Comment)
//     let id = Comment[0].id
//     document.location.hash = `highlight-${id}`;
//   };

//   const uniqueFieldNames = [...new Set(highlights.map((highlight) => {
//     // Remove the occurrence count (e.g., (1/2)) if it exists
//     return highlight.comment.text.replace(/\(\d+\/\d+\)$/, '');
//   }))];
//   console.log("uniqueFieldNames", uniqueFieldNames);


//   useEffect(() => {
//     const initialSelectedOccurrences: any = {};
//     uniqueFieldNames.forEach((fieldName) => {
//       const fieldOccurrences = highlights.filter(
//         (highlight) =>
//           highlight.comment.text.replace(/\(\d+\/\d+\)$/, '') === fieldName
//       );
//       if (fieldOccurrences.length > 1) {
//         // Set the default value for the dropdown to the ID of the first occurrence
//         initialSelectedOccurrences[fieldName] = fieldOccurrences[0].id;
//       }
//     });
//     setSelectedOccurrences(initialSelectedOccurrences);
//   }, [highlights]);


//   const handleFieldDropdownChange = (fieldName: any, selectedValue: any) => {
//     // Create a copy of the selectedOccurrences object
//     const updatedSelectedOccurrences = { ...selectedOccurrences };
//     // Update the selected value for the fieldName
//     updatedSelectedOccurrences[fieldName] = selectedValue;
//     setSelectedOccurrences(updatedSelectedOccurrences);


//     // Handle any other actions you need here
//     updatedHash(selectedValue);
//     scrollToView();
//   };


//   console.log("newMyArr", highlighter);
//   return (
//     <>
//       <div className="v_sidebar" style={{ width: "32vw" }}>
//         <div className="description" style={{ padding: "4px" }}>
//           <p style={{ fontSize: "15px" }}>
//             <div>
//               <input
//                 type="text"
//                 className='search-input form-control ps-13 fs-7 h-35px'
//                 value={search}
//                 placeholder="Search Field Name Here..."
//                 onChange={handlesearch}
//                 readOnly={readOnly}
//               />
//             </div>
//           </p>
//           <p>
//             <small>
//               To add new field, highlight the required text.
//             </small>
//           </p>
//         </div>
//         <ul className="sidebar__highlights">
//           {uniqueFieldNames
//             .filter((fieldName: any) => {
//               console.log("fieldname", fieldName);
//               if (search === "") {
//                 return true; // Show all field names if search is empty
//               } else {
//                 // Use the includes() method to check if the field name includes the search term
//                 return fieldName.toLowerCase().includes(search.toLowerCase());
//               }
//             })
//             .map((fieldName: any) => {
//               const fieldOccurrences = highlights.filter(
//                 (highlight) =>
//                   highlight.comment.text.replace(/\(\d+\/\d+\)$/, "") === fieldName);
//               // Check if there are multiple occurrences for this field
//               if (fieldOccurrences.length > 1) {
//                 console.log("fieldoccur", fieldOccurrences);
//                 return (
//                   <li key={fieldName}>
//                     <div>
//                       <tr>
//                         <td style={{ width: '10%' }}>
//                           <select
//                             // className="form-select form-select-solid"
//                             // style={{ width: '100%', background: '#f8c8dc' }}
//                             onChange={(e) => {
//                               handleFieldDropdownChange(fieldName, e.target.value)
//                             }}
//                             value={selectedOccurrences[fieldName]}
//                           // disabled={readOnly}
//                           >
//                             {fieldOccurrences.map((occurrence) => (
//                               <option key={occurrence.id} value={occurrence.id}>
//                                 {occurrence.comment.text}
//                               </option>
//                             ))}
//                           </select>
//                         </td>
//                         <td className="sidebar__td">
//                           {/* <FcCheckmark
//                             className="sidebar__edit"
//                             onClick={() => {
//                               handleOpen2(fieldOccurrences[0]);
//                               updateHash(fieldOccurrences[0]);
//                               scrollToView();
//                             }}
//                           /> */}
//                           {readOnly ? null : (
//                             <MdEdit
//                               className="sidebar__edit"
//                               onClick={() => {
//                                 if (!readOnly) { // Only allow edit if not in read-only mode
//                                   const selectedOccurrence = fieldOccurrences.find(
//                                     (occurrence) => occurrence.id === selectedOccurrences[fieldName]
//                                   );
//                                   if (selectedOccurrence) {
//                                     handleOpen1(selectedOccurrence.id);
//                                     updateHash(selectedOccurrence);
//                                     scrollToView();
//                                   }
//                                 }
//                               }}
//                             />
//                           )}
//                           {/* <MdEdit
//                             className="sidebar__edit"
//                             onClick={() => {
//                               const selectedOccurrence = fieldOccurrences.find(
//                                 (occurrence) => occurrence.id === selectedOccurrences[fieldName]
//                               );
//                               if (selectedOccurrence) {
//                                 handleOpen1(selectedOccurrence.id);
//                                 updateHash(selectedOccurrence);
//                                 scrollToView();
//                               }
//                             }}
//                           /> */}
//                           {/* <AiFillDelete
//                             className="sidebar__delete"
//                             onClick={() => {
//                               const selectedOccurrence = fieldOccurrences.find(
//                                 (occurrence) => occurrence.id === selectedOccurrences[fieldName]
//                               );
//                               if (selectedOccurrence) {
//                                 handleDeleteClick(selectedOccurrence);
//                               }
//                             }}
//                           /> */}
//                           {readOnly ? null : (
//                             <AiFillDelete
//                               className="sidebar__delete"
//                               onClick={() => {
//                                 if (!readOnly) { // Only allow delete if not in read-only mode
//                                   const selectedOccurrence = fieldOccurrences.find(
//                                     (occurrence) => occurrence.id === selectedOccurrences[fieldName]
//                                   );
//                                   if (selectedOccurrence) {
//                                     handleDeleteClick(selectedOccurrence);
//                                   }
//                                 }
//                               }}
//                             />
//                           )}
//                           <div>
//                             <Modal
//                               open={open3}
//                               onClose={handleClose1}
//                               aria-labelledby="modal-modal-title"
//                               aria-describedby="modal-modal-description"
//                               slots={{ backdrop: Backdrop }}
//                             >
//                               <Box sx={style}>
//                                 <Form form={f1} onChange={handleSubmit} />
//                                 <div style={{ marginLeft: '60%' }}>
//                                   <tr>
//                                     <td style={{ color: "black" }}><Button onClick={handleClose1}><MdOutlineClose />&nbsp;Cancel</Button></td>
//                                     <td style={{ color: "black" }}><Button onClick={handleSave}><FcCheckmark />&nbsp;Ok</Button></td>
//                                   </tr>
//                                 </div>
//                               </Box>
//                             </Modal>
//                           </div>
//                         </td>
//                       </tr>
//                     </div>
//                     <div className="sidebar__highlight"
//                       onClick={() => {
//                         updatedHash(selectedOccurrences[fieldName]);
//                         scrollToView();
//                       }}
//                     >
//                       {fieldOccurrences
//                         .filter((occurrence) => occurrence.id === selectedOccurrences[fieldName])
//                         .map((selectedOccurrence) => (
//                           <>
//                             <p key={selectedOccurrence.id}>
//                               {selectedOccurrence.content.text}
//                             </p><div className="highlight__location">
//                               <b>Page {selectedOccurrence.position.pageNumber}/{TotalPage}</b>
//                             </div>
//                           </>
//                         ))}


//                     </div>
//                   </li>
//                 );
//               } else {
//                 // Render without a dropdown if there's only one occurrence
//                 return (
//                   <li key={fieldName}>
//                     <div>
//                       <tr>
//                         <td style={{ width: '10%' }}>
//                           <b style={{ fontSize: "15px" }}>{fieldName}</b>
//                         </td>
//                         <td className="sidebar__td">
//                           {/* <FcCheckmark
//                             className="sidebar__edit"
//                             onClick={() => {
//                               handleOpen2(fieldOccurrences[0]);
//                               updateHash(fieldOccurrences[0]);
//                               scrollToView();
//                             }}
//                           /> */}
//                           {/* <MdEdit
//                             className="sidebar__edit"
//                             onClick={() => {
//                               handleOpen1(fieldOccurrences[0].id);
//                               updateHash(fieldOccurrences[0]);
//                               scrollToView();
//                             }}
//                           />
//                           <AiFillDelete
//                             className="sidebar__delete"
//                             onClick={() => {
//                               handleDeleteClick(fieldOccurrences[0]);
//                             }}
//                           /> */}
//                           {readOnly ? null : (
//                             <MdEdit
//                               className="sidebar__edit"
//                               onClick={() => {
//                                 if (!readOnly) { // Only allow edit if not in read-only mode
//                                   handleOpen1(fieldOccurrences[0].id);
//                                   updateHash(fieldOccurrences[0]);
//                                   scrollToView();
//                                 }
//                               }}
//                             />
//                           )}
//                           {readOnly ? null : (
//                             <AiFillDelete
//                               className="sidebar__delete"
//                               onClick={() => {
//                                 if (!readOnly) { // Only allow delete if not in read-only mode
//                                   handleDeleteClick(fieldOccurrences[0]);
//                                 }
//                               }}
//                             />
//                           )}
//                           <div>
//                             <Modal
//                               open={open3}
//                               onClose={handleClose1}
//                               aria-labelledby="modal-modal-title"
//                               aria-describedby="modal-modal-description"
//                               slots={{ backdrop: Backdrop }}
//                             >
//                               <Box sx={style}>
//                                 <Form form={f1} onChange={handleSubmit} />
//                                 <div style={{ marginLeft: '60%' }}>
//                                   <tr>
//                                     <td style={{ color: "black" }}><Button onClick={handleClose1}><MdOutlineClose />&nbsp;Cancel</Button></td>
//                                     <td style={{ color: "black" }}><Button onClick={handleSave}><FcCheckmark />&nbsp;Ok</Button></td>
//                                   </tr>
//                                 </div>
//                               </Box>
//                             </Modal>
//                           </div>
//                         </td>
//                       </tr>
//                     </div>
//                     <div className="sidebar__highlight" onClick={() => {
//                       updateHash1(fieldName);
//                       scrollToView();
//                     }}>
//                       {fieldOccurrences.map((occurrence) => (
//                         <>
//                           <p key={occurrence.id}>
//                             {occurrence.content.text}
//                           </p>
//                           <div className="highlight__location">
//                             <b>Page {occurrence.position.pageNumber}/{TotalPage}</b>
//                           </div>
//                           {/* <div
//                             className="highlight__image"
//                             style={{ marginTop: "0.5rem" }}
//                           >
//                             <img src={occurrence.content.image} alt={"Screenshot"} />
//                           </div> */}
//                         </>
//                       ))}
//                     </div>
//                   </li>
//                 );
//               }
//             })}
//         </ul>
//         {/* <ul className="sidebar__highlights">
//           {highlights
//             .filter((highlight: any) => {
//               if (search == "") {
//                 return highlight;
//               } else if (
//                 highlight.comment.text.toLowerCase().includes(search.toLowerCase())
//               ) {
//                 console.log("search value", highlight)
//                 return highlight;
//               }
//             })
//             .map((highlight, index) => (
//               <li
//                 key={index}
//               >
//                 <div>
//                   <tr>
//                     <td style={{ width: '10%' }}><b style={{ fontSize: "15px" }}>{highlight.comment.text}</b></td>
//                     <td className="sidebar__td">
//                       {highlight.comment.text.match(/\((\d+)\/(\d+)\)$/) ?
//                         <FcCheckmark className="sidebar__edit" onClick={() => { handleOpen2(highlight); updateHash(highlight); scrollToView(); }} />
//                         : null} &nbsp;
//                       <MdEdit className="sidebar__edit" onClick={() => {
//                         handleOpen1(highlight.id); updateHash(highlight);
//                         scrollToView();
//                       }} />&nbsp;
//                       <AiFillDelete className="sidebar__delete" onClick={() => {
//                         handleDeleteClick(highlight)
//                       }} />
//                       <div>
//                         <Modal
//                           open={open3}
//                           onClose={handleClose1}
//                           aria-labelledby="modal-modal-title"
//                           aria-describedby="modal-modal-description"
//                           slots={{ backdrop: Backdrop }}
//                         >
//                           <Box sx={style}>
//                             <Form form={f1} onChange={handleSubmit} />
//                             <div style={{ marginLeft: '60%' }}>
//                               <tr>
//                                 <td style={{ color: "black" }}><Button onClick={handleClose1}><MdOutlineClose />&nbsp;Cancel</Button></td>
//                                 <td style={{ color: "black" }}><Button onClick={handleSave}><FcCheckmark />&nbsp;Ok</Button></td>
//                               </tr>
//                             </div>
//                           </Box>
//                         </Modal>
//                       </div>
//                     </td>
//                   </tr>

//                 </div>

//                 <div className="sidebar__highlight" onClick={() => {
//                   updateHash(highlight);
//                   scrollToView();
//                 }}>
//                   {highlight.content.text ? (
//                     <p style={{ marginTop: "0.5rem" }}
//                       onInput={(e) => { handleChange(e, highlight.id) }}
//                     >
//                       {`${highlight.content.text.slice(0, 100).trim()}…`}
//                     </p>
//                   ) : null}
//                   {highlight.content.image ? (
//                     <div
//                       className="highlight__image"
//                       style={{ marginTop: "0.5rem" }}
//                     >
//                       <img src={highlight.content.image} alt={"Screenshot"} />
//                     </div>
//                   ) : null}
//                   <div className="highlight__location">
//                     <b>Page {highlight.position.pageNumber}/{TotalPage}</b>
//                   </div>
//                 </div>
//               </li>
//             ))}
//         </ul> */}
//         <Modal
//           open={openWarning}
//           onClose={handleCloseWarning}
//           aria-labelledby="modal-modal-title"
//           aria-describedby="modal-modal-description"
//           slots={{ backdrop: Backdrop }}
//         >
//           <Box sx={style}>
//             <h3>Warning!</h3>
//             <p style={{ color: 'black' }}>Are you sure want to delete the other " {fieldName}" field occurences?</p>
//             <div style={{ marginLeft: '60%' }}>
//               <Button onClick={handleCloseWarning}>
//                 <MdOutlineClose onClick={handleCloseWarning} />&nbsp;Cancel
//               </Button>
//               <Button onClick={handleDeleteConfirmed}>
//                 <FcCheckmark onClick={handleDeleteConfirmed} />&nbsp;Ok
//               </Button>
//             </div>
//           </Box>
//         </Modal>
//         <Modal
//           open={openConfirm}
//           onClose={() => setOpenConfirm(false)}
//           aria-labelledby="modal-modal-title"
//           aria-describedby="modal-modal-description"
//           slots={{ backdrop: Backdrop }}
//         >
//           <Box sx={style}>
//             <h3>Warning!</h3>
//             <p style={{ color: 'black' }}>Are you sure want to delete the selected field?</p>
//             <div style={{ marginLeft: '55%' }}>
//               <Button onClick={() => setOpenConfirm(false)}>
//                 <MdOutlineClose onClick={() => setOpenConfirm(false)} />&nbsp;Cancel
//               </Button>
//               <Button onClick={handleDeleteOk}>
//                 <FcCheckmark onClick={handleDeleteOk} />&nbsp;Ok
//               </Button>
//             </div>
//           </Box>
//         </Modal>
//       </div>
//     </>
//   );
// }



import React, { useEffect, useState } from "react";
import type { IHighlight } from "../react-pdf-highlighter";
import { AiFillDelete } from "react-icons/ai";
import { MdEdit, MdOutlineClose, MdExpandMore, MdExpandLess, MdChevronLeft, MdChevronRight } from "react-icons/md";
import { FcCheckmark } from "react-icons/fc";
import { BiChevronDown, BiChevronRight } from "react-icons/bi";
import Modal from '@mui/material/Modal';
import { Form } from '@tsed/react-formio';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { Theme } from "@mui/system";
import clsx from 'clsx'
import './EnhancedSidebar.css';

const Backdrop = React.forwardRef<
  HTMLDivElement,
  { open?: boolean; className: string }
>((props, ref) => {
  const { open, className, ...other } = props;
  return (
    <div
      className={clsx({ 'MuiBackdrop-open': open })}
      ref={ref}
      {...other}
    />
  );
});

const style = (theme: Theme) => ({
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '85%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  backgroundColor: theme.palette.mode === 'dark' ? '#0A1929' : 'white',
  border: '1px solid #000',
  boxShadow: '0 0 25px rgba(0, 0, 0, 0.6)',
  p: 1,
});

interface Props {
  highlights: Array<IHighlight>;
  pages: number;
  resetHighlights: () => void;
  toggleDocument: () => void;
  Handledelete: (highlight: any, id: any) => void;
  Handleedit: (text: any, id: any) => void;
  scrollToView: () => void;
  onInit: (setState: any) => void;
  readOnly: boolean;
}

const updateHash = (highlight: IHighlight) => {
  document.location.hash = `highlight-${highlight.id}`;
};

export function Sidebar1({
  highlights,
  pages,
  toggleDocument,
  resetHighlights,
  Handledelete,
  Handleedit,
  scrollToView,
  onInit,
  readOnly,
}: Props) {

  const [search, setSearch] = useState("");
  const [showSave, setShowSave] = useState(false);
  const [open3, setOpen3] = useState(false);
  const [text, setText] = useState("");
  const [id, setId] = useState("");
  const [idx, setIdx] = useState(0);
  const [openWarning, setOpenWarning] = useState(false);
  const [highlightToDelete, setHighlightToDelete] = useState<IHighlight | null>(null);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [fieldName, setFieldName] = useState("")
  const [selectedOccurrences, setSelectedOccurrences] = useState<any>({});
  
  const [expandedFields, setExpandedFields] = useState<{ [key: string]: boolean }>({});
  const [showDescription, setShowDescription] = useState<{ [key: string]: boolean }>({});
  
  // State for sidebar collapse
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  console.log("go to oninit", onInit);

  if (onInit != null) {
    onInit(setSearch);
  }

  if (search == "All") {
    setSearch("")
  }

  function handlesearch(e: any) {
    setSearch(e.target.value);
  }

  const handleSave = (e: any) => {
    setShowSave(!showSave);
    console.log("edit save", text, id);
    Handleedit(text, id);
    setOpen3(false);
  }

  const toggleFieldExpansion = (fieldName: string) => {
    setExpandedFields(prev => ({
      ...prev,
      [fieldName]: !prev[fieldName]
    }));
  };

  const toggleDescription = (fieldName: string) => {
    setShowDescription(prev => ({
      ...prev,
      [fieldName]: !prev[fieldName]
    }));
  };

  // Toggle sidebar and adjust PDF viewer width
  const toggleSidebarCollapse = () => {
    setIsSidebarCollapsed(prev => {
      const newState = !prev;
      
      // Adjust PDF viewer width
      const pdfContainer = document.getElementById('pdf-viewer-container');
      if (pdfContainer) {
        if (newState) {
          // Collapsed: PDF takes more space
          pdfContainer.style.width = 'calc(100% - 50px)';
        } else {
          // Expanded: PDF normal width
          pdfContainer.style.width = 'calc(100% - 350px)';
        }
      }
      
      return newState;
    });
  };

  const TotalPage = pages;
  const f1: any = {
    components: [
      {
        "label": `Edit ${fieldName}`,
        "autoExpand": false,
        "tableView": true,
        "key": "panel",
        "type": "panel",
        "input": false,
        "components": [
          {
            "label": "Text",
            "autoExpand": false,
            "tableView": true,
            "key": "text",
            "type": "textarea",
            "input": true
          }
        ]
      }
    ]
  };

  const handleSubmit = (e: any) => {
    setText(e.data.text)
  }

  const handleOpen1 = (ids: any) => {
    setOpen3(true);
    setId(ids);
    setIdx(idx + 1);
  };

  const handleClose1 = () => {
    setOpen3(false);
  };

  const handleDeleteClick = (highlight: IHighlight) => {
    setHighlightToDelete(highlight);
    setOpenWarning(true);
  };

  const handleCloseWarning = () => {
    setOpenWarning(false);
    setHighlightToDelete(null);
  };

  const handleConfirmDelete = () => {
    if (highlightToDelete) {
      Handledelete(highlightToDelete, highlightToDelete.id);
      setOpenWarning(false);
      setHighlightToDelete(null);
      setOpenConfirm(true);
    }
  };

  const updatedHash = (highlightId: any) => {
    const highlight = highlights.find((h) => h.id === highlightId);
    if (highlight) {
      updateHash(highlight);
    }
  };

  const groupedHighlights = highlights.reduce((acc: any, highlight) => {
    const fieldNameWithoutOccurrence = highlight.comment.text.replace(/\(\d+\/\d+\)$/, '').trim();
    if (!acc[fieldNameWithoutOccurrence]) {
      acc[fieldNameWithoutOccurrence] = [];
    }
    acc[fieldNameWithoutOccurrence].push(highlight);
    return acc;
  }, {});

  useEffect(() => {
    const initialSelections: any = {};
    const initialExpanded: any = {};
    Object.keys(groupedHighlights).forEach((fieldName) => {
      const fieldOccurrences = groupedHighlights[fieldName];
      if (fieldOccurrences.length > 0) {
        initialSelections[fieldName] = fieldOccurrences[0].id;
        initialExpanded[fieldName] = false;
      }
    });
    setSelectedOccurrences(initialSelections);
    setExpandedFields(initialExpanded);
  }, [highlights]);

  const handleOccurrenceChange = (fieldName: string, selectedId: string) => {
    setSelectedOccurrences((prev: any) => ({
      ...prev,
      [fieldName]: selectedId,
    }));
  };

  const filteredHighlights = Object.keys(groupedHighlights)
    .filter((fieldName) => fieldName.toLowerCase().includes(search.toLowerCase()))
    .reduce((acc: any, fieldName) => {
      acc[fieldName] = groupedHighlights[fieldName];
      return acc;
    }, {});

  return (
    <div style={{ 
      position: 'relative', 
      display: 'flex',
      height: '100%',
      width: isSidebarCollapsed ? '50px' : '350px',
      transition: 'width 0.3s ease'
    }}>
      {/* Toggle Button - On LEFT side of sidebar (right edge of PDF) */}
      <button
        onClick={toggleSidebarCollapse}
        style={{
          position: 'absolute',
          left: '-16px', // Position on left edge (overlaps PDF)
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 1001,
          backgroundColor: '#3b82f6',
          color: 'white',
          border: 'none',
          borderRadius: '50%',
          width: '32px',
          height: '32px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
          transition: 'all 0.3s ease'
        }}
        title={isSidebarCollapsed ? "Expand Fields" : "Collapse Fields"}
      >
        {isSidebarCollapsed ? <MdChevronLeft size={20} /> : <MdChevronRight size={20} />}
      </button>

      {/* Sidebar Content */}
      <div 
        className="enhanced-sidebar v_sidebar" 
        style={{ 
          width: '100%',
          height: "67.8vh",
          overflowY: isSidebarCollapsed ? "hidden" : "auto",
          overflowX: "hidden",
          borderLeft: '1px solid #e5e7eb'
        }}
      >
        {!isSidebarCollapsed && (
          <>
            <div className="sidebar-search-container" style={{ 
              backgroundColor: "#fff", 
              padding: "12px", 
              borderBottom: "1px solid #e5e7eb"
            }}>
              <input
                type="text"
                placeholder="Search Field Name Here..."
                className="form-control"
                value={search}
                onChange={handlesearch}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  border: "1px solid #d1d5db",
                  borderRadius: "6px",
                  fontSize: "14px"
                }}
              />
              <div style={{ 
                marginTop: "8px", 
                fontSize: "12px", 
                color: "#6b7280",
                fontStyle: "italic"
              }}>
                To add new field, highlight the required text.
              </div>
            </div>

            <ul className="sidebar__highlights" style={{ padding: "8px", margin: 0 }}>
              {Object.keys(filteredHighlights).map((fieldName) => {
                const fieldOccurrences = filteredHighlights[fieldName];
                const isExpanded = expandedFields[fieldName];
                const showDesc = showDescription[fieldName];
                const selectedOccurrence = fieldOccurrences.find(
                  (occ: any) => occ.id === selectedOccurrences[fieldName]
                ) || fieldOccurrences[0];

                return (
                  <li key={fieldName} className="field-item" style={{ 
                    marginBottom: "8px",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    overflow: "hidden",
                    backgroundColor: "#fff"
                  }}>
                    <div 
                      className="field-header"
                      style={{
                        padding: "12px",
                        backgroundColor: "#f9fafb",
                        borderBottom: isExpanded ? "1px solid #e5e7eb" : "none",
                        cursor: "pointer",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center"
                      }}
                      onClick={() => toggleFieldExpansion(fieldName)}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", flex: 1 }}>
                        {isExpanded ? (
                          <BiChevronDown size={20} style={{ color: "#6b7280" }} />
                        ) : (
                          <BiChevronRight size={20} style={{ color: "#6b7280" }} />
                        )}
                        <span style={{ fontWeight: 600, fontSize: "14px", color: "#1f2937" }}>
                          {fieldName}
                        </span>
                      </div>
                      
                      {fieldOccurrences.length > 1 && (
                        <select
                          className="form-select form-select-sm"
                          value={selectedOccurrences[fieldName]}
                          onChange={(e) => {
                            e.stopPropagation();
                            handleOccurrenceChange(fieldName, e.target.value);
                          }}
                          onClick={(e) => e.stopPropagation()}
                          style={{
                            width: "auto",
                            fontSize: "12px",
                            padding: "4px 8px",
                            border: "1px solid #d1d5db",
                            borderRadius: "4px"
                          }}
                        >
                          {fieldOccurrences.map((occurrence: any) => (
                            <option key={occurrence.id} value={occurrence.id}>
                              {occurrence.comment.text}
                            </option>
                          ))}
                        </select>
                      )}

                      <span style={{ 
                        fontSize: "12px", 
                        color: "#6b7280",
                        marginLeft: "8px",
                        whiteSpace: "nowrap"
                      }}>
                        Page {selectedOccurrence?.position.pageNumber || 1}/{TotalPage}
                      </span>
                    </div>

                    {isExpanded && (
                      <div className="field-content" style={{ padding: "12px" }}>
                        <div style={{ 
                          display: "flex", 
                          justifyContent: "flex-end", 
                          gap: "8px",
                          marginBottom: "8px"
                        }}>
                          {!readOnly && (
                            <>
                              <button
                                className="action-btn edit-btn"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setFieldName(fieldName);
                                  handleOpen1(selectedOccurrence.id);
                                  updateHash(selectedOccurrence);
                                  scrollToView();
                                }}
                                style={{
                                  padding: "6px 12px",
                                  border: "1px solid #3b82f6",
                                  borderRadius: "4px",
                                  backgroundColor: "#fff",
                                  color: "#3b82f6",
                                  fontSize: "12px",
                                  cursor: "pointer",
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "4px"
                                }}
                              >
                                <MdEdit size={10} /> 
                              </button>
                              <button
                                className="action-btn delete-btn"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteClick(selectedOccurrence);
                                }}
                                style={{
                                  padding: "6px 12px",
                                  border: "1px solid #ef4444",
                                  borderRadius: "4px",
                                  backgroundColor: "#fff",
                                  color: "#ef4444",
                                  fontSize: "10px",
                                  cursor: "pointer",
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "4px"
                                }}
                              >
                                <AiFillDelete size={10} /> 
                              </button>
                            </>
                          )}
                        </div>

                        {/* <div style={{ 
                          backgroundColor: "#f9fafb",
                          padding: "12px",
                          borderRadius: "6px",
                          border: "1px solid #e5e7eb"
                        }}>
                          <div style={{ 
                            display: "flex", 
                            justifyContent: "space-between", 
                            alignItems: "center",
                            marginBottom: showDesc ? "8px" : "0"
                          }}>
                            <span style={{ 
                              fontSize: "12px", 
                              fontWeight: 600, 
                              color: "#6b7280" 
                            }}>
                              Extracted Text:
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleDescription(fieldName);
                              }}
                              style={{
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                padding: "4px",
                                display: "flex",
                                alignItems: "center",
                                color: "#6b7280"
                              }}
                            >
                              {showDesc ? <MdExpandLess size={20} /> : <MdExpandMore size={20} />}
                            </button>
                          </div>
                          
                          {showDesc && (
                            <p
                              onClick={() => {
                                updatedHash(selectedOccurrence.id);
                                scrollToView();
                              }}
                              style={{
                                margin: 0,
                                fontSize: "13px",
                                lineHeight: "1.6",
                                color: "#374151",
                                cursor: "pointer",
                                padding: "8px",
                                backgroundColor: "#fff",
                                borderRadius: "4px",
                                maxHeight: "200px",
                                overflowY: "auto"
                              }}
                            >
                              {selectedOccurrence?.content.text}
                            </p>
                          )}
                          
                          {!showDesc && (
                            <p
                              onClick={() => {
                                updatedHash(selectedOccurrence.id);
                                scrollToView();
                              }}
                              style={{
                                margin: 0,
                                fontSize: "13px",
                                color: "#6b7280",
                                fontStyle: "italic",
                                cursor: "pointer"
                              }}
                            >
                              Click to expand...
                            </p>
                          )}
                        </div> */}

                        <div style={{ 
  backgroundColor: "#f9fafb",
  padding: "12px",
  borderRadius: "6px",
  border: "1px solid #e5e7eb"
}}>
  {/* Header remains, but no expand button */}
  <div style={{ 
    marginBottom: "8px"
  }}>
    <span style={{ 
      fontSize: "12px", 
      fontWeight: 600, 
      color: "#6b7280" 
    }}>
      Extracted Text:
    </span>
  </div>
  
  {/* Text is always visible */}
  <p
    onClick={() => {
      updatedHash(selectedOccurrence.id);
      scrollToView();
    }}
    style={{
      margin: 0,
      fontSize: "13px",
      lineHeight: "1.6",
      color: "#374151",
      cursor: "pointer",
      padding: "8px",
      backgroundColor: "#fff",
      borderRadius: "4px",
      maxHeight: "200px",
      overflowY: "auto"
    }}
  >
    {selectedOccurrence?.content.text}
  </p>
</div>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </>
        )}

        {isSidebarCollapsed && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            gap: '16px',
            backgroundColor: '#f9fafb'
          }}>
            <div style={{
              transform: 'rotate(-90deg)',
              whiteSpace: 'nowrap',
              fontSize: '14px',
              fontWeight: 600,
              color: '#6b7280'
            }}>
              Fields
            </div>
            <div style={{
              backgroundColor: '#3b82f6',
              color: 'white',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '14px',
              fontWeight: 600
            }}>
              {Object.keys(groupedHighlights).length}
            </div>
          </div>
        )}
      </div>

      <Modal
        open={open3}
        onClose={handleClose1}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        slots={{ backdrop: Backdrop }}
      >
        <Box sx={style}>
          <Form form={f1} onChange={handleSubmit} />
          <div style={{ marginLeft: '60%' }}>
            <tr>
              <td style={{ color: "black" }}>
                <Button onClick={handleClose1}>
                  <MdOutlineClose />&nbsp;Cancel
                </Button>
              </td>
              <td style={{ color: "black" }}>
                <Button onClick={handleSave}>
                  <FcCheckmark />&nbsp;Ok
                </Button>
              </td>
            </tr>
          </div>
        </Box>
      </Modal>

      <Modal
        open={openWarning}
        onClose={handleCloseWarning}
        aria-labelledby="warning-modal-title"
        aria-describedby="warning-modal-description"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 2
        }}>
          <h3 id="warning-modal-title" style={{ marginTop: 0 }}>Confirm Delete</h3>
          <p id="warning-modal-description">
            Are you sure you want to delete this highlight?
          </p>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '20px' }}>
            <Button variant="outlined" onClick={handleCloseWarning}>
              Cancel
            </Button>
            <Button variant="contained" color="error" onClick={handleConfirmDelete}>
              Delete
            </Button>
          </div>
        </Box>
      </Modal>
    </div>
  );
}