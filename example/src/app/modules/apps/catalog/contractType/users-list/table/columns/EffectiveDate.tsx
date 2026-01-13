/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { FC } from 'react'
import { useNavigate } from 'react-router-dom';

type Props = {
    effectiveDate?: any
}

const EffectiveDate: FC<Props> = ({ effectiveDate }) => {
    console.log("effectiveDate-titel", effectiveDate.node.effectiveDate);

    const nav = useNavigate();
    const openTable = () => {
        // setItemIdForUpdate(id)
        nav("/document-management/document/" + effectiveDate.node.id);

    }
    return (
        <div className='d-flex align-items-center'>

            <div className='d-flex flex-column'>
                <a href='#' onClick={openTable} className='text-gray-800 text-hover-primary mb-1'>
                    {effectiveDate.node.effectiveDate}
                </a>

            </div>
        </div>
    )
}


export { EffectiveDate }
