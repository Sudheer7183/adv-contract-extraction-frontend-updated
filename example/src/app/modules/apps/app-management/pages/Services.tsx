// import React, { useEffect, useState } from 'react'
// import { Form } from 'react-bootstrap';
// import { request, gql } from 'graphql-request'
// import { Alert, Snackbar } from '@mui/material';
// import { useNavigate } from 'react-router-dom';
// import { MdOutlineClose } from 'react-icons/md';
// import BASEURL from '../../../../config/baseurl';

// const allServices = gql`
// query{
//     allServices{
//       id
//       serviceName
//       active
//     }
//   }`

// const allServiceDetail = gql`
// query{
//     serviceDetail{
//         edges{
//             node{
//               id
//               service{
//                 serviceName
//               }
//               serviceApiUrl
//               serviceApiKey
//               accessKey
//               secretKey
//               regionName
//               description
//             }
//           }
//     }
//   }`

// const activeService = gql`
// query ActiveService($ids: [ServiceInput]!){
//     activeService(ids: $ids){
//       id
//       serviceName
//       active
//     }
//   }
// `
// const createServices = gql`
// mutation ServiceDetails(
//     $serviceDetail: [ServiceDetailInput]!
//   ){
//     serviceDetails(serviceDetail: $serviceDetail
//       ){
//       services{
//         id
//         service{
//           serviceName
//         }
//         serviceApiUrl
//         serviceApiKey
//         accessKey
//         secretKey
//         regionName
//       }
//     }
//   }`


// const Services = () => {
//     const nav = useNavigate();
//     const [selectedItems, setSelectedItems] = useState<any[]>([]);
//     const [open1, setOpen1] = useState(false);
//     const [message, setMessage] = useState("")
//     const [message1, setMessage1] = useState(false)
//     const [selectedId, setSelectedId] = useState<any[]>([]);
//     const [zuvaServiceUrl, setZuvaServiceUrl] = useState("")
//     const [zuvaServiceToken, setZuvaServiceToken] = useState("")
//     const [checkZuvaServiceToken, setCheckZuvaServiceToken] = useState("")
//     const [nanonetServiceUrl, setNanonetServiceUrl] = useState("")
//     const [checkNanonetServiceToken, setCheckNanonetServiceToken] = useState("")
//     const [nanonetServiceToken, setNanonetServiceToken] = useState("")
//     const [accessKey, setAccessKey] = useState("")
//     const [secretKey, setSecretKey] = useState("")
//     const [regionName, setRegionName] = useState("")
//     const [checkaccessKey, setCheckAccessKey] = useState("")
//     const [checksecretKey, setCheckSecretKey] = useState("")
//     // const [checkregionName, setCheckRegionName] = useState("")
//     const [zuvaDescription, setZuvaDescription] = useState("");
//     const [checkZuvaDescription, setCheckZuvaDescription] = useState("");
//     const [nanonetDescription, setNanonetDescription] = useState("");
//     const [checkNanonetDescription, setCheckNanonetDescription] = useState("");
//     const [awsDescription, setAWSDescription] = useState("");
//     const [checkawsDescription, setCheckAWSDescription] = useState("");
//     const [aiDescription, setAIDescription] = useState("");
//     const [checkaiDescription, setCheckAIDescription] = useState("");
//     const [data, setdata] = useState<any[]>([])
//     const [allDetail, setAllDetail] = useState<any[]>([])
//     const [detailArr1, setDetailArr1] = useState<any[]>([])
//     const [error1, setError1] = useState("");
//     const [error2, setError2] = useState("");
//     const [error3, setError3] = useState("");
//     const [error4, setError4] = useState("");
//     const [error, setError] = useState("")
//     const [checkurl, setCheckurl] = useState("");

//     const fetchData = () => {
//         request(`${BASEURL}graphql/`, allServices, {}, {Authorization: `Bearer ${localStorage.getItem('Token')}`}).then((res: any) => {
//             console.log(res.allServices)
//             setdata(res.allServices)
//         })
//         request(`${BASEURL}graphql/`, allServiceDetail, {}, {Authorization: `Bearer ${localStorage.getItem('Token')}`}).then((res: any) => {
//             console.log(res.serviceDetail)
//             let serviceArr: any = []
//             for (let k = 0; k < res.serviceDetail.edges.length; k++) {
//                 serviceArr.push(res.serviceDetail.edges[k]?.node)
//                 console.log("data arr", serviceArr);
//                 setAllDetail(serviceArr)
//             }
//             // setAllDetail(res.serviceDetail)
//         })
//     }

//     useEffect(() => {
//         fetchData();
//     }, [])

//     console.log("services--->", data);

//     const updatezuvaServiceToken = (e: any, serviceType: any) => {
//         setCheckZuvaServiceToken(e.target.value)
//         if (allDetail.find((item: any) => (item?.serviceApiKey?.toUpperCase() === e.target.value.toUpperCase()) && (item?.service?.serviceName.toUpperCase() === serviceType.toUpperCase())) !== undefined) {
//             setError1("Token already Available");
//         } else {
//             setZuvaServiceToken(e.target.value)
//             setError1("");
//         }
//     }

//     const updatezuvaServiceUrl = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const input_value = e.target.value.toLowerCase();
//         setCheckurl(input_value);

//         if (/^(https?:\/\/)?([a-zA-Z0-9.-]+(\.[a-zA-Z]{2,})+)(:\d+)?(\/api\/v2\/?)?$/.test(input_value)) {
//             setZuvaServiceUrl(input_value);
//             setError('');
//         } else {
//             setError('Not a valid URL');
//         }
//     }


//     // const updatezuvaServiceUrl = (e: any) => {
//     //     console.log("zuva url", e.target.value);
//     //     setZuvaServiceUrl(e.target.value)
//     // }

//     const updatenanonetServiceToken = (e: any, serviceType: any) => {
//         setCheckNanonetServiceToken(e.target.value)
//         if (allDetail.find((item: any) => (item.serviceApiKey.toUpperCase() === e.target.value.toUpperCase()) && (item.service.serviceName.toUpperCase() === serviceType.toUpperCase())) !== undefined) {
//             setError1("Token already Available");
//         } else {
//             setNanonetServiceToken(e.target.value)
//             setError1("");
//         }
//         console.log("nanonet Token", e.target.value);
//         // setNanonetServiceToken(e.target.value)
//     }

//     const updatenanonetServiceUrl = (e: any) => {
//         console.log("nanonet url", e.target.value);
//         setNanonetServiceUrl(e.target.value)
//     }
//     // const updateaccessKey = (e: any, serviceType: any) => {
//     //     setCheckAccessKey(e.target.value)
//     //     if (allDetail.find((item: any) => (item.accessKey.toUpperCase() === e.target.value.toUpperCase()) && (item.service.serviceName.toUpperCase() === serviceType.toUpperCase())) !== undefined) {
//     //         setError3("AccessKey already Available");
//     //     } else {
//     //         setAccessKey(e.target.value)
//     //         setError3("");
//     //     }
//     // }
//     const updateaccessKey = (e: any, serviceType: any) => {
//         console.log("Accesskey update", e.target.value);
//         setCheckAccessKey(e.target.value);

