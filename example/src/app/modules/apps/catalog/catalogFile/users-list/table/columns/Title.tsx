/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { FC } from 'react'
import { useNavigate } from 'react-router-dom';

type Props = {
    data?: any
}

const Title: FC<Props> = ({ data }) => {
    console.log("data-titel", data.node.doctype);

    const nav = useNavigate();
    const openTable = () => {
        // setItemIdForUpdate(id)
        nav("/document-management/document/" + data.node.id);

    }
    return (
        <div className='d-flex align-items-center'>

            <div className='d-flex flex-column'>
                <a href='#' onClick={openTable} className='text-gray-800 text-hover-primary mb-1'>
                    {data.node.doctype}
                </a>

            </div>
        </div>
    )
}


export { Title }
