import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { apiGetLeaveTypeList } from '@/services/LeaveService'

export type LeaveType = {
    leaveTypeId: number
    leaveTypeName: string
    description: string
    maxDays: number
    carryForwardAllowed: boolean
}

type LeaveTypeList = LeaveType[]

export type LeaveTypeState = {
    loading: boolean
    leaveTypeList: LeaveTypeList
    newLeaveTypeDialog: boolean
    view: 'grid' | 'list'
    drawerOpen: boolean
    selectedLeaveType: Partial<LeaveType>
}

type GetLeaveTypeListResponse = LeaveTypeList

export const SLICE_NAME = 'leaveTypeList'

const initialState: LeaveTypeState = {
    loading: false,
    leaveTypeList: [],
    newLeaveTypeDialog: false,
    view: 'grid',
    drawerOpen: false,
    selectedLeaveType: {},
}

export const getList = createAsyncThunk(
    SLICE_NAME + '/getLeaveTypeList',
    async () => {
        const response = await apiGetLeaveTypeList<GetLeaveTypeListResponse>()
        return response.data
    }
)

// export const putLeave = createAsyncThunk(
//     SLICE_NAME + '/putLeave',
//     async (data: PutLeaveTypeRequest) => {
//         const response = await apiLeaveTypeRequest<
//             PutLeaveTypeResponse,
//             PutLeaveTypeRequest
//         >(data)
//         return response.data
//     }
// )

const leaveTypeSlice = createSlice({
    name: `${SLICE_NAME}/state`,
    initialState,
    reducers: {
        toggleView: (state, action) => {
            state.view = action.payload
        },
        toggleNewLeaveTypeDialog: (state, action) => {
            state.newLeaveTypeDialog = action.payload
        },
        setSelectedLeaveType: (state, action) => {
            state.selectedLeaveType = action.payload
        },
        setDrawerOpen: (state) => {
            state.drawerOpen = true
        },
        setDrawerClose: (state) => {
            state.drawerOpen = false
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getList.fulfilled, (state, action) => {
                state.leaveTypeList = action.payload
                state.loading = false
            })
            .addCase(getList.pending, (state) => {
                state.loading = true
            })
        // .addCase(putLeave.fulfilled, (state, action) => {
        //     state.leaveTypeList = action.payload
        // })
    },
})

export const {
    toggleView,
    toggleNewLeaveTypeDialog,
    setDrawerOpen,
    setDrawerClose,
    setSelectedLeaveType,
} = leaveTypeSlice.actions

export default leaveTypeSlice.reducer
