import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { TableQueries } from '@/@types/common'
import {
    apiDeleteAdvancePayments,
    apiGetAdvancePayments,
    apiProcessAdvancePayments,
} from '@/services/EmployeeService'

export type AllAdvancePaymentData = {
    id: number
    epf: string
    empName: string
    period: string
    status: string
    isFullAmount?: boolean
    amount?: number
}

type AdvancePaymentRequest = {
    companyCode?: number
    period: string
    processBy: string
}

type AdvancePaymentData = AllAdvancePaymentData[]

type GetAdvancePaymentResponse = {
    items: AdvancePaymentData
    total: number
}

export type Row = AllAdvancePaymentData

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

export const SLICE_NAME = 'AdvancePaymentData'

export const getAdvancePaymentData = createAsyncThunk(
    SLICE_NAME + '/getAdvancePaymentDataList',
    async (period: any) => {
        const response = await apiGetAdvancePayments<
            GetAdvancePaymentResponse,
            AdvancePaymentRequest
        >(period)
        return response.data
    }
)

export const processAdvancePaymentData = createAsyncThunk(
    SLICE_NAME + '/processAdvancePaymentData',
    async (period: AdvancePaymentRequest) => {
        const response = await apiProcessAdvancePayments(period)
        console.log(response)
        return response.data
    }
)

export type AdvancePaymentState = {
    loading: boolean
    advancePaymentData: AdvancePaymentData
    tableData: TableQueries
    selectedRow: Partial<Row>
    newAdvancePaymentDialog: boolean
    editSupervisorDialog: boolean
}

const initialState: AdvancePaymentState = {
    loading: true,
    advancePaymentData: [],
    tableData: initialTableData,
    selectedRow: {},
    newAdvancePaymentDialog: false,
    editSupervisorDialog: false,
}

const supervisorSlice = createSlice({
    name: `${SLICE_NAME}/state`,
    initialState,
    reducers: {
        setTableData: (state, action) => {
            state.tableData = action.payload
        },
        setAdvancePaymentData: (state, action) => {
            state.advancePaymentData = action.payload
        },
        toggleAdvancePaymentDialog: (state, action) => {
            state.newAdvancePaymentDialog = action.payload
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
            .addCase(getAdvancePaymentData.fulfilled, (state, action) => {
                state.loading = false
                state.advancePaymentData = action.payload.items
                state.tableData.total = 1
            })
            .addCase(getAdvancePaymentData.pending, (state) => {
                state.loading = true
            })
            .addCase(processAdvancePaymentData.fulfilled, (state, action) => {
                console.log(action.payload)
            })
        // .addCase(editSupervisor.fulfilled, (state, action) => {
        //     state.advancePaymentData = action.payload.items
        // })
    },
})

export const {
    setAdvancePaymentData,
    setTableData,
    toggleAdvancePaymentDialog,
    toggleEditSupervisorDialog,
    setSelectedRow,
} = supervisorSlice.actions

export default supervisorSlice.reducer
