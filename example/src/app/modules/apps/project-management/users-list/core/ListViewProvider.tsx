import React, { FC, useState, createContext, useContext, useMemo } from 'react'
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


const ListViewContext = createContext<ListViewContextProps>(initialListView)


const ListViewProvider: FC<WithChildren> = ({ children }) => {
  const [selected, setSelected] = useState<Array<ID>>(initialListView.selected)
  const [itemIdForUpdate, setItemIdForUpdate] = useState<ID>(initialListView.itemIdForUpdate)
  const [isEdit, setIsEdit] = useState<boolean>(initialListView.isEdit)
  const [projectSearchValue, setProjectSearchValue] = useState<any>(initialListView.searchValue)
  const [projectsort, setProjectSort] = useState<any>(initialListView.sort)
  const [projectorder, setProjectOrder] = useState<any>(initialListView.order)
  const [update, setUpdate] = useState<boolean>(initialListView.update)
  const { isLoading } = useQueryResponse()
  const data = useQueryResponseData()
  const disabled = useMemo(() => calculatedGroupingIsDisabled(isLoading, data), [isLoading, data])
  const isAllSelected = useMemo(() => calculateIsAllDataSelected(data, selected), [data, selected])
  // const [SearchType,setSearchType] =useState<any>(initialListView.searchValue)
  // const [searchtype, setsearchtype] = useState<string>(''); // Global searchtype state

  return (
    <ListViewContext.Provider
      value={{
        selected,
        itemIdForUpdate,
        setItemIdForUpdate,
        disabled,
        isAllSelected,
        isEdit,
        setIsEdit,
        projectSearchValue,
        setProjectSearchValue,
        projectsort,
        projectorder,
        setProjectOrder,
        setProjectSort,
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
