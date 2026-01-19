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
import request, { gql } from 'graphql-request'
import BASEURL from '../../../../../config/baseurl'

const BAR_CHART_FILES = gql`
query barchartFiles($value: String!, $barchart: String!, $classificationType: String!,$skip:Int!,$first:Int!){
  barchartFiles(value: $value, barchart: $barchart, classificationType: $classificationType,skip:$skip,first:$first){
    edges{
      node{
        id
        fileName
        project{
          id
          projectName
        }
        fileType
        fileStatus
        pages
        contractType{
          contractTypeName
        }
        lock
        lockedBy{
          username
        }
      }
    }
  }
}`



const ListViewContext = createContext<ListViewContextProps>(initialListView)

const ListViewProvider: FC<WithChildren> = ({ children }) => {
  const [selected, setSelected] = useState<Array<ID>>(initialListView.selected)
  const [itemIdForUpdate, setItemIdForUpdate] = useState<ID>(initialListView.itemIdForUpdate)
  const [barfilesearchValue, setBarFileSearchValue] = useState<any>(initialListView.searchValue)
  const [barfilesort, setBarFileSort] = useState<any>(initialListView.sort)
  const [barfileorder, setBarFileOrder] = useState<any>(initialListView.order)
  const [name, setName] = useState<string>(initialListView.name)
  const [fileid, setFileid] = useState<string>(initialListView.fileid)
  const [files, setFiles] = useState<any[]>([]);
  const [first1, setFirst1] = useState<any>(initialListView.first1)
  const [skip1, setSkip1] = useState<any>(initialListView.skip1)
  const [val, setVal] = useState<string>(initialListView.val)
  const [chart, setChart] = useState<string>(initialListView.chart)
  const [dtype, setDtype] = useState<string>(initialListView.dtype)
  const [update, setUpdate] = useState<boolean>(initialListView.update)
  const [userAssign, setUserAssign] = useState<boolean>(initialListView.userAssign)
  const [contractAssign, setContractAssign] = useState<boolean>(initialListView.contractAssign)

  useEffect(() => {
    request(`${BASEURL}graphql/`, BAR_CHART_FILES,
      { value: val, barchart: chart, classificationType: dtype, skip: skip1, first: first1 },
      {Authorization: `Bearer ${localStorage.getItem('Token')}`})
      .then((res: any) => {
        console.log(res.barchartFiles.edges)
        let fileArr: any = []
        if (res.barchartFiles.edges.length > 0) {
          for (let k = 0; k < res.barchartFiles.edges.length; k++) {
            fileArr.push(res.barchartFiles.edges[k]?.node)
            console.log("data arr", fileArr);
            setFiles(fileArr)
          }
        }
        else {
          setFiles([])
        }
      })


  }, [skip1, first1]);
  const data: any[] = [];

  for (let i = 0; i < files.length; i++) {
    data.push(files[i])
  }
  console.log("datavalue", data);
  const { isLoading } = useQueryResponse()
  // const data = useQueryResponseData()
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
        barfilesearchValue,
        setBarFileSearchValue,
        barfilesort,
        barfileorder,
        setBarFileOrder,
        setBarFileSort,
        first1,
        setFirst1,
        skip1,
        setSkip1,
        chart,
        setChart,
        val,
        setVal,
        dtype,
        setDtype,
        update,
        setUpdate,
        userAssign,
        setUserAssign,
        contractAssign,
        setContractAssign,
        fileid,
        setFileid,
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
