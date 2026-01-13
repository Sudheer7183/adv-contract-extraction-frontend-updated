import React, { FC, useEffect, useState } from 'react'
import * as Yup from 'yup'
import { useFormik } from 'formik'
import { isNotEmpty, toAbsoluteUrl } from '../../../../../../_metronic/helpers'
import { initialUser, User } from '../core/_models'
import clsx from 'clsx'
import { useListView } from '../core/ListViewProvider'
import { UsersListLoading } from '../components/loading/UsersListLoading'
import { createUser, updateUser } from '../core/_requests'
import { useQueryResponse } from '../core/QueryResponseProvider'
import Select from 'react-select';
import { request, gql } from 'graphql-request'
import { Alert, Snackbar } from '@mui/material';
import BASEURL from '../../../../../config/baseurl'

type Props = {
  isUserLoading: boolean
  user: User
}


const activeProject = gql`
query ActiveProject($isactive: Boolean!) {
  activeProject(isactive: $isactive) {
    edges {
      node {
        id
        projectId
        projectName
        active
      }
    }
  }
}
`
const allUsers = gql`
query {
  users {
    edges{
      node{
        username
        firstName
        email
        lastName
        isActive
        role
      }
    }
  }
}`


const createUsers = gql`
mutation CreateUser(
  $email: String!
  $username: String!
  $firstname: String!
  $lastname: String!
  $role: String!
  $active: Boolean!
  $assignProject: [ProjectsInput]!
) {
  createUser(
    input: {
      email: $email
      username: $username
      firstname: $firstname
      lastname: $lastname
      role: $role
      active: $active
      assignProject: $assignProject
    }
  ) {
    users {
      id
      username
      firstName
      lastName
      role
      isActive
    }
  }
}
`

