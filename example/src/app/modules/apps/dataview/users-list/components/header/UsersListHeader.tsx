import React from 'react';
import { useListView } from '../../core/ListViewProvider'

import { UsersListGrouping } from './UsersListGrouping'


const UsersListHeader = () => {
  const { selected } = useListView()
  return (
    <div className='card-header border-0'>
      <div className='card-toolbar'>
        {/* begin::Group actions */}
        {selected.length > 0 ? <UsersListGrouping /> : <span>Please, select the files to export</span>}
        {/* end::Group actions */}
      </div>
      {/* end::Card toolbar */}
    </div>
  )
}

export { UsersListHeader }
