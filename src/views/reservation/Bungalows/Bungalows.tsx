import { useEffect } from 'react'
import { AdaptableCard } from '@/components/shared'
import { injectReducer } from '@/store'
import reducer, {
    AllBungalowData,
    getBungalowData,
    useAppDispatch,
    useAppSelector,
} from './store'
import useCommon from '@/utils/hooks/useCommon'
import BungalowData from './components/BungalowData'

injectReducer('BungalowData', reducer)

const Bungalows = () => {
    const dispatch = useAppDispatch()
    const { getUserFromLocalStorage } = useCommon()

    const data = useAppSelector((state) => state.BungalowData.data.bungalowData)

    const loading = useAppSelector((state) => state.BungalowData.data.loading)

    const tableData = useAppSelector(
        (state) => state.BungalowData.data.tableData
    )

    useEffect(() => {
        fetchData()
    }, [dispatch, tableData])

    const fetchData = () => {
        dispatch(getBungalowData())
    }

    return (
        <>
            <AdaptableCard>
                <BungalowData
                    {...{
                        data: data as AllBungalowData[],
                        loading,
                        tableData,
                    }}
                />
            </AdaptableCard>
        </>
    )
}

export default Bungalows
