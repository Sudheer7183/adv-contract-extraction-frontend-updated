import React, { FC } from 'react'

type Props = {
    userContract?: any
}

const ContractFileType: FC<Props> = ({ userContract }) => (
    <div className='badge badge-light fw-bolder'>{userContract.userContractType}</div>
)


export { ContractFileType }
