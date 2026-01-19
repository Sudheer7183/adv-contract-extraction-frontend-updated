/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { FC, useEffect, useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { MenuComponent } from '../../../../../../../_metronic/assets/ts/components'
import { ID, KTIcon, QUERIES } from '../../../../../../../_metronic/helpers'
import { useListView } from '../../core/ListViewProvider'
import { useQueryResponse } from '../../core/QueryResponseProvider'
import { deleteUser } from '../../core/_requests'
import { gql } from 'graphql-request'
import axios from 'axios'
import { Variable } from 'lucide-react'
import BASEURL from '../../../../../../config/baseurl'
type Props = {
  id: ID
}

// const ApproveUser = gql`
// mutation CreateAdminUser($input: UsersInputAdmin!) {
//   createAdminUser(input: $input) {
//     users {
//       email
//       username
//       firstName
//       lastName
//       role
//       isActive
//       companyName
      
//     }
//   }
// }
// `

const ApproveUser = gql`
mutation CreateAdminUser(
  $email: String!
  $username: String!
  $firstname: String!
  $lastname: String!
  $companyname: String!
  $active: Boolean!
) {
  createAdminUser(
    input: {
      email: $email
      username: $username
      firstname: $firstname
      lastname: $lastname
      companyname: $companyname
      active: $active
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

const SignupUpdateDetails = gql`
mutation SingupDetailsUpdate($input:SignUpUpdateInput!){
  singupDetailsUpdate(input:$input){
    Details{
      status
    }
  }
}
`

const popupOverlayStyle = {
  position: "fixed" as const,
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0,0,0,0.4)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000,
};

const popupBoxStyle = {
  backgroundColor: "#fff",
  padding: "30px",
  borderRadius: "12px",
  boxShadow: "0 6px 20px rgba(0,0,0,0.2)",
  maxWidth: "400px",
  textAlign: "center" as const,
};

  const buttonStyle = {
    backgroundColor: "var(--accent)",
    color: "#ffffff",
    padding: "10px 24px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: 600,
    marginTop: "20px",
  };

const UserActionsCell: FC<Props> = ({ id }) => {
  
  const { setItemIdForUpdate } = useListView()
  const { query } = useQueryResponse()
  const queryClient = useQueryClient()
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const url = `${BASEURL}graphql/`
  const [message,setmessage] = useState("")
  const [message2,setmessage2] = useState("")
  
  const Allvalues = id
  console.log('id values at start',Allvalues);
  useEffect(() => {
    MenuComponent.reinitialization()
  }, [])

  const openEditModal = () => {
    console.log('i am openedit modal',id)
    setItemIdForUpdate(id)
  }

  const deleteItem = useMutation({ mutationFn: () => deleteUser(id),
    // 💡 response of the mutation is passed to onSuccess
    onSuccess: () => {
      // ✅ update detail view directly
      queryClient.invalidateQueries([`${QUERIES.USERS_LIST}-${query}`])
    },
  })

  const ApproveModal= ()=>{
    console.log('i have been selected ',id)
    const data = id
    console.log('i have been selected',data.companyName);

    const variables = {
      email: data.email,
      username: data.fullName,
      firstname: '',
      lastname: '',
      companyname: data.companyName,
      active: true
    }

    // const Variables ={
    //   input:{
    //     email:data.email,
    //     username:data.fullName,
    //     active:true,
    //     companyName:data.companyName
    //   }
    // }
    
    axios.post(url,{query:ApproveUser,variables:variables},{
      headers:{
        'content-type':'application/json',

      },
    }).then((response:any)=>{
      console.log(response.data);
      // const val = Object.keys(response?.data?.createAdminUser?.users).length
      // console.log('value of length',val);
      
      if (response.data) {
      console.log('succesfully created the tenant');
      console.log('id value',id)
      axios.post(url,{query:SignupUpdateDetails ,variables:{input:{id:data.id,status:"Approved"}}},{
        headers:{
        'content-type':'application/json',

      },
      }).then((res:any)=>{
        console.log(res.data);
        console.log('sucessfully update the user values in signup details to update');
        
        setmessage("🎉 User Approval Successful")
        setmessage2("User has been successfully Created!.")
        setShowSuccessPopup(true)
        
      }).catch((Error)=>{
        console.log('cannot update the values in the signup details table',Error);
        
      })
    }
    }).catch((error)=>{
      console.log('error occured while creating tenant and user',{error});
      
    })
    
  }

  const RejectModal = () =>{
    console.log('I am reject model and i have been selected',id)
    const data = id
    axios.post(url,{query:SignupUpdateDetails ,variables:{input:{id:data.id,status:"Rejected"}}},{
        headers:{
        'content-type':'application/json',

      },
      }).then((res:any)=>{
        console.log(res.data);
        console.log('sucessfully update the user values in signup details to update');
        
        setmessage("🎉 User Rejection Successful")
        setmessage2("User has been successfully Rejected!.")
        setShowSuccessPopup(true)
      }).catch((Error)=>{
        console.log('cannot update the values in the signup details table',Error);
        
      })

  }

  return (
    <>
      <a
        href='#'
        className='btn btn-light btn-active-light-primary btn-sm'
        data-kt-menu-trigger='click'
        data-kt-menu-placement='bottom-end'
      >
        Select
        <KTIcon iconName='down' className='fs-5 m-0' />
      </a>
      {/* begin::Menu */}
      <div
        className='menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg-light-primary fw-bold fs-7 w-125px py-4'
        data-kt-menu='true'
      >
        {/* begin::Menu item */}
      <div className='menu-item px-3'>
        {Allvalues.status === "pending" ? (
          <>
            <a className='menu-link px-3' onClick={ApproveModal}>Approve</a>
            <a className='menu-link px-3' onClick={RejectModal}>Reject</a>
          </>
        ) : Allvalues.status === "Approved" ? (
          <a className='menu-link px-3' onClick={openEditModal}>Edit</a>
        ) : null}
      </div>
      </div>
      
      {showSuccessPopup && (
        <div style={popupOverlayStyle}>
          <div style={popupBoxStyle}>
            <h3 style={{ marginBottom: "12px", fontSize: "18px", color: "#1f2937" }}>{message}</h3>
            <p style={{ marginBottom: "16px", fontSize: "15px", color: "#4b5563" }}>
              {message2}
            </p>
            <button onClick={() => setShowSuccessPopup(false)} style={buttonStyle}>
              Close
            </button>
          </div>
        </div>
      )}
      {/* end::Menu */}
    </>
  )
}

export { UserActionsCell }