//         if (e.target.value && serviceType && allDetail) {
//             const foundItem = allDetail.find((item: any) => (
//                 item.accessKey && item.service.serviceName &&
//                 item.accessKey.toUpperCase() === e.target.value.toUpperCase() &&
//                 item.service.serviceName.toUpperCase() === serviceType.toUpperCase()
//             ));

//             if (foundItem) {
//                 setError3("AccessKey already Available");
//             } else {
//                 console.log("Accesskey update", e.target.value);
//                 setAccessKey(e.target.value);
//                 setError3("");
//             }
//         }
//     }
//     const updatesecretKey = (e: any, serviceType: any) => {
//         console.log("secretkey update", e.target.value);
//         setCheckSecretKey(e.target.value);

//         if (e.target.value && serviceType && allDetail) {
//             const foundItem = allDetail.find((item: any) => (
//                 item.secretKey && item.service.serviceName &&
//                 item.secretKey.toUpperCase() === e.target.value.toUpperCase() &&
//                 item.service.serviceName.toUpperCase() === serviceType.toUpperCase()
//             ));
//             console.log("secretkey foundItem", foundItem);
//             if (foundItem) {
//                 setError4("SecretKey already Available");
//             } else {
//                 console.log("secretkey update", e.target.value);
//                 setSecretKey(e.target.value);
//                 setError4("");
//             }
//         }
//     }
//     // const updatesecretKey = (e: any, serviceType: any) => {
//     //     setCheckSecretKey(e.target.value)
//     //     if (allDetail.find((item: any) => (item.secretKey.toUpperCase() === e.target.value.toUpperCase()) && (item.service.serviceName.toUpperCase() === serviceType.toUpperCase())) !== undefined) {
//     //         setError4("SecretKey already Available");
//     //     } else {
//     //         setSecretKey(e.target.value)
//     //         setError4("");
//     //     }
//     // }
//     const updateregionName = (e: any) => {
//         console.log("region name", e.target.value);
//         setRegionName(e.target.value)
//     }

//     const updateZuvaDescription = (e: any, serviceType: any) => {
//         setCheckZuvaDescription(e.target.value)
//         if (allDetail.find((item: any) => (item.description.toUpperCase() === e.target.value.toUpperCase()) && (item.service.serviceName.toUpperCase() === serviceType.toUpperCase())) !== undefined) {
//             setError2("Description already Available");
//         } else {
//             setZuvaDescription(e.target.value)
//             setError2("");
//         }
//     }

//     const updateNanonetDescription = (e: any, serviceType: any) => {
//         setCheckNanonetDescription(e.target.value)
//         if (allDetail.find((item: any) => (item.description.toUpperCase() === e.target.value.toUpperCase()) && (item.service.serviceName.toUpperCase() === serviceType.toUpperCase())) !== undefined) {
//             setError2("Description already Available");
//         } else {
//             setNanonetDescription(e.target.value)
//             setError2("");
//         }
//     }

//     const updateAWSDescription = (e: any, serviceType: any) => {
//         setCheckAWSDescription(e.target.value)
//         if (allDetail.find((item: any) => (item.description.toUpperCase() === e.target.value.toUpperCase()) && (item.service.serviceName.toUpperCase() === serviceType.toUpperCase())) !== undefined) {
//             setError2("Description already Available");
//         } else {
//             setAWSDescription(e.target.value)
//             setError2("");
//         }
//     }

//     const updateAIDescription = (e: any, serviceType: any) => {
//         setCheckAIDescription(e.target.value)
//         if (allDetail.find((item: any) => (item.description.toUpperCase() === e.target.value.toUpperCase()) && (item.service.serviceName.toUpperCase() === serviceType.toUpperCase())) !== undefined) {
//             setError2("Description already Available");
//         } else {
//             setAIDescription(e.target.value)
//             setError2("");
//         }
//     }
    
//     const handleItemChange = (value: any, id: number) => {
//         console.log("selected item onclick", value)

//         if (selectedItems.includes(value)) {
//             setSelectedItems(selectedItems.filter(item => item !== value));
//             setSelectedId(selectedId.filter(item => item !== id));
//         } else {
//             setSelectedItems([value]);
//             setSelectedId([id]);
//         }
//     };



//     const handleClose1 = () => {
//         setOpen1(false);
//     };

//     const handleCancel = () => {
//         nav("/configuration/site-settings");
//         setZuvaServiceUrl("")
//         setZuvaServiceToken("")
//         setZuvaDescription("")
//         setNanonetServiceUrl("")
//         setNanonetServiceToken("")
//         setNanonetDescription("")
//         setAccessKey("")
//         setSecretKey("")
//         setRegionName("")
//         setAWSDescription("")
//     };

//     console.log("switch selected items submit", selectedId, selectedId[0])

//     const HandleZuvaDetail = (id: any) => {
//         setDetailArr1(current => [...current,
//         {
//             id: id,
//             zuvaUrl: zuvaServiceUrl,
//             zuvaToken: zuvaServiceToken,
//             zuvaDescription: zuvaDescription,
//         }]);
//         setZuvaServiceUrl("")
//         setCheckZuvaServiceToken("")
//         setCheckZuvaDescription("")
//     }
//     const HandleNanonetDetail = (id: any) => {
//         setDetailArr1(current => [...current,
//         {
//             id: id,
//             nanonetUrl: nanonetServiceUrl,
//             nanonetToken: nanonetServiceToken,
//             nanonetDescription: nanonetDescription,
//         }]);
//         setNanonetServiceUrl("")
//         setCheckNanonetServiceToken("")
//         setCheckNanonetDescription("")
//     }
//     const HandleAWSDetail = (id: any) => {
//         setDetailArr1(current => [...current,
//         {
//             id: id,
//             accessKey: accessKey,
//             secretKey: secretKey,
//             regionName: regionName,
//             awsDescription: awsDescription
//         }]);
//         setCheckAccessKey("")
//         setCheckSecretKey("")
//         setRegionName("")
//         setCheckAWSDescription("")
//     }
//     const HandleAIDetail = (id: any) => {
//         setDetailArr1(current => [...current,
//         {
//             id: id,
//             aiDescription: aiDescription
//         }]);
//         setCheckAIDescription("")
//     }
//     console.log("service detail array", detailArr1);
//     const RemoveService = (description: any, serviceName: any) => {
//         console.log("Remove Service desc & name", description, serviceName);
//         console.log("Remove service detail array", detailArr1, detailArr1.length);
//         if (serviceName === "ZuvaDocAI") {
//             for (let i = 0; i < detailArr1.length; i++) {
//                 const index2 = detailArr1.findIndex((prod: any) => prod.zuvaDescription === description); //use id instead of index
//                 console.log("Remove Service index", index2);

