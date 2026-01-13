import React, { FC } from 'react';
import { useAuth } from '../../../../../auth';


type Props = {
    fileStatus?: any;
};


const FileStatus: FC<Props> = ({ fileStatus }) => {
    const getStatusColor = (status: any) => {
        switch (status) {
            case 'To be Processed':
                return 'badge-light';
            case 'Being Processed':
                return 'badge-light-warning';
            case 'Data Extracted':
                return 'badge-light-info';
            case 'Being Reviewed':
                return 'badge-light-primary';
            case 'Review Completed':
                return 'badge-light-success';
            case 'error in process':
                return 'badge-light-danger';
            default:
                return 'badge-light';
        }
    };

    const { currentUser } = useAuth()
    let Role = currentUser?.role
    let statusColorClass;


    if ((Role === "Admin" || Role === "Manager")) {
        statusColorClass = getStatusColor(fileStatus?.fileStatus);
    } else if (Role === "Reviewer") {
        statusColorClass = getStatusColor(fileStatus?.file?.fileStatus);
    }

    return (
        <div className={`badge fw-bolder ${statusColorClass}`}>
            {(Role === "Admin" || Role === "Manager") ? fileStatus?.fileStatus : fileStatus?.file?.fileStatus}
        </div>
    );
};


export { FileStatus };
