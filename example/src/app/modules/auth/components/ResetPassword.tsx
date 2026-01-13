import React, { useState } from 'react'
import * as Yup from 'yup'
import clsx from 'clsx'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useFormik } from 'formik'
import { useAuth } from '../core/Auth'
import request, { gql } from 'graphql-request'
import BASEURL from '../../../config/baseurl'
import zxcvbn from 'zxcvbn';


const ResetSchema = Yup.object().shape({
    newPassword1: Yup.string()
        .required('Password confirmation is required'),
    newPassword2: Yup.string()
        .required('Password is required')
        .test('passwords-match', 'Passwords must match', function (value) {
            return this.parent.newPassword1 === value;
        }),
})

// const CHANGE_PASSWORD = gql`
// mutation ChangePassword(
//   $token:String!
//   $newPassword1: String!
//   $newPassword2: String!
// ){
//   passwordReset(token: $token, newPassword1: $newPassword1, newPassword2: $newPassword2){
//     success
//     errors
//   }
// }`


const CHANGE_PASSWORD = gql`
mutation ChangePassword(
  $token:String!
  $newPassword1: String!
  $newPassword2: String!
){
  passwordResetConfirm(token: $token, newPassword1: $newPassword1, newPassword2: $newPassword2){
    success
    errors
  }
}`


export function ResetPassword() {
    const { token } = useParams();
    const initialValues = {
        // token :token,
        newPassword2: '',
        newPassword1: '',
    }

    const [loading, setLoading] = useState(false)
    const { saveAuth, setCurrentUser } = useAuth()
    const [error, setError] = useState("");
    const nav = useNavigate();
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [num, setNum] = useState(0);

    const changePasswordColor = () => ({
        width: `${num}%`,
        background: getPasswordStrengthColor(),
        height: '7px'
    })

    const handlePasswordChange = (event: any) => {
        const newPassword = event.target.value;
        const strength = zxcvbn(newPassword).score;
        const percentage = strength * 100 / 4;
        setNum(percentage)
        setPasswordStrength(strength);
        formik.handleChange(event); // Handle the change in Formik
    };

    const PasswordLabel = () => {
        switch (passwordStrength) {
            case 0:
                return 'Very weak'; // Very weak
            case 1:
                return 'Weak'; // Weak
            case 2:
                return 'Fear'; // Fair
            case 3:
                return 'Good'; // Good
            case 4:
                return 'Strong'; // Strong
            default:
                return 'none'; // Default color
        }
    }

    const getPasswordStrengthColor = () => {
        switch (passwordStrength) {
            case 0:
                return 'gray'; // Very weak
            case 1:
                return 'red'; // Weak
            case 2:
                return 'orange'; // Fair
            case 3:
                return 'lightgreen'; // Good
            case 4:
                return 'green'; // Strong
            default:
                return 'none'; // Default color
        }
    };


    const formik = useFormik({
        initialValues,
        validationSchema: ResetSchema,
        onSubmit: async (values, { setStatus, setSubmitting }) => {
            setLoading(true)
            try {
                request(`${BASEURL}graphql/`, CHANGE_PASSWORD, {

                    token: token,
                    newPassword1: values.newPassword1,
                    newPassword2: values.newPassword2,
                }).then((response: any) => {
                    console.log(response.passwordResetConfirm.success);
                    if (response.passwordResetConfirm.success) {
                        nav("/auth/password");
                    }
                    else {
                        console.log("error reset pwd", response);
                        setError(response.passwordResetConfirm.errors.nonFieldErrors[0].message);
                    }
                })

            } catch (error) {
                console.error(error)
                saveAuth(undefined)
                setStatus('The login details are incorrect')
                setSubmitting(false)
                setLoading(false)
            }
        },
    })


    return (
        <form
            className='form w-100'
            onSubmit={formik.handleSubmit}
            noValidate
            id='kt_login_signin_form'
        >
            {/* begin::Heading */}
            <div className='text-center mb-11'>
                <h1 className='text-dark fw-bolder mb-3'>Create Password</h1>
            </div>

            <div className='fv-row mb-8'>
                <label className='form-label fs-6 fw-bolder text-dark'>New Password</label>
                <input
                    // placeholder=''
                    {...formik.getFieldProps('newPassword2')}
                    className={clsx(
                        'form-control bg-transparent'
                    )}
                    type='password'
                    name='newPassword2'
                    autoComplete='off'
                    onChange={handlePasswordChange}
                />
                {formik.touched.newPassword2 && formik.errors.newPassword2 && (
                    <div className='fv-plugins-message-container'>
                        <span role='alert'>{formik.errors.newPassword2}</span>
                    </div>
                )}
                <div style={{ margin: '10px 0' }}></div>
                <div className='progress' style={{ height: '7px' }}>
                    <div className='progress-bar'
                        style={changePasswordColor()}></div>
                </div>
                <p style={{ color: getPasswordStrengthColor() }}>{PasswordLabel()}</p>
            </div>

            <div className='fv-row mb-3'>
                <label className='form-label fw-bolder text-dark fs-6 mb-0'>Confirm Password</label>
                <input
                    // placeholder='newPassword2'
                    type='password'
                    autoComplete='off'
                    {...formik.getFieldProps('newPassword1')}
                    className={clsx(
                        'form-control bg-transparent'
                    )}
                />
                {formik.touched.newPassword1 && formik.errors.newPassword1 && (
                    <div className='fv-plugins-message-container'>
                        <div className='fv-help-block'>
                            <span role='alert'>{formik.errors.newPassword1}</span>
                        </div>
                    </div>
                )}
            </div>
            <p className='text-danger'>{error}</p>
            <div className='d-grid mb-10'>
                <button
                    type='submit'
                    id='kt_sign_in_submit'
                    className='btn btn-primary'
                    disabled={formik.isSubmitting || !formik.isValid}
                >
                    <span className='indicator-label'>Set Password</span>
                </button><br />
                <Link to='/auth/request-password-email' className='link-primary'>
                    Resend Email
                </Link>
                {/* <button
                    type='submit'
                    id='kt_password_reset_submit'
                    className='btn btn-primary'

                >
                    <span className='indicator-label'>Resend Email</span>
                </button> */}
            </div>
        </form>
    )
}
