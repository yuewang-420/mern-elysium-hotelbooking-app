import { createSlice } from '@reduxjs/toolkit'

// Define types for auth slice
type UserInfo = {
  id: string
  email: string
  firstName: string
  lastName: string
}

const storedUserInfo = localStorage.getItem('userInfo')
const initialUserInfo: UserInfo | null = storedUserInfo
  ? JSON.parse(storedUserInfo)
  : null
const initialState: { userInfo: UserInfo | null } = {
  userInfo: initialUserInfo,
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: { payload: UserInfo }) => {
      state.userInfo = action.payload
      localStorage.setItem('userInfo', JSON.stringify(action.payload))
    },
    clearCredentials: (state) => {
      state.userInfo = null
      localStorage.removeItem('userInfo')
    },
  },
})

export const { setCredentials, clearCredentials } = authSlice.actions

export default authSlice.reducer
