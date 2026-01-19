/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { FC } from 'react'
import { useNavigate } from 'react-router-dom';

type Props = {
    governingLaw?: any
}

const GoverningLaw: FC<Props> = ({ governingLaw }) => {
    console.log("governingLaw-titel", governingLaw.node.governingLaw);

    const nav = useNavigate();
    const openTable = () => {
        // setItemIdForUpdate(id)
        nav("/document-management/document/" + governingLaw.node.id);

    }
    return (
        <div className='d-flex align-items-center'>

            <div className='d-flex flex-column'>
                <a href='#' onClick={openTable} className='text-gray-800 text-hover-primary mb-1'>
                    {governingLaw.node.governingLaw}
                </a>

            </div>
        </div>
    )
}


export { GoverningLaw }
