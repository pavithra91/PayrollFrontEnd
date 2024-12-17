import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { TableQueries } from '@/@types/common'
import {
    apiGetSupervisorData,
    apiGetSupervisorDataByCo,
} from '@/services/LeaveService'
import {
    apiAddSupervisor,
    apiEditSupervisor,
    apiGetEmployeeData,
} from '@/services/EmployeeService'

export type AllSupervisorData = {
    isActive: boolean
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

type AddSupervisorRequest = {
    userId: string
    epf: string
    isActive: boolean
    createdBy?: string
}

type SupervisorRequest = {
    costCenter: string
}

type EditSupervisorRequest = {
    userId?: string
    epf: string
    isActive: boolean
    isManager: boolean
    createdBy?: string
}

export type Row = AllSupervisorData

type SupervisorData = AllSupervisorData[]
type EmployeeData = AllSupervisorData[]

type AddSupervisorResponse = SupervisorData
type EditSupervisorResponse = SupervisorData

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
    async (costCenter: any) => {
        const response = await apiGetSupervisorDataByCo<
            GetSupervisorDataResponse,
            SupervisorRequest
        >(costCenter)
        return response.data
    }
)

export const getEmployeeData = createAsyncThunk(
    SLICE_NAME + '/getEmployeeDataList',
    async () => {
        const response = await apiGetEmployeeData<GetEmployeeDataResponse>()
        return response.data
    }
)

export const addSupervisor = createAsyncThunk(
    SLICE_NAME + '/addSupervisorList',
    async (data: AddSupervisorRequest) => {
        const response = await apiAddSupervisor<
            AddSupervisorResponse,
            AddSupervisorRequest
        >(data)

        const supervisorResponse =
            await apiGetSupervisorData<GetSupervisorDataResponse>()

        return supervisorResponse.data
    }
)

export const editSupervisor = createAsyncThunk(
    SLICE_NAME + '/editSupervisorList',
    async (data: EditSupervisorRequest) => {
        const response = await apiEditSupervisor<
            EditSupervisorResponse,
            EditSupervisorRequest
        >(data)

        const supervisorResponse =
            await apiGetSupervisorData<GetSupervisorDataResponse>()

        return supervisorResponse.data
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
    editSupervisorDialog: boolean
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
    editSupervisorDialog: false,
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
        toggleEditSupervisorDialog: (state, action) => {
            state.editSupervisorDialog = action.payload
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
            .addCase(addSupervisor.fulfilled, (state, action) => {
                state.supervisorData = action.payload.items
            })
            .addCase(editSupervisor.fulfilled, (state, action) => {
                state.supervisorData = action.payload.items
            })
    },
})

export const {
    setSupervisorData,
    setEmployeeData,
    setTableData,
    toggleNewSupervisorDialog,
    toggleEditSupervisorDialog,
    setSelectedRow,
} = supervisorSlice.actions

export default supervisorSlice.reducer
