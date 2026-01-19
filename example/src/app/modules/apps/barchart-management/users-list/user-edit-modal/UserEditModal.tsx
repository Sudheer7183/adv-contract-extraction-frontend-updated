import React, { useEffect } from 'react'
import { UserEditModalHeader } from './UserEditModalHeader'
import { UserEditModalFormWrapper } from './UserEditModalFormWrapper'
import { useListView } from '../core/ListViewProvider';

const UserEditModal = () => {
  const { userAssign, contractAssign } = useListView();
  const modalContentStyle = (userAssign || contractAssign) ? {
    width: '500px',
    height: '160px',
    marginLeft: '50px',
  } : null;

  const modalBodyStyle = (userAssign || contractAssign) ? {
    height: '90px',
    marginTop: '-10px',
  } : null;

  useEffect(() => {
    document.body.classList.add('modal-open')
    return () => {
      document.body.classList.remove('modal-open')
    }
  }, [])

  return (
    <>
      <div
        className='modal fade show d-block'
        id='kt_modal_add_user'
        role='dialog'
        tabIndex={-1}
        aria-modal='true'
      >
        {userAssign || contractAssign ? (
          <div className='modal-dialog modal-dialog-centered mw-650px'>
            <div className='modal-content' style={modalContentStyle}>
              <UserEditModalHeader />
              <div className='modal-body' style={modalBodyStyle}>
                <UserEditModalFormWrapper />
              </div>
            </div>
          </div>
        ) : (
          <div className='modal-dialog modal-dialog-centered mw-650px'>
            <div className='modal-content' style={modalContentStyle}>
              <UserEditModalHeader />
              <div className='modal-body mx-5 mx-xl-15 my-7' style={{ height: '350px' }}>
                <UserEditModalFormWrapper />
              </div>
            </div>
          </div>)}
      </div>
      {/* begin::Modal Backdrop */}
      <div className='modal-backdrop fade show'></div>
      {/* end::Modal Backdrop */}
    </>
  )
}

export { UserEditModal }
