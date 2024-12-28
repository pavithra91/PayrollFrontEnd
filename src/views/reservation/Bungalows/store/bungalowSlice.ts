import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { TableQueries } from '@/@types/common'
import {
    apiAddBungalow,
    apiEditBungalow,
    apiGetBungalowData,
    apiGetBungalowDataById,
    apiGetCategoryData,
    apiUpdateBungalowRates,
} from '@/services/ReservationService'
import { boolean } from 'yup'

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
    maxOccupancy: number
    isCloded: boolean
    reopenDate?: string | null
    contactNumber: string
    createdBy: string
    bungalowRates: bungalowRates
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
    maxOccupancy: number
    isCloded: boolean
    reopenDate?: string | null
    contactNumber: string
    createdBy: string
}

type rates = {
    rateId: number
    categoryName: string
    amount: number
}
export type bungalowRates = {
    bungalowId: number
    rates: rates[]
    lastupdateBy?: string
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
    reopenDate?: string | null
    contactNumber: string
    lastUpdateBy: string
}

export type Row = AllBungalowData

type BungalowData = AllBungalowData[]

type AddBungalowResponse = BungalowData
type EditBungalowResponse = BungalowData

type GetBungalowDataResponse = {
    items: BungalowData
    total: number
}

type BungalowResponse = {
    id: number
    companyCode: number
    bungalowName: string
    description: string
    address: string
    mainImg: string
    noOfRooms: number
    maxBookingPeriod: number
    maxOccupancy: number
    isCloded: boolean
    reopenDate: string | Date
    contactNumber: string
    createdBy: string
    bungalowRates: bungalowRates
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

export const getBungalowDataById = createAsyncThunk(
    SLICE_NAME + '/getBungalowDataById',
    async (id: number) => {
        const response = await apiGetBungalowDataById<BungalowResponse>(id)
        return response.data
    }
)

export const getCategoryData = createAsyncThunk(
    SLICE_NAME + '/getCategoryDataList',
    async () => {
        const response = await apiGetCategoryData<GetBungalowDataResponse>()
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

        const bungalowDataResponse =
            await apiGetBungalowData<GetBungalowDataResponse>()

        return bungalowDataResponse.data
    }
)

export const editBungalow = createAsyncThunk(
    SLICE_NAME + '/editBungalowList',
    async (data: EditBungalowRequest) => {
        const response = await apiEditBungalow<
            EditBungalowResponse,
            EditBungalowRequest
        >(data)

        const bungalowDataResponse =
            await apiGetBungalowData<GetBungalowDataResponse>()

        return bungalowDataResponse.data
    }
)

export const updateBungalowRates = createAsyncThunk(
    SLICE_NAME + '/updateBungalowRates',
    async (data: bungalowRates) => {
        const response = await apiUpdateBungalowRates<
            AddBungalowResponse,
            bungalowRates
        >(data)

        return response.data
    }
)

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
            .addCase(editBungalow.fulfilled, (state, action) => {
                state.bungalowData = action.payload.items
            })
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
