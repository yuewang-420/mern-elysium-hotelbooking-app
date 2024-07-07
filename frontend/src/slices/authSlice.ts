import { createSlice } from '@reduxjs/toolkit'

// Define types for auth slice
export type UserInfo = {
  id: string
  email: string
  firstName: string
  lastName: string
  expiresAt: number
}

const EXPIRATION_TIME = 24 * 60 * 60 * 1000
const isExpired = (userInfo: UserInfo): boolean => {
  return Date.now() > userInfo.expiresAt
}

const storedUserInfo = localStorage.getItem('userInfo')
const initialUserInfo: UserInfo | null = storedUserInfo
  ? JSON.parse(storedUserInfo)
  : null
const initialState: { userInfo: UserInfo | null } = {
  userInfo:
    initialUserInfo && !isExpired(initialUserInfo) ? initialUserInfo : null,
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: { payload: Omit<UserInfo, 'expiresAt'> }
    ) => {
      const expiresAt = Date.now() + EXPIRATION_TIME
      const userInfo = { ...action.payload, expiresAt }
      state.userInfo = userInfo
      localStorage.setItem('userInfo', JSON.stringify(userInfo))
    },
    clearCredentials: (state) => {
      state.userInfo = null
      localStorage.removeItem('userInfo')
    },
  },
})

export const { setCredentials, clearCredentials } = authSlice.actions

export default authSlice.reducer
