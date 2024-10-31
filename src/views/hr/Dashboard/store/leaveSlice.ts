import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {
    apiLeaveRequest,
} from '@/services/LeaveService'

type Leave = {
    id: number
    name: number
}

type LeaveList = Leave[]

type PutLeaveResponse = LeaveList

type PutLeaveRequest = {
    id: number
    name: number
}

export type LeaveState = {
    leaveList: LeaveList
    newLeaveDialog: boolean
}

export const SLICE_NAME = 'leaveList'

export const putLeave = createAsyncThunk(
    SLICE_NAME + '/putLeave',
    async (data: PutLeaveRequest) => {
        const response = await apiLeaveRequest<
        PutLeaveResponse,
            PutLeaveRequest
        >(data)
        return response.data
    }
)

const initialState: LeaveState = {
    leaveList : [],
    newLeaveDialog: false,
}

const leaveSlice = createSlice({
    name: `${SLICE_NAME}/state`,
    initialState,
    reducers: {
        toggleNewLeaveDialog: (state, action) => {
            state.newLeaveDialog = action.payload
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(putLeave.fulfilled, (state, action) => {
                state.leaveList = action.payload
            })
    },
})

export const { toggleNewLeaveDialog } =
    leaveSlice.actions

export default leaveSlice.reducer