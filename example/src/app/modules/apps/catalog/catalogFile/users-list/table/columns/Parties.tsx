/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { FC } from 'react'
import { useNavigate } from 'react-router-dom';

type Props = {
    parties?: any
}

const Parties: FC<Props> = ({ parties }) => {
    console.log("parties-titel", parties.node.parties);

    const nav = useNavigate();
    const openTable = () => {
        // setItemIdForUpdate(id)
        nav("/document-management/document/" + parties.node.id);

    }
    return (
        <div className='d-flex align-items-center'>

            <div className='d-flex flex-column'>
                <a href='#' onClick={openTable} className='text-gray-800 text-hover-primary mb-1'>
                    {parties.node.parties}
                </a>

            </div>
        </div>
    )
}


export { Parties }
