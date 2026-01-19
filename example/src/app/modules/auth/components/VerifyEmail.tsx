import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import request, { gql } from 'graphql-request';
import BASEURL from '../../../config/baseurl';
import axios from 'axios';


const VERIFY_EMAIL = gql`
  mutation VerifyEmail($user_id: Int!, $email: String!) {
    verifyEmail(userId: $user_id, email: $email) {
      success
    }
  }
`;


const PASSWORD_RESET_REQUEST = gql`
  mutation ResetRequest(
    $email:String!
  ){
    sendPasswordResetEmail(email:$email){
      success
      errors
    }
  }`

export function VerifyEmail() {
    const { email, timestamp, id } = useParams();
    const [hasErrors, setHasErrors] = useState<boolean | undefined>(undefined)
    const [error, setError] = useState("");
    console.log("email verfication, timestamp", email, timestamp, id);

    useEffect(() => {
        const currentTimestamp = Math.floor(new Date().getTime() / 1000); // Current timestamp in seconds

        if (currentTimestamp > Number(timestamp)) {
            setError("The verification link has expired. Please request a new one.");
            setHasErrors(true);
            return;
        }
        request(`${BASEURL}graphql/`, VERIFY_EMAIL, {
            user_id: id,
            email: email,
        }, {Authorization: `Bearer ${localStorage.getItem('Token')}`})
            .then((response: any) => {
                console.log("response in verify email", response);
                if (response.verifyEmail.success) {
                    setHasErrors(false)
                    request(`${BASEURL}graphql/`, PASSWORD_RESET_REQUEST, { email: email }, {Authorization: `Bearer ${localStorage.getItem('Token')}`}).then((response: any) => {
                        console.log("reset res", response);
                        if (response.sendPasswordResetEmail.success) {
                            setHasErrors(false)
                        }
                        else {
                            setError(response.sendPasswordResetEmail.errors.email[0].message);
                            setHasErrors(true)
                        }
                    })
                }
            })
            .catch((error) => {
                console.log(error)
                setError("Invalid Email");
                setHasErrors(true)
            });
    })

    const handleEmail = (event: any) => {
        event.preventDefault()
        const url = `${BASEURL}verifyemail/${email}/`;
        axios.get(url, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('Token')}`
            }
        }).then((response: any) => {
            console.log(response);
        }).catch((error: any) => {
            console.log("Error Message", error)
        });
    }


    return (
        <div style={{ textAlign: "center" }}>
            {hasErrors === true && (
                <>
                    <div className='mb-lg-15 alert alert-danger'>
                        <div className='alert-text font-weight-bold'>
                            {error}
                        </div>
                    </div>
                    <div className='d-grid mb-10'>
                        <button
                            type='submit'
                            id='kt_sign_in_submit'
                            className='btn btn-primary'
                            onClick={handleEmail}
                        >
                            <span className='indicator-label'>Resend Email</span>
                        </button>
                    </div>
                </>
            )}

            {hasErrors === false && (
                <>
                    <span className="svg-icon svg-icon-success svg-icon-4x ">
                        <svg xmlns="http://www.w3.org/2000/svg" width="54px" height="54px" viewBox="0 0 24 24" version="1.1">
                            <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                                <polygon points="0 0 24 0 24 24 0 24" />
                                <path d="M6.26193932,17.6476484 C5.90425297,18.0684559 5.27315905,18.1196257 4.85235158,17.7619393 C4.43154411,17.404253 4.38037434,16.773159 4.73806068,16.3523516 L13.2380607,6.35235158 C13.6013618,5.92493855 14.2451015,5.87991302 14.6643638,6.25259068 L19.1643638,10.2525907 C19.5771466,10.6195087 19.6143273,11.2515811 19.2474093,11.6643638 C18.8804913,12.0771466 18.2484189,12.1143273 17.8356362,11.7474093 L14.0997854,8.42665306 L6.26193932,17.6476484 Z" fill="#000000" fill-rule="nonzero" transform="translate(11.999995, 12.000002) rotate(-180.000000) translate(-11.999995, -12.000002) " />
                            </g>
                        </svg>
                    </span>
                    <h4 className='text-primary'>
                        Your E-mail has been Verified!
                    </h4><br />
                    <div className='mb-10 bg-light-info p-8 rounded'>
                        <div className='text-info'>Please check your email to set your new Password</div>
                    </div>
                </>
            )}
        </div>
    );
}
