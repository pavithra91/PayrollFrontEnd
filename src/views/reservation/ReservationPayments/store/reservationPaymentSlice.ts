import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { TableQueries } from '@/@types/common'
import { apiGetPaymentData } from '@/services/ReservationService'

export type AllPaymentData = {
    reservationId: number
    epf?: string
    checkInDate: string
    checkOutDate: string
    categoryName: string
    status: string
    amount: number
    chargeType: string
}

type GetPaymentRequest = {
    category?: number
    fromDate: Date | string
    toDate: Date | string
}

export type Row = AllPaymentData

type PaymentData = AllPaymentData[]

type GetPaymentDataResponse = {
    items: PaymentData
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
}

export const SLICE_NAME = 'PaymentData'

export const getPaymentData = createAsyncThunk(
    SLICE_NAME + '/getPaymentData',
    async (data: GetPaymentRequest) => {
        const response = await apiGetPaymentData<
            GetPaymentDataResponse,
            GetPaymentRequest
        >(data)

        // const bungalowDataResponse =
        //     await apiGetBungalowData<GetBungalowDataResponse>()

        //return bungalowDataResponse.data
        return response.data
    }
)

export type PaymentState = {
    loading: boolean
    paymentData: PaymentData
    tableData: TableQueries
    selectedRow: Partial<Row>
    newPaymentDialog: boolean
}

const initialState: PaymentState = {
    loading: true,
    paymentData: [],
    tableData: initialTableData,
    selectedRow: {},
    newPaymentDialog: false,
}

const reservationPaymentSlice = createSlice({
    name: `${SLICE_NAME}/state`,
    initialState,
    reducers: {
        setTableData: (state, action) => {
            state.tableData = action.payload
        },
        setPaymentData: (state, action) => {
            state.paymentData = action.payload
        },
        toggleNewPaymentDialog: (state, action) => {
            state.newPaymentDialog = action.payload
        },
        setSelectedRow: (state, action) => {
            state.selectedRow = action.payload
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getPaymentData.fulfilled, (state, action) => {
                state.loading = false
                state.paymentData = action.payload.items
                state.tableData.total = 1
            })
            .addCase(getPaymentData.pending, (state) => {
                state.loading = true
            })
        // .addCase(addBungalow.fulfilled, (state, action) => {
        //     state.bungalowData = action.payload.items
        // })
        // .addCase(editBungalow.fulfilled, (state, action) => {
        //     state.bungalowData = action.payload.items
        // })
    },
})

export const {
    setPaymentData,
    setTableData,
    toggleNewPaymentDialog,
    setSelectedRow,
} = reservationPaymentSlice.actions

export default reservationPaymentSlice.reducer
