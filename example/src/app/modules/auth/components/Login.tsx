// /* eslint-disable jsx-a11y/anchor-is-valid */
// import React, { useState } from 'react'
// import * as Yup from 'yup'
// import clsx from 'clsx'
// import { Link } from 'react-router-dom'
// import { useFormik } from 'formik'
// import { login } from '../core/_requests'
// import { useAuth } from '../core/Auth'
// import Visibility from '@mui/icons-material/Visibility';
// import VisibilityOff from '@mui/icons-material/VisibilityOff';
// import { Avatar, Alert, Snackbar, Button, IconButton, TextField } from '@mui/material';
// import request, { gql } from 'graphql-request';
// import BASEURL from '../../../config/baseurl';

// const get_user_tenant = gql`
//   query userTenant($username: String!){
//   userTenant(username: $username){
//     id
//     username
//     email
//     tenant{
//       schemaName
//     }
//   }
// }`


// const loginSchema = Yup.object().shape({
//   email: Yup.string()
//     .email('Wrong email format')
//     .required('Email is required'),
//   password: Yup.string()
//     .required('Password is required'),
// })


// const initialValues = {
//   email: 'admin@admin.com',
//   password: 'admin@123',
// }


// export function Login() {
//   const [loading, setLoading] = useState(false)
//   const { saveAuth, setCurrentUser } = useAuth()
//   const [error, setError] = useState("");
//   const [showPassword, setShowPassword] = useState(false);


//   const handleTogglePasswordVisibility = () => {
//     setShowPassword(!showPassword);
//   };

//   const formik = useFormik({
//     initialValues,
//     validationSchema: loginSchema,
//     onSubmit: async (values, { setStatus, setSubmitting }) => {
//       setLoading(true)
//       try {
//         const { data: auth } = await login(values.email, values.password)
//         saveAuth(auth)
//         console.log("Auth", auth)
//         if (auth.data.tokenAuth === null) {
//           console.log("deactivate", auth.data);
//           console.log("deactivate error");
//           setError(auth.errors[0].message);
//         }
//         console.log("Token", auth.data.tokenAuth.token)
//         const Token = auth.data.tokenAuth.token
//         const user = auth.data.tokenAuth.user
        // const username = auth.data.tokenAuth.user.username
        // localStorage.setItem('Token', Token)
        // localStorage.setItem('userDetails', JSON.stringify(user));
        // // const {data: user} = await getUserByToken(auth.api_token)
        // request(`${BASEURL}graphql/`, get_user_tenant, { username: username }, { Authorization: `Bearer ${Token}` }).then((res: any) => {
        //   console.log("get user tenant", res, res.userTenant.tenant.schemaName);
        //   localStorage.setItem('Schema', res.userTenant.tenant.schemaName);  
        // })
//         setCurrentUser(user)
//         console.log("User Detail", user)
//         setError(auth.data.tokenAuth.errors.nonFieldErrors[0].message);
//       } catch (error) {
//         console.error(error)
//         saveAuth(undefined)
//         setStatus('The login details are incorrect')
//         setSubmitting(false)
//         setLoading(false)
//       }
//     },
//   })

//   return (
//     <form
//       className='form w-100'
//       onSubmit={formik.handleSubmit}
//       noValidate
//       id='kt_login_signin_form'
//     >
//       {/* begin::Heading */}
//       <div className='text-center mb-11'>
//         <h1 className='text-dark fw-bolder mb-3'>Sign In</h1>
//       </div>
//       {/* begin::Heading */}

//       {/* begin::Form group */}
//       <div className='fv-row mb-8'>
//         <label className='form-label fs-6 fw-bolder text-dark'>Email</label>
//         <input
//           placeholder='Email'
//           {...formik.getFieldProps('email')}
//           className={clsx(
//             'form-control bg-transparent'
//           )}
//           type='email'
//           name='email'
//           autoComplete='off'
//         />
//         {formik.touched.email && formik.errors.email && (
//           <div className='fv-plugins-message-container'>
//             <span role='alert'>{formik.errors.email}</span>
//           </div>
//         )}
//       </div>
//       {/* end::Form group */}

//       {/* begin::Form group */}
//       <div className='fv-row mb-3'>
//         <label className='form-label fw-bolder text-dark fs-6 mb-0'>Password</label>
//         <TextField
//           className={clsx(
//             'form-control bg-transparent'
//           )}
//           autoComplete='off'
//           {...formik.getFieldProps('password')}

