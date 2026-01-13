import React, { FC } from 'react'
import { useAuth } from '../../../../../auth'


type Props = {
    data?: any
}

const Language: FC<Props> = ({ data }) => {
    const { currentUser } = useAuth()
    let Role = currentUser?.role
    return (
        <div className='badge badge-light fw-bolder'>
            {(Role === "Admin" || Role === "Manager") ? data?.language : data?.file?.language}
        </div>
    )
}

export { Language }
