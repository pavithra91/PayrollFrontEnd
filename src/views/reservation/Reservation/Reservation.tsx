import { useEffect } from 'react'
import { AdaptableCard } from '@/components/shared'
import { injectReducer } from '@/store'
import reducer, {
    AllReservationData,
    getReservationData,
    useAppDispatch,
    useAppSelector,
} from './store'
import useCommon from '@/utils/hooks/useCommon'
import ReservationData from './components/ReservationData'

injectReducer('ReservationData', reducer)

const Reservation = () => {
    const dispatch = useAppDispatch()
    const { getUserFromLocalStorage } = useCommon()

    const data = useAppSelector(
        (state) => state.ReservationData.data.reservationData
    )

    const loading = useAppSelector(
        (state) => state.ReservationData.data.loading
    )

    const tableData = useAppSelector(
        (state) => state.ReservationData.data.tableData
    )

    useEffect(() => {
        fetchData()
    }, [dispatch, tableData])

    const fetchData = () => {
        dispatch(getReservationData(getUserFromLocalStorage().epf))
    }

    return (
        <>
            <AdaptableCard>
                <ReservationData
                    {...{
                        data: data as AllReservationData[],
                        loading,
                        tableData,
                    }}
                />
            </AdaptableCard>
        </>
    )
}

export default Reservation
