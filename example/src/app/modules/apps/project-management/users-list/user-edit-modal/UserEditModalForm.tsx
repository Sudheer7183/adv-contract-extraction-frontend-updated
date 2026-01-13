import React, { FC, useEffect, useState } from 'react'
import * as Yup from 'yup'
import { Field, useFormik } from 'formik'
import { isNotEmpty, toAbsoluteUrl } from '../../../../../../_metronic/helpers'
import { initialUser, User } from '../core/_models'
import clsx from 'clsx'
import { useListView } from '../core/ListViewProvider'
import { UsersListLoading } from '../components/loading/UsersListLoading'
import { createUser, updateUser } from '../core/_requests'
import { useQueryResponse } from '../core/QueryResponseProvider'
import { request, gql } from 'graphql-request'
import Select from 'react-select';
import { Alert, Snackbar } from '@mui/material';
import BASEURL from '../../../../../config/baseurl'

type Props = {
  isUserLoading: boolean
  user: User
}

const editUserSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, 'Minimum 3 numbers')
    .max(15, 'Must be 15 characters or less')
})

const allProject = gql`
query {
  allProjects {
    id
    projectName
    active
    projectId
    description
    totalFiles
    ocr
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

const createProject = gql`
mutation CreateProject(
  $projectName: String!
  $description: String!
  $dateFormat: String!
  $active:Boolean!
  $ocr:Boolean!
  $assignUser: [UserInput]!
  $classificationFileId: Int!
  $defaultContractTypeId: Int!
  $serviceId: String!
  $repositoryActive:Boolean!
) {
  createProjects(
    input: {
      projectName: $projectName
      description: $description
      dateFormat: $dateFormat
      active:$active
      ocr:$ocr
      assignUser: $assignUser
      classificationFileId: $classificationFileId
      defaultContractTypeId: $defaultContractTypeId
      serviceId: $serviceId
      repositoryActive:$repositoryActive
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
const activeServices = gql`
query Services($active: Boolean!){
  services(status: $active){
    id
    serviceName
    active
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

const UserEditModalForm: FC<Props> = ({ user, isUserLoading }) => {
  const [data, setdata] = useState([])
  const [projectsName, setProjectsName] = useState("");
  const [error, setError] = useState("");
  const [users, setUsers] = useState<any>({});
  const [file, setFile] = useState<any>({});
  const [catalogId, setCatalogId] = useState(0);
  const [dcontractId, setDcontractId] = useState(0);
  const [checkProjectsName, setCheckProjectsName] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const [isOCRChecked, setIsOCRChecked] = useState(false);
  const [isEnabledRepo,setisEnabledRepo] = useState(false);
  const [selectedOption, setSelectedOption] = useState<any[]>([]);
  const [selectedOption1, setSelectedOption1] = useState<any>({});
  const [selectedOption2, setSelectedOption2] = useState<any[]>([]);
  const [selectedOption3, setSelectedOption3] = useState<any[]>([]);
  const [selectedOption4, setSelectedOption4] = useState<any[]>([]);
  const [selectedFormat, setSelectedFormat] = useState<any>(null);
  const [assignUsers, setAssignUsers] = useState<any[]>([])
  const [description, setDescription] = useState("");
  const [serviceId, setServiceId] = useState("");
  const [services, setservices] = useState<any[]>([])
  const [option4, setOption4] = useState<any[]>([])
  const [message, setMessage] = useState("")
  const [message1, setMessage1] = useState(false)
  const [open1, setOpen1] = useState(false);
  const { setItemIdForUpdate, setUpdate } = useListView()
  const { refetch } = useQueryResponse()
  const Position = "Reviewer"
  const variables = {
    position: Position,
  }
  useEffect(() => {
    request(`${BASEURL}graphql/`, allProject, {}, {Authorization: `Bearer ${localStorage.getItem('Token')}`}).then((res: any) => setdata(res.allProjects))
    request(`${BASEURL}graphql/`, reviewUser, variables, {Authorization: `Bearer ${localStorage.getItem('Token')}`}).then((user: any) => setUsers(user.reviewUser.edges))
    request(`${BASEURL}graphql/`, activeCatalog, { isactive: true }, {Authorization: `Bearer ${localStorage.getItem('Token')}`}).then((file: any) => setFile(file.activeCatalogs))
    request(`${BASEURL}graphql/`, activeServices, { active: true }, {Authorization: `Bearer ${localStorage.getItem('Token')}`}).then((res: any) => {
      console.log(res.services)
      setservices(res.services)
    })
  }, [])

  const dateFormats = [
    { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
    { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
    { value: 'YYYY/MM/DD', label: 'YYYY/MM/DD' },
    { value: 'Month DD, YYYY', label: 'Month DD, YYYY' },
    { value: 'DD Month, YYYY', label: 'DD Month, YYYY' },
    { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' },
    { value: 'MM-DD-YYYY', label: 'MM-DD-YYYY' },
  ];

  console.log("AllProjects in add form", data)
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

  let option1: any[] = [];
  for (let j = 0; j < file?.length; j++) {
    const cf = file[j]?.catalogName
    const cf1 = file[j]?.catalogName
    const id = file[j]?.id
    option1.push({ value: cf, label: cf1, id: id });
  }

  let option2: any[] = [];


  for (let l = 0; l < file.length; l++) {
    if (file[l].id == catalogId) {
      let length = file[l].catalogdetail.length
      for (let j = 0; j < length; j++) {
        const ct = file[l].catalogdetail[j].userContractTypeMaster.contractTypeName
        const ct1 = file[l].catalogdetail[j].userContractTypeMaster.contractTypeName
        const dctId = file[l].catalogdetail[j].userContractTypeMaster.id
        option2.push({ value: ct, label: ct1, id: dctId });
      }
    }
  }

  let option3: any[] = [];
  for (let s = 0; s < services.length; s++) {
    let service_name = services[s].serviceName
    let service_id = services[s].id
    option3.push({ value: service_name, label: service_name, id: service_id });
  }

  const updateProjectsName = (e: any) => {
    setCheckProjectsName(e.target.value.toUpperCase().replace(/[^\w\s]/gi, ""));
    if (data.find((item: any) => item.projectName === e.target.value.toUpperCase()) !== undefined) {
      setError("Project Name already Available");
    } else {
      setProjectsName(e.target.value.toUpperCase().replace(/[^\w\s]/gi, ""));
      setError("");
    }
  }

  const handleActiveStatus = () => {
    setIsChecked(!isChecked);
  }

  const handleEnabledRepository = () => {
    console.log('i am repository i got enabled.');
    
    setisEnabledRepo(!isEnabledRepo);
  }

  const handleOCRConvert = () => {
    setIsOCRChecked(!isOCRChecked);
  }

  const handleChange = (selectedOption: any) => {
    setSelectedOption(selectedOption);
  };

  const handleChange1 = (selectedOption: any) => {
    setCatalogId(selectedOption.id)
    console.log('selected catalog id',selectedOption.id);
    
    setSelectedOption1(selectedOption);
  };

  const handleChange2 = (selectedOption: any) => {
    setDcontractId(selectedOption.id)
    setSelectedOption2(selectedOption);
  };

  const handleChange3 = (selectedOption: any) => {
    request(`${BASEURL}graphql/`, getServiceToken, { id: selectedOption.id }, {Authorization: `Bearer ${localStorage.getItem('Token')}`}).then((service: any) => {
      const newOptions = service.getServiceToken.map((serviceToken: any) => ({
        value: serviceToken.description,
        label: serviceToken.description,
        id: serviceToken.id,
      }));
      setOption4(newOptions);
    })
    setSelectedOption3(selectedOption);
  };

  const handleDateChange = (selectedOption: any) => {
    setSelectedFormat(selectedOption);
  };

  const handleChange4 = (selectedOption: any) => {
    setServiceId(selectedOption.id)
    setSelectedOption4(selectedOption);
  };

  const updateDescription = (e: any) => {
    setDescription(e.target.value)
  }

  const [userForEdit] = useState<User>({
    ...user,
    avatar: user.avatar || initialUser.avatar,
    role: user.role || initialUser.role,
    position: user.position || initialUser.position,
    name: user.name || initialUser.name,
    email: user.email || initialUser.email,
    description: user.description || initialUser.description,
    active: user.active || initialUser.active,
  })

  const cancel = (withRefresh?: boolean) => {
    if (withRefresh) {
      refetch()
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


  const onSubmit = async (e: any) => {
    e.preventDefault()
    let len = selectedOption.length
    for (var i = 0; i < len; i++) {
      let Id = selectedOption[i].id
      console.log("Selected Email", Id)
      assignUsers.push({ userId: Id })
      console.log(`Option selected1:`, assignUsers, assignUsers.length);
      setAssignUsers(assignUsers)
    }

    console.log(`Option selected2:`, assignUsers);
    const variables = {
      projectName: projectsName,
      description: description,
      dateFormat: selectedFormat.value,
      active: isChecked,
      ocr: isOCRChecked,
      classificationFileId: catalogId,
      defaultContractTypeId: dcontractId,
      assignUser: assignUsers,
      serviceId: serviceId,
      repositoryActive:isEnabledRepo
    }

    request(`${BASEURL}graphql/`, createProject, variables, {Authorization: `Bearer ${localStorage.getItem('Token')}`}).then((response: any) => {
      console.log("createdProject", response)
      const val = Object.keys(response?.createProjects?.projects).length
      console.log(" create project val", val)
      setOpen1(true);
      if (val > 0) {
        setMessage1(true)
        setMessage("Successfully Created")

        setTimeout(() => {
          setItemIdForUpdate(undefined)
          setUpdate(true)
        }, 500);
      } else {
        setMessage1(false)
        setMessage("Something Went Wrong")
      }
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
              onChange={updateProjectsName}
              value={checkProjectsName}
              className={clsx(
                'form-control form-control-solid mb-3 mb-lg-0'
              )}
              autoComplete='off'
              required
              disabled={formik.isSubmitting || isUserLoading}
              style={{
                border: '1px solid #6c757d',
                borderRadius: '5px',
              }}
            />
            <div className='fv-plugins-message-container'>
              <div className='fv-help-block'>
                <span role='alert'>{error}</span>
              </div>
            </div>
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
              value={description}
              name='description'
              className={clsx(
                'form-control form-control-solid mb-3 mb-lg-0'
              )}
              autoComplete='off'
              disabled={formik.isSubmitting || isUserLoading}
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
            <label className='required fw-bold fs-6 mb-2'>
              <input {...formik.getFieldProps('active')} type="checkbox" onChange={handleActiveStatus} required />&nbsp;&nbsp;
              <span>Active</span>
            </label>
            {/* end::Label */}
          </div>
                    <div className='fv-row mb-3'>
            {/* begin::Label */}
            <label className='required fw-bold fs-6 mb-2'>
              <input {...formik.getFieldProps('active')} type="checkbox" onChange={handleEnabledRepository} required />&nbsp;&nbsp;
              <span>Enable Repository</span>
            </label>
            {/* end::Label */}
          </div>
          {/* end::Input group */}
          {/* begin::Input group */}
          <div className='fv-row mb-3'>
            {/* begin::Label */}
            <label className='fw-bold fs-6 mb-2'>
              <input {...formik.getFieldProps('active')} type="checkbox" onChange={handleOCRConvert} />&nbsp;&nbsp;
              <span>Enable OCR</span>
            </label>
            {/* end::Label */}
          </div>
          {/* end::Input group */}
          {/* begin::Input group */}
          <div className='fv-row mb-3'>
            {/* begin::Label */}
            <label className='required fw-bold fs-6 mb-2'>Date Format</label>
            {/* end::Label */}

            {/* begin::Input */}
            <Select
              className="dropdown"
              value={selectedFormat}
              onChange={handleDateChange}
              options={dateFormats}
              required
            />
            {/* end::Input */}
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
          {/* begin::Input group */}
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
              options={option3}
              required
            />
            {/* end::Input */}
          </div>
          {/* end::Input group */}

          {/* begin::Input group */}
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
              options={option4}
              required
            />
            {/* end::Input */}
          </div>
          {/* end::Input group */}
        </div>
        {/* end::Scroll */}

        {/* begin::Actions */}
        <div className='text-center pt-7'>
          <button
            type='reset'
            onClick={() => cancel()}
            className='btn btn-secondary me-3'
            data-kt-users-modal-action='cancel'
            disabled={formik.isSubmitting || isUserLoading}
          >
            Discard
          </button>

          <button
            type='submit'
            className={themec}
            data-kt-users-modal-action='submit'
            disabled={isUserLoading || formik.isSubmitting || !formik.isValid || !formik.touched}
          >
            <span className='indicator-label'>Submit</span>
            {/* {(formik.isSubmitting || isUserLoading) && (
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
      {(formik.isSubmitting || isUserLoading) && <UsersListLoading />}
    </>
  )
}

export { UserEditModalForm }
