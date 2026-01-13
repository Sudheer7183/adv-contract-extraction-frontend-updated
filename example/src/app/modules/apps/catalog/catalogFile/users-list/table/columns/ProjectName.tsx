import React, { FC } from 'react'

type Props = {
    catalogName?: any
}

const ProjectName: FC<Props> = ({ catalogName }) => {

    console.log("projectName ->", catalogName);
    return (
        <div className=''>
            {catalogName.catalogName}</div>
    )
}

export { ProjectName }
