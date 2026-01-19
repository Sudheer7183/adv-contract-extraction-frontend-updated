import React, { FC } from 'react'
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../../auth';
import Swal from 'sweetalert2';

type Props = {
    data?: any
}

const FileName: FC<Props> = ({ data }) => {
    console.log("data1->>>", data);
    const { currentUser } = useAuth()
    const UserName = currentUser?.username;

    const nav = useNavigate();
    const openTable = () => {
        if (data.fileStatus === "Being Processed" || data.fileStatus === "To be Processed" || data.fileStatus === "error in process") {
            Swal.fire({
                title: `Hello ${UserName || 'User'}`,
                text: 'File is not ready for view.',
                icon: 'warning', // You can customize the icon
            });
            // window.alert("File is not ready for view.");
        } else {
            nav('/viewer-management/viewer/' + data.id);
        }
    }
    return (
        <div className='d-flex align-items-center'>
            <div className='d-flex flex-column'>
                {data.lock == false && data.fileStatus != "To be Processed" ?
                    <a href='#' onClick={openTable} className='text-gray-800 text-hover-primary mb-1' style={{ maxWidth: "35ch" }}>{data.fileName}</a>
                    : data.fileStatus == "To be Processed" ?
                        <a href='#' onClick={openTable} className='text-gray-800 text-hover-primary mb-1' style={{ maxWidth: "35ch" }}>{data.fileName}</a>
                        : data.lock == true && data.lockedBy?.username == UserName ?
                            <a href='#' onClick={openTable} className='text-gray-800 text-hover-primary mb-1' style={{ maxWidth: "35ch" }}>{data.fileName}</a>
                            :
                            <a href='#' className='text-gray-800 text-hover-primary mb-1' style={{ maxWidth: "35ch" }}>{data.fileName}</a>
                }
            </div>
        </div>
    )
}

export { FileName }
