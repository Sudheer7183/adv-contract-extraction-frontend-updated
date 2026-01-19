/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { FC } from 'react'
import { useNavigate } from 'react-router-dom';

type Props = {
    expirationDate?: any
}

const ExpirationDate: FC<Props> = ({ expirationDate }) => {
    console.log("expirationDate-titel", expirationDate.node.expirationDate);

    const nav = useNavigate();
    const openTable = () => {
        // setItemIdForUpdate(id)
        nav("/document-management/document/" + expirationDate.node.id);

    }
    return (
        <div className='d-flex align-items-center'>

            <div className='d-flex flex-column'>
                <a href='#' onClick={openTable} className='text-gray-800 text-hover-primary mb-1'>
                    {expirationDate.node.expirationDate}
                </a>

            </div>
        </div>
    )
}


export { ExpirationDate }
