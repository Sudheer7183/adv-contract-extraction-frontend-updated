import React, { FC } from 'react'


type Props = {
    dataStatus?: any
}

const ProjectStatus: FC<Props> = ({ dataStatus }) => {

    return (
        <div className='d-flex align-items-center'>
            <div className='d-flex flex-column'>
                {dataStatus.active == false ? <div className='badge badge-light fw-bolder'>Close</div> :
                    <div className='badge badge-light fw-bolder'>Open</div>
                }
            </div>
        </div>
    )
}


export { ProjectStatus }
