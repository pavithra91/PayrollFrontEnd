import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

export type DashboardState = {
    loading: boolean
    newAdvanceDialog: boolean
}

export const SLICE_NAME = 'dashboard'

const initialState: DashboardState = {
    loading: false,
    newAdvanceDialog: false,
}

const dashboardSlice = createSlice({
    name: `${SLICE_NAME}/state`,
    initialState,
    reducers: {
        toggleNewAdvanceDialog: (state, action) => {
            state.newAdvanceDialog = action.payload
        },
    },
    extraReducers: (builder) => {
        //builder
        // .addCase(putLeave.fulfilled, (state, action) => {
        //     state.leaveTypeList = action.payload
        // })
    },
})

export const { toggleNewAdvanceDialog } = dashboardSlice.actions

export default dashboardSlice.reducer
