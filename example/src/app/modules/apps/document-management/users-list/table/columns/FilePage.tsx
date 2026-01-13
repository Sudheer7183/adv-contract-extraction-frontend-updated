import React, { FC } from 'react'
import { useAuth } from '../../../../../auth'


type Props = {
    filePages?: any
}

const FilePages: FC<Props> = ({ filePages }) => {
    const { currentUser } = useAuth()
    let Role = currentUser?.role
    return (
        <div className='badge badge-light fw-bolder'>
            {(Role === "Admin" || Role === "Manager") ? filePages?.pages : filePages?.file?.pages}
        </div>
    )
}


export { FilePages }
