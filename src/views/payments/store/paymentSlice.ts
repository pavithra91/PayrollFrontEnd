import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { TableQueries } from '@/@types/common'
import { apiGetVoucherData } from '@/services/PaymentService'


export type AllPaymentData = {
    id: number
    companyCode?: number
    epf: number
    bungalowid: number
    category: number
    checkInDate: string | Date
    checkOutDate: string | Date
    noOfAdults: number
    noOfChildren: number
    totalPax: number
    contactNumber_1: string
    contactNumber_2?: string
    createdBy: string
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
    SLICE_NAME + '/getPaymentDataList',
    async (data: string) => {
        const response =
            await apiGetVoucherData<GetPaymentDataResponse>(data)
        return response.data
    }
)

// export const createReservation = createAsyncThunk(
//     SLICE_NAME + '/createReservationList',
//     async (data: AddReservationRequest) => {
//         const response = await apiAddReservation<
//             AddReservationResponse,
//             AddReservationRequest
//         >(data)

//         const ReservatiorResponse =
//             await apiGetReservationData<GetReservationDataResponse>()

//         return ReservatiorResponse.data
//     }
// )

// export const editReservation = createAsyncThunk(
//     SLICE_NAME + '/editBungalowList',
//     async (data: EditReservationRequest) => {
//         const response = await apiEditReservation<
//             EditReservationResponse,
//             EditReservationRequest
//         >(data)

//         const reservationResponse =
//             await apiGetReservationData<GetReservationDataResponse>()

//         return reservationResponse.data
//     }
// )

export type PaymentState = {
    loading: boolean
    paymentData: PaymentData
    tableData: TableQueries
    selectedRow: Partial<Row>
    // newReservationDialog: boolean
    // editReservationDialog: boolean
}

const initialState: PaymentState = {
    loading: true,
    paymentData: [],
    tableData: initialTableData,
    selectedRow: {},
    // newReservationDialog: false,
    // editReservationDialog: false,
}

const paymentSlice = createSlice({
    name: `${SLICE_NAME}/state`,
    initialState,
    reducers: {
        setTableData: (state, action) => {
            state.tableData = action.payload
        },
        setPaymentData: (state, action) => {
            state.paymentData = action.payload
        },
        // toggleNewReservationDialog: (state, action) => {
        //     state.newReservationDialog = action.payload
        // },
        // toggleEditReservationDialog: (state, action) => {
        //     state.editReservationDialog = action.payload
        // },
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
            // .addCase(createReservation.fulfilled, (state, action) => {
            //     state.reservationData = action.payload.items
            // })
            // .addCase(editReservation.fulfilled, (state, action) => {
            //     state.reservationData = action.payload.items
            // })
    },
})

export const {
    setPaymentData,
    setTableData,
    //toggleNewReservationDialog,
    //toggleEditReservationDialog,
    setSelectedRow,
} = paymentSlice.actions

export default paymentSlice.reducer