//                 if (index2 > -1 && detailArr1.map((val: any) => val.zuvaDescription === description)) { //make sure you found it
//                     const updatedArray = [...detailArr1]; // Create a copy of the array
//                     updatedArray.splice(index2, 1); // Remove the item from the copied array
//                     setDetailArr1(updatedArray);
//                     console.log("Updated array--->", updatedArray);
//                 }
//             }
//         }
//         else if (serviceName === "Table Extraction AI") {
//             for (let i = 0; i < detailArr1.length; i++) {
//                 const index2 = detailArr1.findIndex((prod: any) => prod.nanonetDescription === description); //use id instead of index
//                 console.log("Remove Service index", index2);

//                 if (index2 > -1 && detailArr1.map((val: any) => val.nanonetDescription === description)) { //make sure you found it
//                     const updatedArray = [...detailArr1]; // Create a copy of the array
//                     updatedArray.splice(index2, 1); // Remove the item from the copied array
//                     setDetailArr1(updatedArray);
//                     console.log("Updated array--->", updatedArray);
//                 }
//             }
//         }
//         else {
//             for (let i = 0; i < detailArr1.length; i++) {
//                 const index2 = detailArr1.findIndex((prod: any) => prod.awsDescription === description); //use id instead of index
//                 console.log("Remove Service index", index2);

//                 if (index2 > -1 && detailArr1.map((val: any) => val.awsDescription === description)) { //make sure you found it
//                     const updatedArray = [...detailArr1]; // Create a copy of the array
//                     updatedArray.splice(index2, 1); // Remove the item from the copied array
//                     setDetailArr1(updatedArray);
//                     console.log("Updated array--->", updatedArray);
//                 }
//             }
//         }
//     }


//     const onSubmit = async (e: any) => {
//         e.preventDefault()
//         console.log("switch selected items submit", selectedId);
//         const len = selectedId.length
//         let service = []
//         if (len > 0) {
//             for (let j = 0; j < len; j++) {
//                 let serviceId = selectedId[j]
//                 service.push({ id: serviceId })
//                 console.log("service-->", service)
//             }
//         }
//         request(`${BASEURL}graphql/`, activeService, { ids: service }, {Authorization: `Bearer ${localStorage.getItem('Token')}`}).then((res: any) => {
//             console.log(res.activeService)
//         })
//         request(`${BASEURL}graphql/`, createServices, {
//             serviceDetail: detailArr1
//         }, {Authorization: `Bearer ${localStorage.getItem('Token')}`}).then((res: any) => {
//             console.log(res)
//             const val = Object.keys(res.serviceDetails.services).length
//             console.log("val", val)
//             setOpen1(true);
//             if (val > 0) {
//                 setMessage1(true)
//                 setMessage("Successfully saved")
//             } else {
//                 setMessage1(false)
//                 setMessage("Something Went Wrong")
//             }
//         })
//     }
//     function openServiceSiteInNewTab(serviceSiteUrl: string) {
//         if (serviceSiteUrl) {
//             window.open(serviceSiteUrl, '_blank');
//         }
//     }

//     const colorv = localStorage.getItem("themeColor")
//     const themec = colorv != null ? colorv + " " + 'btn' : 'p-3 bg-primary text-white btn'