//           // name='newPassword'
//           type={showPassword ? 'text' : 'password'}
//           // value={newPassword}
//           // onChange={(e) => setNewPassword(e.target.value)}
//           InputProps={{
//             endAdornment: (
//               <IconButton
//                 aria-label='toggle password visibility'
//                 onClick={handleTogglePasswordVisibility}
//               >
//                 {showPassword ? <Visibility /> : <VisibilityOff />}
//               </IconButton>
//             ),
//             style: { height: '35px' }
//           }}
//         />
//         {/* <input
//           type='password'
//           autoComplete='off'
//           {...formik.getFieldProps('password')}
//           className={clsx(
//             'form-control bg-transparent'
//           )}
//         /> */}
//         {formik.touched.password && formik.errors.password && (
//           <div className='fv-plugins-message-container'>
//             <div className='fv-help-block'>
//               <span role='alert'>{formik.errors.password}</span>
//             </div>
//           </div>
//         )}
//       </div>
//       {/* end::Form group */}

//       {/* begin::Wrapper */}
//       <div className='d-flex flex-stack flex-wrap gap-3 fs-base fw-semibold mb-8'>
//         <p className='text-danger'>{error}</p>
//         {/* <div /> */}

//         {/* begin::Link */}
//         <Link to='/auth/forgot-password' className='link-primary'>
//           Forgot Password ?
//         </Link>
//         {/* end::Link */}
//       </div>
//       {/* end::Wrapper */}

//       {/* begin::Action */}
//       <div className='d-grid mb-10'>
//         <button
//           type='submit'
//           id='kt_sign_in_submit'
//           className='btn btn-primary'
//           disabled={formik.isSubmitting || !formik.isValid}
//         >
//           <span className='indicator-label'>Login</span>
//           {/* {!loading && <span className='indicator-label'>Login</span>}
//           {loading && (
//             <span className='indicator-progress' style={{ display: 'block' }}>
//               Please wait...
//               <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
//             </span>
//           )} */}
//         </button>
//       </div>
//       {/* end::Action */}
//     </form>
//   )
// }


// import React, { useState } from 'react';
// import { useFormik } from 'formik';
// import * as Yup from 'yup';
// import { Visibility, VisibilityOff } from '@mui/icons-material';
// import { IconButton, TextField } from '@mui/material';
// import { Link } from 'react-router-dom';
// import { login } from '../core/_requests';
// import { useAuth } from '../core/Auth';
// import './Login.css';
// import { FileText, Brain, Users, Zap, Eye, Download, Settings } from 'lucide-react';
// import ThemeColorDropdown from '../../LandingPage/ThemeColourDropDown';
// import Card from '@mui/material';
// import CardContent from '@mui/material';
// import BASEURL from '../../../config/baseurl';
// import request, { gql } from 'graphql-request';
// const loginSchema = Yup.object().shape({
//   email: Yup.string().email('Invalid email format').required('Email is required'),
//   password: Yup.string().required('Password is required')
// });

// const initialValues = {
//   email: 'admin@admin.com',
//   password: 'admin@123'
// };

// const get_user_tenant = gql`
//   query userTenant($username: String!){
//   userTenant(username: $username){
//     id
//     username
//     email
//     tenant{
//       schemaName
//       name
//     }
//   }
// }`
// export function Login() {
//   const [showPassword, setShowPassword] = useState(false);
//   const [error, setError] = useState('');
//   const { saveAuth, setCurrentUser } = useAuth();

//   const togglePassword = () => setShowPassword(!showPassword);

//   const formik = useFormik({
//     initialValues,
//     validationSchema: loginSchema,
//     onSubmit: async (values, { setStatus, setSubmitting }) => {
//       try {
//         const { data: auth } = await login(values.email, values.password);
//         saveAuth(auth);

//         if (auth.data.tokenAuth === null) {
//           setError(auth.errors[0].message);
//           return;
//         }

//         const token = auth.data.tokenAuth.token;
//         const user = auth.data.tokenAuth.user;
//         const username = auth.data.tokenAuth.user.username
//         localStorage.setItem('Token', token)
//         localStorage.setItem('userDetails', JSON.stringify(user));
//         // const {data: user} = await getUserByToken(auth.api_token)
//         request(`${BASEURL}graphql/`, get_user_tenant, { username: username }, { Authorization: `Bearer ${token}` }).then((res: any) => {
//           console.log("get user tenant", res, res.userTenant.tenant.schemaName);
//           localStorage.setItem('Schema', res.userTenant.tenant.schemaName);
//           localStorage.setItem('TenantName', res.userTenant.tenant.name);  
//         })
//         localStorage.setItem('Token', token);
//         localStorage.setItem('UserGlobal', user);
//         localStorage.setItem('userDetails', JSON.stringify(user));

//         setCurrentUser(user);
//       } catch (err) {
//         saveAuth(undefined);
//         setStatus('The login details are incorrect');
//         setSubmitting(false);
//         setError('Login failed. Please try again.');
//       }
//     }
//   });

