/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { FC } from 'react'
import { useNavigate } from 'react-router-dom';

type Props = {
    paymentMethod?: any
}

const PaymentMethod: FC<Props> = ({ paymentMethod }) => {
    console.log("paymentMethod-titel", paymentMethod.node.paymentMethod);

    const nav = useNavigate();
    const openTable = () => {
        // setItemIdForUpdate(id)
        nav("/document-management/document/" + paymentMethod.node.id);

    }
    return (
        <div className='d-flex align-items-center'>

            <div className='d-flex flex-column'>
                <a href='#' onClick={openTable} className='text-gray-800 text-hover-primary mb-1'>
                    {paymentMethod.node.paymentMethod}
                </a>

            </div>
        </div>
    )
}


export { PaymentMethod }
