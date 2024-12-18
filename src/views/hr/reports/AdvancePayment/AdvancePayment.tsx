import { useEffect } from 'react'
import { AdaptableCard } from '@/components/shared'
import { injectReducer } from '@/store'
import reducer, {
    AllAdvancePaymentData,
    getAdvancePaymentData,
    useAppDispatch,
    useAppSelector,
} from './store'
import useCommon from '@/utils/hooks/useCommon'
import AdvancePaymentData from './components/AdvancePaymentData'

injectReducer('AdvancePaymentData', reducer)

const AdvancePayment = () => {
    const dispatch = useAppDispatch()
    const { getUserFromLocalStorage } = useCommon()

    const data = useAppSelector(
        (state) => state.AdvancePaymentData.data.advancePaymentData
    )

    const loading = useAppSelector(
        (state) => state.AdvancePaymentData.data.loading
    )

    const tableData = useAppSelector(
        (state) => state.AdvancePaymentData.data.tableData
    )

    useEffect(() => {
        fetchData()
    }, [dispatch, tableData])

    const fetchData = () => {
        dispatch(getAdvancePaymentData(getUserFromLocalStorage().epf))
    }

    return (
        <>
            <AdaptableCard>
                <AdvancePaymentData
                    {...{
                        data: data as AllAdvancePaymentData[],
                        loading,
                        tableData,
                    }}
                />
            </AdaptableCard>
        </>
    )
}
export default AdvancePayment
