import React, { useEffect, useMemo, useState } from 'react'
import axios from "axios";
import Select from 'react-select';
import { MaterialReactTable } from 'material-react-table';
import { useNavigate } from 'react-router-dom';
import { Alert, Snackbar, Button } from '@mui/material';
import request, { gql } from 'graphql-request';
import { MdOutlineClose } from 'react-icons/md';
import { useListView } from '../../../../catalog/contractType/users-list/core/ListViewProvider';
import BASEURL from '../../../../../../config/baseurl';
import CircularProgress from '@mui/material/CircularProgress';


const ALL_CONTRACT_TYPES = gql`
query{
  allContractTypes{
    id
    active
    contractTypeName
    usercontracttypedetail{
        edges{
            node{
              id
              fieldId
              fieldName
              originalPrompt
              currentPrompt
              fieldFullClause
            }
        }
    }
  }
}`


const ALL_CATALOG = gql`
query{
    allCatalogs{
      id
      fieldId
      fieldName
      contractType
      originalPrompt
      currentPrompt
      fieldFullClause
    }
  }`

const ALL_FIELDS = gql`
query{
    allCatalogFields{
      id
      fieldId
      fieldName
      contractType
      originalPrompt
      currentPrompt
      fieldFullClause
    }
  }`


const CREATE_CONTRACT_TYPE = gql`
mutation CreateContract(
  $contractType: String!
  $zuvaType: String!
  $assignField: [FieldsInput]!
){
  createContract(
    input:{
      contractType: $contractType
      zuvaType: $zuvaType
      assignField: $assignField
    }
  ){
    contract{
      id
      active
      contractTypeName
      contractZuvaType
      createdAt
      usercontracttypedetail{
        edges{
            node{
              id
              fieldId
              fieldName
              originalPrompt
              currentPrompt
              fieldFullClause
            }
        }
      }
    }
  }
}`

