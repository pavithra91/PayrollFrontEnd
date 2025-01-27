import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { TableQueries } from '@/@types/common'
import { apiGetRaffleDrawData } from '@/services/ReservationService'

export type AllRaffleDrawData = {
    id: number
    companyCode?: number
    bungalowName?: string
    rank: number
    epf: string
    empName: string
    contactNumber: string
    noOfPax: number
    checkInDate: string | Date
    checkOutDate: string | Date
    cost: number
}

type RaffleDrawRequest = {
    raffleDrawDate: string
}

export type Row = AllRaffleDrawData

type RaffleDrawData = AllRaffleDrawData[]

type GetRaffleDrawResponse = {
    items: RaffleDrawData
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

export const SLICE_NAME = 'RaffleDrawData'

export const getRaffleDrawData = createAsyncThunk(
    SLICE_NAME + '/getRaffleDrawData',
    async (data: any) => {
        const response = await apiGetRaffleDrawData<
            GetRaffleDrawResponse,
            RaffleDrawRequest
        >(data)

        return response.data
    }
)

export type RaffleDrawState = {
    loading: boolean
    raffleDrawData: RaffleDrawData
    tableData: TableQueries
    selectedRow: Partial<Row>
}

const initialState: RaffleDrawState = {
    loading: true,
    raffleDrawData: [],
    tableData: initialTableData,
    selectedRow: {},
}

const raffleDrawSlice = createSlice({
    name: `${SLICE_NAME}/state`,
    initialState,
    reducers: {
        setTableData: (state, action) => {
            state.tableData = action.payload
        },
        setRaffleDrawData: (state, action) => {
            state.raffleDrawData = action.payload
        },
        setSelectedRow: (state, action) => {
            state.selectedRow = action.payload
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getRaffleDrawData.fulfilled, (state, action) => {
                state.loading = false
                state.raffleDrawData = action.payload.items
                state.tableData.total = 1
            })
            .addCase(getRaffleDrawData.pending, (state) => {
                state.loading = true
            })
    },
})

export const { setRaffleDrawData, setTableData, setSelectedRow } =
    raffleDrawSlice.actions

export default raffleDrawSlice.reducer
