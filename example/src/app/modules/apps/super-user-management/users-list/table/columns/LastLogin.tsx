import React, { FC } from 'react';


type Props = {
    lastLogin: string;
};


const formatDate = (date: Date): string => {
    const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    };
    return date.toLocaleString(undefined, options);
};


const LastLogin: FC<Props> = ({ lastLogin }) => {
    const date = new Date(lastLogin.lastLogin);
    if (!isNaN(date.getTime())) {
        const lastLoginDate = lastLogin.lastLogin ? new Date(lastLogin.lastLogin) : new Date(lastLogin.dateJoined);
        const formattedDate = formatDate(lastLoginDate);


        return (
            <div className='badge badge-light fw-bolder'>
                {formattedDate}
            </div>
        );
    } else {
        return (
            <div className='badge badge-light fw-bolder'>
                Not Available
            </div>
        );
    }
};


export { LastLogin };
