import {ID, Response} from '../../../../../../_metronic/helpers'
export type User = {
  id?: ID
  name?: string
  avatar?: string
  email?: string
  password?: string
  username?: string
  first_name?: string
  last_name?: string
  company_name?: string
  role?: string
  last_login?: string
  two_steps?: boolean
  joined_day?: string
  online?: boolean
  initials?: {
    label: string
    state: string
  }
}

export type UsersQueryResponse = Response<Array<User>>

export const initialUser: User = {
  avatar: 'avatars/300-6.jpg',
  role: 'Admin',
  name: '',
  email: '',
  username: '',
  first_name: '',
  last_name: '',
  password: '',
}
