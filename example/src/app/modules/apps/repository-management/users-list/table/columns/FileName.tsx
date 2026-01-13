import React, { FC } from 'react'
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../../auth';
import Swal from 'sweetalert2';

type Props = {
    data?: any
}

const FileName: FC<Props> = ({ data }) => {
    const { currentUser } = useAuth()
    let Role = currentUser?.role
    const UserName = currentUser?.username;

    const nav = useNavigate();
    const openTable = () => {
        if (Role === "Admin" || Role === "Manager") {
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
        } else if (Role === "Reviewer") {
            if (data.file.fileStatus === "Being Processed" || data.file.fileStatus === "To be Processed" || data.file.fileStatus === "error in process") {
                Swal.fire({
                    title: `Hello ${UserName || 'User'}`,
                    text: 'File is not ready for view.',
                    icon: 'warning', // You can customize the icon
                });
                // window.alert("File is not ready for view.");
            } else {
                nav('/viewer-management/viewer/' + data.file.id);
            }
        }

    }
    return (
        <div className='d-flex align-items-center'>
            <div className='d-flex flex-column'>
                {(Role === "Admin" || Role === "Manager") ? (
                    data.lock === false && data.fileStatus !== "To be Processed" ? (
                        <a href='#' onClick={openTable} className='text-gray-800 text-hover-primary mb-1' style={{ maxWidth: "35ch" }}>
                            {data.fileName}
                        </a>
                    ) : data.fileStatus === "To be Processed" ? (
                        <a href='#' onClick={openTable} className='text-gray-800 text-hover-primary mb-1' style={{ maxWidth: "35ch" }}>
                            {data.fileName}
                        </a>
                    ) : data.lock === true && data.lockedBy?.username === UserName ? (
                        <a href='#' onClick={openTable} className='text-gray-800 text-hover-primary mb-1' style={{ maxWidth: "35ch" }}>
                            {data.fileName}
                        </a>
                    ) : (
                        <a href='#' onClick={openTable} className='text-gray-800 text-hover-primary mb-1' style={{ maxWidth: "35ch" }}>
                            {data.fileName}
                        </a>
                    )
                ) : Role === "Reviewer" ? (
                    data?.file?.lock === false && data.file.fileStatus !== "To be Processed" ? (
                        <a href='#' onClick={openTable} className='text-gray-800 text-hover-primary mb-1' style={{ maxWidth: "35ch" }}>
                            {data.file.fileName}
                        </a>
                    ) : data?.file?.fileStatus === "To be Processed" ? (
                        <a href='#' onClick={openTable} className='text-gray-800 text-hover-primary mb-1' style={{ maxWidth: "35ch" }}>
                            {data.file.fileName}
                        </a>
                    ) : data?.file?.lock === true && data.file.lockedBy?.username === UserName ? (
                        <a href='#' onClick={openTable} className='text-gray-800 text-hover-primary mb-1' style={{ maxWidth: "35ch" }}>
                            {data.file.fileName}
                        </a>
                    ) : (
                        <a href='#' onClick={openTable} className='text-gray-800 text-hover-primary mb-1' style={{ maxWidth: "35ch" }}>
                            {data?.file?.fileName}
                        </a>
                    )
                ) : null}

                {/* {data.lock == false && data.fileStatus != "To be Processed" ?
                    <a href='#' onClick={openTable} className='text-gray-800 text-hover-primary mb-1' style={{ maxWidth: "35ch" }}>{data.fileName}</a>
                    : data.fileStatus == "To be Processed" ?
                        <a href='#' onClick={openTable} className='text-gray-800 text-hover-primary mb-1' style={{ maxWidth: "35ch" }}>{data.fileName}</a>
                        : data.lock == true && data.lockedBy?.username == UserName ?
                            <a href='#' onClick={openTable} className='text-gray-800 text-hover-primary mb-1' style={{ maxWidth: "35ch" }}>{data.fileName}</a>
                            :
                            <a href='#' onClick={openTable} className='text-gray-800 text-hover-primary mb-1' style={{ maxWidth: "35ch" }}>{data.fileName}</a>
                } */}
            </div>
        </div>
    )
}

export { FileName }