const CreateContractType = () => {
    const { setUpdate } = useListView()
    const nav = useNavigate();
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("")
    const [message1, setMessage1] = useState(false)
    const [open1, setOpen1] = useState(false);
    const [checkContractType, setCheckContractType] = useState("");
    const [contractType, setContractType] = useState("");
    const [error1, setError1] = useState("");
    const [saveButton, setSaveButton] = useState(true);
    const [docType, setDocType] = useState("")
    const [rowSelection, setRowSelection] = useState<MRT_RowSelectionState>({});
    const [value, setValue] = useState<any[]>([])
    const [fieldArr, setFieldArr] = useState<any[]>([])
    const [fieldArr1, setFieldArr1] = useState<any[]>([])
    const [fields, setFields] = useState<any[]>([])
    const [catalogs, setCatalogs] = useState<any[]>([])
    const [data1, setData1] = useState<any[]>([])
    const [refreshBtn, setRefreshBtn] = useState(false)
     const [activeTab, setActiveTab] = useState<'catalog' | 'contract'>('catalog')

// useEffect(() => {
//   const storedTab = sessionStorage.getItem('catalogTab')
//   if (storedTab === 'contract' || storedTab === 'catalog') {
//     setActiveTab(storedTab as 'contract' | 'catalog')
//   }
// }, [])

 useEffect(() => {
  const token = localStorage.getItem('Token');
  const headers = { Authorization: `Bearer ${token}` };
  Promise.all([
    request(`${BASEURL}graphql/`, ALL_CONTRACT_TYPES, {}, headers),
    request(`${BASEURL}graphql/`, ALL_CATALOG, {}, headers),
    request(`${BASEURL}graphql/`, ALL_FIELDS, {}, headers),
  ])
    .then(([contractRes, catalogRes, fieldRes]) => {
      setData1(contractRes.allContractTypes);
      setCatalogs(catalogRes);
      setFields(fieldRes.allCatalogFields);
    })
    .catch((err) => {
      console.error("Error fetching data", err);
    })
    .finally(() => {
      setLoading(false);
    });
}, []);



    const columns = useMemo(
        () => [
            {
                accessorKey: 'fieldName',
                header: 'Field Name',
                size: 120,
                filterFn: 'customFilterFn',
                enableEditing: false,
            },
            {
                accessorKey: 'fieldId',
                header: 'Field Id',
                size: 100,
                enableColumnFilter: false,
                enableEditing: false,
            },
            {
                accessorKey: 'fieldFullClause',
                header: 'Full Clause',
                size: 100,
                enableColumnFilter: false,
                enableEditing: true,
                Cell: ({ cell }: any) => (cell.getValue() ? 'Yes' : 'No'), // or use 'Enabled' / 'Disabled'
                muiTableBodyCellEditTextFieldProps: ({ row, table }: any) => ({
                    defaultValue: row.original.fieldFullClause,
                    onBlur: (event: any) => {
                      const updatedValue = event.target.value;
                      console.log("Updated Full Clause:", updatedValue);
                      
                      table.options.meta?.updateData(row.index, 'fieldFullClause', updatedValue);
                    },
                  }),
            },
            {
                accessorKey: 'currentPrompt',
                header: 'current Prompt',
                size: 100,
                enableColumnFilter: false,
                enableEditing: true,
                Cell: ({ row }: any) => row.original.currentPrompt || row.original.originalPrompt, // fallback for display
                muiTableBodyCellEditTextFieldProps: ({ row, table }: any) => ({
                    defaultValue: row.original.currentPrompt,
                    onBlur: (event: any) => {
                      const updatedPrompt = event.target.value;
                      console.log("current prompts edited value", updatedPrompt);
                      
                      table.options.meta?.updateData(row.index, 'currentPrompt', updatedPrompt);
                    },
                  }),
            },
            {
                header: 'Actions',
                id: 'actions',
                size: 100,
                Cell: ({ row, table }: any) => (
                    <Button
                        variant="outlined"
                        color="secondary"
                        size="small"
                        onClick={() => {
                            table.options.meta?.updateData(
                                row.index,
                                'currentPrompt',
                                row.original.originalPrompt
                            );
                        }}
                    >
                        Revert
                    </Button>
                ),
            }
        ],
        [],
    );

    const length = catalogs?.allCatalogs?.length

    let option2: any[] = [];

    for (let j = 0; j < length; j++) {
        const ct = catalogs?.allCatalogs[j]?.contractType
        const ct1 = catalogs?.allCatalogs[j]?.contractType
        option2.push({ value: ct, label: ct1 });
    }

    const updateData = (rowIndex: number, columnId: string, value: any) => {

        console.log("updated prompts, clause value", value);
        
        setFields((prev) =>
          prev.map((row, index) =>
            index === rowIndex ? { ...row, [columnId]: value } : row
          )
        );
    };


    const updateContractType = (e: any) => {
        setCheckContractType(e.target.value)
        if (data1.find((item: any) => item.contractTypeName.toUpperCase() === e.target.value.toUpperCase()) !== undefined) {
            setError1("Contract Type already Available");
        } else {
            setContractType(e.target.value)
            setError1("");
        }
    }

    const handleChange2 = (selectedOption: any) => {
        setDocType(selectedOption.target.value)
    };

    const RefreshFields = () => {
        const url = `${BASEURL}getfields/`;
        setRefreshBtn(true)
        axios.get(url, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('Token')}`
            }
        }).then((response: any) => {
            console.log(response);
            setOpen1(true);
            setMessage("Refreshed...")
            setMessage1(true)
            setRefreshBtn(false)
        }).catch((error: any) => {
            setOpen1(true);
            setMessage("Failed...")
            setMessage1(false)
            setRefreshBtn(false)
            console.log("Error Message", error)
        });
    }

    const HandleContract = () => {
        let fieldarr: any[] = []
        for (let j = 0; j < value.length; j++) {
            let field_id = value[j][0].fieldId
            let field_name = value[j][0].fieldName
            let original_prompt = value[j][0].originalPrompt
            let current_prompt = value[j][0].currentPrompt || original_prompt;
            let field_full_clause_str = value[j][0].fieldFullClause;
            let field_full_clause = typeof field_full_clause_str === "boolean" ? field_full_clause_str : String(field_full_clause_str).toLowerCase() === "true";
            fieldarr.push({ fieldId: field_id, fieldName: field_name, originalPrompt: original_prompt, currentPrompt: current_prompt, fieldFullClause: field_full_clause })
            setFieldArr(current => [...current, { fieldId: field_id, fieldName: field_name, originalPrompt: original_prompt, currentPrompt: current_prompt, fieldFullClause: field_full_clause }]);
        }
        setFieldArr1(current => [...current, { fields: fieldarr }]);
        setRowSelection({})
        setValue([])
        setSaveButton(false)
    }

    const RemoveFields = (fieldname: any) => {
        for (let j = 0; j < fieldArr.length; j++) {

            let filteredArray = fieldArr.filter(item => item.fieldName !== fieldname)
            setFieldArr(filteredArray)
        }
        for (let i = 0; i < fieldArr1.length; i++) {
            const index2 = fieldArr1[i].fields.findIndex((prod: any) => prod.fieldName === fieldname); //use id instead of index
            if (index2 > -1 && fieldArr1[i].fields.map((val: any) => val.fieldName === fieldname)) { //make sure you found it
                fieldArr1[i].fields.splice(index2, 1)
                console.log("array--->", fieldArr1);
            }
            console.log("array--->", fieldArr1);

        }
    }


    const handleCancel = () => {
        localStorage.setItem('activeTab', 'contract');
        nav("/catalogManagement/ContractType");
    };

    const handleClose1 = () => {
        setOpen1(false);
    };

    const catalogSubmit = async (event1: any) => {
        event1.preventDefault()
        setSaveButton(true)
        request(`${BASEURL}graphql/`, CREATE_CONTRACT_TYPE, { contractType: contractType, zuvaType: docType, assignField: fieldArr }, {Authorization: `Bearer ${localStorage.getItem('Token')}`}).then((data: any) => {
            const val = Object.keys(data?.createContract.contract).length
            console.log("val", val)
            setOpen1(true);
            if (val > 0) {
                setMessage1(true)
                setMessage("Successfully Created the ContractType")
                setUpdate(true)
            } else {
                setMessage1(false)
                setMessage("Something Went Wrong")
            }
            setTimeout(() => {
                localStorage.setItem('activeTab', 'contract');
                nav("/catalogManagement/ContractType");
            }, 1000);
        })

    }
    const colorv = localStorage.getItem("themeColor")
    const themec = colorv != null ? colorv + " " + 'btn' : 'p-3 bg-primary text-white btn'


    return (
        <>
       
            {/* <Home /> */}
            
            <div className='container my-container'>
                <div>
                    <div className="cproject">
                        <h4 style={{ color: "purple" }}>Create ContractType</h4><br />
                        <form onSubmit={catalogSubmit}>
                            <label className="required form-label fs-6 mb-2"><b>Enter Contract Type:</b></label>
                            <input type="text" name="name" onChange={updateContractType}
                                className="form-control form-control mb-3 mb-lg-0" placeholder='Enter Contract Type'
                                value={checkContractType} required />
                            <br />
                            <div className='fv-plugins-message-container'>
                                <div className='fv-help-block'>
                                    <span role='alert'>{error1}</span>
                                </div>
                            </div>
                            <section>
                                <label className="required form-label fs-6 mb-2"><b>Zuva Contract Type:</b></label>
                                <select className="form-select"
                                    name="select2_input"
                                    data-control="select2"
                                    data-placeholder="Select an option"
                                    // is-searchable="true"
                                    onChange={handleChange2}
                                    required
                                // data-allow-clear="true"
                                // options={option2}
                                >
                                    <option value="">Choose the zuva ContractType</option>
                                    {option2.map((e: any) => (
                                        <option value={e.value}>{e.value}</option>
                                    ))}
                                </select>
                                <br />
                            </section>
                            <button type="button" className="btn btn-secondary me-3" onClick={handleCancel}>Cancel</button>&nbsp;&nbsp;
                            <button type="submit" className={themec} disabled={saveButton}>Save</button>
                        </form>
                    </div><br /><br />
                    <div className="verticalLine">
                        <h4 style={{ color: "purple" }}>Choose the Fields for ContractType</h4>
                        <div style={{ marginLeft: '64rem' }}>
                            <button type="button" className={themec} onClick={() => RefreshFields()} disabled={refreshBtn}>
                                Refresh
                            </button>&nbsp;&nbsp;
                            <button type="button" className={themec} onClick={() => HandleContract()} disabled={value.length === 0}>
                                Add
                            </button>&nbsp;&nbsp;
                        </div>
                       
{loading ? (
  <div style={{ display: 'flex', justifyContent: 'center', marginTop: 30 }}>
    <b className={themec} style={{ marginRight: 12 }}>LOADING ...</b>
    <CircularProgress />
  </div>
) : (
  <MaterialReactTable
    columns={columns}
    data={fields ?? []}
    enableTopToolbar={false}
    filterFns={{
      customFilterFn: (row, id, filterValue) => {
        return row.original.fieldName.toLowerCase().includes(filterValue.toLowerCase());
      },
    }}
    enableEditing
    editingMode="cell"
    meta={{ updateData }}
    initialState={{ density: 'compact' }}
    muiTableBodyRowProps={({ row }: any) => ({
      onClick: () => {
        setRowSelection((prev: any) => ({
          ...prev,
          [row.id]: !prev[row.id],
        }));
        setValue((prev: any) =>
          rowSelection[row.id]
            ? [...prev].filter((item) => item[0] !== row.original)
            : [...prev, [row.original]]
        );
      },
      selected: rowSelection[row.id],
      sx: { cursor: 'pointer' },
    })}
    state={{ rowSelection, showColumnFilters: true }}
  />
)}
                    </div><br />
                    <div style={{ color: "black" }}>
                        <>
                            {contractType != "" ? <ul><b>Contract Type :</b>&nbsp;{contractType}</ul> : null}
                            {docType != "" ? <ul><b>Zuva Contract Type :</b>&nbsp;{docType}</ul> : null}
                            {fieldArr1.map((value: any) => {
                                return (
                                    <>
                                        {value.fields.map((val: any) => {
                                            return (
                                                <tr>
                                                    <td>{val.fieldName}</td>
                                                    <td><MdOutlineClose onClick={() => RemoveFields(val.fieldName)} /></td>
                                                </tr>
                                            )
                                        })}
                                    </>
                                )
                            })}
                        </>
                    </div>
                    <Snackbar anchorOrigin={{
                        vertical: "top",
                        horizontal: "center",
                    }} style={{ float: "right" }} open={open1} autoHideDuration={6000} onClose={handleClose1}>
                        {message1 ?
                            <Alert onClose={handleClose1} variant="filled" severity="success" sx={{ width: '100%' }}>
                                {message}!
                            </Alert>
                            : <Alert onClose={handleClose1} variant="filled" severity="error" sx={{ width: '100%' }}>
                                {message}!
                            </Alert>
                        }
                    </Snackbar>
                </div>
            </div>
        </>
    )
}


export default CreateContractType

