import { combineReducers } from '@reduxjs/toolkit'
import { useSelector } from 'react-redux'

import type { TypedUseSelectorHook } from 'react-redux'
import type { RootState } from '@/store'
import reducers, { SLICE_NAME, LeaveTypeState } from './leaveTypeSlice'

const reducer = combineReducers({
    data: reducers,
})

export const useAppSelector: TypedUseSelectorHook<
    RootState & {
        [SLICE_NAME]: {
            newLeaveTypeDialog: boolean
            data: LeaveTypeState
        }
    }
> = useSelector

export * from './leaveTypeSlice'
export { useAppDispatch } from '@/store'
export default reducer
