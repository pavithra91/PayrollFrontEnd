import { combineReducers } from '@reduxjs/toolkit'
import { useSelector } from 'react-redux'

import type { TypedUseSelectorHook } from 'react-redux'
import type { RootState } from '@/store'
import reducers, { SLICE_NAME, LeaveState } from './leaveSlice'

const reducer = combineReducers({
    data: reducers,
})

export const useAppSelector: TypedUseSelectorHook<
    RootState & {
        [SLICE_NAME]: {
            data: LeaveState
        }
    }
> = useSelector

export * from './leaveSlice'
export { useAppDispatch } from '@/store'
export default reducer
