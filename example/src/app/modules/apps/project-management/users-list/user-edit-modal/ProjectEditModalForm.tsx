import React, { FC, useEffect, useState } from 'react'
import * as Yup from 'yup'
import { useFormik } from 'formik'
import { isNotEmpty } from '../../../../../../_metronic/helpers'
import { initialUser, User } from '../core/_models'
import clsx from 'clsx'
import { useListView } from '../core/ListViewProvider'
import { UsersListLoading } from '../components/loading/UsersListLoading'
import { createUser, updateUser } from '../core/_requests'
import { request, gql } from 'graphql-request'
import Select from 'react-select';
import { Alert, Snackbar } from '@mui/material';
import BASEURL from '../../../../../config/baseurl'

type Props = {
  id: number
}

const editUserSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, 'Minimum 3 numbers')
    .max(15, 'Must be 15 characters or less')
})

const getProject = gql`
query GetProject($id: String!){
  getProject(id: $id){
    id  
    projectName
    description
    dateFormat
    active
    ocr
    catalogFile{
      id
      catalogName
    }
    defaultContractType{
      id
      catalogdetail{
        userContractTypeMaster{
          id
          contractTypeName
        }
      }
    }
    service{
      id
      service{
        id
        serviceName
      }
      description
      serviceApiUrl
      serviceApiKey
    }

  }
}
`
const projectUser = gql`
query ProjectWithUser($id: String!) {
  projectWithUser(search: $id) {
    edges {
      node {
        id
        projectId
        projectName
        description
        users {
          id
          email
          isActive
          username
          firstName
          lastName
        }
      }
    }
  }
}
`
const reviewUser = gql`
query ReviewUser($position: String!) {
  reviewUser(position: $position) {
    edges {
      node {
        id
        username
        firstName
        lastName
        email
        role
      }
    }
  }
}`
const activeCatalog = gql`
query ActiveCatalogs($isactive: Boolean!){
  activeCatalogs(isactive: $isactive){
    id
    catalogName
    active
    catalogdetail{
      id
      userContractTypeMaster{
        id
        contractTypeName
        usercontracttypedetail{
          edges{
            node{
              fieldId
              fieldName
            }
          }
        }
      }
    }
  }
}`
const getServiceToken = gql`
query GetServiceToken($id: Int!){
  getServiceToken(id: $id){
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
}`


const activeServices = gql`
query Services($active: Boolean!){
  services(status: $active){
    id
    serviceName
    active
  }
}`


const updateProject = gql`
  mutation UpdateProject(
    $projectName: String!
    $description: String!
    $active:Boolean!
    $ocr:Boolean!
    $assignUser: [UserInput]!
    $classificationFileId: Int!
    $defaultContractTypeId: Int!
    $serviceId: String!

  ) {
    updateProject(
      input: {
        projectName: $projectName
        description: $description
        assignUser: $assignUser
        active:$active
        ocr:$ocr
        classificationFileId: $classificationFileId
        defaultContractTypeId: $defaultContractTypeId
        serviceId: $serviceId
      }
    ) {
      projects {
        projectName
        id
        description
        active
        ocr
      }
    }
  }
`

