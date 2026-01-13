import React, { FC, useState, createContext, useContext, useMemo, useEffect } from 'react'
import {
  ID,
  calculatedGroupingIsDisabled,
  calculateIsAllDataSelected,
  groupingOnSelect,
  initialListView,
  ListViewContextProps,
  groupingOnSelectAll,
  WithChildren,
} from '../../../../../../_metronic/helpers'
import { useQueryResponse, useQueryResponseData } from './QueryResponseProvider'
import request, { gql } from 'graphql-request'
import BASEURL from '../../../../../config/baseurl'

const documents = gql`
query Filess($projectId: String!) {
    filess(projectId: $projectId) {
      edges {
        node {
          id
          filePath
          fileName
          project{
            id
            projectName
            active
          }
          zuvaFileId
          fileStatus
          fileType
          pages
          userContractType{
            contractTypeName
          }
          lock
          lockedBy {
            username
            email
            role
          }
        }
      }
    }
  }
`

const ListViewContext = createContext<ListViewContextProps>(initialListView)

const ListViewProvider: FC<WithChildren> = ({ children }) => {
  const [selected, setSelected] = useState<Array<ID>>(initialListView.selected)
  const [selectedStatus, setSelectedStatus] = useState<string>(initialListView.selectedStatus)
  const [fileUpload, setFileUpload] = useState<boolean>(initialListView.fileUpload)
  const [itemIdForUpdate, setItemIdForUpdate] = useState<ID>(initialListView.itemIdForUpdate)
  const [filesearchValue, setFileSearchValue] = useState<any>(initialListView.searchValue)
  const [filesort, setFileSort] = useState<any>(initialListView.sort)
  const [fileorder, setFileOrder] = useState<any>(initialListView.order)
  const [name, setName] = useState<string>(initialListView.name)
  const [rowSelect, setRowSelect] = useState<Array<string>>(initialListView.rowSelect)
  const [projectid, setProjectid] = useState<string>(initialListView.projectid)
  const [projectName, setProjectName] = useState<any>(initialListView.projectName)
  const [update, setUpdate] = useState<boolean>(initialListView.update)
  const [userAssign, setUserAssign] = useState<boolean>(initialListView.userAssign)
  const [contractAssign, setContractAssign] = useState<boolean>(initialListView.contractAssign)
  const [files, setFiles] = useState<any[]>([]);
  const [clicked, setClicked] = useState(false)
  const [selected1, setSelected1] = useState<Array<ID>>(initialListView.selected1)
  const [filestatus, setFileStatus] = useState<boolean>(initialListView.filestatus)

  useEffect(() => {
    console.log("multiple request projectId", projectid);

    if (projectid != "") {
      console.log("multiple request")
      request(`${BASEURL}graphql/`, documents, { projectId: projectid }, {Authorization: `Bearer ${localStorage.getItem('Token')}`}).then((data: any) => setFiles(data.filess.edges))
    }
  }, [projectid])

  const data: any[] = [];

  for (let i = 0; i < files.length; i++) {
    data.push(files[i].node)

  }
  console.log("datav", data, selected, selected1)

  const { isLoading } = useQueryResponse()
  // const data = useQueryResponseData()
  const disabled = useMemo(() => calculatedGroupingIsDisabled(isLoading, data), [isLoading, data])
  const isAllSelected = useMemo(() => calculateIsAllDataSelected(data, selected, selected1), [data, selected, selected1])

  return (
    <ListViewContext.Provider
      value={{
        selected,
        setSelected,
        selected1,
        setSelected1,
        filestatus,
        setFileStatus,
        itemIdForUpdate,
        setItemIdForUpdate,
        fileUpload,
        setFileUpload,
        filesearchValue,
        setFileSearchValue,
        filesort,
        fileorder,
        setFileOrder,
        setFileSort,
        disabled,
        isAllSelected,
        rowSelect,
        setRowSelect,
        projectid,
        setProjectid,
        projectName,
        setProjectName,
        selectedStatus,
        setSelectedStatus,
        clicked,
        setClicked,
        name,
        setName,
        update,
        setUpdate,
        userAssign,
        setUserAssign,
        contractAssign,
        setContractAssign,
        onSelect: (id: ID) => {
          groupingOnSelect(id, selected, setSelected, selected1, setSelected1)
        },
        onSelectAll: () => {
          groupingOnSelectAll(isAllSelected, setSelected, setSelected1, data)
        },
        clearSelected: () => {
          setSelected([])
          setSelected1([])
        },
      }}
    >
      {children}
    </ListViewContext.Provider>
  )
}

const useListView = () => useContext(ListViewContext)

export { ListViewProvider, useListView }
