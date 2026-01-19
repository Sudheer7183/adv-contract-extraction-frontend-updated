import React, { useEffect, useMemo, useState } from 'react'
import Select from 'react-select';
// import { useMutation, useQuery } from '@apollo/client';
// import { ALL_CATALOG } from "../graphql/Queries";
import { MaterialReactTable } from 'material-react-table';
// import Home from '../pages/Home';
import { useNavigate, useParams } from 'react-router-dom';
import { Alert, Snackbar, Button } from '@mui/material';
// import { CREATE_CONTRACT_TYPE } from '../graphql/Mutations';
// import { client } from '../Client';
import request, { gql } from 'graphql-request';
import { MdOutlineClose } from 'react-icons/md';
import { useListView } from '../../../../catalog/contractType/users-list/core/ListViewProvider';
import BASEURL from '../../../../../../config/baseurl';

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

const GET_CONTRACT = gql`
query getContract($id: Int!){
    getContract(id: $id){
      id
      active
      contractTypeName
      contractZuvaType
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


const UPDATE_CONTRACT_TYPE = gql`
mutation updateContract(
  $contractId: Int!
  $contractType: String!
  $zuvaType: String!
  $assignField: [FieldsInput]!
){
  updateContract(
    input:{
      contractId: $contractId
      contractType: $contractType
      zuvaType: $zuvaType
      assignField: $assignField
    }
  ){
    updateContract{
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


const EditContractType = () => {
    const { id } = useParams()
    const { setUpdate } = useListView()
    const nav = useNavigate();
    const [message, setMessage] = useState("")
    const [message1, setMessage1] = useState(false)
    const [open1, setOpen1] = useState(false);
    const [docType, setDocType] = useState("")
    const [rowSelection, setRowSelection] = useState<MRT_RowSelectionState>({});
    const [value, setValue] = useState<any[]>([])
    const [fieldArr, setFieldArr] = useState<any[]>([])
    const [fieldArr1, setFieldArr1] = useState<any[]>([])
    const [fields, setFields] = useState<any[]>([])
    const [catalogs, setCatalogs] = useState<any[]>([])
    const [contract, setContract] = useState<any[]>([])
    const [data1, setData1] = useState<any[]>([])
    const [checkContractType, setCheckContractType] = useState("");
    const [contractType, setContractType] = useState("");
    const [error1, setError1] = useState("");

    useEffect(() => {
        request(`${BASEURL}graphql/`, ALL_CONTRACT_TYPES, {}, {Authorization: `Bearer ${localStorage.getItem('Token')}`}).then((res: any) => setData1(res.allContractTypes))
        request(`${BASEURL}graphql/`, ALL_CATALOG, {}, {Authorization: `Bearer ${localStorage.getItem('Token')}`}).then((res: any) => setCatalogs(res))
        request(`${BASEURL}graphql/`, ALL_FIELDS, {}, {Authorization: `Bearer ${localStorage.getItem('Token')}`}).then((res: any) => setFields(res.allCatalogFields))
        request(`${BASEURL}graphql/`, GET_CONTRACT, { id: id }, {Authorization: `Bearer ${localStorage.getItem('Token')}`}).then((res: any) => setContract(res.getContract))
    }, []);

    console.log("econtract in edit contract", contract);
    const zuva_type = contract.contractZuvaType;
    const contract_type = contract.contractTypeName
    const contract_id = contract.id
    const usercontract_detail = contract?.usercontracttypedetail?.edges

    useEffect(() => {
        if (usercontract_detail != undefined) {
            let fieldarr: any[] = []
            for (let j = 0; j < usercontract_detail.length; j++) {
                const fid = usercontract_detail[j]?.node?.fieldId
                const fname = usercontract_detail[j]?.node?.fieldName
                const oprompt = usercontract_detail[j]?.node?.originalPrompt
                const cprompt = usercontract_detail[j]?.node?.currentPrompt
                const ffclause = usercontract_detail[j]?.node?.fieldFullClause
                // const contract_type = usercontract_detail[j]?.node?.zuvaContractType
                setFieldArr(current => [...current, { fieldId: fid, fieldName: fname,originalPrompt:oprompt,currentPrompt: cprompt,fieldFullClause: ffclause }]);
                fieldarr.push({ fieldId: fid, fieldName: fname,originalPrompt:oprompt,currentPrompt: cprompt,fieldFullClause: ffclause })
            }
            fieldArr1.push({ fields: fieldarr })
            setFieldArr1(fieldArr1)
        }
        setDocType(zuva_type)
        setContractType(contract_type)
        setCheckContractType(contract_type)
    }, [zuva_type, contract_type, usercontract_detail])

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
                // muiTableBodyCellEditTextFieldProps: ({ row, table }: any) => ({
                //     children: (
                //         <input
                            
                //             onChange={(e) => {
                //                 const updatedValue = e.target.value;
                //                 console.log("Updated Full Clause:", updatedValue);
                //                 table.options.meta?.updateData(row.index, 'fieldFullClause', updatedValue);
                //             }}
                //         />
                //     ),
                // }),
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
            },
        ],
        [],
    );

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


    const length = catalogs?.allCatalogs?.length
    let option2: any[] = [];

    for (let j = 0; j < length; j++) {
        const ct = catalogs?.allCatalogs[j]?.contractType
        const ct1 = catalogs?.allCatalogs[j]?.contractType
        option2.push({ value: ct, label: ct1 });
    }

    const handleChange2 = (e: any) => {
        setDocType(e.target.value)
    };


    const HandleContract = () => {
        let fieldarr: any[] = []
        for (let j = 0; j < value.length; j++) {
            let field_id = value[j][0].fieldId
            let field_name = value[j][0].fieldName
            let original_prompt = value[j][0].originalPrompt
            let current_prompt = value[j][0].currentPrompt || original_prompt;
            let field_full_clause_str = value[j][0].fieldFullClause;
            let field_full_clause = typeof field_full_clause_str === "boolean" ? field_full_clause_str : String(field_full_clause_str).toLowerCase() === "true";
            
            // let zuva_ctype = value[j][0].contractType
            fieldarr.push({ fieldId: field_id, fieldName: field_name, originalPrompt: original_prompt, currentPrompt: current_prompt, fieldFullClause: field_full_clause })
            setFieldArr(current => [...current, { fieldId: field_id, fieldName: field_name, originalPrompt: original_prompt, currentPrompt: current_prompt, fieldFullClause: field_full_clause }]);
        }
        setFieldArr1(current => [...current, { fields: fieldarr }]);
        setRowSelection({})
        setValue([])
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
            setFieldArr1(fieldArr1)


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
        request(`${BASEURL}graphql/`, UPDATE_CONTRACT_TYPE,
            { contractId: contract_id, contractType: contractType, zuvaType: docType, assignField: fieldArr },
            {Authorization: `Bearer ${localStorage.getItem('Token')}`})
            .then((data: any) => {
                const val = Object.keys(data?.updateContract.updateContract).length
                console.log("val", val)
                setOpen1(true);
                if (val > 0) {
                    setMessage1(true)
                    setMessage("Successfully Updated the ContractType")
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
                        <h4 style={{ color: "purple" }}>Edit ContractType</h4><br />
                        <form onSubmit={catalogSubmit}>
                            <label className="required form-label fs-6 mb-2"><b>Contract Type:</b></label>
                            <input
                                type="text"
                                name="name"
                                onChange={updateContractType}
                                className="form-control form-control mb-3 mb-lg-0"
                                placeholder='Contract Type'
                                value={checkContractType}
                                required
                            />
                            <br />
                            <div className='fv-plugins-message-container'>
                                <div className='fv-help-block'>
                                    <span role='alert'>{error1}</span>
                                </div>
                            </div>
                            <section>
                                <label className="required form-label fs-6 mb-2"><b>Zuva Contract Type:</b></label>
                                <select
                                    className="form-select"
                                    name="select2_input"
                                    data-control="select2"
                                    data-placeholder="Select an option"
                                    onChange={handleChange2}
                                    value={docType}
                                >
                                    {option2.map((e: any) => (
                                        <option value={e.value}>{e.value}</option>
                                    ))}
                                </select>
                                <br />
                            </section>
                            <button type="button" className="btn btn-secondary me-3" onClick={handleCancel}>Cancel</button>&nbsp;&nbsp;
                            <button type="submit" className={themec}>Save</button>
                        </form>
                    </div><br /><br />
                    <div className="verticalLine">
                        <h4 style={{ color: "purple" }}>Choose the Fields for ContractType</h4>
                        <div style={{ marginLeft: '69rem' }}>
                            <button type="button" className={themec} onClick={() => HandleContract()} disabled={value.length === 0}>Add</button>&nbsp;&nbsp;
                        </div>
                        <MaterialReactTable
                            columns={columns}
                            data={fields ?? []}
                            filterFns={{
                                customFilterFn: (row, id, filterValue) => {
                                    return row.original.fieldName.toLowerCase().includes(filterValue.toLowerCase());
                                },
                            }}
                            enableTopToolbar={false}
                            enableEditing
                            editingMode="cell" // or "row" if you prefer whole-row editing
                            // Pass the updateData function via meta
                            meta={{ updateData }}
                            // enableRowSelection
                            initialState={{ density: 'compact' }}
                            muiTableBodyRowProps={({ row }: any) => ({
                                //implement row selection click events manually
                                onClick: () => {
                                    setRowSelection((prev: any) => ({
                                        ...prev,
                                        [row.id]: !prev[row.id],
                                    }));
                                    setValue((prev: any) => rowSelection[row.id] ? [...prev].filter(item => item[0] !== row.original)
                                        : ([
                                            ...prev,
                                            [row.original]
                                        ]));
                                },
                                selected: rowSelection[row.id],
                                sx: {
                                    cursor: 'pointer',
                                },
                            })}
                            state={{ rowSelection, showColumnFilters: true }}
                        />
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

export default EditContractType

