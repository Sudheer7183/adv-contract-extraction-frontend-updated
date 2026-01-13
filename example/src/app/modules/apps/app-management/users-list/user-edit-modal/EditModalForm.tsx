import React, { FC, useEffect, useState } from 'react'
import { useFormik } from 'formik'
import { isNotEmpty } from '../../../../../../_metronic/helpers'
import { initialUser, User } from '../core/_models'
import clsx from 'clsx'
import { useListView } from '../core/ListViewProvider'
import { UsersListLoading } from '../components/loading/UsersListLoading'
import { createUser, updateUser } from '../core/_requests'
import { useQueryResponse } from '../core/QueryResponseProvider'
import { request, gql } from 'graphql-request'
import { Alert, Snackbar } from '@mui/material';
import BASEURL from '../../../../../config/baseurl'

type Props = {
  id: string
}

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

const GetService = gql`
query GetService($id: String!){
  getService(id: $id){
    id
    service{
      id
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

const updateService = gql`
mutation UpdateService($input: UpdateServiceInput!){
  updateService(input: $input){
    service{
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
}`

const EditModalForm: FC<Props> = ({ id }) => {
  console.log("Service edit id props value", id);
  const { setItemIdForUpdate, setUpdate } = useListView()
  const [data, setdata] = useState([])
  const [message, setMessage] = useState("")
  const [message1, setMessage1] = useState(false)
  const [open1, setOpen1] = useState(false);
  const [error1, setError1] = useState("")
  const [error2, setError2] = useState("")
  const [error3, setError3] = useState("")
  const [error4, setError4] = useState("")
  const [allDetail, setAllDetail] = useState<any[]>([]);
  const { refetch } = useQueryResponse()

  useEffect(() => {
    request(`${BASEURL}graphql/`, GetService, { id: id }, {Authorization: `Bearer ${localStorage.getItem('Token')}`}).then((res: any) => setdata(res.getService))
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
  }, [])
  console.log("edit Service data---->", data);

  const url = data?.serviceApiUrl
  const token = data?.serviceApiKey
  const desc = data?.description
  const servicename = data?.service?.serviceName
  const access_key = data.accessKey
  const secret_key = data.secretKey
  const region_name = data.regionName

  const [serviceName, setServiceName] = useState(servicename)
  const [serviceUrl, setServiceUrl] = useState(url)
  const [serviceToken, setServiceToken] = useState("")
  const [serviceDesc, setServiceDesc] = useState("")
  const [checkServiceDesc, setCheckServiceDesc] = useState(desc)
  const [checkServiceToken, setCheckServiceToken] = useState(token);
  const [accessKey, setAccessKey] = useState("")
  const [secretKey, setSecretKey] = useState("")
  const [checkaccessKey, setCheckAccessKey] = useState(access_key)
  const [checksecretKey, setCheckSecretKey] = useState(secret_key)
  const [regionName, setRegionName] = useState(region_name)


  useEffect(() => {
    setServiceUrl(url)
    setServiceToken(token)
    setCheckServiceToken(token)
    setCheckServiceDesc(desc)
    setServiceDesc(desc)
    setServiceName(servicename)
    setCheckAccessKey(access_key)
    setCheckSecretKey(secret_key)
    setRegionName(region_name)
  }, [url, token, desc, servicename, access_key, secret_key, region_name]
  )

  const [userForEdit] = useState<User>({
    // avatar: user.avatar || initialUser.avatar,
    role: initialUser.role,
    password: initialUser.password,
    name: initialUser.name,
    email: initialUser.email,
    first_name: initialUser.first_name,
    last_name: initialUser.last_name,
  })

  const cancel = (withRefresh?: boolean) => {
    if (withRefresh) {
      refetch()
    }
    setItemIdForUpdate(undefined)
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

  const updateServiceUrl = (e: any) => {
    console.log("zuva url", e.target.value);
    setServiceUrl(e.target.value)
  }

  const updateServiceToken = (e: any, serviceType: any) => {
    setCheckServiceToken(e.target.value)
    if (allDetail.find((item: any) => (item.serviceApiKey.toUpperCase() === e.target.value.toUpperCase()) && (item.service.serviceName.toUpperCase() === serviceType.toUpperCase())) !== undefined) {
      setError1("Token already Available");
    } else {
      setServiceToken(e.target.value)
      setError1("");
    }
  }

  const updateDescription = (e: any, serviceType: any) => {
    setCheckServiceDesc(e.target.value)
    if (allDetail.find((item: any) => (item.description.toUpperCase() === e.target.value.toUpperCase()) && (item.service.serviceName.toUpperCase() === serviceType.toUpperCase())) !== undefined) {
      setError2("Description already Available");
    } else {
      setServiceDesc(e.target.value)
      setError2("");
    }
  }
  const updateaccessKey = (e: any, serviceType: any) => {
    setCheckAccessKey(e.target.value)
    if (allDetail.find((item: any) => (item.accessKey.toUpperCase() === e.target.value.toUpperCase()) && (item.service.serviceName.toUpperCase() === serviceType.toUpperCase())) !== undefined) {
      setError3("AccessKey already Available");
    } else {
      setAccessKey(e.target.value)
      setError3("");
    }
  }
  const updatesecretKey = (e: any, serviceType: any) => {
    setCheckSecretKey(e.target.value)
    if (allDetail.find((item: any) => (item.secretKey.toUpperCase() === e.target.value.toUpperCase()) && (item.service.serviceName.toUpperCase() === serviceType.toUpperCase())) !== undefined) {
      setError4("SecretKey already Available");
    } else {
      setSecretKey(e.target.value)
      setError4("");
    }
  }
  const updateregionName = (e: any) => {
    console.log("region name", e.target.value);
    setRegionName(e.target.value)
  }

  const handleClose1 = () => {
    setOpen1(false);
  };

  const onSubmit = async (e: any) => {
    e.preventDefault()
    if (serviceName == "ZuvaDocAI") {
      const variables = {
        serviceId: id,
        zuvaUrl: serviceUrl,
        zuvaToken: serviceToken,
        zuvaDescription: serviceDesc
      }
      request(`${BASEURL}graphql/`, updateService, { input: variables }, {Authorization: `Bearer ${localStorage.getItem('Token')}`}).then((response: any) => {
        console.log(response)
        const val = Object.keys(response?.updateService?.service).length
        console.log(" create project val", val)
        setOpen1(true);
        if (val > 0) {
          setMessage1(true)
          setMessage("Successfully Updated")
          setUpdate(true)
        } else {
          setMessage1(false)
          setMessage("Something Went Wrong")
        }
      })
    } else if (serviceName == "Nanonet") {
      const variables = {
        serviceId: id,
        nanonetUrl: serviceUrl,
        nanonetToken: serviceToken,
        nanonetDescription: serviceDesc
      }
      request(`${BASEURL}graphql/`, updateService, { input: variables }, {Authorization: `Bearer ${localStorage.getItem('Token')}`}).then((response: any) => {
        console.log(response)
        const val = Object.keys(response?.updateService?.service).length
        console.log(" create project val", val)
        setOpen1(true);
        if (val > 0) {
          setMessage1(true)
          setMessage("Successfully Updated")
          setUpdate(true)
        } else {
          setMessage1(false)
          setMessage("Something Went Wrong")
        }
      })
    } else {
      const variables = {
        serviceId: id,
        accessKey: accessKey,
        secretKey: secretKey,
        regionName: regionName,
        awsDescription: serviceDesc
      }
      request(`${BASEURL}graphql/`, updateService, { input: variables }, {Authorization: `Bearer ${localStorage.getItem('Token')}`}).then((response: any) => {
        console.log(response)
        const val = Object.keys(response?.updateService?.service).length
        console.log(" create project val", val)
        setOpen1(true);
        if (val > 0) {
          setMessage1(true)
          setMessage("Successfully Updated")
          setUpdate(true)
        } else {
          setMessage1(false)
          setMessage("Something Went Wrong")
        }
      })
    }
    setUpdate(true)
  }

  const colorv = localStorage.getItem("themeColor")
  const themec = colorv != null ? colorv + " " + 'btn' : 'p-3 bg-primary text-white btn'

  return (
    <>
      <form id='kt_modal_add_user_form' className='form' onSubmit={onSubmit} noValidate>
        {/* begin::Scroll */}
        {serviceName == "ZuvaDocAI" ?
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
            <div className='fv-row mb-3'>
              {/* begin::Label */}
              <label className='required fw-bold fs-6 mb-2'>Zuva SDK Url</label>
              {/* end::Label */}

              {/* begin::Input */}
              <input
                placeholder='Url'
                {...formik.getFieldProps('email')}
                className={clsx(
                  'form-control form-control-solid mb-3 mb-lg-0',
                  { 'is-invalid': formik.touched.email && formik.errors.email },
                  {
                    'is-valid': formik.touched.email && !formik.errors.email,
                  }
                )}
                type='text'
                name='name'
                onChange={updateServiceUrl}
                value={serviceUrl}
                autoComplete='off'
              // disabled
              />
              {/* end::Input */}
            </div>
            {/* end::Input group */}

            {/* begin::Input group */}
            <div className='fv-row mb-3'>
              {/* begin::Label */}
              <label className='required fw-bold fs-6 mb-2'>Zuva SDK Token</label>
              {/* end::Label */}

              {/* begin::Input */}
              <input
                placeholder='Token'
                {...formik.getFieldProps('name')}
                type='text'
                name='name'
                onChange={(e) => updateServiceToken(e, serviceName)}
                value={checkServiceToken}
                className={clsx(
                  'form-control form-control-solid mb-3 mb-lg-0',
                  { 'is-invalid': formik.touched.name && formik.errors.name },
                  {
                    'is-valid': formik.touched.name && !formik.errors.name,
                  }
                )}
                autoComplete='off'
                disabled={formik.isSubmitting}
              />
              <p className='red-text text-darken-1'>{error1}</p>
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
              <label className='required fw-bold fs-6 mb-2'>Description:</label>
              {/* end::Label */}

              {/* begin::Input */}
              <input
                placeholder='Hint: Project Name/Project Description'
                {...formik.getFieldProps('first_name')}
                type='text'
                name='name'
                onChange={(e) => updateDescription(e, serviceName)}
                value={checkServiceDesc}
                className={clsx(
                  'form-control form-control-solid mb-3 mb-lg-0',
                  { 'is-invalid': formik.touched.first_name && formik.errors.first_name },
                  {
                    'is-valid': formik.touched.first_name && !formik.errors.first_name,
                  }
                )}
                autoComplete='off'
                disabled={formik.isSubmitting}
              />
              <p className='red-text text-darken-1'>{error2}</p>
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
          </div> : serviceName == "Nanonet" ?
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
              <div className='fv-row mb-3'>
                {/* begin::Label */}
                <label className='required fw-bold fs-6 mb-2'>Enter Nanonet Url</label>
                {/* end::Label */}

                {/* begin::Input */}
                <input
                  placeholder='Url'
                  {...formik.getFieldProps('email')}
                  className={clsx(
                    'form-control form-control-solid mb-3 mb-lg-0',
                    { 'is-invalid': formik.touched.email && formik.errors.email },
                    {
                      'is-valid': formik.touched.email && !formik.errors.email,
                    }
                  )}
                  type='text'
                  name='name'
                  onChange={updateServiceUrl}
                  value={serviceUrl}
                  autoComplete='off'
                // disabled
                />
                {/* end::Input */}
              </div>
              {/* end::Input group */}

              {/* begin::Input group */}
              <div className='fv-row mb-3'>
                {/* begin::Label */}
                <label className='required fw-bold fs-6 mb-2'>Enter Nanonet API Key</label>
                {/* end::Label */}

                {/* begin::Input */}
                <input
                  placeholder='Token'
                  {...formik.getFieldProps('name')}
                  type='text'
                  name='name'
                  onChange={(e) => updateServiceToken(e, serviceName)}
                  value={checkServiceToken}
                  className={clsx(
                    'form-control form-control-solid mb-3 mb-lg-0',
                    { 'is-invalid': formik.touched.name && formik.errors.name },
                    {
                      'is-valid': formik.touched.name && !formik.errors.name,
                    }
                  )}
                  autoComplete='off'
                  disabled={formik.isSubmitting}
                />
                <p className='red-text text-darken-1'>{error1}</p>
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
                <label className='required fw-bold fs-6 mb-2'>Description:</label>
                {/* end::Label */}

                {/* begin::Input */}
                <input
                  placeholder='Hint: Project Name/Project Description'
                  {...formik.getFieldProps('first_name')}
                  type='text'
                  name='name'
                  onChange={(e) => updateDescription(e, serviceName)}
                  value={checkServiceDesc}
                  className={clsx(
                    'form-control form-control-solid mb-3 mb-lg-0',
                    { 'is-invalid': formik.touched.first_name && formik.errors.first_name },
                    {
                      'is-valid': formik.touched.first_name && !formik.errors.first_name,
                    }
                  )}
                  autoComplete='off'
                  disabled={formik.isSubmitting}
                />
                <p className='red-text text-darken-1'>{error2}</p>
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
            </div> : <div
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
              <div className='fv-row mb-3'>
                {/* begin::Label */}
                <label className='required fw-bold fs-6 mb-2'>AWS Access Key ID</label>
                {/* end::Label */}

                {/* begin::Input */}
                <input
                  placeholder='Access Key Id'
                  {...formik.getFieldProps('email')}
                  className={clsx(
                    'form-control form-control-solid mb-3 mb-lg-0',
                    { 'is-invalid': formik.touched.email && formik.errors.email },
                    {
                      'is-valid': formik.touched.email && !formik.errors.email,
                    }
                  )}
                  type='text'
                  name='name'
                  onChange={(e) => updateaccessKey(e, serviceName)}
                  value={checkaccessKey}
                  autoComplete='off'
                // disabled
                />
                <p className='red-text text-darken-1'>{error3}</p>
                {/* end::Input */}
              </div>
              {/* end::Input group */}

              {/* begin::Input group */}
              <div className='fv-row mb-3'>
                {/* begin::Label */}
                <label className='required fw-bold fs-6 mb-2'>AWS Secret Access Key</label>
                {/* end::Label */}

                {/* begin::Input */}
                <input
                  placeholder=' Secret Access Key'
                  {...formik.getFieldProps('name')}
                  type='text'
                  name='name'
                  onChange={(e) => updatesecretKey(e, serviceName)}
                  value={checksecretKey}
                  className={clsx(
                    'form-control form-control-solid mb-3 mb-lg-0',
                    { 'is-invalid': formik.touched.name && formik.errors.name },
                    {
                      'is-valid': formik.touched.name && !formik.errors.name,
                    }
                  )}
                  autoComplete='off'
                  disabled={formik.isSubmitting}
                />
                <p className='red-text text-darken-1'>{error4}</p>
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
                <label className='required fw-bold fs-6 mb-2'>Default region name</label>
                {/* end::Label */}

                {/* begin::Input */}
                <input
                  placeholder='Region Name'
                  {...formik.getFieldProps('name')}
                  type='text'
                  name='name'
                  onChange={updateregionName}
                  value={regionName}
                  className={clsx(
                    'form-control form-control-solid mb-3 mb-lg-0',
                    { 'is-invalid': formik.touched.name && formik.errors.name },
                    {
                      'is-valid': formik.touched.name && !formik.errors.name,
                    }
                  )}
                  autoComplete='off'
                  disabled={formik.isSubmitting}
                />
                {/* <p className='red-text text-darken-1'>{error1}</p> */}
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
                <label className='required fw-bold fs-6 mb-2'>Description:</label>
                {/* end::Label */}

                {/* begin::Input */}
                <input
                  placeholder='Hint: Project Name/Project Description'
                  {...formik.getFieldProps('first_name')}
                  type='text'
                  name='name'
                  onChange={(e) => updateDescription(e, serviceName)}
                  value={checkServiceDesc}
                  className={clsx(
                    'form-control form-control-solid mb-3 mb-lg-0',
                    { 'is-invalid': formik.touched.first_name && formik.errors.first_name },
                    {
                      'is-valid': formik.touched.first_name && !formik.errors.first_name,
                    }
                  )}
                  autoComplete='off'
                  disabled={formik.isSubmitting}
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
            </div>}
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
            <span className='indicator-label'>Save</span>
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

export { EditModalForm }
