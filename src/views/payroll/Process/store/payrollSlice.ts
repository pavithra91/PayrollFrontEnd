import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { TableQueries } from '@/@types/common'
import { apiGetPayrunByPeriod, apiProcessPayroll, apiSimulatePayroll } from '@/services/PayrunService'
import { ConfirmDataTransfer, PayrollDataSchema } from '@/@types/payroll'

export type AllPayrollData = {
    id: number
}

type ProcessPayrollRequest = {
    companyCode?: number
    period: number
    approvedBy: string
}

export type Row = AllPayrollData

type PayrollData = AllPayrollData[]

type ProcessPayrollResponse = PayrollData

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

export const SLICE_NAME = 'PayrollData'

export const getPayrunByPeriod = createAsyncThunk(
    SLICE_NAME + '/getPayrunByPeriod',
    async (data: PayrollDataSchema) => {
        const response = await apiGetPayrunByPeriod(data)
        return response.data
    }
)

export const simulatePayroll = createAsyncThunk(
    SLICE_NAME + '/simulatePayroll',
    async (data: ConfirmDataTransfer) => {
        const response = await apiSimulatePayroll(data)

        return response.data
    }
)

export const processPayroll = createAsyncThunk(
    SLICE_NAME + '/processPayroll',
    async (data: ConfirmDataTransfer) => {
        const response = await apiProcessPayroll(data)

        return response.data
    }
)

export type BungalowState = {
    loading: boolean
    payrollData: PayrollData
    tableData: TableQueries
    selectedRow: Partial<Row>
    processPayrollDialog: boolean
    unrecoveredDialog: boolean
}

const initialState: BungalowState = {
    loading: true,
    payrollData: [],
    tableData: initialTableData,
    selectedRow: {},
    processPayrollDialog: false,
    unrecoveredDialog: false,
}

const payrollSlice = createSlice({
    name: `${SLICE_NAME}/state`,
    initialState,
    reducers: {
        setTableData: (state, action) => {
            state.tableData = action.payload
        },
        setPayrollData: (state, action) => {
            state.payrollData = action.payload
        },
        toggleProcessPayrollDialog: (state, action) => {
            state.processPayrollDialog = action.payload
        },
        toggleUnrecoveredDialog: (state, action) => {
            state.unrecoveredDialog = action.payload
        },
        setSelectedRow: (state, action) => {
            state.selectedRow = action.payload
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(processPayroll.fulfilled, (state, action) => {
                state.loading = false
            })
            .addCase(processPayroll.pending, (state) => {
                state.loading = true
            })
    },
})

export const {
    setPayrollData,
    setTableData,
    toggleProcessPayrollDialog,
    toggleUnrecoveredDialog,
    setSelectedRow,
} = payrollSlice.actions

export default payrollSlice.reducer