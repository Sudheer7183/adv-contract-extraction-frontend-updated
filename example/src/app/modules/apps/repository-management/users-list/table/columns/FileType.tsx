import React, { FC } from 'react'


type Props = {
    fileType?: any
}


const FileType: FC<Props> = ({ fileType }) => (
    <div className='badge badge-light fw-bolder'>{fileType.fileType}</div>
)


export { FileType }
