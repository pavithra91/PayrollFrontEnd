import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { TableQueries } from '@/@types/common'
import { apiGetSupervisorData } from '@/services/LeaveService'
import { apiGetEmployeeData } from '@/services/EmployeeService'

export type AllSupervisorData = {
    id: number
    epf: string
    empName: string
    grade: string
    isManager: boolean
}

export type AllEmployeeData = {
    id: number
    epf: string
    empName: string
    grade: string
    costCenter: string
    // isManager: boolean
}

export type Row = AllSupervisorData

type SupervisorData = AllSupervisorData[]
type EmployeeData = AllSupervisorData[]

type GetSupervisorDataResponse = {
    items: SupervisorData
    total: number
}

type GetEmployeeDataResponse = {
    items: EmployeeData
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

export const SLICE_NAME = 'SupervisorData'

export const getSupervisorData = createAsyncThunk(
    SLICE_NAME + '/getSupervisorDataList',
    async () => {
        const response = await apiGetSupervisorData<GetSupervisorDataResponse>()
        return response.data
    }
)

export const getEmployeeData = createAsyncThunk(
    SLICE_NAME + '/getEmployeeDataList',
    async () => {
        const response = await apiGetEmployeeData<GetEmployeeDataResponse>()
        console.log(response.data)
        return response.data
    }
)

export type SupervisorState = {
    loading: boolean
    supervisorData: SupervisorData
    employeeData: EmployeeData
    tableData: TableQueries
    // selectedTab: string
    //tradeDialogOpen: boolean
    selectedRow: Partial<Row>
    newSupervisorDialog: boolean
}

const initialState: SupervisorState = {
    loading: true,
    supervisorData: [],
    employeeData: [],
    tableData: initialTableData,
    // selectedTab: 'all',
    //tradeDialogOpen: false,
    selectedRow: {},
    newSupervisorDialog: false,
}

const supervisorSlice = createSlice({
    name: `${SLICE_NAME}/state`,
    initialState,
    reducers: {
        setTableData: (state, action) => {
            state.tableData = action.payload
        },
        setSupervisorData: (state, action) => {
            state.supervisorData = action.payload
        },
        setEmployeeData: (state, action) => {
            state.employeeData = action.payload
        },
        toggleNewSupervisorDialog: (state, action) => {
            state.newSupervisorDialog = action.payload
        },
        setSelectedRow: (state, action) => {
            state.selectedRow = action.payload
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getSupervisorData.fulfilled, (state, action) => {
                state.loading = false
                state.supervisorData = action.payload.items
                state.tableData.total = 1
            })
            .addCase(getSupervisorData.pending, (state) => {
                state.loading = true
            })
            .addCase(getEmployeeData.fulfilled, (state, action) => {
                state.employeeData = action.payload.items
            })
    },
})

export const {
    setSupervisorData,
    setEmployeeData,
    setTableData,
    toggleNewSupervisorDialog,
    setSelectedRow,
} = supervisorSlice.actions

export default supervisorSlice.reducer
