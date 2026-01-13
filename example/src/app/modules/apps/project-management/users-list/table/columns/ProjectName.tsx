/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { FC } from 'react'
import { useNavigate } from 'react-router-dom';

type Props = {
    data?: any
}

const ProjectName: FC<Props> = ({ data }) => {
    console.log("data", data);

    const nav = useNavigate();
    const openTable = () => {
        // setItemIdForUpdate(id)
        nav("/document-management/document/" + data.id);

    }
    return (
        <div className='d-flex align-items-center'>

            <div className='d-flex flex-column'>
                <a href='#' onClick={openTable} className='text-gray-800 text-hover-primary mb-1'>
                    {data.projectName}
                </a>

            </div>
        </div>
    )
}


export { ProjectName }
