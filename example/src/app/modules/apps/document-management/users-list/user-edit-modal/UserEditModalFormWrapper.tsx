import React from 'react';
import { useListView } from '../core/ListViewProvider'
import UploadFormContract from './UploadFormContract';
import AssignReviewer from '../components/header/AssignReviewer';
import AssignContractType from '../components/header/AssignContractType';

const UserEditModalFormWrapper = () => {
  const { fileUpload, projectid, userAssign, contractAssign } = useListView()


  console.log("file upload popup --->", fileUpload, projectid);


  if (fileUpload) {
    return <UploadFormContract id={projectid} />
  }

  if (userAssign) {
    return <AssignReviewer />
  }


  if (contractAssign) {
    return <AssignContractType />
  }


  return null
}

export { UserEditModalFormWrapper }