//   return (
//     <div className="app-container">
//       <header className="app-header">
//         <img
//           src="/media/Aavanamlogo.jpg"
//           alt="Aavanam Logo"
//           className="logo-image"
//         />
//         <div style={{margin:"0px 1000px 10px"}}>
//           <ThemeColorDropdown/>
//         </div>
//       </header>
//       {/* <Card>
//         <CardContent>

//         </CardContent>
//         <p>Hi testing card</p>
//       </Card> */}
//       <div className="login-full-page">
//         <header className="login-header">
//           <div className="login-logo">
//             <FileText color="white" size={32} style={{ marginTop: '17px', marginLeft: '6px' }} />
//             <Brain className="text-white" size={15} />
//           </div>
//           <h1 className="title">Aavanam Document Extraction</h1>
//           <p className="description">
//             Transform your legacy contractual documents with AI-powered extraction. Extract, review, and migrate key fields seamlessly.
//           </p>
//           <div className="features">
//             <div className="feature">
//               <FileText color="blue" size={24} />
//               <span>Document Viewer</span>
//             </div>
//             <div className="feature">
//               <Brain color="purple" size={24} />
//               <span>AI Extraction</span>
//             </div>
//             <div className="feature">
//               <Users color="green" size={24} />
//               <span>Multi-tenant</span>
//             </div>
//           </div>
//         </header>

//         <main className="login-main">
//           <div className="login-card">
//             <form onSubmit={formik.handleSubmit} className="login-form">
//               <h2 className="form-title">Welcome!</h2>
//               <p className="form-subtext">Sign in to your Aavanam account</p>

//               <TextField
//                 fullWidth
//                 label="Email"
//                 variant="outlined"
//                 {...formik.getFieldProps('email')}
//                 error={formik.touched.email && Boolean(formik.errors.email)}
//                 helperText={formik.touched.email && formik.errors.email}
//               />

//               <TextField
//                 fullWidth
//                 label="Password"
//                 variant="outlined"
//                 type={showPassword ? 'text' : 'password'}
//                 {...formik.getFieldProps('password')}
//                 error={formik.touched.password && Boolean(formik.errors.password)}
//                 helperText={formik.touched.password && formik.errors.password}
//                 InputProps={{
//                   endAdornment: (
//                     <IconButton onClick={togglePassword}>
//                       {showPassword ? <Visibility /> : <VisibilityOff />}
//                     </IconButton>
//                   )
//                 }}
//               />

//               {error && <p className="text-danger">{error}</p>}

//               <div style={{ textAlign: 'right', width: '100%' }}>
//                 <Link to="/auth/forgot-password" style={{color:"#582fcf"}}>
//                   Forgot Password?
//                 </Link>
//               </div>

//               <button type="submit" className="form-button">
//                 Sign In
//               </button>
//             </form>
//           </div>
//         </main>

//         <section className="login-footer">
//           <div className="footer-card">
//             <Zap color="orange" size={24} />
//             <div>
//               <strong>AI-Powered Extraction</strong>
//               <br />ZUVA, Aavanam Text & Table AI
//             </div>
//           </div>
//           <div className="footer-card">
//             <Eye color="blue" size={24} />
//             <div>
//               <strong>Document Viewer</strong>
//               <br />Highlighted content with editable fields
//             </div>
//           </div>
//           <div className="footer-card">
//             <Download color="green" size={24} />
//             <div>
//               <strong>CSV Export</strong>
//               <br />Ready for CLM product migration
//             </div>
//           </div>
//           <div className="footer-card">
//             <Settings color="purple" size={24} />
//             <div>
//               <strong>User Management</strong>
//               <br />Reviewers and supervisors workflow
//             </div>
//           </div>
//         </section>

//         <footer className="login-copyright">
//           © 2024 Aavanam Document Extraction. All rights reserved.
//         </footer>
//       </div>
//     </div>
//   );
// }

import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { IconButton, TextField } from '@mui/material';
import { Link } from 'react-router-dom';
import { login } from '../core/_requests';
import { useAuth } from '../core/Auth';
import './Login.css';
import { FileText, Brain, Users, Zap, Eye, Download, Settings } from 'lucide-react';
import ThemeColorDropdown from '../../LandingPage/ThemeColourDropDown';
import Card from '@mui/material';
import CardContent from '@mui/material';
import request, { gql } from 'graphql-request';
import BASEURL from '../../../config/baseurl';


const loginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email format').required('Email is required'),
  password: Yup.string().required('Password is required')
});

const get_user_tenant = gql`
  query userTenant($username: String!){
  userTenant(username: $username){
    id
    username
    email
    tenant{
      schemaName
      name
    }
  }
}`

const initialValues = {
  email: 'admin@admin.com',
  password: 'admin@123'
};

