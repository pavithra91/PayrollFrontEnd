import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { TableQueries } from '@/@types/common'
import {
    apiAddBungalow,
    apiGetBungalowData,
} from '@/services/ReservationService'

export type AllBungalowData = {
    id: number
    companyCode?: number
    bungalowName: string
    description: string
    address: string
    mainImg: string
    noOfRooms: number
    perDayCost: number
    maxBookingPeriod: number
    isCloded: boolean
    reopenDate?: string | null
    contactNumber: string
    createdBy: string
}

type AddBungalowRequest = {
    companyCode?: number
    bungalowName: string
    description: string
    address: string
    mainImg: string
    noOfRooms: number
    perDayCost: number
    maxBookingPeriod: number
    isCloded: boolean
    reopenDate?: string | null
    contactNumber: string
    createdBy: string
}

type EditBungalowRequest = {
    id: number
    companyCode?: number
    bungalowName: string
    description: string
    address: string
    mainImg?: string
    noOfRooms: number
    perDayCost: number
    maxOccupancy: number
    maxBookingPeriod: number
    isCloded: boolean
    reopenDate: string
    contactNumber: string
    createdBy: string
}

export type Row = AllBungalowData

type BungalowData = AllBungalowData[]

type AddBungalowResponse = BungalowData
type EditBungalowResponse = BungalowData

type GetBungalowDataResponse = {
    items: BungalowData
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

export const SLICE_NAME = 'BungalowData'

export const getBungalowData = createAsyncThunk(
    SLICE_NAME + '/getBungalowDataList',
    async () => {
        const response = await apiGetBungalowData<GetBungalowDataResponse>()
        return response.data
    }
)

export const addBungalow = createAsyncThunk(
    SLICE_NAME + '/addBungalowList',
    async (data: AddBungalowRequest) => {
        const response = await apiAddBungalow<
            AddBungalowResponse,
            AddBungalowRequest
        >(data)

        const supervisorResponse =
            await apiGetBungalowData<GetBungalowDataResponse>()

        return supervisorResponse.data
    }
)

// export const editBungalow = createAsyncThunk(
//     SLICE_NAME + '/editBungalowList',
//     async (data: EditBungalowRequest) => {
//         const response = await apiEditBungalow<
//             EditBungalowResponse,
//             EditBungalowRequest
//         >(data)

//         const supervisorResponse =
//             await apiGetBungalowData<GetBungalowDataResponse>()

//         return supervisorResponse.data
//     }
// )

export type BungalowState = {
    loading: boolean
    bungalowData: BungalowData
    tableData: TableQueries
    selectedRow: Partial<Row>
    newBungalowDialog: boolean
    editBungalowDialog: boolean
}

const initialState: BungalowState = {
    loading: true,
    bungalowData: [],
    tableData: initialTableData,
    selectedRow: {},
    newBungalowDialog: false,
    editBungalowDialog: false,
}

const bungalowSlice = createSlice({
    name: `${SLICE_NAME}/state`,
    initialState,
    reducers: {
        setTableData: (state, action) => {
            state.tableData = action.payload
        },
        setBungalowData: (state, action) => {
            state.bungalowData = action.payload
        },
        toggleNewBungalowDialog: (state, action) => {
            state.newBungalowDialog = action.payload
        },
        toggleEditBungalowDialog: (state, action) => {
            state.editBungalowDialog = action.payload
        },
        setSelectedRow: (state, action) => {
            state.selectedRow = action.payload
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getBungalowData.fulfilled, (state, action) => {
                state.loading = false
                state.bungalowData = action.payload.items
                state.tableData.total = 1
            })
            .addCase(getBungalowData.pending, (state) => {
                state.loading = true
            })
            .addCase(addBungalow.fulfilled, (state, action) => {
                state.bungalowData = action.payload.items
            })
        // .addCase(editBungalow.fulfilled, (state, action) => {
        //     state.bungalowData = action.payload.items
        // })
    },
})

export const {
    setBungalowData,
    setTableData,
    toggleNewBungalowDialog,
    toggleEditBungalowDialog,
    setSelectedRow,
} = bungalowSlice.actions

export default bungalowSlice.reducer
