/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { FC } from 'react'
import { useNavigate } from 'react-router-dom';

type Props = {
    venue?: any
}

const Venue: FC<Props> = ({ venue }) => {
    console.log("venue-titel", venue.node.venue);

    const nav = useNavigate();
    const openTable = () => {
        // setItemIdForUpdate(id)
        nav("/document-management/document/" + venue.node.id);

    }
    return (
        <div className='d-flex align-items-center'>

            <div className='d-flex flex-column'>
                <a href='#' onClick={openTable} className='text-gray-800 text-hover-primary mb-1'>
                    {venue.node.venue}
                </a>

            </div>
        </div>
    )
}


export { Venue }
