import { useEffect } from 'react'
import { AdaptableCard } from '@/components/shared'
import { injectReducer } from '@/store'
import reducer, {
    AllReservationData,
    getReservationData,
    useAppDispatch,
    useAppSelector,
} from './store'
import { useLocation } from 'react-router-dom'
import useCommon from '@/utils/hooks/useCommon'

injectReducer('ReservationData', reducer)

const BookingConfirmation = () => {
    const dispatch = useAppDispatch()
    const location = useLocation()
    const { getUserFromLocalStorage } = useCommon()

    const { notification } = location.state || {}
    console.log(notification)

    // useEffect(() => {
    //     fetchData()
    // }, [dispatch, notification])

    // const fetchData = () => {
    //     dispatch(getReservationData(notification.id))
    // }
    return (
        <>
            <AdaptableCard></AdaptableCard>
        </>
    )
}

export default BookingConfirmation
