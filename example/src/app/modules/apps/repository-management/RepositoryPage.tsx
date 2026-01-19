import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, Route, Routes, useParams } from 'react-router-dom'
import { PageLink, PageTitle } from '../../../../_metronic/layout/core'
// import { UsersListWrapper } from './users-list/UsersList'

import { UsersListWrapper } from './users-list/UsersList';
import { useListView } from '../project-management/users-list/core/ListViewProvider';
import request, { gql } from 'graphql-request';
import BASEURL from '../../../config/baseurl';

const PROJECTNAME = gql`
query GetProject($id: String!) {
  getProject(id:$id){
    id
    projectName
  }
}`

const UsersPage = () => {

  // const { projectName } = useListView()
  const val = useParams()
  console.log("document list val", val);
  const [projectName, setProjectName] = useState<string>("")

  const getVal: any = val["*"];
  console.log("document list get-val", getVal);
  const Id: any = getVal?.split("/");
  console.log("document list Id", Id);
  console.log("name2->", projectName);
  const variables = {
    id: Id[1],

  }


  const title = 'Project : ' + projectName;
  const usersBreadcrumbs: Array<PageLink> = [
    {
      title: title,
      path: '/document-management/document/:id',
      isSeparator: false,
      isActive: false,
    },
    {
      title: '',
      path: '',
      isSeparator: true,
      isActive: false,
    },
  ]

  useEffect(() => {
    request(`${BASEURL}graphql/`, PROJECTNAME, variables, {Authorization: `Bearer ${localStorage.getItem('Token')}`}).then((res: any) => {
      console.log("document list--->", res.getProject?.projectName);
      setProjectName(res.getProject?.projectName);
    }
    )
  }, [projectName])
  return (
    <Routes>
      <Route element={<Outlet />}>
        <Route
          path='/files'
          element={
            <>
              {/* <PageTitle>Project: {projectName}</PageTitle> */}
              <PageTitle >Repository Files</PageTitle>
              <UsersListWrapper />

            </>
          }
        />
      </Route>
      <Route index element={<Navigate to='/repository/files' />} />
    </Routes>
  )
}

export default UsersPage
