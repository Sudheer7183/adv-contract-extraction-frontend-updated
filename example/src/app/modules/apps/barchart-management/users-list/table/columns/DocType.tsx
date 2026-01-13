import React, { FC } from 'react'

type Props = {
    docType?: any
}

const DocType: FC<Props> = ({ docType }) => (
    <div className='badge badge-light fw-bolder'>{docType?.contractType?.contractTypeName}</div>
)


export { DocType }
