/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { FC } from 'react'
import { useNavigate } from 'react-router-dom';

type Props = {
    doctype?: any
}

const Doctype: FC<Props> = ({ doctype }) => {
    console.log("doctype-titel", doctype.node.doctype);

    const nav = useNavigate();
    const openTable = () => {
        // setItemIdForUpdate(id)
        nav("/document-management/document/" + doctype.node.id);

    }
    return (
        <div className='d-flex align-items-center'>

            <div className='d-flex flex-column'>
                <a href='#' onClick={openTable} className='text-gray-800 text-hover-primary mb-1'>
                    {doctype.node.doctype}
                </a>

            </div>
        </div>
    )
}


export { Doctype }
