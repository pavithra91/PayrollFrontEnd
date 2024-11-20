import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { TableQueries } from '@/@types/common'
import {
    apiGetEmployeeData,
    apiGetSupervisorData,
} from '@/services/LeaveService'

type Approver = {
    level: string
    userId: string
    epf: string
    name?: string
}
export type AllEmployeeData = {
    id: number
    epf: string
    approvalLevel: string
    supervisorList?: Approver[]
    name?: string
}

export type AllSupervisorData = {
    id: number
    epf: string
    userId?: string
    isActive?: boolean
    createdBy?: string
}

export type Row = AllEmployeeData

type EmployeeData = AllEmployeeData[]
type SupervisorData = AllSupervisorData[]

type GetEmpDataResponse = {
    data: EmployeeData
    total: number
}

type GetSupervisorDataResponse = {
    items: AllSupervisorData[]
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

export const SLICE_NAME = 'empData'

export const getEmployeeData = createAsyncThunk(
    SLICE_NAME + '/getEmployeeDataList',
    async () => {
        const response = await apiGetEmployeeData<GetEmpDataResponse>()

        return response.data
    }
)

export const getSupervisorData = createAsyncThunk(
    SLICE_NAME + '/getSupervisorList',
    async () => {
        const response = await apiGetSupervisorData<GetSupervisorDataResponse>()
        return response.data.items
    }
)

export type EmployeeDataState = {
    loading: boolean
    employeeData: EmployeeData
    supervisorData: SupervisorData
    tableData: TableQueries
    // selectedTab: string
    tradeDialogOpen: boolean
    selectedRow: Partial<Row>
    newAssignLevelDialog: boolean
}

const initialState: EmployeeDataState = {
    loading: true,
    employeeData: [],
    supervisorData: [],
    tableData: initialTableData,
    // selectedTab: 'all',
    tradeDialogOpen: false,
    selectedRow: {},
    newAssignLevelDialog: false,
}

const employeeSlice = createSlice({
    name: `${SLICE_NAME}/state`,
    initialState,
    reducers: {
        setTableData: (state, action) => {
            state.tableData = action.payload
        },
        setEmployeeData: (state, action) => {
            state.employeeData = action.payload
        },
        setSupervisorData: (state, action) => {
            state.supervisorData = action.payload
        },
        toggleTradeDialog: (state, action) => {
            state.tradeDialogOpen = action.payload
        },
        toggleNewAssignLevelDialog: (state, action) => {
            state.newAssignLevelDialog = action.payload
        },
        setSelectedRow: (state, action) => {
            state.selectedRow = action.payload
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getEmployeeData.fulfilled, (state, action) => {
                state.loading = false
                state.employeeData = action.payload.data
                state.tableData.total = action.payload.total
            })
            .addCase(getEmployeeData.pending, (state) => {
                state.loading = true
            })
            .addCase(getSupervisorData.fulfilled, (state, action) => {
                state.supervisorData = action.payload
            })
    },
})

export const {
    setEmployeeData,
    setTableData,
    setSupervisorData,
    toggleTradeDialog,
    toggleNewAssignLevelDialog,
    setSelectedRow,
} = employeeSlice.actions

export default employeeSlice.reducer
