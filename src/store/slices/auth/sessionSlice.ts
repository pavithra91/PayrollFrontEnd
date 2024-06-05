import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { SLICE_BASE_NAME } from './constants'
import { apiSignOut } from '@/services/AuthService'
import { SignOutCredential } from '@/@types/auth'
import useCommon from '@/utils/hooks/useCommon'

export interface SessionState {
    signedIn: boolean
    token: string | null
}

const common = useCommon()

const userData: SignOutCredential = {
    userID: common.getUserIDFromLocalStorage(),
}

const initialState: SessionState = {
    signedIn: false,
    token: null,
}

const sessionSlice = createSlice({
    name: `${SLICE_BASE_NAME}/session`,
    initialState,
    reducers: {
        signInSuccess(state, action: PayloadAction<string>) {
            state.signedIn = true
            state.token = action.payload
        },
        signOutSuccess(state) {
            state.signedIn = false
            state.token = null

            userData.userID = common.getUserIDFromLocalStorage()
            apiSignOut(userData)
        },
    },
})

export const { signInSuccess, signOutSuccess } = sessionSlice.actions
export default sessionSlice.reducer
