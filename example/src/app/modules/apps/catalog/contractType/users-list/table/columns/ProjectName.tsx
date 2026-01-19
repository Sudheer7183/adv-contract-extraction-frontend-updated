import React, { FC } from 'react'

type Props = {
    contractTypeName?: any
}

const ProjectName: FC<Props> = ({ contractTypeName }) => {

    console.log("projectName ->", contractTypeName);
    return (
        <div className=''>
            {contractTypeName.contractTypeName}</div>
    )
}

export { ProjectName }
