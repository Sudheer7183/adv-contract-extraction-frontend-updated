import React, { useEffect, useState } from "react";
import type { IHighlight } from "../react-pdf-highlighter";
import { AiFillDelete } from "react-icons/ai";
import { MdEdit, MdOutlineClose } from "react-icons/md";
import { FcCheckmark } from "react-icons/fc";
import Modal from '@mui/material/Modal';
import { Form } from '@tsed/react-formio';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { Theme } from "@mui/system";
import clsx from 'clsx'

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
  // boxShadow: 24,
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
  // console.log("Index_Value", highlight.id)
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

  const handleChange = (c: any, id: any) => {
    // console.log(c.currentTarget.textContent, id);
    setText(c.currentTarget.textContent);
    setId(id);
  }

  const handleOpen1 = (id: any) => {
    let index = highlights.findIndex(obj => obj.id === id)
    console.log("open index", index);
    setOpen3(true);
    setIdx(index)
  }
  const handleClose1 = () => setOpen3(false);

  const handleOpen2 = (highlight: IHighlight) => {
    setHighlightToDelete(highlight);
    setFieldName(highlight.comment.text.replace(/\(\d+\/\d+\)$/, ''))
    setOpenWarning(true);
  };
  const handleDeleteClick = (highlight: IHighlight) => {
    setHighlightToDelete(highlight);
    setOpenConfirm(true);
  };
  const handleDeleteOk = async () => {
    if (highlightToDelete) {
      console.log("handleDeleteOk", highlightToDelete);
      try {
        await Handledelete(highlightToDelete, highlightToDelete.id);
      } catch (error) {
        console.error('Error deleting data:', error);
      }
    }
    setOpenConfirm(false)
  };

  const handleCloseWarning = () => {
    setOpenWarning(false);
  };

  const handleDeleteConfirmed = async () => {
    // Perform the delete operation here
    if (highlightToDelete) {
      console.log("Delete the other occurrence", highlightToDelete);
      const fieldName = highlightToDelete.comment.text.replace(/\(\d+\/\d+\)$/, '');
      console.log("delete fieldName", fieldName);
      const remainingOccurrences = highlights.filter(item => item.comment.text.replace(/\(\d+\/\d+\)$/, '') === fieldName);
      console.log("delete remaining occurence", remainingOccurrences);
      let deleteCount = 0;
      for (const item of remainingOccurrences) {
        if (item.id !== highlightToDelete.id && deleteCount < remainingOccurrences.length) {
          console.log("Delete Remove", item);
          await new Promise(resolve => setTimeout(resolve, 500)); // Introduce a delay of 1000 milliseconds (1 second)
          try {
            await Handledelete(item, item.id);
            deleteCount++;
          } catch (error) {
            console.error('Error deleting data:', error);
          }
        }
      }
    }
    setOpenWarning(false);
  }

  const handleSubmit = (data: any) => {
    console.log("datavalue", data.changed.value);
    const val = highlights.filter((obj, index): any => index == idx)
    console.log("val->", val[0].id)
    setText(data.changed.value);
    setId(val[0].id);
  }
  console.log("highlights", highlights[idx]?.position?.form);
  const f1 = highlights[idx]?.position?.form


  const counts: any = []
  const TotalPage = pages;

  highlights.forEach(function (highlight) { counts[highlight.comment.text] = (counts[highlight.comment.text] || 0) + 1; });
  const highlighter: any = highlights.map(ele => {
    const noOccurence = highlights.filter(obj => obj.comment.text === ele.comment.text).length;
    if (counts[ele.comment.text] > 1) {
      let Totalfieldcounts = counts[ele.comment.text] || 1;

      const fieldcount = Totalfieldcounts - noOccurence + 1
      ele.comment.text = `${ele.comment.text} (${fieldcount}/${Totalfieldcounts})`
      counts[ele.comment.text] = Totalfieldcounts + 1;
    }
    return ele;
  })
  const updatedHash = (id: any) => {
    console.log("Index_Value", id)
    document.location.hash = `highlight-${id}`;
  };

  const updateHash1 = (text: any) => {
    console.log("Index_Value", text)
    // document.location.hash = `highlight-${highlight.id}`;
    const Comment: any[] = highlights.filter((obj: any) => obj.comment.text === text);
    console.log("Index comment", Comment)
    let id = Comment[0].id
    document.location.hash = `highlight-${id}`;
  };

  const uniqueFieldNames = [...new Set(highlights.map((highlight) => {
    // Remove the occurrence count (e.g., (1/2)) if it exists
    return highlight.comment.text.replace(/\(\d+\/\d+\)$/, '');
  }))];
  console.log("uniqueFieldNames", uniqueFieldNames);


  useEffect(() => {
    const initialSelectedOccurrences: any = {};
    uniqueFieldNames.forEach((fieldName) => {
      const fieldOccurrences = highlights.filter(
        (highlight) =>
          highlight.comment.text.replace(/\(\d+\/\d+\)$/, '') === fieldName
      );
      if (fieldOccurrences.length > 1) {
        // Set the default value for the dropdown to the ID of the first occurrence
        initialSelectedOccurrences[fieldName] = fieldOccurrences[0].id;
      }
    });
    setSelectedOccurrences(initialSelectedOccurrences);
  }, [highlights]);


  const handleFieldDropdownChange = (fieldName: any, selectedValue: any) => {
    // Create a copy of the selectedOccurrences object
    const updatedSelectedOccurrences = { ...selectedOccurrences };
    // Update the selected value for the fieldName
    updatedSelectedOccurrences[fieldName] = selectedValue;
    setSelectedOccurrences(updatedSelectedOccurrences);


    // Handle any other actions you need here
    updatedHash(selectedValue);
    scrollToView();
  };


  console.log("newMyArr", highlighter);
  return (
    <>
      <div className="v_sidebar" style={{ width: "32vw" }}>
        <div className="description" style={{ padding: "4px" }}>
          <p style={{ fontSize: "15px" }}>
            <div>
              <input
                type="text"
                className='search-input form-control ps-13 fs-7 h-35px'
                value={search}
                placeholder="Search Field Name Here..."
                onChange={handlesearch}
                readOnly={readOnly}
              />
            </div>
          </p>
          <p>
            <small>
              To add new field, highlight the required text.
            </small>
          </p>
        </div>
        <ul className="sidebar__highlights">
          {uniqueFieldNames
            .filter((fieldName: any) => {
              console.log("fieldname", fieldName);
              if (search === "") {
                return true; // Show all field names if search is empty
              } else {
                // Use the includes() method to check if the field name includes the search term
                return fieldName.toLowerCase().includes(search.toLowerCase());
              }
            })
            .map((fieldName: any) => {
              const fieldOccurrences = highlights.filter(
                (highlight) =>
                  highlight.comment.text.replace(/\(\d+\/\d+\)$/, "") === fieldName);
              // Check if there are multiple occurrences for this field
              if (fieldOccurrences.length > 1) {
                console.log("fieldoccur", fieldOccurrences);
                return (
                  <li key={fieldName}>
                    <div>
                      <tr>
                        <td style={{ width: '10%' }}>
                          <select
                            // className="form-select form-select-solid"
                            // style={{ width: '100%', background: '#f8c8dc' }}
                            onChange={(e) => {
                              handleFieldDropdownChange(fieldName, e.target.value)
                            }}
                            value={selectedOccurrences[fieldName]}
                          // disabled={readOnly}
                          >
                            {fieldOccurrences.map((occurrence) => (
                              <option key={occurrence.id} value={occurrence.id}>
                                {occurrence.comment.text}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="sidebar__td">
                          {/* <FcCheckmark
                            className="sidebar__edit"
                            onClick={() => {
                              handleOpen2(fieldOccurrences[0]);
                              updateHash(fieldOccurrences[0]);
                              scrollToView();
                            }}
                          /> */}
                          {readOnly ? null : (
                            <MdEdit
                              className="sidebar__edit"
                              onClick={() => {
                                if (!readOnly) { // Only allow edit if not in read-only mode
                                  const selectedOccurrence = fieldOccurrences.find(
                                    (occurrence) => occurrence.id === selectedOccurrences[fieldName]
                                  );
                                  if (selectedOccurrence) {
                                    handleOpen1(selectedOccurrence.id);
                                    updateHash(selectedOccurrence);
                                    scrollToView();
                                  }
                                }
                              }}
                            />
                          )}
                          {/* <MdEdit
                            className="sidebar__edit"
                            onClick={() => {
                              const selectedOccurrence = fieldOccurrences.find(
                                (occurrence) => occurrence.id === selectedOccurrences[fieldName]
                              );
                              if (selectedOccurrence) {
                                handleOpen1(selectedOccurrence.id);
                                updateHash(selectedOccurrence);
                                scrollToView();
                              }
                            }}
                          /> */}
                          {/* <AiFillDelete
                            className="sidebar__delete"
                            onClick={() => {
                              const selectedOccurrence = fieldOccurrences.find(
                                (occurrence) => occurrence.id === selectedOccurrences[fieldName]
                              );
                              if (selectedOccurrence) {
                                handleDeleteClick(selectedOccurrence);
                              }
                            }}
                          /> */}
                          {readOnly ? null : (
                            <AiFillDelete
                              className="sidebar__delete"
                              onClick={() => {
                                if (!readOnly) { // Only allow delete if not in read-only mode
                                  const selectedOccurrence = fieldOccurrences.find(
                                    (occurrence) => occurrence.id === selectedOccurrences[fieldName]
                                  );
                                  if (selectedOccurrence) {
                                    handleDeleteClick(selectedOccurrence);
                                  }
                                }
                              }}
                            />
                          )}
                          <div>
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
                                    <td style={{ color: "black" }}><Button onClick={handleClose1}><MdOutlineClose />&nbsp;Cancel</Button></td>
                                    <td style={{ color: "black" }}><Button onClick={handleSave}><FcCheckmark />&nbsp;Ok</Button></td>
                                  </tr>
                                </div>
                              </Box>
                            </Modal>
                          </div>
                        </td>
                      </tr>
                    </div>
                    <div className="sidebar__highlight"
                      onClick={() => {
                        updatedHash(selectedOccurrences[fieldName]);
                        scrollToView();
                      }}
                    >
                      {fieldOccurrences
                        .filter((occurrence) => occurrence.id === selectedOccurrences[fieldName])
                        .map((selectedOccurrence) => (
                          <>
                            <p key={selectedOccurrence.id}>
                              {selectedOccurrence.content.text}
                            </p><div className="highlight__location">
                              <b>Page {selectedOccurrence.position.pageNumber}/{TotalPage}</b>
                            </div>
                          </>
                        ))}


                    </div>
                  </li>
                );
              } else {
                // Render without a dropdown if there's only one occurrence
                return (
                  <li key={fieldName}>
                    <div>
                      <tr>
                        <td style={{ width: '10%' }}>
                          <b style={{ fontSize: "15px" }}>{fieldName}</b>
                        </td>
                        <td className="sidebar__td">
                          {/* <FcCheckmark
                            className="sidebar__edit"
                            onClick={() => {
                              handleOpen2(fieldOccurrences[0]);
                              updateHash(fieldOccurrences[0]);
                              scrollToView();
                            }}
                          /> */}
                          {/* <MdEdit
                            className="sidebar__edit"
                            onClick={() => {
                              handleOpen1(fieldOccurrences[0].id);
                              updateHash(fieldOccurrences[0]);
                              scrollToView();
                            }}
                          />
                          <AiFillDelete
                            className="sidebar__delete"
                            onClick={() => {
                              handleDeleteClick(fieldOccurrences[0]);
                            }}
                          /> */}
                          {readOnly ? null : (
                            <MdEdit
                              className="sidebar__edit"
                              onClick={() => {
                                if (!readOnly) { // Only allow edit if not in read-only mode
                                  handleOpen1(fieldOccurrences[0].id);
                                  updateHash(fieldOccurrences[0]);
                                  scrollToView();
                                }
                              }}
                            />
                          )}
                          {readOnly ? null : (
                            <AiFillDelete
                              className="sidebar__delete"
                              onClick={() => {
                                if (!readOnly) { // Only allow delete if not in read-only mode
                                  handleDeleteClick(fieldOccurrences[0]);
                                }
                              }}
                            />
                          )}
                          <div>
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
                                    <td style={{ color: "black" }}><Button onClick={handleClose1}><MdOutlineClose />&nbsp;Cancel</Button></td>
                                    <td style={{ color: "black" }}><Button onClick={handleSave}><FcCheckmark />&nbsp;Ok</Button></td>
                                  </tr>
                                </div>
                              </Box>
                            </Modal>
                          </div>
                        </td>
                      </tr>
                    </div>
                    <div className="sidebar__highlight" onClick={() => {
                      updateHash1(fieldName);
                      scrollToView();
                    }}>
                      {fieldOccurrences.map((occurrence) => (
                        <>
                          <p key={occurrence.id}>
                            {occurrence.content.text}
                          </p>
                          <div className="highlight__location">
                            <b>Page {occurrence.position.pageNumber}/{TotalPage}</b>
                          </div>
                          {/* <div
                            className="highlight__image"
                            style={{ marginTop: "0.5rem" }}
                          >
                            <img src={occurrence.content.image} alt={"Screenshot"} />
                          </div> */}
                        </>
                      ))}
                    </div>
                  </li>
                );
              }
            })}
        </ul>
        {/* <ul className="sidebar__highlights">
          {highlights
            .filter((highlight: any) => {
              if (search == "") {
                return highlight;
              } else if (
                highlight.comment.text.toLowerCase().includes(search.toLowerCase())
              ) {
                console.log("search value", highlight)
                return highlight;
              }
            })
            .map((highlight, index) => (
              <li
                key={index}
              >
                <div>
                  <tr>
                    <td style={{ width: '10%' }}><b style={{ fontSize: "15px" }}>{highlight.comment.text}</b></td>
                    <td className="sidebar__td">
                      {highlight.comment.text.match(/\((\d+)\/(\d+)\)$/) ?
                        <FcCheckmark className="sidebar__edit" onClick={() => { handleOpen2(highlight); updateHash(highlight); scrollToView(); }} />
                        : null} &nbsp;
                      <MdEdit className="sidebar__edit" onClick={() => {
                        handleOpen1(highlight.id); updateHash(highlight);
                        scrollToView();
                      }} />&nbsp;
                      <AiFillDelete className="sidebar__delete" onClick={() => {
                        handleDeleteClick(highlight)
                      }} />
                      <div>
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
                                <td style={{ color: "black" }}><Button onClick={handleClose1}><MdOutlineClose />&nbsp;Cancel</Button></td>
                                <td style={{ color: "black" }}><Button onClick={handleSave}><FcCheckmark />&nbsp;Ok</Button></td>
                              </tr>
                            </div>
                          </Box>
                        </Modal>
                      </div>
                    </td>
                  </tr>

                </div>

                <div className="sidebar__highlight" onClick={() => {
                  updateHash(highlight);
                  scrollToView();
                }}>
                  {highlight.content.text ? (
                    <p style={{ marginTop: "0.5rem" }}
                      onInput={(e) => { handleChange(e, highlight.id) }}
                    >
                      {`${highlight.content.text.slice(0, 100).trim()}…`}
                    </p>
                  ) : null}
                  {highlight.content.image ? (
                    <div
                      className="highlight__image"
                      style={{ marginTop: "0.5rem" }}
                    >
                      <img src={highlight.content.image} alt={"Screenshot"} />
                    </div>
                  ) : null}
                  <div className="highlight__location">
                    <b>Page {highlight.position.pageNumber}/{TotalPage}</b>
                  </div>
                </div>
              </li>
            ))}
        </ul> */}
        <Modal
          open={openWarning}
          onClose={handleCloseWarning}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
          slots={{ backdrop: Backdrop }}
        >
          <Box sx={style}>
            <h3>Warning!</h3>
            <p style={{ color: 'black' }}>Are you sure want to delete the other " {fieldName}" field occurences?</p>
            <div style={{ marginLeft: '60%' }}>
              <Button onClick={handleCloseWarning}>
                <MdOutlineClose onClick={handleCloseWarning} />&nbsp;Cancel
              </Button>
              <Button onClick={handleDeleteConfirmed}>
                <FcCheckmark onClick={handleDeleteConfirmed} />&nbsp;Ok
              </Button>
            </div>
          </Box>
        </Modal>
        <Modal
          open={openConfirm}
          onClose={() => setOpenConfirm(false)}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
          slots={{ backdrop: Backdrop }}
        >
          <Box sx={style}>
            <h3>Warning!</h3>
            <p style={{ color: 'black' }}>Are you sure want to delete the selected field?</p>
            <div style={{ marginLeft: '55%' }}>
              <Button onClick={() => setOpenConfirm(false)}>
                <MdOutlineClose onClick={() => setOpenConfirm(false)} />&nbsp;Cancel
              </Button>
              <Button onClick={handleDeleteOk}>
                <FcCheckmark onClick={handleDeleteOk} />&nbsp;Ok
              </Button>
            </div>
          </Box>
        </Modal>
      </div>
    </>
  );
}