export function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { saveAuth, setCurrentUser } = useAuth();

  const togglePassword = () => setShowPassword(!showPassword);

  const formik = useFormik({
    initialValues,
    validationSchema: loginSchema,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      try {
        const { data: auth } = await login(values.email, values.password);
        saveAuth(auth);

        if (auth.data.tokenAuth === null) {
          setError(auth.errors[0].message);
          return;
        }

        const Token = auth.data.tokenAuth.token
        const user = auth.data.tokenAuth.user
        const username = auth.data.tokenAuth.user.username

        localStorage.setItem('Token', Token);
        localStorage.setItem('UserGlobal', user);
        localStorage.setItem('userDetails', JSON.stringify(user));

        request(`${BASEURL}graphql/`, get_user_tenant, { username: username }, { Authorization: `Bearer ${Token}` }).then((res: any) => {
          console.log("get user tenant", res, res.userTenant.tenant.schemaName);
          localStorage.removeItem('Schema')
          localStorage.removeItem('TenantName')
          localStorage.setItem('Schema', res.userTenant.tenant.schemaName);
          localStorage.setItem('TenantName', res.userTenant.tenant.name);
        })

        setCurrentUser(user);
      } catch (err) {
        saveAuth(undefined);
        setStatus('The login details are incorrect');
        setSubmitting(false);
        setError('Login failed. Please try again.');
      }
    }
  });

  return (
    <div className="app-container">
      <header className="app-header">
        <img
          src="/media/Aavanamlogo.jpg"
          alt="Aavanam Logo"
          className="logo-image"
        />
        <div style={{ margin: "0px 1000px 10px" }}>
          <ThemeColorDropdown />
        </div>
      </header>
      {/* <Card>
        <CardContent>

        </CardContent>
        <p>Hi testing card</p>
      </Card> */}
      <div className="login-full-page">
        <header className="login-header">
          <div className="login-logo">
            <FileText color="white" size={32} style={{ marginTop: '17px', marginLeft: '6px' }} />
            <Brain className="text-white" size={15} />
          </div>
          <h1 className="title">Aavanam Document Extraction</h1>
          <p className="description">
            Transform your legacy contractual documents with AI-powered extraction. Extract, review, and migrate key fields seamlessly.
          </p>
          <div className="features">
            <div className="feature">
              <FileText color="blue" size={24} />
              <span>Document Viewer</span>
            </div>
            <div className="feature">
              <Brain color="purple" size={24} />
              <span>AI Extraction</span>
            </div>
            <div className="feature">
              <Users color="green" size={24} />
              <span>Multi-tenant</span>
            </div>
          </div>
        </header>

        <main className="login-main">
          <div className="login-card">
            <form onSubmit={formik.handleSubmit} className="login-form">
              <h2 className="form-title">Welcome!</h2>
              <p className="form-subtext">Sign in to your Aavanam account</p>

              <TextField
                fullWidth
                label="Email"
                variant="outlined"
                {...formik.getFieldProps('email')}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
              />

              <TextField
                fullWidth
                label="Password"
                variant="outlined"
                type={showPassword ? 'text' : 'password'}
                {...formik.getFieldProps('password')}
                error={formik.touched.password && Boolean(formik.errors.password)}
                helperText={formik.touched.password && formik.errors.password}
                InputProps={{
                  endAdornment: (
                    <IconButton onClick={togglePassword}>
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  )
                }}
              />

              {error && <p className="text-danger">{error}</p>}

              <div style={{ textAlign: 'right', width: '100%' }}>
                <Link to="/auth/forgot-password" style={{ color: "#582fcf" }}>
                  Forgot Password?
                </Link>
              </div>

              <button type="submit" className="form-button">
                Sign In
              </button>
            </form>
          </div>
        </main>

        <section className="login-footer">
          <div className="footer-card">
            <Zap color="orange" size={24} />
            <div>
              <strong>AI-Powered Extraction</strong>
              <br />ZUVA, Aavanam Text & Table AI
            </div>
          </div>
          <div className="footer-card">
            <Eye color="blue" size={24} />
            <div>
              <strong>Document Viewer</strong>
              <br />Highlighted content with editable fields
            </div>
          </div>
          <div className="footer-card">
            <Download color="green" size={24} />
            <div>
              <strong>CSV Export</strong>
              <br />Ready for CLM product migration
            </div>
          </div>
          <div className="footer-card">
            <Settings color="purple" size={24} />
            <div>
              <strong>User Management</strong>
              <br />Reviewers and supervisors workflow
            </div>
          </div>
        </section>

        <footer className="login-copyright">
          © 2024 Aavanam Document Extraction. All rights reserved.
        </footer>
      </div>
    </div>
  );
}
