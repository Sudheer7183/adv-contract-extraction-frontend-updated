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
import { useQueryResponse } from './QueryResponseProvider'
import request, { gql } from 'graphql-request';
import BASEURL from '../../../../../config/baseurl';

const LIST_FILES = gql`
query listFiles(
  $projectid: String!,
  $contracttype: String!,
  $filestatus: String!
){
  listFiles(
    projectid:$projectid,
    contracttype: $contracttype,
    filestatus: $filestatus
  ){
    project{
      id
      projectName
    }
    contractType{
      contractTypeName
    }
    fileStatus
    fileName
    id
  }
}`

const ListViewContext = createContext<ListViewContextProps>(initialListView)

const ListViewProvider: FC<WithChildren> = ({ children }) => {
  const [selected, setSelected] = useState<Array<ID>>(initialListView.selected)
  const [itemIdForUpdate, setItemIdForUpdate] = useState<ID>(initialListView.itemIdForUpdate)
  const [searchValue, setSearchValue] = useState<any>(initialListView.searchValue)
  const [usersort, setUserSort] = useState<any>(initialListView.sort)
  const [userorder, setUserOrder] = useState<any>(initialListView.order)
  const [update, setUpdate] = useState<boolean>(initialListView.update)
  const [projectid, setProjectid] = useState<string>(initialListView.projectid)
  const [docType, setDocType] = useState<string>(initialListView.dtype)
  const { isLoading } = useQueryResponse()
  const [data, setData] = useState<any[]>([])

  console.log("export data variable projectId, doctype", projectid, docType);

  useEffect(() => {
    if (projectid != "") {
      request(`${BASEURL}graphql/`, LIST_FILES, { projectid: projectid, contracttype: docType, filestatus: "Review Completed" }, {Authorization: `Bearer ${localStorage.getItem('Token')}`}).then((res: any) => {
        console.log("response in export data handlechange1", res.listFiles);
        setData(res.listFiles)
      })
    }
  }, [projectid, docType])
  // const data = useQueryResponseData()
  const disabled = useMemo(() => calculatedGroupingIsDisabled(isLoading, data), [isLoading, data])
  const isAllSelected = useMemo(() => calculateIsAllDataSelected(data, selected, selected), [data, selected])

  return (
    <ListViewContext.Provider
      value={{
        selected,
        itemIdForUpdate,
        setItemIdForUpdate,
        projectid,
        setProjectid,
        docType,
        setDocType,
        searchValue,
        setSearchValue,
        usersort,
        userorder,
        setUserOrder,
        setUserSort,
        disabled,
        isAllSelected,
        update,
        setUpdate,
        onSelect: (id: ID) => {
          groupingOnSelect(id, selected, setSelected)
        },
        onSelectAll: () => {
          groupingOnSelectAll(isAllSelected, setSelected, data)
        },
        clearSelected: () => {
          setSelected([])
        },
      }}
    >
      {children}
    </ListViewContext.Provider>
  )
}

const useListView = () => useContext(ListViewContext)

export { ListViewProvider, useListView }
