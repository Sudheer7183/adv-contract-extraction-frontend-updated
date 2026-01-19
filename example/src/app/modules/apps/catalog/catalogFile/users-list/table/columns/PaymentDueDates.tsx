/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { FC } from 'react'
import { useNavigate } from 'react-router-dom';

type Props = {
    paymentDueDates?: any
}

const PaymentDueDates: FC<Props> = ({ paymentDueDates }) => {
    console.log("paymentDueDates-titel", paymentDueDates.node.paymentDueDates);

    const nav = useNavigate();
    const openTable = () => {
        // setItemIdForUpdate(id)
        nav("/document-management/document/" + paymentDueDates.node.id);

    }
    return (
        <div className='d-flex align-items-center'>

            <div className='d-flex flex-column'>
                <a href='#' onClick={openTable} className='text-gray-800 text-hover-primary mb-1'>
                    {paymentDueDates.node.paymentDueDates}
                </a>

            </div>
        </div>
    )
}


export { PaymentDueDates }
