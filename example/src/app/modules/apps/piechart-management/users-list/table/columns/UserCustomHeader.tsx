import clsx from 'clsx'
import React, { FC, PropsWithChildren, useMemo } from 'react'
import { HeaderProps } from 'react-table'
import { initialQueryState } from '../../../../../../../_metronic/helpers'
import { useQueryRequest } from '../../core/QueryRequestProvider'
import { User } from '../../core/_models'
import { useListView } from '../../core/ListViewProvider'

type Props = {
  className?: string
  title?: string
  tableProps: PropsWithChildren<HeaderProps<User>>
}
const UserCustomHeader: FC<Props> = ({ className, title, tableProps }) => {
  const id = tableProps.column.id
  const { state, updateState } = useQueryRequest()
  const { setPieFileSort, setPieFileOrder } = useListView()

  const isSelectedForSorting = useMemo(() => {
    return state.sort && state.sort === id
  }, [state, id])
  const order: 'asc' | 'desc' | undefined = useMemo(() => state.order, [state])

  const sortColumn = () => {
    // avoid sorting for these columns
    if (id === 'actions' || id === 'selection') {
      return
    }

    if (!isSelectedForSorting) {
      // enable sort asc
      setPieFileSort(id)
      setPieFileOrder("asc")
      updateState({ sort: id, order: 'asc', ...initialQueryState })
      return
    }

    if (isSelectedForSorting && order !== undefined) {
      if (order === 'asc') {
        // enable sort desc
        setPieFileSort(id)
        setPieFileOrder("desc")
        updateState({ sort: id, order: 'desc', ...initialQueryState })
        return
      }

      // disable sort
      setPieFileSort("")
      setPieFileOrder("")
      updateState({ sort: undefined, order: undefined, ...initialQueryState })
    }
  }

  return (
    <th
      {...tableProps.column.getHeaderProps()}
      className={clsx(
        className,
        isSelectedForSorting && order !== undefined && `table-sort-${order}`
      )}
      style={{ cursor: 'pointer' }}
      onClick={sortColumn}
    >
      {title}
    </th>
  )
}

export { UserCustomHeader }
