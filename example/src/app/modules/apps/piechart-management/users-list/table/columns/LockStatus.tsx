import React, { FC } from 'react'


type Props = {
    lockStatus?: any
}


const LockStatus: FC<Props> = ({ lockStatus }) => {
    if (!lockStatus.lockedBy) {
        return <i className="bi bi-unlock d-block mx-auto"></i>;
    }

    return (
        <div className='badge badge-light fw-bolder text-center'>{lockStatus.lockedBy.username}</div>
    );
}


export { LockStatus }
