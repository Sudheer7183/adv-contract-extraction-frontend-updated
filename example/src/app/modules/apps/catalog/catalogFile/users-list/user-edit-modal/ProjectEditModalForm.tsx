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
  // isUserLoading: boolean
  // user: User
  id: number
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

const getProject = gql`
query GetProject($id: String!){
  getProject(id: $id){
    id
    projectName
    description
    active
    classificationFile {
      id
      jsonFile
    }
    catalogFile{
      id
      catalogName
    }
    defaultContractType{
      id
      catalogdetail{
        userContractTypeMaster{
          contractTypeName
        }
      }
    }
  }
}
`
const projectUser = gql`
query ProjectWithUser($name: String!) {
  projectWithUser(search: $name) {
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

const UPDATE_PROJECT_WITH_USER = gql`
  mutation UpdateProject(
    $projectName: String!
    $description: String!
    $active:Boolean!
    $assignUser: [UserInput]!
    $classificationFileId: Int!
    $defaultContractTypeId: Int!
  ) {
    updateProject(
      input: {
        projectName: $projectName
        description: $description
        assignUser: $assignUser
        active:$active
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

const ProjectEditModalForm: FC<Props> = ({ id }) => {

  console.log("edit project name props-->", id)
  const [data, setdata] = useState<any>({})
  const [users, setUsers] = useState<any>({});
  const [proUsers, setProUsers] = useState<any>({});
  const [cname, setCname] = useState("");
  const [cid, setCid] = useState(0)
  const [file, setFile] = useState<any>({});
  // const [selectedOption, setSelectedOption] = useState<any[]>([]);
  const [assignUsers, setAssignUsers] = useState<any[]>([])
  const { setItemIdForUpdate } = useListView()
  const { refetch } = useQueryResponse()
  const Position = "Reviewer"
  const variables = {
    position: Position,
  }
  const variabless = {
    id: id,
  }

  useEffect(() => {
    request(`${BASEURL}graphql/`, getProject, variabless, {Authorization: `Bearer ${localStorage.getItem('Token')}`}).then((res: any) => console.log("description->", res.getProject.description))
    request(`${BASEURL}graphql/`, reviewUser, variables, {Authorization: `Bearer ${localStorage.getItem('Token')}`}).then((user: any) => setUsers(user.reviewUser.edges))
    request(`${BASEURL}graphql/`, activeCatalog, { isactive: true }, {Authorization: `Bearer ${localStorage.getItem('Token')}`}).then((file: any) => setFile(file.activeCatalogs))
  }, [])

  console.log("AllProjects in add form", data)
  const pname = data?.projectName
  const description = data?.description
  const active = data?.active
  console.log("project desc, active--->", description, active)
  const catalog = data?.catalogFile
  const [proName, setProName] = useState(pname)
  const [desc, setDesc] = useState(description)
  const [isChecked, setIsChecked] = useState(active);
  const [catalogArr, setCatalogArr] = useState<any[]>(catalog)

  useEffect(() => {
    setDesc(description)
    setIsChecked(active)
    setProName(pname)
    setCatalogArr(catalog)
    const variablesss = {
      name: pname,
    }
    console.log("Variable----->", variablesss)
    request(`${BASEURL}graphql/`, projectUser, variablesss, {Authorization: `Bearer ${localStorage.getItem('Token')}`}).then((res: any) => setProUsers(res.projectWithUser.edges[0].node.users))
  }, [description, active, pname, catalog]
  )
  console.log("catalog file--->", catalogArr)

  let option2: any[] = [];

  for (let i = 0; i < proUsers.length; i++) {
    const fn = proUsers[i].firstName
    const ln = proUsers[i].lastName
    const fn1 = proUsers[i].firstName
    const ln1 = proUsers[i].lastName
    const val = fn + ln;
    const val1 = fn1 + ' ' + ln1;
    option2.push({ value: val, label: val1 });
  }

  const [selectedOption, setSelectedOption] = useState<any[]>(option2);
  const [selectedOption1, setSelectedOption1] = useState<any>({});

  console.log("select option1111---->", selectedOption1);


  useEffect(() => {
    setSelectedOption(option2)
  }, [option2]
  )

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

  const handleActiveStatus = () => {
    setIsChecked(!isChecked);
  }
  console.log("Active status->", isChecked);

  const handleChange = (selectedOption: any) => {
    setSelectedOption(selectedOption);
  };

  const handleChange1 = (selectedOption: any) => {
    setSelectedOption1(selectedOption);
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

  const onSubmit = async (e: any) => {
    e.preventDefault()
    console.log("classificaTION select option1", selectedOption1)
    console.log("classificaTION select", selectedOption1.id)
    let len = selectedOption.length
    for (var i = 0; i < len; i++) {
      let Email = selectedOption[i].email
      console.log("Selected Email", Email)
      assignUsers.push({ userEmail: Email })
      console.log(`Option selected1:`, assignUsers, assignUsers.length);
      setAssignUsers(assignUsers)
    }

    console.log(`Option selected2:`, assignUsers);
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
              value={pname}
              className={clsx(
                'form-control form-control-solid mb-3 mb-lg-0',
                { 'is-invalid': formik.touched.name && formik.errors.name },
                {
                  'is-valid': formik.touched.name && !formik.errors.name,
                }
              )}
              autoComplete='off'
              disabled
            />
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
              value={desc}
              name='description'
              className={clsx(
                'form-control form-control-solid mb-3 mb-lg-0',
                { 'is-invalid': formik.touched.description && formik.errors.description },
                {
                  'is-valid': formik.touched.description && !formik.errors.description,
                }
              )}
              autoComplete='off'
              disabled={formik.isSubmitting}
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
              <input {...formik.getFieldProps('active')} type="checkbox" onChange={handleActiveStatus} checked={isChecked} />&nbsp;&nbsp;
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
            {/* <Select
              className="dropdown"
              value={selectedOption2}
              isSearchable={true}
              onChange={handleChange2}
              options={option2}
            /> */}
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
            disabled={formik.isSubmitting}
          >
            Discard
          </button>

          <button
            type='submit'
            className='btn btn-primary'
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
      {(formik.isSubmitting) && <UsersListLoading />}
    </>
  )
}

export { ProjectEditModalForm }
