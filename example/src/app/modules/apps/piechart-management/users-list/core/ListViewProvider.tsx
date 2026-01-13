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

const documents = gql`
query Filess($name: String!) {
    filess(name: $name) {
      edges {
        node {
          id
          filePath
          fileName
          projectName
          zuvaFileId
          fileStatus
          fileType
          userContractType
          pages
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
  const [itemIdForUpdate, setItemIdForUpdate] = useState<ID>(initialListView.itemIdForUpdate)
  const [piefilesearchValue, setPieFileSearchValue] = useState<any>(initialListView.searchValue)
  const [piefilesort, setPieFileSort] = useState<any>(initialListView.sort)
  const [piefileorder, setPieFileOrder] = useState<any>(initialListView.order)
  const [name, setName] = useState<string>(initialListView.name)
  // const [rowSelect, setRowSelect] = useState<Array<string>>(initialListView.rowSelect)
  // const [fileid, setFileid] = useState<string>(initialListView.fileid)
  // const [files, setFiles] = useState<any[]>([]);

  // useEffect(() => {
  //   request(`${BASEURL}graphql/`, documents, { name: fileid }).then((data: any) => setFiles(data.filess.edges))
  // }, [fileid])

  // const data: any[] = [];


  // for (let i = 0; i < files.length; i++) {
  //   data.push(files[i].node)

  // }
  // console.log("datav", data)
  const { isLoading } = useQueryResponse()
  const data = useQueryResponseData()
  const disabled = useMemo(() => calculatedGroupingIsDisabled(isLoading, data), [isLoading, data])
  const isAllSelected = useMemo(() => calculateIsAllDataSelected(data, selected), [data, selected])

  return (
    <ListViewContext.Provider
      value={{
        selected,
        itemIdForUpdate,
        setItemIdForUpdate,
        disabled,
        isAllSelected,
        piefilesearchValue,
        setPieFileSearchValue,
        piefilesort,
        piefileorder,
        setPieFileOrder,
        setPieFileSort,
        // rowSelect,
        // setRowSelect,
        // fileid,
        // setFileid,
        name,
        setName,
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
