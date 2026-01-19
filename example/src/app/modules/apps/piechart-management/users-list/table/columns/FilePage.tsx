import React, { FC } from 'react'


type Props = {
    filePages?: any
}

const FilePages: FC<Props> = ({ filePages }) => (
    <div className='badge badge-light fw-bolder'>{filePages.pages}</div>
)

export { FilePages }
