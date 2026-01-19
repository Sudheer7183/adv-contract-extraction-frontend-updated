import React, { useEffect, useState } from 'react';
import { useListView } from '../../core/ListViewProvider'
import { UsersListToolbar } from './UserListToolbar'
import { UsersListGrouping } from './UsersListGrouping'
import { UsersListSearchComponent } from './UsersListSearchComponent'
import DocumentProcess from './DocumentProcess';
import FileUpload from './FileUpload';
import request, { gql } from 'graphql-request';
import BASEURL from '../../../../../../config/baseurl';
import { DocumentListHead } from './DocumentListHead';
import RefreshButton from './RefreshButton';

const getProject = gql`
query GetProject($id: String!){
  getProject(id: $id){
    id  
    projectName
    description
    dateFormat
    active
  }
}
`

const UsersListHeader = () => {
  const { selected, projectid } = useListView()
  const [data, setdata] = useState<any>({})

  useEffect(() => {
    request(`${BASEURL}graphql/`, getProject, { id: projectid }, {Authorization: `Bearer ${localStorage.getItem('Token')}`}).then((res: any) => setdata(res.getProject))
  }, [projectid])

  // console.log("Header ProjectId document list", projectid, data, data?.active)
  const ProjectActive = data?.active
  return (
    <div className='card-header border-0'>
      {/* <RefreshButton /> */}
      <UsersListSearchComponent />
      {selected.length > 0 ? <DocumentListHead /> : null}
      {/* {selected.length > 0 ? <UsersListGrouping /> : <span className='pt-6'>Please, select the files to assign Contract Type</span>} */}
      {/* begin::Card toolbar */}
      <div className='card-toolbar'>
        {/* begin::Group actions */}
        {ProjectActive ?
          <div className='card-toolbar'>
            <UsersListToolbar />
            <FileUpload />
            {/* <DocumentProcess /> */}
          </div> : null}
        {/* end::Group actions */}
      </div>

      {/* end::Card toolbar */}
    </div>
  )
}

export { UsersListHeader }
