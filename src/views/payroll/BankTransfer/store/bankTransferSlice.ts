import { createSlice, createAsyncThunk, current, PayloadAction } from '@reduxjs/toolkit'
import type { TableQueries } from '@/@types/common'
import { PayrollDataSchema } from '@/@types/payroll'
import { apiGetBankTransferSummary, apiGetPayrollSummary, apiStopEmpSalary } from '@/services/PayrunService'

export type AllPayrollData = {
    id: number
    empName: string
    grade: string
    epf: string
    total: number
}

type ApprovalData = 
{
    companyCode : number,
    period: number,
    approvedBy?: string
}


type BankTransferRequest = {
    companyCode?: number
    period: number
    approvedBy: string
}

export type Row = AllPayrollData

type PayrollData = AllPayrollData[]

// type BankTransferResponse = PayrollData

type BankTransferResponse = {
    data: PayrollData
    total: number
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
    companyCode:3000,
    period:0
}

export const SLICE_NAME = 'BankTransferData'

// export const getBankTransferData = createAsyncThunk(
//     SLICE_NAME + '/getBankTransferData',
//     async (data: PayrollDataSchema) => {
//         const response = await apiGetPayrollSummary(data)
//         return response.data
//     }
// )

export const getBankTransferData = createAsyncThunk(
    SLICE_NAME + '/getBankTransferData',
    async (data: TableQueries) => {
        const response = await apiGetBankTransferSummary<
        BankTransferResponse,
            TableQueries
        >(data)
        return response.data
    }
)

export const removeEmployeesFromBankList = async (data: { id: string | string[], companyCode?: number, period?: number, deleteBy?: string }) => {
    const response = await apiStopEmpSalary<
        boolean,
        { id: string | string[] }
    >(data)
    return response.data
}

export type BankTransferState = {
    loading: boolean
    payrollData: PayrollData
    tableData: TableQueries
    selectedRow: string
    comData: ApprovalData
    deleteMode: 'single' | 'batch' | ''
    selectedRows: string[]
}

const initialState: BankTransferState = {
    loading: true,
    payrollData: [],
    tableData: initialTableData,
    selectedRow: '',
    comData: {
        companyCode: 0,
        period: 0,
        approvedBy: ''
    },
    deleteMode: '',
    selectedRows: []
}

const bankTransferSlice = createSlice({
    name: `${SLICE_NAME}/state`,
    initialState,
    reducers: {
        setPayrollDataList: (state, action) => {
            state.payrollData = action.payload
        },
        setTableData: (state, action) => {
            state.tableData = action.payload
        },
        setSelectedRows: (state, action) => {
            state.selectedRows = action.payload
        },
        setSelectedRow: (state, action) => {
            state.selectedRow = action.payload
        },
        addRowItem: (state, { payload }) => {
            const currentState = current(state)
            if (!currentState.selectedRows.includes(payload)) {
                state.selectedRows = [...currentState.selectedRows, ...payload]
            }
        },
        removeRowItem: (state, { payload }: PayloadAction<string>) => {
            const currentState = current(state)
            if (currentState.selectedRows.includes(payload)) {
                state.selectedRows = currentState.selectedRows.filter(
                    (id) => id !== payload
                )
            }
        },
        setDeleteMode: (state, action) => {
            state.deleteMode = action.payload
        },
        setComData: (state, action) => {
            state.comData = action.payload
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getBankTransferData.fulfilled, (state, action) => {
                state.payrollData = action.payload.data
                state.tableData.total = action.payload.total
                state.loading = false
            })
            .addCase(getBankTransferData.pending, (state) => {
                state.loading = true
            })
    },
})

export const {
    setPayrollDataList,
    setTableData,
    setComData,
    setDeleteMode,
    setSelectedRows,
    addRowItem,
    removeRowItem,
    setSelectedRow,
} = bankTransferSlice.actions

export default bankTransferSlice.reducer