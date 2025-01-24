import { AccountData, PasswordReset } from '@/@types/Account'
import {
    apiAddUser,
    apiGetUserList,
    apiGetUsers,
    apiResetUserPassword,
    apiUpdateUser,
} from '@/services/AccountService'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

export type Users = {
    id: number
    companyCode: number
    costCenter: string
    userID: string
    password?: string
    epf: number
    empName: string
    role: string
    isAccountLocked: boolean
    status: boolean
    createdBy: string
}

type UserList = Users[]

export type UserState = {
    loading: boolean
    userList: UserList
    newUserDialog: boolean
    editUserDialog: boolean
    view: 'grid' | 'list'
    selectedUser: Partial<Users>
}

type GetUserListResponse = UserList

export const SLICE_NAME = 'userList'

const initialState: UserState = {
    loading: false,
    userList: [],
    newUserDialog: false,
    editUserDialog: false,
    view: 'grid',
    selectedUser: {},
}

export const getUserList = createAsyncThunk(
    SLICE_NAME + '/getUserList',
    async () => {
        const response = await apiGetUserList<GetUserListResponse>()
        try {
            const jsonString: any = response.data

            let parsedArray: Users[] = []
            parsedArray = JSON.parse(jsonString.data) as Users[]
            console.log(parsedArray)
            return parsedArray
        } catch (error) {
            alert(error)
            return []
        }
    }
)

export const addNewUser = createAsyncThunk(
    SLICE_NAME + '/addNewUser',
    async (data: AccountData) => {
        const response = await apiAddUser(data)

        const userResponse = await apiGetUserList<GetUserListResponse>()

        return response.data
    }
)

export const editUser = createAsyncThunk(
    SLICE_NAME + '/editUser',
    async (data: AccountData) => {
        const response = await apiUpdateUser(data)

        const userResponse = await apiGetUserList<GetUserListResponse>()

        return response.data
    }
)

export const resetUserPassword = createAsyncThunk(
    SLICE_NAME + '/resetUserPassword',
    async (data: PasswordReset) => {
        const response = await apiResetUserPassword(data)

        return response.data
    }
)

const userSlice = createSlice({
    name: `${SLICE_NAME}/state`,
    initialState,
    reducers: {
        toggleView: (state, action) => {
            state.view = action.payload
        },
        toggleNewUserDialog: (state, action) => {
            state.newUserDialog = action.payload
        },
        toggleEditUserDialog: (state, action) => {
            state.editUserDialog = action.payload
        },
        setSelectedUser: (state, action) => {
            state.selectedUser = action.payload
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getUserList.fulfilled, (state, action) => {
                state.userList = action.payload
                state.loading = false
            })
            .addCase(getUserList.pending, (state) => {
                state.loading = true
            })
        // .addCase(putLeave.fulfilled, (state, action) => {
        //     state.leaveTypeList = action.payload
        // })
    },
})

export const {
    toggleView,
    toggleNewUserDialog,
    toggleEditUserDialog,
    setSelectedUser,
} = userSlice.actions

export default userSlice.reducer
