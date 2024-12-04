import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { SLICE_BASE_NAME } from './constants'
import bcrypt from 'bcryptjs'

export type UserState = {
    avatar?: string
    userName?: string
    userID?: string
    epf?: string
    id?: string
    costCenter?: string
    authority?: string[]
    pwd?: string
}

const initialState: UserState = {
    avatar: '',
    userName: '',
    userID: '',
    epf: '',
    id: '',
    costCenter: '',
    authority: [],
    pwd: '',
}

const userSlice = createSlice({
    name: `${SLICE_BASE_NAME}/user`,
    initialState,
    reducers: {
        setUser(state, action: PayloadAction<UserState>) {
            state.avatar = action.payload?.avatar
            state.id = action.payload?.id
            state.userName = action.payload?.userName
            state.epf = action.payload?.epf
            state.userID = action.payload?.userID
            state.costCenter = action.payload?.costCenter
            state.authority = action.payload?.authority
            state.pwd = action.payload?.pwd
        },
    },
})

export const { setUser } = userSlice.actions
export default userSlice.reducer
