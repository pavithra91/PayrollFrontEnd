import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { TableQueries } from '@/@types/common'
import { apiGetReservationById } from '@/services/ReservationService'
import { number } from 'yup'

export type AllReservationData = {
    id: number
    companyCode?: number
    bungalowName: string
    description: string
    address: string
    mainImg: string
    noOfRooms: number
    perDayCost: number
    maxBookingPeriod: number
    maxOccupancy: number
    isCloded: boolean
    reopenDate?: string | null
    contactNumber: string
    createdBy: string
}

export type Row = AllReservationData

type ReservationData = AllReservationData[]

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
    async (id: number) => {
        const response =
            await apiGetReservationById<GetReservationDataResponse>(id)
        return response.data
    }
)

export type ConfirmationState = {
    loading: boolean
    reservationData: ReservationData
    tableData: TableQueries
    selectedRow: Partial<Row>
    newReservationDialog: boolean
    editReservationDialog: boolean
}

const initialState: ConfirmationState = {
    loading: true,
    reservationData: [],
    tableData: initialTableData,
    selectedRow: {},
    newReservationDialog: false,
    editReservationDialog: false,
}

const confirmationSlice = createSlice({
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
        // .addCase(addBungalow.fulfilled, (state, action) => {
        //     state.bungalowData = action.payload.items
        // })
        // .addCase(editBungalow.fulfilled, (state, action) => {
        //     state.bungalowData = action.payload.items
        // })
    },
})

export const {
    setReservationData,
    setTableData,
    toggleNewReservationDialog,
    toggleEditReservationDialog,
    setSelectedRow,
} = confirmationSlice.actions

export default confirmationSlice.reducer
