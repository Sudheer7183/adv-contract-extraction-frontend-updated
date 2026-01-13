import React, { useEffect, useMemo, useState } from 'react'
import axios from "axios";
import Select from 'react-select';
import { useNavigate } from 'react-router-dom';
import { Alert, Snackbar } from '@mui/material';
import request, { gql } from 'graphql-request';
import { useListView } from '../../../../catalog/catalogFile/users-list/core/ListViewProvider1';
import BASEURL from '../../../../../../config/baseurl';


const ALL_CATALOG_FILES = gql`
query{
  allCatalogfiles{
    id
    catalogName
    active
    catalogdetail{
      id
      userContractTypeMaster{
        id
        contractTypeName
        active
        usercontracttypedetail{
            edges{
                node{
                  id
                  fieldId
                  fieldName
                }
            }
        }
      }
    }
  }
}`


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
            }
        }
    }
  }
}`


const CreateCatalog = () => {
    const { setUpdate } = useListView()
    const nav = useNavigate();
    const [isChecked, setIsChecked] = useState(false);
    const [message, setMessage] = useState("")
    const [message1, setMessage1] = useState(false)
    const [open1, setOpen1] = useState(false);
    const [catalogName, setCatalogName] = useState("");
    const [checkCatalogName, setCheckCatalogName] = useState("");
    const [error, setError] = useState("");
    // const [selectedOption1, setSelectedOption1] = useState<any[]>([]);
    const [selectedOption2, setSelectedOption2] = useState<any[]>([]);
    const [docType, setDocType] = useState("")
    const [docTypeArr, setDocTypeArr] = useState<any[]>([])
    const [cfile, setCfile] = useState<any[]>([])
    const [contractId, setContractId] = useState<any[]>([])
    const [contractTypes, setContractTypes] = useState<any[]>([])
    const [optionlen, setOptionlen] = useState(0)
    const [data, setData] = useState<any[]>([])
    // const contractTypes = useQuery(ALL_CONTRACT_TYPES)
    console.log("Zuva Fields", contractTypes)

    useEffect(() => {
        request(`${BASEURL}graphql/`, ALL_CATALOG_FILES, {}, {Authorization: `Bearer ${localStorage.getItem('Token')}`}).then((res: any) => setData(res.allCatalogfiles))
        request(`${BASEURL}graphql/`, ALL_CONTRACT_TYPES, {}, {Authorization: `Bearer ${localStorage.getItem('Token')}`}).then((res: any) => setContractTypes(res))
    }, []);

    const length = contractTypes?.allContractTypes?.length


    let option2: any[] = [];


    for (let j = 0; j < length; j++) {
        const ct = contractTypes?.allContractTypes[j]?.contractTypeName
        const ct1 = contractTypes?.allContractTypes[j]?.contractTypeName
        const ctId = contractTypes?.allContractTypes[j]?.id
        option2.push({ value: ct, label: ct1, id: ctId });
    }


    console.log("contract type Array", option2)

    console.log("all catalog data", data);



    const updateCatalogName = (e: any) => {
        setCheckCatalogName(e.target.value)
        setCatalogName(e.target.value)
        if (data.find((item: any) => item.catalogName.toUpperCase() === e.target.value.toUpperCase()) !== undefined) {
            setError("Catalog Name already Available");
        } else {
            setCatalogName(e.target.value)
            setError("");
        }
    }
    const handleActiveStatus = () => {
        setIsChecked(!isChecked);
    }
    console.log("Active status->", isChecked);


    const handleChange2 = (selectedOption: any) => {
        console.log("contract type selectedOption", selectedOption)
        setSelectedOption2(selectedOption);
        let len = selectedOption.length
        setOptionlen(len)
        if (optionlen <= len) {
            for (let i = 0; i < len; i++) {
                let Id = selectedOption[i].id
                console.log("Selected Email", Id)
                contractId.push({ cId: Id })
                setContractId(contractId)
                let type = selectedOption[i].value
                console.log("Selected Type", type)
                for (let j = 0; j < length; j++) {
                    if (contractTypes?.allContractTypes[j]?.id == Id && !(docTypeArr.includes(type))) {
                        setDocTypeArr((prev) => [...prev, type])
                        console.log("Selected Contract type Value-->", contractTypes?.allContractTypes[j])
                        setDocType(contractTypes?.allContractTypes[j]?.contractTypeName)
                        let user_contract_type = contractTypes?.allContractTypes[j]?.contractTypeName
                        let value = contractTypes?.allContractTypes[j]?.usercontracttypedetail?.edges
                        console.log("values--->", value, value.length)
                        let fieldarr: any[] = [];
                        for (let k = 0; k < value.length; k++) {
                            let field_id = value[k].node.fieldId
                            let field_name = value[k].node.fieldName
                            console.log("fields array", field_id, field_name)
                            fieldarr.push({ Id: field_id, Name: field_name })
                            console.log("fieldarr--->", fieldarr)
                        }
                        console.log("catalog array values set usestate", docType, fieldarr)
                        cfile.push({ ContractType: user_contract_type, Fields: fieldarr })
                        // setCfile(current => [...current, { ContractType: user_contract_type, Fields: fieldarr }]);
                    }


                }
            }
        }
        else {
            for (let c = 0; c < cfile.length; c++) {
                let match = false;
                if (selectedOption.length == 0) {
                    console.log("remove all items");
                    setCfile([])
                }
                for (let s = 0; s < selectedOption.length; s++) {
                    if (cfile[c].ContractType == selectedOption[s].value) {
                        match = true;
                        break;
                    }
                }
                if (!match) {
                    let idx = docTypeArr.indexOf(cfile[c].ContractType);
                    if (idx > -1) {
                        docTypeArr.splice(idx, 1);
                    }
                    let index = cfile.indexOf(cfile[c]);
                    if (index > -1) {
                        cfile.splice(index, 1);
                    }
                    console.log(cfile);

                }
            }

        }
    };
    // console.log("classification array", cfile)
    // let classfile: any = { Classification: cfile };
    // console.log("Final classification json", classfile)

    const handleCancel = () => {
        localStorage.setItem('activeTab', 'catalog');
        nav("/catalogManagement/ContractType");
        // nav("/catalog-management/catalog");
    };


    const handleClose1 = () => {
        setOpen1(false);
    };


    const catalogSubmit = (event1: any) => {
        event1.preventDefault()
        console.log("catalog name", catalogName)
        const url = `${BASEURL}catalog/`;
        // setOpen1(true);
        axios.post(url, { isChecked, catalogName, contractId }, {
            headers: {
                'content-type': "application/json",
                'Authorization': `Bearer ${localStorage.getItem('Token')}`,
            }
        })
            .then(response => {
                setOpen1(true);
                console.log("Response catalog create", response, response.data)
                if (response.data == 'ok') {
                    setMessage1(true)
                    setMessage("Successfully Created the Catalog")
                    setUpdate(true)
                }
            })
            .catch(error => {
                setOpen1(true);
                setMessage1(false)
                setMessage("Something Went Wrong")
                console.log("create catalog error", error)
            });
        setTimeout(() => {
            localStorage.setItem('activeTab', 'catalog');
            nav("/catalogManagement/ContractType");
        }, 1000);
    }

    const colorv = localStorage.getItem("themeColor")
    const themec = colorv != null ? colorv + " " + 'btn' : 'p-3 bg-primary text-white btn'

    const maxFieldCount = Math.max(...cfile.map((contractType) => contractType.Fields.length));

    return (
        <>
            {/* <Home /> */}
            <div className='container my-container'>
                <div>
                    <div className="cproject">
                        <h4 style={{ color: "purple" }}>Create Catalog</h4><br />
                        <form onSubmit={catalogSubmit}>
                            <label className="required form-label fs-6 mb-2"><b>Enter Catalog Name:</b></label>
                            <input
                                type="text"
                                className="form-control form-control mb-3 mb-lg-0"
                                placeholder='Enter Catalog Name'
                                onChange={updateCatalogName}
                                value={checkCatalogName}
                                name="name"
                                required /><br />
                            <div className='fv-plugins-message-container'>
                                <div className='fv-help-block'>
                                    <span role='alert'>{error}</span>
                                </div>
                            </div>
                            <p>
                                <label className='required fw-bold fs-6 mb-2'>
                                    <input type="checkbox" onChange={handleActiveStatus} required />&nbsp;
                                    <span>Active</span>
                                </label>
                            </p>
                            <section>
                                <label className="required form-label fs-6 mb-2"><b>Choose Contract Types:</b></label>
                                <Select
                                    className="dropdown"
                                    isMulti={true}
                                    value={selectedOption2}
                                    isSearchable={true}
                                    closeMenuOnSelect={false}
                                    onChange={handleChange2}
                                    required
                                    options={option2} /><br />
                            </section>
                            <button type="button" className='btn btn-secondary' onClick={handleCancel}>Cancel</button>&nbsp;&nbsp;
                            <button type="submit" className={themec}>Save</button>
                        </form>
                    </div><br /><br />
                    <div>
                        <div>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Field Name's from chosen contract type</th>
                                    </tr>
                                </thead><br />
                                <tbody>
                                    <tr>
                                        {cfile.map((field, index) => (
                                            <th key={index} style={{ width: `${100 / cfile.length}%` }}>{field.ContractType}</th>
                                        ))}
                                    </tr>
                                    {Array.from({ length: maxFieldCount }).map((_, valIndex) => (
                                        <tr key={valIndex}>
                                            {cfile.map((field, fieldIndex) => (
                                                <td key={fieldIndex}>
                                                    {field.Fields[valIndex]?.Name || ''}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
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


export default CreateCatalog
