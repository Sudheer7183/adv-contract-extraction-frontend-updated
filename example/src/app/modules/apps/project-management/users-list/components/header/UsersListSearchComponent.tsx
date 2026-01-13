/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import { initialQueryState, KTIcon, useDebounce } from '../../../../../../../_metronic/helpers'
import { useQueryRequest } from '../../core/QueryRequestProvider'
import { useListView } from '../../core/ListViewProvider'

const UsersListSearchComponent = () => {
  const { updateState } = useQueryRequest()
  const [searchTerm, setSearchTerm] = useState<string>('')
  const { setProjectSearchValue } = useListView()
  // Debounce search term so that it only gives us latest value ...
  // ... if searchTerm has not been updated within last 500ms.
  // The goal is to only have the API call fire when user stops typing ...
  // ... so that we aren't hitting our API rapidly.
  const debouncedSearchTerm = useDebounce(searchTerm, 150)
  // Effect for API call
  useEffect(
    () => {
      if (debouncedSearchTerm !== undefined && searchTerm !== undefined) {
        updateState({ search: debouncedSearchTerm, ...initialQueryState })
        setProjectSearchValue?.(searchTerm)
      }
    },
    [debouncedSearchTerm] // Only call effect if debounced search term changes
    // More details about useDebounce: https://usehooks.com/useDebounce/
  )

  return (
    <div className='card-title'>
      {/* begin::Search */}
      <div className='d-flex align-items-center position-relative my-1'>
        <KTIcon iconName='magnifier' className='fs-1 position-absolute ms-6' />
        <input
          type='text'
          data-kt-user-table-filter='search'
          className='form-control form-control-solid w-250px ps-14'
          placeholder='Search project'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '40px',
            height: '40px',
            border: '1px solid #6c757d',
            borderRadius: '5px',

          }}
        />
      </div>
      {/* end::Search */}
    </div>
  )
}

export { UsersListSearchComponent }
