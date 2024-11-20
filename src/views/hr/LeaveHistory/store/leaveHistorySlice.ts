import { createSlice } from '@reduxjs/toolkit'

export type LeaveHistoryState = {
    dialogOpen: boolean
}

export const SLICE_NAME = 'leaveHistory'

const initialState: LeaveHistoryState = {
    dialogOpen: false,
}

const leaveHistorySlice = createSlice({
    name: `${SLICE_NAME}/state`,
    initialState,
    reducers: {
        openDialog: (state) => {
            state.dialogOpen = true
        },
        closeDialog: (state) => {
            state.dialogOpen = false
        },
    },
    extraReducers: (builder) => {},
})

export const { openDialog, closeDialog } = leaveHistorySlice.actions

export default leaveHistorySlice.reducer
