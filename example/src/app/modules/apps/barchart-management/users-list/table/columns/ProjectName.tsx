import React, { FC } from 'react'


type Props = {
    projectName?: any
}


const ProjectName: FC<Props> = ({ projectName }) => {


    console.log("projectName ->", projectName);
    return (
        <div className=''>
            {projectName.project.projectName}</div>
    )
}


export { ProjectName }
