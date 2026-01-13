import React from 'react';
import { useListView } from '../../core/ListViewProvider'
import { useAuth } from '../../../../../auth';
import Swal from 'sweetalert2';
import { FaUser, FaFileContract } from "react-icons/fa";

const UsersListToolbar = () => {
  const { currentUser } = useAuth()
  const Role = currentUser?.role
  const UserName = currentUser?.username;

  const { selected, setUserAssign, setContractAssign } = useListView()
  const openAssignContracttype = () => {
    if (selected.length === 0) {
      Swal.fire({
        title: `Hello ${UserName || 'User'}`,
        text: 'Select the files first to perform the desired operation.',
        icon: 'warning', // You can customize the icon
      });
      // alert("Select the files first to perform the desired operation.")
    } else {
      setContractAssign(true)
    }
  }

  const openAssignUser = () => {
    if (selected.length === 0) {
      Swal.fire({
        title: `Hello ${UserName || 'User'}`,
        text: 'Select the files first to perform the desired operation.',
        icon: 'warning', // You can customize the icon
      });
      // alert("Select the files first to perform the desired operation.")
    } else {
      setUserAssign(true)
    }
  }

  const color = localStorage.getItem("themeColor")
  const themec = color != null ? color + " " + 'btn' : 'p-3 bg-primary text-white btn'
  console.log("themec", themec);


  return (
    <div className='d-flex justify-content-end' data-kt-user-table-toolbar='base'>
      {(Role === "Admin" || Role === "Manager") ?
        <button type='button' className={themec} onClick={openAssignContracttype} title='Assign Contract type'>
          <FaFileContract />
        </button> : null
      }&nbsp;&nbsp;


      {(Role === "Admin" || Role === "Manager") ?
        <button type='button' className={themec} onClick={openAssignUser} title='Assign Reviewer'>
          <FaUser />
        </button> : null
      }
    </div>
  )
}

export { UsersListToolbar }
