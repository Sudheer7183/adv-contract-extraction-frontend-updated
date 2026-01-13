import axios from 'axios'
import {AuthModel, UserModel} from './_models'
import BASEURL from '../../../config/baseurl'

const API_URL = import.meta.env.VITE_API_URL

export const GET_USER_BY_ACCESSTOKEN_URL = `${API_URL}/verify_token`
export const LOGIN_URL = `${API_URL}/login`
export const REGISTER_URL = `${API_URL}/register`
export const REQUEST_PASSWORD_URL = `${API_URL}/forgot_password`
export const LOGIN = `${BASEURL}graphql/`

// Server should return AuthModel
export function login(email: string, password: string) {
  return axios.post(LOGIN, {
    query: `mutation Login($email: String!, $password: String!) {
      tokenAuth(email: $email, password: $password) {
        success
        errors
        token
        refreshToken
        user {
          id
          username
          email
          role
          profilePicture
          isSuperuser
        }
      }
    }`,
    variables: {
      email: email,
      password: password
    }
  }, {
      headers: {
        'Content-Type': 'application/json'
      },
      
    });
}

// Server should return AuthModel
export function register(
  email: string,
  firstname: string,
  lastname: string,
  password: string,
  password_confirmation: string
) {
  return axios.post(REGISTER_URL, {
    email,
    first_name: firstname,
    last_name: lastname,
    password,
    password_confirmation,
  })
}

// Server should return object => { result: boolean } (Is Email in DB)
export function requestPassword(email: string) {
  return axios.post<{result: boolean}>(REQUEST_PASSWORD_URL, {
    email,
  })
}

export function getUserByToken(token: string) {
  return axios.post<UserModel>(GET_USER_BY_ACCESSTOKEN_URL, {
    api_token: token,
  })
}
