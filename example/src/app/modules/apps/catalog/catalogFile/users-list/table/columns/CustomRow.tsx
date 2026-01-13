// @ts-nocheck
import clsx from 'clsx'
import React, { FC } from 'react'
import { Row } from 'react-table'
import { User } from '../../core/_models'
import { useListView } from '../../core/ListViewProvider1'
import CatalogDetail from '../../../../../catalog-management/users-list/table/catalogType/CatalogDetail'

// import DataView1 from '../../../DataView'


type Props = {
  row: Row<User>
}

const CustomRow: FC<Props> = ({ row }) => {
  const { Expand } = useListView()
  console.log("rowss->", Expand, row.original);

  return (
    <>
      <tr  {...row.getRowProps()}>
        {row.cells.map((cell) => {
          return (
            <td
              {...cell.getCellProps()}
              className={clsx({ 'text-center min-w-100px': cell.column.id === 'actions' })}
            >
              {cell.render('Cell')}
            </td>
          )
        })}

      </tr>
      <tr tr {...row.getRowProps()}>
        {
          row.original.id == Expand ? (
            <>

              <td colspan="4">
                <CatalogDetail
                  // catalogid={row.original.catalogId}
                  catalogfields={row.original.catalogdetail}
                />
              </td>
            </>
          ) : null
        }

      </tr >




    </>

  )
}

export { CustomRow }
