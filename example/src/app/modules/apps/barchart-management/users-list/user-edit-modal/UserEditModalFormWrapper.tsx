import React from 'react';
import { useListView } from '../core/ListViewProvider'
import AssignContractType from '../components/header/AssignContractType';
import AssignReviewer from '../components/header/AssignReviewer';

const UserEditModalFormWrapper = () => {
  const { userAssign, contractAssign } = useListView()

  if (userAssign) {
    return <AssignReviewer />
  }

  if (contractAssign) {
    return <AssignContractType />
  }

  return null
}

export { UserEditModalFormWrapper }
