import React, { useState } from 'react'
import clsx from 'clsx'
import { Link } from 'react-router-dom'
import { useFormik } from 'formik'
import { request, gql } from 'graphql-request'
import BASEURL from '../../../config/baseurl'

const initialValues = {
  email: '',
}

const PASSWORD_RESET_REQUEST = gql`
  mutation ResetRequest(
    $email:String!
  ){
    sendPasswordResetEmail(email:$email){
      success
      errors
    }
  }`

export function ForgotPassword() {
  const [hasErrors, setHasErrors] = useState<boolean | undefined>(undefined)
  const [error, setError] = useState("");
  const [button, setButton] = useState(false)
  const [email, setEmail] = useState("")

  const updateEmail = (e: any) => {
    console.log("email", e.target.value)
    const enteredEmail = e.target.value.toLowerCase()
    setEmail(enteredEmail);
  }

  const formik = useFormik({
    initialValues,
    onSubmit: () => {
      console.log("val->", email);
      setButton(true)
      request(`${BASEURL}graphql/`, PASSWORD_RESET_REQUEST, { email: email }, {Authorization: `Bearer ${localStorage.getItem('Token')}`}).then((response: any) => {
        console.log("reset res", response);
        console.log(response.sendPasswordResetEmail.success);
        if (response.sendPasswordResetEmail.success) {
          setHasErrors(false)
        }
        else {
          setError(response.sendPasswordResetEmail.errors.email[0].message);
          setHasErrors(true)
        }
      })
    },
  })


  return (
    <form
      className='form w-100 fv-plugins-bootstrap5 fv-plugins-framework'
      noValidate
      id='kt_login_password_reset_form'
      onSubmit={formik.handleSubmit}
    >
      <div className='text-center mb-10'>
        {/* begin::Title */}
        <h1 className='text-dark fw-bolder mb-3'>Forgot Password ?</h1>
        {/* end::Title */}

        {/* begin::Link */}
        <div className='text-gray-500 fw-semibold fs-6'>
          Enter your email to reset your password.
        </div>
        {/* end::Link */}
      </div>

      {/* begin::Title */}
      {hasErrors === true && (
        <div className='mb-lg-15 alert alert-danger'>
          <div className='alert-text font-weight-bold'>
            {error}
          </div>
        </div>
      )}

      {hasErrors === false && (
        <div className='mb-10 bg-light-info p-8 rounded'>
          <div className='text-info'>Sent password reset. Please check your email</div>
        </div>
      )}
      {/* end::Title */}

      {/* begin::Form group */}
      <div className='fv-row mb-8'>
        <label className='form-label fw-bolder text-gray-900 fs-6'>Email</label>
        <input
          type='email'
          placeholder='Email'
          autoComplete='off'
          {...formik.getFieldProps('email')}
          className={clsx(
            'form-control bg-transparent'
          )}
          name='email'
          onChange={updateEmail}
          value={email}
          disabled={formik.isSubmitting}
        />
        {formik.touched.email && formik.errors.email && (
          <div className='fv-plugins-message-container'>
            <div className='fv-help-block'>
              <span role='alert'>{formik.errors.email}</span>
            </div>
          </div>
        )}
      </div>
      {/* end::Form group */}

      {/* begin::Form group */}
      <div className='d-flex flex-wrap justify-content-center pb-lg-0'>
        <button type='submit' id='kt_password_reset_submit' disabled={button} className='btn btn-primary me-4'>
          <span className='indicator-label'>Submit</span>
          {/* {loading && (
            <span className='indicator-progress'>
              Please wait...
              <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
            </span>
          )} */}
        </button>
        <Link to='/auth/login'>
          <button
            type='button'
            id='kt_login_password_reset_form_cancel_button'
            className='btn btn-light'
            disabled={formik.isSubmitting || !formik.isValid}
          >
            Cancel
          </button>
        </Link>{' '}
      </div>
      {/* end::Form group */}
    </form>
  )
}
