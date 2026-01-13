import React, { FC } from 'react';


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
            default:
                return 'badge-light';
        }
    };


    const statusColorClass = getStatusColor(fileStatus.fileStatus);


    return (
        <div className={`badge fw-bolder ${statusColorClass}`}>
            {fileStatus.fileStatus}
        </div>
    );
};


export { FileStatus };
