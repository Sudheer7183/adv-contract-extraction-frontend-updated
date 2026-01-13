// @ts-nocheck
import clsx from 'clsx'
import React, { FC } from 'react'
import { Row } from 'react-table'
import { User } from '../../core/_models'
import ServiceDetail from '../../../ServiceDetail'
import { useListView } from '../../core/ListViewProvider'
import ServiceDetailAWS from '../../../ServiceDetailAWS'

type Props = {
  row: Row<User>
}

const CustomRow: FC<Props> = ({ row }) => {
  const { Expand } = useListView()
  console.log("Servicessssss", row.original)
  return (
    <>
      <tr {...row.getRowProps()}>
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
      </tr><tr tr {...row.getRowProps()}>
        {row.original.id === Expand && row.original.service.serviceName != "AWS Textract" ? (
          <>
            <td colspan="4">

              <ServiceDetail
                servicedetail={row.original} />
            </td>
          </>
        )
          : row.original.id === Expand && row.original.service.serviceName === "AWS Textract" ? (
            <>
              <td colspan="4">

                <ServiceDetailAWS
                  servicedetail={row.original} />
              </td>
            </>
          ) : null}

      </tr>
    </>
  )
}

export { CustomRow }
