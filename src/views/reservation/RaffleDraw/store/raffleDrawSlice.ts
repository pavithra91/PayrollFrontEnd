import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { TableQueries } from '@/@types/common'
import { apiGetRaffleDrawData } from '@/services/ReservationService'

export type AllRaffleDrawData = {
    id: number
    epf: string
    companyCode?: number
    empName: string
    rank: number
    bungalowName: string
    contactNumber: string
    noOfPax: number
    checkInDate?: string | null
    checkOutDate?: string | null
    cost: number
}

type GetRaffleDrawDataRequest = {
    raffleDrawDate?: string | Date
}

export type Row = AllRaffleDrawData

type RaffleDrawData = AllRaffleDrawData[]

type GetRaffleDrawDataResponse = {
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
    SLICE_NAME + '/getRaffleDrawDataList',
    async (data: GetRaffleDrawDataRequest) => {
        const response = await apiGetRaffleDrawData<
            GetRaffleDrawDataResponse,
            GetRaffleDrawDataRequest
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
