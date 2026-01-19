import React, { useEffect, useState } from 'react';
import { useListView } from '../../core/ListViewProvider'


import { UsersListSearchComponent } from './UsersListSearchComponent'


import request, { gql } from 'graphql-request';
import BASEURL from '../../../../../../config/baseurl';
import { DocumentListHead } from './DocumentListHead';
import RefreshButton from './RefreshButton';
import { RepositorySearchTypeDropDown } from './RepositorySearchTypeDropDwon';
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

  // useEffect(() => {
  //   request(`${BASEURL}graphql/`, getProject, { id: projectid }, {Authorization: `Bearer ${localStorage.getItem('Token')}`}).then((res: any) => setdata(res.getProject))
  // }, [projectid])

  // // console.log("Header ProjectId document list", projectid, data, data?.active)
  // const ProjectActive = data?.active
  return (
    <div className='card-header border-0'>
      {/* <RefreshButton /> */}
      <UsersListSearchComponent />
      <RepositorySearchTypeDropDown/>
      {selected.length > 0 ? <DocumentListHead /> : null}
      {/* {selected.length > 0 ? <UsersListGrouping /> : <span className='pt-6'>Please, select the files to assign Contract Type</span>} */}
      {/* begin::Card toolbar */}
      <div className='card-toolbar'>
        {/* begin::Group actions */}
        {
          <div className='card-toolbar'>
          </div>}
      </div>

      {/* end::Card toolbar */}
    </div>
  )
}

export { UsersListHeader }