//     return (
//         <>
//             {/* <Home /> */}
//             <div className='container my-container'>
//                 <div className="cproject">
//                     <form>
//                         <label className="required form-label fs-6 mb-2"><b>Choose the Extraction Service:</b></label>
//                         {data.map((val: any) => {
//                             return (
//                                 <>
//                                     <Form.Check
//                                         type="switch"
//                                         id={val.id}
//                                         label={val.serviceName}
//                                         checked={selectedItems.includes(val.serviceName)}
//                                         onChange={() => handleItemChange(val.serviceName, val.id)} /><br />
//                                     {val.serviceName == "ZuvaDocAI" && selectedItems.includes(val.serviceName) ? <div>
//                                         <div style={{ color: "black" }}>
//                                             <>
//                                                 {selectedItems.includes(val.serviceName) ? <ul><img
//                                                     src='/media/logos/ZuvaLogo.png'
//                                                     className='h-50px h-lg-25px'
//                                                     alt='ZuvaDocAI'
//                                                     style={{ cursor: 'pointer' }}
//                                                     onClick={() => openServiceSiteInNewTab("https://zuva.ai/")}
//                                                 />&nbsp;&nbsp;<b>Service Name :</b>&nbsp;{val.serviceName}</ul> : null}
//                                                 {detailArr1.map((value: any) => {
//                                                     return (
//                                                         <tr>
//                                                             <td>{value.zuvaUrl}</td>&nbsp;
//                                                             <td>{value.zuvaToken}</td>&nbsp;
//                                                             <td>{value.zuvaDescription}</td>&nbsp;
//                                                             <td><MdOutlineClose onClick={() => RemoveService(value.zuvaDescription, val.serviceName)} /></td>
//                                                         </tr>
//                                                     )
//                                                 })}
//                                             </>
//                                         </div>
//                                         <div style={{ marginLeft: '69rem' }}>
//                                             <button type="button" className={themec} onClick={() => HandleZuvaDetail(val.id)} disabled={zuvaDescription === "" || zuvaServiceUrl === "" || zuvaServiceToken === ""}>Add</button>&nbsp;&nbsp;
//                                         </div>
//                                         <label className="required form-label fs-6 mb-2"><b>Zuva SDK Url:</b></label>
//                                         <input
//                                             type="text"
//                                             className="form-control form-control mb-3 mb-lg-0"
//                                             placeholder='Enter Url'
//                                             onChange={updatezuvaServiceUrl}
//                                             // value={zuvaServiceUrl}
//                                             value={checkurl}
//                                             name="name"
//                                             required /><br />
//                                         <p className='red-text text-darken-1'>{error}</p>
//                                         <label className="required form-label fs-6 mb-2"><b>Zuva SDK Token:</b></label>
//                                         <input
//                                             type="text"
//                                             className="form-control form-control mb-3 mb-lg-0"
//                                             placeholder='Enter Token'
//                                             onChange={(e) => updatezuvaServiceToken(e, val.serviceName)}
//                                             value={checkZuvaServiceToken}
//                                             name="name"
//                                             required /><br />
//                                         <p className='red-text text-darken-1'>{error1}</p>
//                                         <label className="required form-label fs-6 mb-2"><b>Description:</b></label>
//                                         <input
//                                             type="text"
//                                             className="form-control form-control mb-3 mb-lg-0"
//                                             placeholder='Hint: Project Name/Project Description'
//                                             onChange={(e) => updateZuvaDescription(e, val.serviceName)}
//                                             value={checkZuvaDescription}
//                                             name="name"
//                                             required /><br />
//                                         <p className='red-text text-darken-1'>{error2}</p>
//                                     </div> : null}
//                                     {val.serviceName == "Table Extraction AI" && selectedItems.includes(val.serviceName) ? <div>
//                                         <div style={{ color: "black" }}>
//                                             <>
//                                                 {selectedItems.includes(val.serviceName) ? <ul><img
//                                                     // src='/media/logos/nanonet.png'
//                                                     className='h-50px h-lg-25px'
//                                                     alt='Table Extraction AI'
//                                                     style={{ cursor: 'pointer' }}
//                                                     onClick={() => openServiceSiteInNewTab("https://nanonets.com/")}
//                                                 />&nbsp;&nbsp;<b>Service Name :</b>&nbsp;{val.serviceName}</ul> : null}
//                                                 {detailArr1.map((value: any) => {
//                                                     return (
//                                                         <tr>
//                                                             <td>{value.nanonetUrl}</td>&nbsp;
//                                                             <td>{value.nanonetToken}</td>&nbsp;
//                                                             <td>{value.nanonetDescription}</td>&nbsp;
//                                                             <td><MdOutlineClose onClick={() => RemoveService(value.nanonetDescription, val.serviceName)} /></td>
//                                                         </tr>
//                                                     )
//                                                 })}
//                                             </>
//                                         </div>
//                                         <div style={{ marginLeft: '69rem' }}>
//                                             <button type="button" className={themec} onClick={() => HandleNanonetDetail(val.id)} disabled={nanonetDescription === ""}>Add</button>&nbsp;&nbsp;
//                                         </div>
//                                         {/* <label className="required form-label fs-6 mb-2"><b>Enter Nanonet Url:</b></label>
//                                         <input
//                                             type="text"
//                                             className="form-control form-control mb-3 mb-lg-0"
//                                             placeholder='Enter Url'
//                                             onChange={updatenanonetServiceUrl}
//                                             value={nanonetServiceUrl}
//                                             name="name"
//                                             required /><br /> */}
//                                         {/* <label className="required form-label fs-6 mb-2"><b>Enter Nanonet API Key:</b></label>
//                                         <input
//                                             type="text"
//                                             className="form-control form-control mb-3 mb-lg-0"
//                                             placeholder='Enter Token'
//                                             onChange={(e) => updatenanonetServiceToken(e, val.serviceName)}
//                                             value={checkNanonetServiceToken}
//                                             name="name"
//                                             required /><br /> */}
//                                         <p className='red-text text-darken-1'>{error1}</p>
//                                         <label className="required form-label fs-6 mb-2"><b>Description:</b></label>
//                                         <input
//                                             type="text"
//                                             className="form-control form-control mb-3 mb-lg-0"
//                                             placeholder='Hint: Project Name/Project Description'
//                                             onChange={(e) => updateNanonetDescription(e, val.serviceName)}
//                                             value={checkNanonetDescription}
//                                             name="name"
//                                             required /><br />
//                                         <p className='red-text text-darken-1'>{error2}</p>
//                                     </div> : null}
//                                     {val.serviceName == "AWS Textract" && selectedItems.includes(val.serviceName) ? <div>
//                                         <div style={{ color: "black" }}>
//                                             <>
//                                                 {selectedItems.includes(val.serviceName) ? <ul><img
//                                                     src='/media/logos/awslogo.png'
//                                                     className='h-50px h-lg-25px'
//                                                     alt='AWS Textract'
//                                                     style={{ cursor: 'pointer' }}
//                                                     onClick={() => openServiceSiteInNewTab("https://aws.amazon.com/textract/")}
//                                                 />&nbsp;&nbsp;<b>Service Name :</b>&nbsp;{val.serviceName}</ul> : null}
//                                                 {detailArr1.map((value: any) => {
//                                                     return (
//                                                         <tr>
//                                                             <td>{value.accessKey}</td>&nbsp;
//                                                             <td>{value.secretKey}</td>&nbsp;
//                                                             <td>{value.regionName}</td>&nbsp;
//                                                             <td>{value.awsDescription}</td>&nbsp;
//                                                             <td><MdOutlineClose onClick={() => RemoveService(value.awsDescription, val.serviceName)} /></td>
//                                                         </tr>
//                                                     )
//                                                 })}
//                                             </>
//                                         </div>
//                                         <div style={{ marginLeft: '69rem' }}>
//                                             <button type="button" className={themec} onClick={() => HandleAWSDetail(val.id)} disabled={awsDescription === "" || accessKey === "" || secretKey === "" || regionName === ""}>Add</button>&nbsp;&nbsp;
//                                         </div>
//                                         <label className="required form-label fs-6 mb-2"><b>AWS Access Key ID:</b></label>
//                                         <input
//                                             type="text"
//                                             className="form-control form-control mb-3 mb-lg-0"
//                                             placeholder='Enter Key Id'
//                                             onChange={(e) => updateaccessKey(e, val.serviceName)}
//                                             value={checkaccessKey}
//                                             name="name"
//                                             required /><br />
//                                         <p className='red-text text-darken-1'>{error3}</p>
//                                         <label className="required form-label fs-6 mb-2"><b>AWS Secret Access Key:</b></label>
//                                         <input
//                                             type="text"
//                                             className="form-control form-control mb-3 mb-lg-0"
//                                             placeholder='Enter Access Key'
//                                             onChange={(e) => updatesecretKey(e, val.serviceName)}
//                                             value={checksecretKey}
//                                             name="name"
//                                             required /><br />
//                                         <p className='red-text text-darken-1'>{error4}</p>
//                                         <label className="required form-label fs-6 mb-2"><b>Default region name:</b></label>
//                                         <input
//                                             type="text"
//                                             className="form-control form-control mb-3 mb-lg-0"
//                                             placeholder='Enter Region Name'
//                                             onChange={updateregionName}
//                                             value={regionName}
//                                             name="name"
//                                             required /><br />
//                                         <label className="required form-label fs-6 mb-2"><b>Description:</b></label>
//                                         <input
//                                             type="text"
//                                             className="form-control form-control mb-3 mb-lg-0"
//                                             placeholder='Hint: Project Name/Project Description'
//                                             onChange={(e) => updateAWSDescription(e, val.serviceName)}
//                                             value={checkawsDescription}
//                                             name="name"
//                                             required /><br />
//                                         <p className='red-text text-darken-1'>{error2}</p>
//                                     </div> : null}
//                                     {val.serviceName == "Aavanam AI" && selectedItems.includes(val.serviceName) ? <div>
//                                         <div style={{ color: "black" }}>
//                                             <>
//                                                 {selectedItems.includes(val.serviceName) ? <ul><b>Service Name :</b>&nbsp;{val.serviceName}</ul> : null}
//                                                 {detailArr1.map((value: any) => {
//                                                     return (
//                                                         <tr>
//                                                             <td>{value.aiDescription}</td>&nbsp;
//                                                             <td><MdOutlineClose onClick={() => RemoveService(value.aiDescription, val.serviceName)} /></td>
//                                                         </tr>
//                                                     )
//                                                 })}
//                                             </>
//                                         </div>
//                                         <div style={{ marginLeft: '69rem' }}>
//                                             <button type="button" className={themec} onClick={() => HandleAIDetail(val.id)} disabled={aiDescription === ""}>Add</button>&nbsp;&nbsp;
//                                         </div>
//                                         <label className="required form-label fs-6 mb-2"><b>Description:</b></label>
//                                         <input
//                                             type="text"
//                                             className="form-control form-control mb-3 mb-lg-0"
//                                             placeholder='Hint: Project Name/Project Description'
//                                             onChange={(e) => updateAIDescription(e, val.serviceName)}
//                                             value={checkaiDescription}
//                                             name="name"
//                                             required /><br />
//                                         <p className='red-text text-darken-1'>{error2}</p>
//                                     </div> : null}
//                                 </>
//                             )
//                         })}
//                         <button type="button" className="btn btn-secondary me-3" onClick={handleCancel}>Cancel</button>&nbsp;&nbsp;
//                         <button type="submit" className={themec} onClick={onSubmit} disabled={detailArr1.length == 0}>Save</button>
//                     </form>
//                     <Snackbar anchorOrigin={{
//                         vertical: "top",
//                         horizontal: "center",
//                     }} style={{ float: "right" }} open={open1} autoHideDuration={6000} onClose={handleClose1}>
//                         {message1 ?
//                             <Alert onClose={handleClose1} variant="filled" severity="success" sx={{ width: '100%' }}>
//                                 {message}!
//                             </Alert>
//                             : <Alert onClose={handleClose1} variant="filled" severity="error" sx={{ width: '100%' }}>
//                                 {message}!
//                             </Alert>
//                         }
//                     </Snackbar>
//                 </div><br /><br />
//             </div>
//         </>
//     )
// }


