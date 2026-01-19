import React, { useEffect, useState } from 'react';
import { KTIcon } from '../../../../../../_metronic/helpers'
import { useListView } from '../core/ListViewProvider'

const UserEditModalHeader = () => {
  const { fileUpload,
    setFileUpload,
    userAssign,
    setUserAssign,
    contractAssign,
    setContractAssign,
    selected,
    setSelected,
  } = useListView()
  const [temporarySelected, setTemporarySelected] = useState<any[]>([]);

  useEffect(() => {
    setTemporarySelected(selected)
  }, [selected])


  const handleCloseForm = () => {
    if (userAssign) {
      setUserAssign(false)
      setSelected([])
    } else if (contractAssign) {
      setContractAssign(false)
      setSelected([])
    }
  }

  const handleGoBack = () => {
    setSelected([...temporarySelected]);
    if (userAssign) {
      setUserAssign(false)
    } else if (contractAssign) {
      setContractAssign(false)
    }
  }

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
          <h2 className='fw-bolder text-light fs-1 text-center w-100'>Assign Reviewer</h2>
        </div>
      }
      {contractAssign &&
        <div className={headertheme}>
          <h2 className='fw-bolder text-light fs-1 text-center w-100'>Assign Contract Type</h2>
        </div>
      }
    </div>
  )
}

export { UserEditModalHeader }
