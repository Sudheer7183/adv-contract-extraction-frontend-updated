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
} from '../../../../../../../_metronic/helpers'
import { useQueryResponse, useQueryResponseData } from './QueryResponseProvider1'


const ListViewContext = createContext<ListViewContextProps>(initialListView)


const ListViewProvider1: FC<WithChildren> = ({ children }) => {
  const [selected, setSelected] = useState<Array<ID>>(initialListView.selected)
  const [Expand, setExpand] = useState<ID>(initialListView.Expand)
  const [update, setUpdate] = useState<boolean>(initialListView.update)
  const [itemIdForUpdate, setItemIdForUpdate] = useState<ID>(initialListView.itemIdForUpdate)
  const [isEdit, setIsEdit] = useState<boolean>(initialListView.isEdit)
  const [Hide, setHide] = useState<boolean>(initialListView.Hide)
  const [catalogSearchValue, setCatalogSearchValue] = useState<any>(initialListView.searchValue)
  const [catalogsort, setCatalogSort] = useState<any>(initialListView.sort)
  const [catalogorder, setCatalogOrder] = useState<any>(initialListView.order)
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
        Expand,
        setExpand,
        disabled,
        isAllSelected,
        isEdit,
        Hide,
        catalogSearchValue,
        setCatalogSearchValue,
        catalogsort,
        setCatalogSort,
        catalogorder,
        setCatalogOrder,
        setIsEdit,
        setHide,
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


export { ListViewProvider1, useListView }