const ProjectEditModalForm: FC<Props> = ({ id }) => {
  console.log("edit project name props-->", id)
  const [message, setMessage] = useState("")
  const [message1, setMessage1] = useState(false)
  const [open1, setOpen1] = useState(false)
  const [data, setdata] = useState<any>({})
  const [users, setUsers] = useState<any>({});
  const [proUsers, setProUsers] = useState<any>({});
  const [file, setFile] = useState<any>({});
  const [assignUsers, setAssignUsers] = useState<any[]>([])
  const { setItemIdForUpdate, setUpdate } = useListView()
  const [services, setservices] = useState<any[]>([])
  const [option9, setOption9] = useState<any[]>([])


  const serviceId = data?.service?.service?.id
  const Position = "Reviewer"
  const variables = {
    position: Position,
  }

  useEffect(() => {
    request(`${BASEURL}graphql/`, getProject, { id: id }, {Authorization: `Bearer ${localStorage.getItem('Token')}`}).then((res: any) => setdata(res.getProject))
    request(`${BASEURL}graphql/`, reviewUser, variables, {Authorization: `Bearer ${localStorage.getItem('Token')}`}).then((user: any) => setUsers(user.reviewUser.edges))
    request(`${BASEURL}graphql/`, activeCatalog, { isactive: true }, {Authorization: `Bearer ${localStorage.getItem('Token')}`}).then((file: any) => setFile(file.activeCatalogs))
    request(`${BASEURL}graphql/`, projectUser, { id: id }, {Authorization: `Bearer ${localStorage.getItem('Token')}`}).then((res: any) => setProUsers(res.projectWithUser.edges[0].node.users))
    request(`${BASEURL}graphql/`, activeServices, { active: true }, {Authorization: `Bearer ${localStorage.getItem('Token')}`}).then((res: any) => {
      console.log(res.services)
      setservices(res.services)
    })
    request(`${BASEURL}graphql/`, getServiceToken, { id: serviceId }, {Authorization: `Bearer ${localStorage.getItem('Token')}`}).then((service: any) => {
      console.log("token in useEffect", service);
      for (let s = 0; s < service.getServiceToken.length; s++) {
        let s_name = service.getServiceToken[s].description
        let s_id = service.getServiceToken[s].id
        option9.push({ value: s_name, label: s_name, id: s_id });
      }
      console.log("option 4 in edit form", option9);
    })
  }, [id, serviceId])

  console.log("AllProjects in add form", data)
  const pname = data?.projectName
  const description = data?.description
  const active = data?.active
  const ocr = data?.ocr
  const catalog = data?.catalogFile
  const cId = data?.catalogFile?.id
  const defaultType = data?.defaultContractType?.catalogdetail[0]?.userContractTypeMaster?.contractTypeName
  const defaultId = data?.defaultContractType?.catalogdetail[0]?.userContractTypeMaster?.id
  const serviceDesc = data?.service?.description
  const sId = data?.service?.id
  const service = data?.service?.service

  const [proName, setProName] = useState(pname)
  const [desc, setDesc] = useState(description)
  const [isChecked, setIsChecked] = useState(active);
  const [isOCRChecked, setIsOCRChecked] = useState(ocr);
  const [catalogId, setCatalogId] = useState(cId);
  const [dcontractId, setDcontractId] = useState(0);
  const [catalogArr, setCatalogArr] = useState<any[]>(catalog)
  const [servicenameArr, setServiceNameArr] = useState<any[]>(service)
  const [servicenameId, setServiceNameId] = useState(serviceId)
  const [servicedescription, setServiceDescription] = useState(serviceDesc)


  useEffect(() => {
    setDesc(description)
    setIsChecked(active)
    setIsOCRChecked(ocr)
    setProName(pname)
    setCatalogId(cId)
    setCatalogArr(catalog)
    setServiceNameArr(service)
    setServiceNameId(serviceId)
    setServiceDescription(serviceDesc)
    setDcontractId(defaultId)
    setServiceNId(sId)
  }, [description, active, ocr, pname, catalog, cId, service, serviceId, serviceDesc, defaultId]
  )
  console.log("catalog file--->", catalogArr)
  console.log("Assigned ProUsers --->", proUsers)


  const [selectedOption, setSelectedOption] = useState<any[]>([]);
  const [selectedOption1, setSelectedOption1] = useState<any>({});
  const [selectedOption2, setSelectedOption2] = useState<any>({});
  const [selectedOption3, setSelectedOption3] = useState<any[]>([]);
  const [selectedOption4, setSelectedOption4] = useState<any[]>([]);
  const [servicenid, setServiceNId] = useState("");


  console.log("select option1111---->", selectedOption1);


  useEffect(() => {
    let option4: any = catalogArr != undefined ? { value: catalogArr.catalogName, label: catalogArr.catalogName, id: catalogArr.id } : {}

    let option5: any = defaultType != undefined ? { value: defaultType, label: defaultType, id: defaultId } : {}

    let option3: any[] = [];
    let existingIds: Set<string> = new Set();
    for (let i = 0; i < proUsers.length; i++) {
      const user = proUsers[i];
      if (user && user.firstName && user.lastName && user.id) {
        // Check if the id is already present in the set
        if (!existingIds.has(user.id)) {
          const val = user.firstName + user.lastName;
          const val1 = user.firstName + ' ' + user.lastName;

          option3.push({ value: val, label: val1, id: user.id });

          // Add the id to the set to mark it as existing
          existingIds.add(user.id);
        }
      }

      // if (user && user.firstName && user.lastName && user.id) {
      //   const val = user.firstName + user.lastName;
      //   const val1 = user.firstName + ' ' + user.lastName;
      //   option3.push({ value: val, label: val1, id: user.id });
      // }
    }

    // for (let i = 0; i < proUsers.length; i++) {
    //   const fn = proUsers[i].firstName
    //   const ln = proUsers[i].lastName
    //   const fn1 = proUsers[i].firstName
    //   const ln1 = proUsers[i].lastName
    //   const id = proUsers[i].id
    //   const val = fn + ln;
    //   const val1 = fn1 + ' ' + ln1;
    //   option3.push({ value: val, label: val1, id: id });
    // }
    let option7: any = servicenameArr != undefined ? { value: servicenameArr.serviceName, label: servicenameArr.serviceName, id: servicenameArr.id } : {}
    let option8: any = serviceDesc != undefined ? { value: serviceDesc, label: serviceDesc, id: sId } : {}

    setSelectedOption(option3)
    setSelectedOption1(option4)
    setSelectedOption2(option5)
    setSelectedOption3(option7)
    setSelectedOption4(option8)
  }, [catalogArr, proUsers, defaultId, defaultType]
  )

  let option: any[] = [];
  const lenn = users.length
  for (let i = 0; i < lenn; i++) {
    const fn = users[i]?.node?.firstName
    const ln = users[i]?.node?.lastName
    const fn1 = users[i]?.node?.firstName
    const ln1 = users[i]?.node?.lastName
    const id = users[i]?.node?.id
    const val = fn + ln;
    const val1 = fn1 + ' ' + ln1;
    // console.log("Val", val)
    option.push({ value: val, label: val1, id: id });
  }
  console.log("Assign User Array", option)
  console.log("classification file", file)
  let option1: any[] = [];
  for (let j = 0; j < file.length; j++) {
    const cf = file[j]?.catalogName
    const cf1 = file[j]?.catalogName
    const id = file[j]?.id
    option1.push({ value: cf, label: cf1, id: id });
  }
  console.log("classification Array", option1)

  let option2: any[] = [];

  for (let l = 0; l < file.length; l++) {
    if (file[l].id == catalogId) {
      console.log("default Contract Type array", file[l].catalogdetail)
      let length = file[l].catalogdetail.length
      for (let j = 0; j < length; j++) {
        const ct = file[l].catalogdetail[j].userContractTypeMaster.contractTypeName
        const ct1 = file[l].catalogdetail[j].userContractTypeMaster.contractTypeName
        const dctId = file[l].catalogdetail[j].userContractTypeMaster.id
        option2.push({ value: ct, label: ct1, id: dctId });
      }
      console.log("contract type Array", option2)
    }
  }

  const handleActiveStatus = () => {
    setIsChecked(!isChecked);
  }
  console.log("Active status->", isChecked);

  const handleOCRConvert = () => {
    setIsOCRChecked(!isOCRChecked);
  }

  const handleChange = (selectedOption: any) => {
    setSelectedOption(selectedOption);
  };

  const handleChange1 = (selectedOption: any) => {
    setCatalogId(selectedOption.id)
    setSelectedOption1(selectedOption);
  };

  const handleChange2 = (selectedOption: any) => {
    setDcontractId(selectedOption.id)
    setSelectedOption2(selectedOption);
  };

  const updateDescription = (e: any) => {
    setDesc(e.target.value)
  }

  const [userForEdit] = useState<User>({
    avatar: initialUser.avatar,
    role: initialUser.role,
    position: initialUser.position,
    name: initialUser.name,
    email: initialUser.email,
    description: initialUser.description,
    active: initialUser.active,
  })

  const cancel = (withRefresh?: boolean) => {
    if (withRefresh) {
      // refetch()
    }
    setItemIdForUpdate(undefined)
  }


  const formik = useFormik({
    initialValues: userForEdit,
    validationSchema: editUserSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true)
      console.log("submitted values", values)
      try {
        if (isNotEmpty(values.id)) {
          await updateUser(values)
        } else {
          await createUser(values)
        }
      } catch (ex) {
        console.error(ex)
      } finally {
        setSubmitting(true)
        cancel(true)
      }
    },
  })

  const handleClose1 = () => {
    setOpen1(false);
  };
  let option6: any[] = [];
  for (let s = 0; s < services.length; s++) {
    let service_name = services[s].serviceName
    let service_id = services[s].id
    option6.push({ value: service_name, label: service_name, id: service_id });
  }

  const handleChange3 = (selectedOption: any) => {
    console.log("Extraction Service selectedOption", selectedOption)
    console.log("Extraction Service selectedOption value", selectedOption.value)
    setOption9([])
    request(`${BASEURL}graphql/`, getServiceToken, { id: selectedOption.id }, {Authorization: `Bearer ${localStorage.getItem('Token')}`}).then((service: any) => {
      const newOptions = service.getServiceToken.map((serviceToken: any) => ({
        value: serviceToken.description,
        label: serviceToken.description,
        id: serviceToken.id,
      }));
      setOption9(newOptions);
      console.log("option 4 in edit formmmmm", newOptions);
    })
    setSelectedOption3(selectedOption);
  };


  const handleChange4 = (selectedOption: any) => {
    console.log("Extraction Service desc selectedOption", selectedOption)
    console.log("Extraction Service desc selectedOption value", selectedOption.value)
    setServiceNId(selectedOption.id)
    setSelectedOption4(selectedOption);
  };



  const onSubmit = async (e: any) => {
    e.preventDefault()
    console.log("classificaTION select option1", selectedOption1)
    console.log("classificaTION select", selectedOption1.id)
    let len = selectedOption.length
    for (let i = 0; i < len; i++) {
      let Id = selectedOption[i].id
      console.log("Selected Email", Id)
      assignUsers.push({ userId: Id })
      console.log(`Option selected1:`, assignUsers, assignUsers.length);
      setAssignUsers(assignUsers)
    }

    console.log(`Option selected2:`, assignUsers);
    const variables = {
      projectName: proName,
      description: desc,
      active: isChecked,
      ocr: isOCRChecked,
      classificationFileId: catalogId,
      defaultContractTypeId: dcontractId,
      assignUser: assignUsers,
      serviceId: servicenid
    }

    request(`${BASEURL}graphql/`, updateProject, variables, {Authorization: `Bearer ${localStorage.getItem('Token')}`}).then((response: any) => {
      console.log(response)
      const val = Object.keys(response?.updateProject.projects).length
      console.log("val", val)
      setOpen1(true);
      if (val > 0) {
        setMessage1(true)
        setMessage("Successfully Updated")
        setUpdate(true)
      } else {
        setMessage1(false)
        setMessage("Something Went Wrong")
      }
      setTimeout(() => {
        setItemIdForUpdate(undefined)
      }, 1000);
    })
    setAssignUsers([])
  }
  const colorv = localStorage.getItem("themeColor")
  const themec = colorv != null ? colorv + " " + 'btn' : 'p-3 bg-primary text-white btn'

  return (
    <>
      <form id='kt_modal_add_user_form' className='form' onSubmit={onSubmit}>
        {/* begin::Scroll */}
        <div
          className='d-flex flex-column me-n7 pe-7'
          id='kt_modal_add_user_scroll'
          data-kt-scroll='true'
          data-kt-scroll-activate='{default: false, lg: true}'
          data-kt-scroll-max-height='auto'
          data-kt-scroll-dependencies='#kt_modal_add_user_header'
          data-kt-scroll-wrappers='#kt_modal_add_user_scroll'
          data-kt-scroll-offset='300px'
        >

          {/* begin::Input group */}
          <div className='fv-row mb-3'>
            {/* begin::Label */}
            <label className='required fw-bold fs-6 mb-2'>Project Name</label>
            {/* end::Label */}

            {/* begin::Input */}
            <input
              placeholder='Project name'
              {...formik.getFieldProps('name')}
              type='text'
              name='name'
              value={pname}
              className={clsx(
                'form-control form-control-solid mb-3 mb-lg-0'
              )}
              autoComplete='off'
              disabled
              style={{
                border: '1px solid #6c757d',
                borderRadius: '5px',
              }}
            />
            {/* end::Input */}
          </div>
          {/* end::Input group */}

          {/* begin::Input group */}
          <div className='fv-row mb-3'>
            {/* begin::Label */}
            <label className='fw-bold fs-6 mb-2'>Description</label>
            {/* end::Label */}

            {/* begin::Input */}
            <input
              placeholder='description'
              {...formik.getFieldProps('description')}
              type='text'
              onChange={updateDescription}
              value={desc}
              name='description'
              className={clsx(
                'form-control form-control-solid mb-3 mb-lg-0'
              )}
              autoComplete='off'
              disabled={formik.isSubmitting}
              style={{
                border: '1px solid #6c757d',
                borderRadius: '5px',
              }}
            />
            {formik.touched.description && formik.errors.description && (
              <div className='fv-plugins-message-container'>
                <div className='fv-help-block'>
                  <span role='alert'>{formik.errors.description}</span>
                </div>
              </div>
            )}
            {/* end::Input */}
          </div>
          {/* end::Input group */}

          {/* begin::Input group */}
          <div className='fv-row mb-3'>
            {/* begin::Label */}
            <label className='fw-bold fs-6 mb-2'>
              <input {...formik.getFieldProps('active')} type="checkbox" onChange={handleActiveStatus} checked={isChecked} />&nbsp;&nbsp;
              <span>Active</span>
            </label>
            {/* end::Label */}
          </div>
          {/* end::Input group */}
          {/* begin::Input group */}
          <div className='fv-row mb-3'>
            {/* begin::Label */}
            <label className='fw-bold fs-6 mb-2'>
              <input {...formik.getFieldProps('active')} type="checkbox" onChange={handleOCRConvert} checked={isOCRChecked} />&nbsp;&nbsp;
              <span>Enable OCR</span>
            </label>
            {/* end::Label */}
          </div>
          {/* end::Input group */}

          {/* begin::Input group */}
          <div className='fv-row mb-3'>
            {/* begin::Label */}
            <label className='fw-bold fs-6 mb-2'>Assign Reviewer Users</label>
            {/* end::Label */}

            {/* begin::Input */}
            <Select
              className="dropdown"
              isMulti={true}
              value={selectedOption}
              isSearchable={true}
              onChange={handleChange}
              options={option}
            />
            {/* end::Input */}
          </div>
          {/* end::Input group */}

          {/* begin::Input group */}
          <div className='fv-row mb-3'>
            {/* begin::Label */}
            <label className='required fw-bold fs-6 mb-2'>Choose Catalog File</label>
            {/* end::Label */}

            {/* begin::Input */}
            <Select
              className="dropdown"
              value={selectedOption1}
              isSearchable={true}
              onChange={handleChange1}
              options={option1}
              required
            />
            {/* end::Input */}
          </div>
          {/* end::Input group */}

          {/* begin::Input group */}
          <div className='fv-row mb-3'>
            {/* begin::Label */}
            <label className='required fw-bold fs-6 mb-2'>Choose Default Contract Type</label>
            {/* end::Label */}

            {/* begin::Input */}
            <Select
              className="dropdown"
              value={selectedOption2}
              isSearchable={true}
              onChange={handleChange2}
              options={option2}
              required
            />
            {/* end::Input */}
          </div>
          {/* end::Input group */}
          <div className='fv-row mb-3'>
            {/* begin::Label */}
            <label className='required fw-bold fs-6 mb-2'>Choose Extraction Service</label>
            {/* end::Label */}


            {/* begin::Input */}
            <Select
              className="dropdown"
              value={selectedOption3}
              isSearchable={true}
              onChange={handleChange3}
              options={option6}
              required
            />
            {/* end::Input */}
          </div>
          <div className='fv-row mb-3'>
            {/* begin::Label */}
            <label className='required fw-bold fs-6 mb-2'>Choose Extraction Service Desc</label>
            {/* end::Label */}


            {/* begin::Input */}
            <Select
              className="dropdown"
              value={selectedOption4}
              isSearchable={true}
              onChange={handleChange4}
              options={option9}
              required
            />
            {/* end::Input */}
          </div>
        </div>
        {/* end::Scroll */}

        {/* begin::Actions */}
        <div className='text-center pt-7'>
          <button
            type='reset'
            onClick={() => cancel()}
            className='btn btn-secondary me-3'
            data-kt-users-modal-action='cancel'
            disabled={formik.isSubmitting}
          >
            Discard
          </button>

          <button
            type='submit'
            className={themec}
            data-kt-users-modal-action='submit'
            disabled={formik.isSubmitting || !formik.isValid || !formik.touched}
          >
            <span className='indicator-label'>Submit</span>
            {/* {(formik.isSubmitting) && (
              <span className='indicator-progress'>
                Please wait...{' '}
                <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
              </span>
            )} */}
          </button>
        </div>
        {/* end::Actions */}
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
      {(formik.isSubmitting) && <UsersListLoading />}

    </>
  )
}

export { ProjectEditModalForm }
