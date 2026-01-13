import {Dispatch, SetStateAction} from 'react'

export type ID = undefined | null | number

export type PaginationState = {
  page: number
  items_per_page: 10 | 30 | 50 | 100
  links?: Array<{label: string; active: boolean; url: string | null; page: number | null}>
}

export type SortState = {
  sort?: string
  order?: 'asc' | 'desc'
}

export type FilterState = {
  filter?: unknown
}

export type SearchState = {
  search?: string
}

export type Response<T> = {
  data?: T
  payload?: {
    message?: string
    errors?: {
      [key: string]: Array<string>
    }
    pagination?: PaginationState
  }
}

export type QueryState = PaginationState & SortState & FilterState & SearchState

export type QueryRequestContextProps = {
  state: QueryState
  updateState: (updates: Partial<QueryState>) => void
}

export const initialQueryState: QueryState = {
  page: 1,
  items_per_page: 10,
}

export const initialQueryRequest: QueryRequestContextProps = {
  state: initialQueryState,
  updateState: () => {},
}

export type QueryResponseContextProps<T> = {
  response?: Response<Array<T>> | undefined
  refetch: () => void
  isLoading: boolean
  query: string
}

export const initialQueryResponse = {refetch: () => {}, isLoading: false, query: ''}

export type ListViewContextProps = {
  selected: Array<ID>
  selected1: Array<ID>
  onSelect: (selectedId: ID) => void
  onSelectAll: () => void
  clearSelected: () => void
  // NULL => (CREATION MODE) | MODAL IS OPENED
  // NUMBER => (EDIT MODE) | MODAL IS OPENED
  // UNDEFINED => MODAL IS CLOSED
  itemIdForUpdate?: ID
  // itemIdForUpdate?: string
  setItemIdForUpdate: Dispatch<SetStateAction<ID>>
  fileUpload: boolean
  setFileUpload:Dispatch<SetStateAction<boolean>>
  chronology:boolean
  setChronology:Dispatch<SetStateAction<boolean>>
  factualchronology:boolean
  setfactualchronology:Dispatch<SetStateAction<boolean>>
  isAllSelected: boolean
  disabled: boolean
  isEdit: boolean
  setIsEdit: Dispatch<SetStateAction<boolean>>
  searchValue?: string
  setSearchValue: Dispatch<SetStateAction<string>>
  projectSearchValue?:string
  setProjectSearchValue?:Dispatch<SetStateAction<string>>
  sort?: string
  setSort: Dispatch<SetStateAction<string>>
  order?: string
  setOrder: Dispatch<SetStateAction<string>>
  rowSelect?: Array<string>
  setRowSelect: () => Array<string>
  name?: string
  setName: Dispatch<SetStateAction<string>>
  projectName?: string
  setProjectName: Dispatch<SetStateAction<string>>
  projectid?: string
  setProjectid?:Array<string>
  Expand?: ID
  setExpand: Dispatch<SetStateAction<ID>>
  update: boolean
  setUpdate: Dispatch<SetStateAction<boolean>>
  first1: string
  setFirst1: Dispatch<SetStateAction<string>>
  skip1: string
  setSkip1: Dispatch<SetStateAction<string>>
  dtype: string
  setDtype: Dispatch<SetStateAction<string>>
  chart: string
  setChart: Dispatch<SetStateAction<string>>
  val: string
  setVal: Dispatch<SetStateAction<string>>
  userAssign: boolean
  setUserAssign: Dispatch<SetStateAction<boolean>>
  contractAssign: boolean
  setContractAssign:Dispatch<SetStateAction<boolean>>
  selectedStatus: string
  setSelectedStatus: Dispatch<SetStateAction<string>>
  clicked:boolean,
 	setClicked:Dispatch<SetStateAction<boolean>>
  filestatus:boolean,
 	setFileStatus:Dispatch<SetStateAction<boolean>>
  filesearchValue?:string
  setfilesearchValue:Dispatch<SetStateAction<string>>
  searchType?: string
  setSearchType: Dispatch<SetStateAction<string>>
}

export const initialListView: ListViewContextProps = {
  selected: [],
  selected1: [],
  onSelect: () => {},
  onSelectAll: () => {},
  clearSelected: () => {},
  setItemIdForUpdate: () => {},
  fileUpload: false,
  setFileUpload: () => {},
  isAllSelected: false,
  disabled: false,
  isEdit: false,
  setIsEdit:()=>{},
  searchValue: '',
  setSearchValue: () => {},
  projectSearchValue:'',
  setProjectSearchValue:()=>{},
  searchType: '',
  setSearchType: () => {},
  sort: '',
  setSort: () => {},
  order: '',
  setOrder: () => {},
  rowSelect: [],
  setRowSelect: () => [],
  name: '',
  setName: () => {},
  projectName: '',
  setProjectName: () => {},
  projectid: '',
  setProjectid: () => {},
  selectedStatus: '',
  setSelectedStatus: () => {},
  setExpand: () => {},
  update: false,
  setUpdate: () => {},
  first1: '',
  setFirst1: () => {},
  skip1: '',
  setSkip1: () => {},
  dtype: "",
  setDtype: () => {},
  chart: '',
  setChart: () => {},
  val: '',
  setVal: () => {},
  userAssign: false,
  setUserAssign: () => { },
  contractAssign: false,
  setContractAssign: () => { },
  filestatus: false,
  setFileStatus: () => { },
  chronology:false,
  setChronology:() => { },
  factualchronology:false,
  setfactualchronology:()=>{}
}
