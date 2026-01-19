import React, { FC } from 'react'
import { useAuth } from '../../../../../auth'

type Props = {
    userContract?: any
}

const ContractFileType: FC<Props> = ({ userContract }) => {
    const { currentUser } = useAuth()
    let Role = currentUser?.role
    // let contractTypeName = userContract?.userContractType?.contractTypeName;
    let contractTypeName;

    if (Role === "Admin" || Role === "Manager") {
        contractTypeName = userContract?.userContractType?.contractTypeName;
    } else {
        contractTypeName = userContract?.file?.userContractType?.contractTypeName;
    }

    if (contractTypeName === undefined) {
        contractTypeName = 'undefined';
    }

    return (
        <div className='badge badge-light fw-bolder'>{contractTypeName}</div>
    );
}


// (
//     <div className='badge badge-light fw-bolder'>{userContract?.userContractType?.contractTypeName}</div>
// )


export { ContractFileType }
