import React, { FC, useEffect, useState } from 'react'
import * as Yup from 'yup'
import { Field, useFormik } from 'formik'
import { isNotEmpty, toAbsoluteUrl } from '../../../../../../../_metronic/helpers'
import { initialUser, User } from '../core/_models'
import clsx from 'clsx'
import { useListView } from '../core/ListViewProvider1'
import { UsersListLoading } from '../components/loading/UsersListLoading'
import { createUser, updateUser } from '../core/_requests'
import { useQueryResponse } from '../core/QueryResponseProvider1'
import { request, gql } from 'graphql-request'
import Select from 'react-select';
import BASEURL from '../../../../../../config/baseurl'

type Props = {
  isUserLoading: boolean
  user: User
}

const editUserSchema = Yup.object().shape({
  // email: Yup.string()
  //   .email('Wrong email format')
  //   .min(3, 'Minimum 3 symbols')
  //   .max(50, 'Maximum 50 symbols')
  //   .required('Email is required'),
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
    classificationFile {
      id
      jsonFile
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
    catalogJson
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
  $active:Boolean!
  $assignUser: [UserInput]!
  $classificationFileId: Int!
  $defaultContractTypeId: Int!
) {
  createProjects(
    input: {
      projectName: $projectName
      description: $description
      active:$active
      assignUser: $assignUser
      classificationFileId: $classificationFileId
      defaultContractTypeId: $defaultContractTypeId
    }
  ) {
    projects {
      projectName
      id
      description
      active
      classificationFile {
        id
        jsonFile
      }
    }
  }
}
`

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
  const [selectedOption, setSelectedOption] = useState<any[]>([]);
  const [selectedOption1, setSelectedOption1] = useState<any>({});
  const [selectedOption2, setSelectedOption2] = useState<any[]>([]);
  const [assignUsers, setAssignUsers] = useState<any[]>([])
  const [description, setDescription] = useState("");
  const { setItemIdForUpdate } = useListView()
  const { refetch } = useQueryResponse()
  const Position = "Reviewer"
  const variables = {
    position: Position,
  }
  useEffect(() => {
    request(`${BASEURL}graphql/`, allProject, {}, {Authorization: `Bearer ${localStorage.getItem('Token')}`}).then((res: any) => setdata(res.allProjects))
    request(`${BASEURL}graphql/`, reviewUser, variables, {Authorization: `Bearer ${localStorage.getItem('Token')}`}).then((user: any) => setUsers(user.reviewUser.edges))
    request(`${BASEURL}graphql/`, activeCatalog, { isactive: true }, {Authorization: `Bearer ${localStorage.getItem('Token')}`}).then((file: any) => setFile(file.activeCatalogs))
  }, [])

  console.log("AllProjects in add form", data)
  let option: any[] = [];
  const lenn = users.length
  for (let i = 0; i < lenn; i++) {
    const fn = users[i]?.node?.firstName
    const ln = users[i]?.node?.lastName
    const fn1 = users[i]?.node?.firstName
    const ln1 = users[i]?.node?.lastName
    const email = users[i]?.node?.email
    const val = fn + ln;
    const val1 = fn1 + ' ' + ln1;
    // console.log("Val", val)
    option.push({ value: val, label: val1, email: email });
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

  console.log("default Contract Type array -->", option2)

  const updateProjectsName = (e: any) => {
    setCheckProjectsName(e.target.value.toUpperCase().replace(/[^\w\s]/gi, ""));
    if (data.find((item: any) => item.projectName === e.target.value.toUpperCase()) !== undefined) {
      setError("Project Name already Available");
    } else {
      setProjectsName(e.target.value.toUpperCase().replace(/[^\w\s]/gi, ""));
      setError("");
    }
  }

  console.log("New Project Name", projectsName)
  console.log("project avaiable", error)

  const handleActiveStatus = () => {
    setIsChecked(!isChecked);
  }
  console.log("Active status->", isChecked);

  const handleChange = (selectedOption: any) => {
    // console.log(`Option selected:`, selectedOption);
    // console.log(`Option selected1:`, assignUsers, assignUsers.length);
    setSelectedOption(selectedOption);
  };

  const handleChange1 = (selectedOption: any) => {
    console.log(`Option selected:`, selectedOption);
    setCatalogId(selectedOption.id)
    // console.log(`Option selected1:`, assignUsers, assignUsers.length);
    setSelectedOption1(selectedOption);
  };

  console.log("catalogId---->", catalogId);

  const handleChange2 = (selectedOption: any) => {
    console.log("Default contract type selectedOption", selectedOption)
    console.log("Default contract type selectedOption value", selectedOption.value)
    // setDocType(selectedOption.value)
    setDcontractId(selectedOption.id)
    setSelectedOption2(selectedOption);
  };

  console.log("DcontractType--->", dcontractId)


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

  // const blankImg = toAbsoluteUrl('/media/svg/avatars/blank.svg')
  // const userAvatarImg = toAbsoluteUrl(`/media/${userForEdit.avatar}`)

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



  const onSubmit = async (e: any) => {
    e.preventDefault()
    // console.log("classificaTION select option1", selectedOption1)
    // console.log("classificaTION select", selectedOption1.id)
    let len = selectedOption.length
    for (var i = 0; i < len; i++) {
      let Email = selectedOption[i].email
      console.log("Selected Email", Email)
      assignUsers.push({ userEmail: Email })
      console.log(`Option selected1:`, assignUsers, assignUsers.length);
      setAssignUsers(assignUsers)
    }

    console.log(`Option selected2:`, assignUsers);
    const variables = {
      projectName: projectsName,
      description: description,
      active: isChecked,
      classificationFileId: catalogId,
      defaultContractTypeId: dcontractId,
      assignUser: assignUsers
    }

    request(`${BASEURL}graphql/`, createProject, variables, {Authorization: `Bearer ${localStorage.getItem('Token')}`}).then((response: any) => console.log(response))
    setAssignUsers([])
  }

  return (
    <>
      <form id='kt_modal_add_user_form' className='form' onSubmit={onSubmit} noValidate>
        {/* begin::Scroll */}
        <div
          className='d-flex flex-column scroll-y me-n7 pe-7'
          id='kt_modal_add_user_scroll'
          data-kt-scroll='true'
          data-kt-scroll-activate='{default: false, lg: true}'
          data-kt-scroll-max-height='auto'
          data-kt-scroll-dependencies='#kt_modal_add_user_header'
          data-kt-scroll-wrappers='#kt_modal_add_user_scroll'
          data-kt-scroll-offset='300px'
        >
          {/* begin::Input group */}
          <div className='fv-row mb-7'>
            {/* begin::Label */}
            {/* <label className='d-block fw-bold fs-6 mb-5'>Avatar</label> */}
            {/* end::Label */}

            {/* begin::Hint */}
            {/* <div className='form-text'>Allowed file types: png, jpg, jpeg.</div> */}
            {/* end::Hint */}
          </div>
          {/* end::Input group */}

          {/* begin::Input group */}
          <div className='fv-row mb-7'>
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
                'form-control form-control-solid mb-3 mb-lg-0',
                { 'is-invalid': formik.touched.name && formik.errors.name },
                {
                  'is-valid': formik.touched.name && !formik.errors.name,
                }
              )}
              autoComplete='off'
              disabled={formik.isSubmitting || isUserLoading}
            />
            <div className='fv-plugins-message-container'>
              <div className='fv-help-block'>
                <span role='alert'>{error}</span>
              </div>
            </div>
            {/* {formik.touched.name && formik.errors.name && (
              <div className='fv-plugins-message-container'>
                <div className='fv-help-block'>
                  <span role='alert'>{formik.errors.name}</span><br/>
                  <span role='alert'>{error}</span>
                </div>
              </div>
            )} */}
            {/* end::Input */}
          </div>
          {/* end::Input group */}

          {/* begin::Input group */}
          <div className='fv-row mb-7'>
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
                'form-control form-control-solid mb-3 mb-lg-0',
                { 'is-invalid': formik.touched.description && formik.errors.description },
                {
                  'is-valid': formik.touched.description && !formik.errors.description,
                }
              )}
              autoComplete='off'
              disabled={formik.isSubmitting || isUserLoading}
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
          <div className='fv-row mb-7'>
            {/* begin::Label */}
            <label className='required fw-bold fs-6 mb-2'>
              <input {...formik.getFieldProps('active')} type="checkbox" onChange={handleActiveStatus} />&nbsp;&nbsp;
              <span>Active</span>
            </label>
            {/* end::Label */}
          </div>
          {/* end::Input group */}
          {/* begin::Input group */}
          <div className='fv-row mb-7'>
            {/* begin::Label */}
            <label className='fw-bold fs-6 mb-2'>Assign Users</label>
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
          <div className='fv-row mb-7'>
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
            />
            {/* end::Input */}
          </div>
          {/* end::Input group */}

          {/* begin::Input group */}
          <div className='fv-row mb-7'>
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
            />
            {/* end::Input */}
          </div>
          {/* end::Input group */}

        </div>
        {/* end::Scroll */}

        {/* begin::Actions */}
        <div className='text-center pt-15'>
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
            className='btn btn-primary'
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
      {(formik.isSubmitting || isUserLoading) && <UsersListLoading />}
    </>
  )
}

export { UserEditModalForm }