// export default Services

import React, { useEffect, useState } from 'react'
import { Form } from 'react-bootstrap';
import { request, gql } from 'graphql-request'
import { Alert, Snackbar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { MdOutlineClose } from 'react-icons/md';
import BASEURL from '../../../../config/baseurl';

const allServices = gql`
query{
    allServices{
      id
      serviceName
      active
    }
  }`

const allServiceDetail = gql`
query{
    serviceDetail{
        edges{
            node{
              id
              service{
                serviceName
              }
              serviceApiUrl
              serviceApiKey
              accessKey
              secretKey
              regionName
              description
            }
          }
    }
  }`

const activeService = gql`
query ActiveService($ids: [ServiceInput]!){
    activeService(ids: $ids){
      id
      serviceName
      active
    }
  }
`
const createServices = gql`
mutation ServiceDetails(
    $serviceDetail: [ServiceDetailInput]!
  ){
    serviceDetails(serviceDetail: $serviceDetail
      ){
      services{
        id
        service{
          serviceName
        }
        serviceApiUrl
        serviceApiKey
        accessKey
        secretKey
        regionName
      }
    }
  }`


const Services = () => {
    const nav = useNavigate();
    const [selectedItems, setSelectedItems] = useState<any[]>([]);
    const [open1, setOpen1] = useState(false);
    const [message, setMessage] = useState("")
    const [message1, setMessage1] = useState(false)
    const [selectedId, setSelectedId] = useState<any[]>([]);
    const [zuvaServiceUrl, setZuvaServiceUrl] = useState("")
    const [zuvaServiceToken, setZuvaServiceToken] = useState("")
    const [checkZuvaServiceToken, setCheckZuvaServiceToken] = useState("")
    const [nanonetServiceUrl, setNanonetServiceUrl] = useState("")
    const [checkNanonetServiceToken, setCheckNanonetServiceToken] = useState("")
    const [nanonetServiceToken, setNanonetServiceToken] = useState("")
    const [accessKey, setAccessKey] = useState("")
    const [secretKey, setSecretKey] = useState("")
    const [regionName, setRegionName] = useState("")
    const [checkaccessKey, setCheckAccessKey] = useState("")
    const [checksecretKey, setCheckSecretKey] = useState("")
    // const [checkregionName, setCheckRegionName] = useState("")
    const [zuvaDescription, setZuvaDescription] = useState("");
    const [checkZuvaDescription, setCheckZuvaDescription] = useState("");
    const [nanonetDescription, setNanonetDescription] = useState("");
    const [checkNanonetDescription, setCheckNanonetDescription] = useState("");
    const [awsDescription, setAWSDescription] = useState("");
    const [checkawsDescription, setCheckAWSDescription] = useState("");
    const [aiDescription, setAIDescription] = useState("");
    const [checkaiDescription, setCheckAIDescription] = useState("");
    const [data, setdata] = useState<any[]>([])
    const [allDetail, setAllDetail] = useState<any[]>([])
    const [detailArr1, setDetailArr1] = useState<any[]>([])
    const [error1, setError1] = useState("");
    const [error2, setError2] = useState("");
    const [error3, setError3] = useState("");
    const [error4, setError4] = useState("");
    const [error, setError] = useState("")
    const [checkurl, setCheckurl] = useState("");

    const fetchData = () => {
        request(`${BASEURL}graphql/`, allServices, {}, {Authorization: `Bearer ${localStorage.getItem('Token')}`}).then((res: any) => {
            console.log(res.allServices)
            setdata(res.allServices)
        })
        request(`${BASEURL}graphql/`, allServiceDetail, {}, {Authorization: `Bearer ${localStorage.getItem('Token')}`}).then((res: any) => {
            console.log(res.serviceDetail)
            let serviceArr: any = []
            for (let k = 0; k < res.serviceDetail.edges.length; k++) {
                serviceArr.push(res.serviceDetail.edges[k]?.node)
                console.log("data arr", serviceArr);
                setAllDetail(serviceArr)
            }
            // setAllDetail(res.serviceDetail)
        })
    }

    useEffect(() => {
        fetchData();
    }, [])

    console.log("services--->", data);

    const updatezuvaServiceToken = (e: any, serviceType: any) => {
        setCheckZuvaServiceToken(e.target.value)
        console.log("allDetails---", allDetail);
        console.log("token, serviceType", e.target.value, serviceType);
        
        if (allDetail.find((item: any) => (item?.serviceApiKey?.toUpperCase() === e.target.value.toUpperCase()) && (item.service.serviceName.toUpperCase() === serviceType.toUpperCase())) !== undefined) {
            setError1("Token already Available");
        } else {
            setZuvaServiceToken(e.target.value)
            setError1("");
        }
    }

    const updatezuvaServiceUrl = (e: React.ChangeEvent<HTMLInputElement>) => {
        const input_value = e.target.value.toLowerCase();
        setCheckurl(input_value);

        if (/^(https?:\/\/)?([a-zA-Z0-9.-]+(\.[a-zA-Z]{2,})+)(:\d+)?(\/api\/v2\/?)?$/.test(input_value)) {
            setZuvaServiceUrl(input_value);
            setError('');
        } else {
            setError('Not a valid URL');
        }
    }


    // const updatezuvaServiceUrl = (e: any) => {
    //     console.log("zuva url", e.target.value);
    //     setZuvaServiceUrl(e.target.value)
    // }

    const updatenanonetServiceToken = (e: any, serviceType: any) => {
        setCheckNanonetServiceToken(e.target.value)
        if (allDetail.find((item: any) => (item.serviceApiKey.toUpperCase() === e.target.value.toUpperCase()) && (item.service.serviceName.toUpperCase() === serviceType.toUpperCase())) !== undefined) {
            setError1("Token already Available");
        } else {
            setNanonetServiceToken(e.target.value)
            setError1("");
        }
        console.log("nanonet Token", e.target.value);
        // setNanonetServiceToken(e.target.value)
    }

    const updatenanonetServiceUrl = (e: any) => {
        console.log("nanonet url", e.target.value);
        setNanonetServiceUrl(e.target.value)
    }
    // const updateaccessKey = (e: any, serviceType: any) => {
    //     setCheckAccessKey(e.target.value)
    //     if (allDetail.find((item: any) => (item.accessKey.toUpperCase() === e.target.value.toUpperCase()) && (item.service.serviceName.toUpperCase() === serviceType.toUpperCase())) !== undefined) {
    //         setError3("AccessKey already Available");
    //     } else {
    //         setAccessKey(e.target.value)
    //         setError3("");
    //     }
    // }
    const updateaccessKey = (e: any, serviceType: any) => {
        console.log("Accesskey update", e.target.value);
        setCheckAccessKey(e.target.value);

        if (e.target.value && serviceType && allDetail) {
            const foundItem = allDetail.find((item: any) => (
                item.accessKey && item.service.serviceName &&
                item.accessKey.toUpperCase() === e.target.value.toUpperCase() &&
                item.service.serviceName.toUpperCase() === serviceType.toUpperCase()
            ));

            if (foundItem) {
                setError3("AccessKey already Available");
            } else {
                console.log("Accesskey update", e.target.value);
                setAccessKey(e.target.value);
                setError3("");
            }
        }
    }
    const updatesecretKey = (e: any, serviceType: any) => {
        console.log("secretkey update", e.target.value);
        setCheckSecretKey(e.target.value);

        if (e.target.value && serviceType && allDetail) {
            const foundItem = allDetail.find((item: any) => (
                item.secretKey && item.service.serviceName &&
                item.secretKey.toUpperCase() === e.target.value.toUpperCase() &&
                item.service.serviceName.toUpperCase() === serviceType.toUpperCase()
            ));
            console.log("secretkey foundItem", foundItem);
            if (foundItem) {
                setError4("SecretKey already Available");
            } else {
                console.log("secretkey update", e.target.value);
                setSecretKey(e.target.value);
                setError4("");
            }
        }
    }
    // const updatesecretKey = (e: any, serviceType: any) => {
    //     setCheckSecretKey(e.target.value)
    //     if (allDetail.find((item: any) => (item.secretKey.toUpperCase() === e.target.value.toUpperCase()) && (item.service.serviceName.toUpperCase() === serviceType.toUpperCase())) !== undefined) {
    //         setError4("SecretKey already Available");
    //     } else {
    //         setSecretKey(e.target.value)
    //         setError4("");
    //     }
    // }
    const updateregionName = (e: any) => {
        console.log("region name", e.target.value);
        setRegionName(e.target.value)
    }

    const updateZuvaDescription = (e: any, serviceType: any) => {
        setCheckZuvaDescription(e.target.value)
        if (allDetail.find((item: any) => (item.description.toUpperCase() === e.target.value.toUpperCase()) && (item.service.serviceName.toUpperCase() === serviceType.toUpperCase())) !== undefined) {
            setError2("Description already Available");
        } else {
            setZuvaDescription(e.target.value)
            setError2("");
        }
    }

    const updateNanonetDescription = (e: any, serviceType: any) => {
        setCheckNanonetDescription(e.target.value)
        if (allDetail.find((item: any) => (item.description.toUpperCase() === e.target.value.toUpperCase()) && (item.service.serviceName.toUpperCase() === serviceType.toUpperCase())) !== undefined) {
            setError2("Description already Available");
        } else {
            setNanonetDescription(e.target.value)
            setError2("");
        }
    }

    const updateAWSDescription = (e: any, serviceType: any) => {
        setCheckAWSDescription(e.target.value)
        if (allDetail.find((item: any) => (item.description.toUpperCase() === e.target.value.toUpperCase()) && (item.service.serviceName.toUpperCase() === serviceType.toUpperCase())) !== undefined) {
            setError2("Description already Available");
        } else {
            setAWSDescription(e.target.value)
            setError2("");
        }
    }

    const updateAIDescription = (e: any, serviceType: any) => {
        setCheckAIDescription(e.target.value)
        if (allDetail.find((item: any) => (item.description.toUpperCase() === e.target.value.toUpperCase()) && (item.service.serviceName.toUpperCase() === serviceType.toUpperCase())) !== undefined) {
            setError2("Description already Available");
        } else {
            setAIDescription(e.target.value)
            setError2("");
        }
    }
    
    const handleItemChange = (value: any, id: number) => {
        console.log("selected item onclick", value)

        if (selectedItems.includes(value)) {
            setSelectedItems(selectedItems.filter(item => item !== value));
            setSelectedId(selectedId.filter(item => item !== id));
        } else {
            setSelectedItems([value]);
            setSelectedId([id]);
        }
    };



    const handleClose1 = () => {
        setOpen1(false);
    };

    const handleCancel = () => {
        nav("/configuration/site-settings");
        setZuvaServiceUrl("")
        setZuvaServiceToken("")
        setZuvaDescription("")
        setNanonetServiceUrl("")
        setNanonetServiceToken("")
        setNanonetDescription("")
        setAccessKey("")
        setSecretKey("")
        setRegionName("")
        setAWSDescription("")
    };

    console.log("switch selected items submit", selectedId, selectedId[0], selectedItems)

    const HandleZuvaDetail = (id: any) => {
        setDetailArr1(current => [...current,
        {
            id: id,
            zuvaUrl: zuvaServiceUrl,
            zuvaToken: zuvaServiceToken,
            zuvaDescription: zuvaDescription,
        }]);
        setZuvaServiceUrl("")
        setCheckZuvaServiceToken("")
        setCheckZuvaDescription("")
    }
    const HandleNanonetDetail = (id: any) => {
        setDetailArr1(current => [...current,
        {
            id: id,
            nanonetUrl: nanonetServiceUrl,
            nanonetToken: nanonetServiceToken,
            nanonetDescription: nanonetDescription,
        }]);
        setNanonetServiceUrl("")
        setCheckNanonetServiceToken("")
        setCheckNanonetDescription("")
    }
    const HandleAWSDetail = (id: any) => {
        setDetailArr1(current => [...current,
        {
            id: id,
            accessKey: accessKey,
            secretKey: secretKey,
            regionName: regionName,
            awsDescription: awsDescription
        }]);
        setCheckAccessKey("")
        setCheckSecretKey("")
        setRegionName("")
        setCheckAWSDescription("")
    }
    const HandleAIDetail = (id: any) => {
        setDetailArr1(current => [...current,
        {
            id: id,
            aiDescription: aiDescription
        }]);
        setCheckAIDescription("")
    }
    console.log("service detail array", detailArr1);
    const RemoveService = (description: any, serviceName: any) => {
        console.log("Remove Service desc & name", description, serviceName);
        console.log("Remove service detail array", detailArr1, detailArr1.length);
        if (serviceName === "ZuvaDocAI") {
            for (let i = 0; i < detailArr1.length; i++) {
                const index2 = detailArr1.findIndex((prod: any) => prod.zuvaDescription === description); //use id instead of index
                console.log("Remove Service index", index2);

                if (index2 > -1 && detailArr1.map((val: any) => val.zuvaDescription === description)) { //make sure you found it
                    const updatedArray = [...detailArr1]; // Create a copy of the array
                    updatedArray.splice(index2, 1); // Remove the item from the copied array
                    setDetailArr1(updatedArray);
                    console.log("Updated array--->", updatedArray);
                }
            }
        }
        else if (normalize(serviceName) === normalize("Table Extraction AI")) {
            for (let i = 0; i < detailArr1.length; i++) {
                const index2 = detailArr1.findIndex((prod: any) => prod.nanonetDescription === description); //use id instead of index
                console.log("Remove Service index", index2);

                if (index2 > -1 && detailArr1.map((val: any) => val.nanonetDescription === description)) { //make sure you found it
                    const updatedArray = [...detailArr1]; // Create a copy of the array
                    updatedArray.splice(index2, 1); // Remove the item from the copied array
                    setDetailArr1(updatedArray);
                    console.log("Updated array--->", updatedArray);
                }
            }
        }
        else {
            for (let i = 0; i < detailArr1.length; i++) {
                const index2 = detailArr1.findIndex((prod: any) => prod.awsDescription === description); //use id instead of index
                console.log("Remove Service index", index2);

                if (index2 > -1 && detailArr1.map((val: any) => val.awsDescription === description)) { //make sure you found it
                    const updatedArray = [...detailArr1]; // Create a copy of the array
                    updatedArray.splice(index2, 1); // Remove the item from the copied array
                    setDetailArr1(updatedArray);
                    console.log("Updated array--->", updatedArray);
                }
            }
        }
    }


    const onSubmit = async (e: any) => {
        e.preventDefault()
        console.log("switch selected items submit", selectedId);
        const len = selectedId.length
        let service = []
        if (len > 0) {
            for (let j = 0; j < len; j++) {
                let serviceId = selectedId[j]
                service.push({ id: serviceId })
                console.log("service-->", service)
            }
        }
        request(`${BASEURL}graphql/`, activeService, { ids: service }, {Authorization: `Bearer ${localStorage.getItem('Token')}`}).then((res: any) => {
            console.log(res.activeService)
        })
        request(`${BASEURL}graphql/`, createServices, {
            serviceDetail: detailArr1
        }, {Authorization: `Bearer ${localStorage.getItem('Token')}`}).then((res: any) => {
            console.log(res)
            const val = Object.keys(res.serviceDetails.services).length
            console.log("val", val)
            setOpen1(true);
            if (val > 0) {
                setMessage1(true)
                setMessage("Successfully saved")
            } else {
                setMessage1(false)
                setMessage("Something Went Wrong")
            }
        })
    }
    function openServiceSiteInNewTab(serviceSiteUrl: string) {
        if (serviceSiteUrl) {
            window.open(serviceSiteUrl, '_blank');
        }
    }

    const normalize = (str: string) => str?.replace(/\s+/g, ' ').trim().toLowerCase();

    const colorv = localStorage.getItem("themeColor")
    const themec = colorv != null ? colorv + " " + 'btn' : 'p-3 bg-primary text-white btn'


    return (
        <>
            {/* <Home /> */}
            <div className='container my-container'>
                <div className="cproject">
                    <form>
                        <label className="required form-label fs-6 mb-2"><b>Choose the Extraction Service:</b></label>
                        {data.map((val: any) => {
                            return (
                                <>
                                    <Form.Check
                                        type="switch"
                                        id={val.id}
                                        label={val.serviceName}
                                        checked={selectedItems.includes(val.serviceName)}
                                        onChange={() => handleItemChange(val.serviceName, val.id)} /><br />
                                    {val.serviceName == "ZuvaDocAI" && selectedItems.includes(val.serviceName) ? <div>
                                        <div style={{ color: "black" }}>
                                            <>
                                                {selectedItems.includes(val.serviceName) ? <ul><img
                                                    src='/media/logos/ZuvaLogo.png'
                                                    className='h-50px h-lg-25px'
                                                    alt='ZuvaDocAI'
                                                    style={{ cursor: 'pointer' }}
                                                    onClick={() => openServiceSiteInNewTab("https://zuva.ai/")}
                                                />&nbsp;&nbsp;<b>Service Name :</b>&nbsp;{val.serviceName}</ul> : null}
                                                {detailArr1.map((value: any) => {
                                                    return (
                                                        <tr>
                                                            <td>{value.zuvaUrl}</td>&nbsp;
                                                            <td>{value.zuvaToken}</td>&nbsp;
                                                            <td>{value.zuvaDescription}</td>&nbsp;
                                                            <td><MdOutlineClose onClick={() => RemoveService(value.zuvaDescription, val.serviceName)} /></td>
                                                        </tr>
                                                    )
                                                })}
                                            </>
                                        </div>
                                        <div style={{ marginLeft: '69rem' }}>
                                            <button type="button" className={themec} onClick={() => HandleZuvaDetail(val.id)} disabled={zuvaDescription === "" || zuvaServiceUrl === "" || zuvaServiceToken === ""}>Add</button>&nbsp;&nbsp;
                                        </div>
                                        <label className="required form-label fs-6 mb-2"><b>Zuva SDK Url:</b></label>
                                        <input
                                            type="text"
                                            className="form-control form-control mb-3 mb-lg-0"
                                            placeholder='Enter Url'
                                            onChange={updatezuvaServiceUrl}
                                            // value={zuvaServiceUrl}
                                            value={checkurl}
                                            name="name"
                                            required /><br />
                                        <p className='red-text text-darken-1'>{error}</p>
                                        <label className="required form-label fs-6 mb-2"><b>Zuva SDK Token:</b></label>
                                        <input
                                            type="text"
                                            className="form-control form-control mb-3 mb-lg-0"
                                            placeholder='Enter Token'
                                            onChange={(e) => updatezuvaServiceToken(e, val.serviceName)}
                                            value={checkZuvaServiceToken}
                                            name="name"
                                            required /><br />
                                        <p className='red-text text-darken-1'>{error1}</p>
                                        <label className="required form-label fs-6 mb-2"><b>Description:</b></label>
                                        <input
                                            type="text"
                                            className="form-control form-control mb-3 mb-lg-0"
                                            placeholder='Hint: Project Name/Project Description'
                                            onChange={(e) => updateZuvaDescription(e, val.serviceName)}
                                            value={checkZuvaDescription}
                                            name="name"
                                            required /><br />
                                        <p className='red-text text-darken-1'>{error2}</p>
                                    </div> : null}
                                    {normalize(val.serviceName) === normalize("Table Extraction AI") &&
                                        selectedItems.some(item => normalize(item) === normalize(val.serviceName)) ? <div>
                                        <div style={{ color: "black" }}>
                                            <>
                                                {selectedItems.includes(val.serviceName) ? <ul><img
                                                    src='/media/logos/nanonet.png'
                                                    className='h-50px h-lg-25px'
                                                    alt='Nanonet'
                                                    style={{ cursor: 'pointer' }}
                                                    onClick={() => openServiceSiteInNewTab("https://nanonets.com/")}
                                                />&nbsp;&nbsp;<b>Service Name :</b>&nbsp;{val.serviceName}</ul> : null}
                                                {detailArr1.map((value: any) => {
                                                    return (
                                                        <tr>
                                                            <td>{value.nanonetUrl}</td>&nbsp;
                                                            <td>{value.nanonetToken}</td>&nbsp;
                                                            <td>{value.nanonetDescription}</td>&nbsp;
                                                            <td><MdOutlineClose onClick={() => RemoveService(value.nanonetDescription, val.serviceName)} /></td>
                                                        </tr>
                                                    )
                                                })}
                                            </>
                                        </div>
                                        <div style={{ marginLeft: '69rem' }}>
                                            <button type="button" className={themec} onClick={() => HandleNanonetDetail(val.id)} disabled={nanonetDescription === "" }>Add</button>&nbsp;&nbsp;
                                        </div>
                                        {/* <label className="required form-label fs-6 mb-2"><b>Enter Nanonet Url:</b></label>
                                        <input
                                            type="text"
                                            className="form-control form-control mb-3 mb-lg-0"
                                            placeholder='Enter Url'
                                            onChange={updatenanonetServiceUrl}
                                            value={nanonetServiceUrl}
                                            name="name"
                                            required /><br />
                                        <label className="required form-label fs-6 mb-2"><b>Enter Nanonet API Key:</b></label>
                                        <input
                                            type="text"
                                            className="form-control form-control mb-3 mb-lg-0"
                                            placeholder='Enter Token'
                                            onChange={(e) => updatenanonetServiceToken(e, val.serviceName)}
                                            value={checkNanonetServiceToken}
                                            name="name"
                                            required /><br />
                                        <p className='red-text text-darken-1'>{error1}</p> */}
                                        <label className="required form-label fs-6 mb-2"><b>Description:</b></label>
                                        <input
                                            type="text"
                                            className="form-control form-control mb-3 mb-lg-0"
                                            placeholder='Hint: Project Name/Project Description'
                                            onChange={(e) => updateNanonetDescription(e, val.serviceName)}
                                            value={checkNanonetDescription}
                                            name="name"
                                            required /><br />
                                        <p className='red-text text-darken-1'>{error2}</p>
                                    </div> : null}
                                    {val.serviceName == "AWS Textract" && selectedItems.includes(val.serviceName) ? <div>
                                        <div style={{ color: "black" }}>
                                            <>
                                                {selectedItems.includes(val.serviceName) ? <ul><img
                                                    src='/media/logos/awslogo.png'
                                                    className='h-50px h-lg-25px'
                                                    alt='AWS Textract'
                                                    style={{ cursor: 'pointer' }}
                                                    onClick={() => openServiceSiteInNewTab("https://aws.amazon.com/textract/")}
                                                />&nbsp;&nbsp;<b>Service Name :</b>&nbsp;{val.serviceName}</ul> : null}
                                                {detailArr1.map((value: any) => {
                                                    return (
                                                        <tr>
                                                            <td>{value.accessKey}</td>&nbsp;
                                                            <td>{value.secretKey}</td>&nbsp;
                                                            <td>{value.regionName}</td>&nbsp;
                                                            <td>{value.awsDescription}</td>&nbsp;
                                                            <td><MdOutlineClose onClick={() => RemoveService(value.awsDescription, val.serviceName)} /></td>
                                                        </tr>
                                                    )
                                                })}
                                            </>
                                        </div>
                                        <div style={{ marginLeft: '69rem' }}>
                                            <button type="button" className={themec} onClick={() => HandleAWSDetail(val.id)} disabled={awsDescription === "" || accessKey === "" || secretKey === "" || regionName === ""}>Add</button>&nbsp;&nbsp;
                                        </div>
                                        <label className="required form-label fs-6 mb-2"><b>AWS Access Key ID:</b></label>
                                        <input
                                            type="text"
                                            className="form-control form-control mb-3 mb-lg-0"
                                            placeholder='Enter Key Id'
                                            onChange={(e) => updateaccessKey(e, val.serviceName)}
                                            value={checkaccessKey}
                                            name="name"
                                            required /><br />
                                        <p className='red-text text-darken-1'>{error3}</p>
                                        <label className="required form-label fs-6 mb-2"><b>AWS Secret Access Key:</b></label>
                                        <input
                                            type="text"
                                            className="form-control form-control mb-3 mb-lg-0"
                                            placeholder='Enter Access Key'
                                            onChange={(e) => updatesecretKey(e, val.serviceName)}
                                            value={checksecretKey}
                                            name="name"
                                            required /><br />
                                        <p className='red-text text-darken-1'>{error4}</p>
                                        <label className="required form-label fs-6 mb-2"><b>Default region name:</b></label>
                                        <input
                                            type="text"
                                            className="form-control form-control mb-3 mb-lg-0"
                                            placeholder='Enter Region Name'
                                            onChange={updateregionName}
                                            value={regionName}
                                            name="name"
                                            required /><br />
                                        <label className="required form-label fs-6 mb-2"><b>Description:</b></label>
                                        <input
                                            type="text"
                                            className="form-control form-control mb-3 mb-lg-0"
                                            placeholder='Hint: Project Name/Project Description'
                                            onChange={(e) => updateAWSDescription(e, val.serviceName)}
                                            value={checkawsDescription}
                                            name="name"
                                            required /><br />
                                        <p className='red-text text-darken-1'>{error2}</p>
                                    </div> : null}
                                    {val.serviceName == "Aavanam AI" && selectedItems.includes(val.serviceName) ? <div>
                                        <div style={{ color: "black" }}>
                                            <>
                                                {selectedItems.includes(val.serviceName) ? <ul><b>Service Name :</b>&nbsp;{val.serviceName}</ul> : null}
                                                {detailArr1.map((value: any) => {
                                                    return (
                                                        <tr>
                                                            <td>{value.aiDescription}</td>&nbsp;
                                                            <td><MdOutlineClose onClick={() => RemoveService(value.aiDescription, val.serviceName)} /></td>
                                                        </tr>
                                                    )
                                                })}
                                            </>
                                        </div>
                                        <div style={{ marginLeft: '69rem' }}>
                                            <button type="button" className={themec} onClick={() => HandleAIDetail(val.id)} disabled={aiDescription === ""}>Add</button>&nbsp;&nbsp;
                                        </div>
                                        <label className="required form-label fs-6 mb-2"><b>Description:</b></label>
                                        <input
                                            type="text"
                                            className="form-control form-control mb-3 mb-lg-0"
                                            placeholder='Hint: Project Name/Project Description'
                                            onChange={(e) => updateAIDescription(e, val.serviceName)}
                                            value={checkaiDescription}
                                            name="name"
                                            required /><br />
                                        <p className='red-text text-darken-1'>{error2}</p>
                                    </div> : null}
                                </>
                            )
                        })}
                        <button type="button" className="btn btn-secondary me-3" onClick={handleCancel}>Cancel</button>&nbsp;&nbsp;
                        <button type="submit" className={themec} onClick={onSubmit} disabled={detailArr1.length == 0}>Save</button>
                    </form>
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
                </div><br /><br />
            </div>
        </>
    )
}


export default Services
