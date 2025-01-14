import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { TableQueries } from '@/@types/common'
import { apiGetScheduleJobsData, apiPauseScheduleJobData, apiRunScheduleJobData } from '@/services/SettingsService'

export type AllScheduleJobsData = {
    id: number
    jobName: string
    groupName: string
    cronExpression: string
    isActive: boolean
    createdBy: string
}

export type Row = AllScheduleJobsData

type ScheduleJobsData = AllScheduleJobsData[]

type GetScheduleJobsDataResponse = {
    items: ScheduleJobsData
    total: number
}

type ScheduleJobRequest = {
    jobName: string
    lastUpdateBy?:string
}

export const initialTableData: TableQueries = {
    total: 0,
    pageIndex: 1,
    pageSize: 10,
    query: '',
    sort: {
        order: '',
        key: '',
    },
}

export const SLICE_NAME = 'JobsData'

export const getScheduleJobsData = createAsyncThunk(
    SLICE_NAME + '/getscheduleJobsDataList',
    async () => {
        const response =
            await apiGetScheduleJobsData<GetScheduleJobsDataResponse>()
        //console.log(response.data)
        return response.data
    }
)

export const pauseScheduleJob = createAsyncThunk(
    SLICE_NAME + '/pauseScheduleJob',
    async (jobName: ScheduleJobRequest) => {
        const response =
            await apiPauseScheduleJobData(jobName)
        console.log(response.data)
        return response.data
    }
)

export const runScheduleJob = createAsyncThunk(
    SLICE_NAME + '/runScheduleJob',
    async (jobName: ScheduleJobRequest) => {
        const response =
            await apiRunScheduleJobData(jobName)
        console.log(response.data)
        return response.data
    }
)

export type ScheduleJobsState = {
    loading: boolean
    scheduleJobsData: ScheduleJobsData
    tableData: TableQueries
    // selectedTab: string
    //tradeDialogOpen: boolean
    selectedRow: Partial<Row>
    newJobDialog: boolean
}

const initialState: ScheduleJobsState = {
    loading: true,
    scheduleJobsData: [],
    tableData: initialTableData,
    // selectedTab: 'all',
    //tradeDialogOpen: false,
    selectedRow: {},
    newJobDialog: false,
}

const scheduleJobsSlice = createSlice({
    name: `${SLICE_NAME}/state`,
    initialState,
    reducers: {
        setTableData: (state, action) => {
            state.tableData = action.payload
        },
        setScheduleJobsData: (state, action) => {
            state.scheduleJobsData = action.payload
        },
        toggleNewJobDialog: (state, action) => {
            state.newJobDialog = action.payload
        },
        setSelectedRow: (state, action) => {
            state.selectedRow = action.payload
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getScheduleJobsData.fulfilled, (state, action) => {
                state.loading = false
                state.scheduleJobsData = action.payload.items
                state.tableData.total = 1
            })
            .addCase(getScheduleJobsData.pending, (state) => {
                state.loading = true
            })
    },
})

export const {
    setScheduleJobsData,
    setTableData,
    toggleNewJobDialog,
    setSelectedRow,
} = scheduleJobsSlice.actions

export default scheduleJobsSlice.reducer