const UserEditModalForm: FC<Props> = ({ user, isUserLoading }) => {
  const { setItemIdForUpdate, setUpdate } = useListView()
  const [data, setdata] = useState([])
  const { refetch } = useQueryResponse()
  const [email, setEmail] = useState("")
  const [checkEmail, setCheckEmail] = useState("")
  const [error, setError] = useState("")
  const [username, setUsername] = useState("")
  const [firstname, setFirstname] = useState("")
  const [lastname, setLastname] = useState("")
  // const [password, setPassword] = useState("")
  const [isChecked, setIsChecked] = useState(true);
  const [projects, setProjects] = useState<any>({});
  const [role, setRole] = useState("Admin")
  const [message, setMessage] = useState("")
  const [message1, setMessage1] = useState(false)
  const [open1, setOpen1] = useState(false);
  const [assignProjects, setAssignProjects] = useState<any[]>([])
  const [selectedOption, setSelectedOption] = useState<any[]>([]);
  const Active = true
  const variables = {
    isactive: Active,
  }
  useEffect(() => {
    request(`${BASEURL}graphql/`, allUsers, {}, {Authorization: `Bearer ${localStorage.getItem('Token')}`}).then((res: any) => {
      let userArr: any = []
      if (res.users.edges.length > 0) {
        for (let k = 0; k < res.users.edges.length; k++) {
          userArr.push(res.users.edges[k]?.node)
          console.log("data arr", userArr);
          setdata(userArr)
        }
      }
      // setdata(res.users)
    })
    request(`${BASEURL}graphql/`, activeProject, variables, {Authorization: `Bearer ${localStorage.getItem('Token')}`}).then((pro: any) => setProjects(pro.activeProject.edges))
  }, [])

  console.log("Active_Projects", projects)
  const [userForEdit] = useState<User>({
    ...user,
    // avatar: user.avatar || initialUser.avatar,
    role: user.role || initialUser.role,
    password: user.password || initialUser.password,
    name: user.name || initialUser.name,
    email: user.email || initialUser.email,
    first_name: user.first_name || initialUser.first_name,
    last_name: user.last_name || initialUser.last_name,
  })

  const cancel = (withRefresh?: boolean) => {
    if (withRefresh) {
      refetch()
    }
    setItemIdForUpdate(undefined)
  }

  let option: any[] = [];

  for (let i = 0; i < projects.length; i++) {
    const pn = projects[i]?.node?.projectName
    const pn1 = projects[i]?.node?.projectName
    const id = projects[i]?.node?.id
    option.push({ value: pn, label: pn1, id: id });
  }

  console.log("Active project Array", option)

  // const blankImg = toAbsoluteUrl('/media/svg/avatars/blank.svg')
  // const userAvatarImg = toAbsoluteUrl(`/media/${userForEdit.avatar}`)

  const handleActiveStatus = () => {
    setIsChecked(!isChecked);
  }
  console.log("Active status->", isChecked);

  const handleChange = (selectedOption: any) => {
    console.log("selectedOption", selectedOption)
    setSelectedOption(selectedOption);
  };

  const handleRole = (e: any) => {
    console.log("Role", e.target.value)
    setRole(e.target.value)
  }

  const updateEmail = (e: any) => {
    setCheckEmail(e.target.value.toLowerCase())
    const enteredEmail = e.target.value.toLowerCase()
    console.log("email", enteredEmail, checkEmail)


    if (data.find((item: any) => item.email === enteredEmail) !== undefined) {
      setError("Email already Available");
    }
    else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(enteredEmail)) {
      setError("Not a valid email");
    }
    else {
      setEmail(enteredEmail);
      setError("");
    }
  }


  // const updatePassword = (e: any) => {
  //   setPassword(e.target.value)
  // }

  const updateUsername = (e: any) => {
    setUsername(e.target.value)
  }

  const updateFirstName = (e: any) => {
    setFirstname(e.target.value)
  }

  const updateLastName = (e: any) => {
    setLastname(e.target.value)
  }


  const formik = useFormik({
    initialValues: userForEdit,
    // validationSchema: editUserSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true)
      console.log("user submitted values", values)
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
      let proId = selectedOption[i].id
      assignProjects.push({ projectId: proId })
      setAssignProjects(assignProjects)
    }
    console.log(`Option selected2:`, assignProjects);
    const variables = {
      email: email,
      // password: password,
      username: username,
      firstname: firstname,
      lastname: lastname,
      active: isChecked,
      role: role,
      assignProject: assignProjects
    }

    request(`${BASEURL}graphql/`, createUsers, variables, {Authorization: `Bearer ${localStorage.getItem('Token')}`}).then((response: any) => {
      console.log("create user res", response)
      const val = Object.keys(response?.createUser?.users).length
      console.log(" create project val", val)
      setOpen1(true);
      if (val > 0) {
        setMessage1(true)
        setMessage("Successfully Created")
        setUpdate(true)
      } else {
        setMessage1(false)
        setMessage("Something Went Wrong")
      }
      setTimeout(() => {
        setItemIdForUpdate(undefined)
      }, 1000);
    })
    setAssignProjects([])
  }

  const colorv = localStorage.getItem("themeColor")
  const themec = colorv != null ? colorv + " " + 'btn' : 'p-3 bg-primary text-white btn'


  return (
    <>
      <form id='kt_modal_add_user_form' className='form' onSubmit={onSubmit} >
        {/* <form id='kt_modal_add_user_form' className='form' onSubmit={formik.handleSubmit} noValidate> */}
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
            <label className='required fw-bold fs-6 mb-2'>Email</label>
            {/* end::Label */}

            {/* begin::Input */}
            <input
              placeholder='Email'
              {...formik.getFieldProps('email')}
              className={clsx(
                'form-control form-control-solid mb-3 mb-lg-0'
              )}
              type='email'
              name='email'
              onChange={updateEmail}
              value={checkEmail}
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
            <label className='required fw-bold fs-6 mb-2'>User Name</label>
            {/* end::Label */}

            {/* begin::Input */}
            <input
              placeholder='User name'
              {...formik.getFieldProps('name')}
              type='text'
              name='name'
              onChange={updateUsername}
              value={username}
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
            {formik.touched.name && formik.errors.name && (
              <div className='fv-plugins-message-container'>
                <div className='fv-help-block'>
                  <span role='alert'>{formik.errors.name}</span>
                </div>
              </div>
            )}
            {/* end::Input */}
          </div>
          {/* end::Input group */}

          {/* begin::Input group */}
          <div className='fv-row mb-3'>
            {/* begin::Label */}
            <label className='required fw-bold fs-6 mb-2'>First Name</label>
            {/* end::Label */}

            {/* begin::Input */}
            <input
              placeholder='First name'
              {...formik.getFieldProps('first_name')}
              type='text'
              name='first_name'
              onChange={updateFirstName}
              value={firstname}
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
            {formik.touched.first_name && formik.errors.first_name && (
              <div className='fv-plugins-message-container'>
                <div className='fv-help-block'>
                  <span role='alert'>{formik.errors.first_name}</span>
                </div>
              </div>
            )}
            {/* end::Input */}
          </div>
          {/* end::Input group */}

          {/* begin::Input group */}
          <div className='fv-row mb-3'>
            {/* begin::Label */}
            <label className='required fw-bold fs-6 mb-2'>Last Name</label>
            {/* end::Label */}

            {/* begin::Input */}
            <input
              placeholder='Last name'
              {...formik.getFieldProps('last_name')}
              type='text'
              name='last_name'
              onChange={updateLastName}
              value={lastname}
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
            {formik.touched.last_name && formik.errors.last_name && (
              <div className='fv-plugins-message-container'>
                <div className='fv-help-block'>
                  <span role='alert'>{formik.errors.last_name}</span>
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
              <input {...formik.getFieldProps('active')} defaultChecked={true} type="checkbox" onChange={handleActiveStatus} required />&nbsp;&nbsp;
              <span>Active</span>
            </label>
            {/* end::Label */}
          </div>
          {/* end::Input group */}

          {/* begin::Input group */}
          <div className='mb-3' onChange={handleRole}>
            {/* begin::Label */}
            <label className='required fw-bold fs-6 mb-5'>Role</label>
            {/* end::Label */}
            {/* begin::Roles */}
            {/* begin::Input row */}
            <div className='d-flex fv-row'>
              {/* begin::Radio */}
              <div className='form-check form-check-custom form-check-solid'>
                {/* begin::Input */}
                <input
                  className='form-check-input me-3'
                  {...formik.getFieldProps('role')}
                  name='role'
                  type='radio'
                  value='Manager'
                  id='kt_modal_update_role_option_0'
                  checked={formik.values.role === 'Manager'}
                  disabled={formik.isSubmitting || isUserLoading}
                />

                {/* end::Input */}
                {/* begin::Label */}
                <label className='form-check-label' htmlFor='kt_modal_update_role_option_0'>
                  <div className='fw-bolder text-gray-800'>Manager</div>
                  {/* <div className='text-gray-600'>
                    Best for business owners and company administrators
                  </div> */}
                </label>
                {/* end::Label */}
              </div>
              {/* end::Radio */}
            </div>
            {/* end::Input row */}
            <div className='separator separator-dashed my-5'></div>
            {/* begin::Input row */}
            <div className='d-flex fv-row'>
              {/* begin::Radio */}
              <div className='form-check form-check-custom form-check-solid'>
                {/* begin::Input */}
                <input
                  className='form-check-input me-3'
                  {...formik.getFieldProps('role')}
                  name='role'
                  type='radio'
                  value='Reviewer'
                  id='kt_modal_update_role_option_1'
                  checked={formik.values.role === 'Reviewer'}
                  disabled={formik.isSubmitting || isUserLoading}
                />
                {/* end::Input */}
                {/* begin::Label */}
                <label className='form-check-label' htmlFor='kt_modal_update_role_option_1'>
                  <div className='fw-bolder text-gray-800'>Reviewer</div>
                  {/* <div className='text-gray-600'>
                    Best for developers or people primarily using the API
                  </div> */}
                </label>
                {/* end::Label */}
              </div>
              {/* end::Radio */}
            </div>
            {/* end::Input row */}
            {/* end::Roles */}
          </div>
          {/* end::Input group */}

          {/* begin::Input group */}
          {role && role == "Reviewer" ?
            <div className='fv-row mb-3'>
              {/* begin::Label */}
              <label className='fw-bold fs-6 mb-2'>Assign Projects</label>
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
            </div> : null
          }
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
