import React, { useEffect, useState } from 'react';
import { KTIcon } from '../../../../../../_metronic/helpers'
import { useListView } from '../core/ListViewProvider'

const UserEditModalHeader = () => {
  const { fileUpload,
    setFileUpload,
    userAssign,
    contractAssign,
    selected,
  } = useListView()

  const color = localStorage.getItem("themeColor")
  const headertheme = color != null ? color + " " + 'modal-header' : 'p-3 modal-header bg-primary text-white'

  return (
    <div>
      {fileUpload &&
        <div className='modal-header'>
          <h2 className='fw-bolder'>Upload File</h2>
          <div
            className='btn btn-icon btn-sm btn-active-icon-primary'
            data-kt-users-modal-action='close'
            onClick={() => setFileUpload(false)}
            style={{ cursor: 'pointer' }}
          >
            <KTIcon iconName='cross' className='fs-1' />
          </div>
        </div>
      }
      {userAssign &&
        <div className={headertheme}>
          {/* <div
            onClick={handleGoBack}
            className='btn btn-icon btn-sm btn-active-icon-light'
          >
            <KTIcon iconName='arrow-left' className='fs-1' />
          </div> */}
          <h2 className='fw-bolder text-light fs-1 text-center w-100'>Assign Reviewer</h2>
          {/* <div
            className='btn btn-icon btn-sm btn-active-icon-light'
            data-kt-users-modal-action='close'
            onClick={() => handleCloseForm()}
            style={{ cursor: 'pointer' }}
          >
            <KTIcon iconName='cross' className='fs-1' />
          </div> */}
        </div>
      }
      {contractAssign &&
        <div className={headertheme}>
          {/* <div
            onClick={handleGoBack}
            className='btn btn-icon btn-sm btn-active-icon-light'
          >
            <KTIcon iconName='arrow-left' className='fs-1' />
          </div> */}
          <h2 className='fw-bolder text-light fs-1 text-center w-100'>Assign Contract Type</h2>
          {/* <div
            className='btn btn-icon btn-sm btn-active-icon-light'
            data-kt-users-modal-action='close'
            onClick={() => handleCloseForm()}
            style={{ cursor: 'pointer' }}
          >
            <KTIcon iconName='cross' className='fs-1' />
          </div> */}
        </div>
      }
    </div>
  )
}

export { UserEditModalHeader }
