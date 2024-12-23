import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { TableQueries } from '@/@types/common'
import {
    apiAddReservation,
    apiEditReservation,
    apiGetReservationData,
} from '@/services/ReservationService'

export type AllReservationData = {
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

type AddReservationRequest = {
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

type EditReservationRequest = {
    id: number
    epf: number
    bungalowid: number
    category: number
    checkInDate: string
    checkOutDate: string
    noOfAdults: number
    noOfChildren: number
    totalPax: number
    contactNumber_1: string
    contactNumber_2?: string
    lastUpdateBy: string
}

export type Row = AllReservationData

type ReservationData = AllReservationData[]

type AddReservationResponse = ReservationData
type EditReservationResponse = ReservationData

type GetReservationDataResponse = {
    items: ReservationData
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

export const SLICE_NAME = 'ReservationData'

export const getReservationData = createAsyncThunk(
    SLICE_NAME + '/getReservationDataList',
    async () => {
        const response =
            await apiGetReservationData<GetReservationDataResponse>()
        return response.data
    }
)

export const createReservation = createAsyncThunk(
    SLICE_NAME + '/createReservationList',
    async (data: AddReservationRequest) => {
        const response = await apiAddReservation<
            AddReservationResponse,
            AddReservationRequest
        >(data)

        const ReservatiorResponse =
            await apiGetReservationData<GetReservationDataResponse>()

        return ReservatiorResponse.data
    }
)

export const editReservation = createAsyncThunk(
    SLICE_NAME + '/editBungalowList',
    async (data: EditReservationRequest) => {
        const response = await apiEditReservation<
            EditReservationResponse,
            EditReservationRequest
        >(data)

        const reservationResponse =
            await apiGetReservationData<GetReservationDataResponse>()

        return reservationResponse.data
    }
)

export type ReservationState = {
    loading: boolean
    reservationData: ReservationData
    tableData: TableQueries
    selectedRow: Partial<Row>
    newReservationDialog: boolean
    editReservationDialog: boolean
}

const initialState: ReservationState = {
    loading: true,
    reservationData: [],
    tableData: initialTableData,
    selectedRow: {},
    newReservationDialog: false,
    editReservationDialog: false,
}

const reservationSlice = createSlice({
    name: `${SLICE_NAME}/state`,
    initialState,
    reducers: {
        setTableData: (state, action) => {
            state.tableData = action.payload
        },
        setReservationData: (state, action) => {
            state.reservationData = action.payload
        },
        toggleNewReservationDialog: (state, action) => {
            state.newReservationDialog = action.payload
        },
        toggleEditReservationDialog: (state, action) => {
            state.editReservationDialog = action.payload
        },
        setSelectedRow: (state, action) => {
            state.selectedRow = action.payload
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getReservationData.fulfilled, (state, action) => {
                state.loading = false
                state.reservationData = action.payload.items
                state.tableData.total = 1
            })
            .addCase(getReservationData.pending, (state) => {
                state.loading = true
            })
            .addCase(createReservation.fulfilled, (state, action) => {
                state.reservationData = action.payload.items
            })
            .addCase(editReservation.fulfilled, (state, action) => {
                state.reservationData = action.payload.items
            })
    },
})

export const {
    setReservationData,
    setTableData,
    toggleNewReservationDialog,
    toggleEditReservationDialog,
    setSelectedRow,
} = reservationSlice.actions

export default reservationSlice.reducer
