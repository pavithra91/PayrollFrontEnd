import { useEffect } from 'react'
import { AdaptableCard } from '@/components/shared'
import { injectReducer } from '@/store'
import reducer, {
    AllSupervisorData,
    getEmployeeData,
    getSupervisorData,
    useAppDispatch,
    useAppSelector,
} from './store'
import SupervisorData from './components/SupervisorData'
import useCommon from '@/utils/hooks/useCommon'

injectReducer('SupervisorData', reducer)

const Supervisor = () => {
    const dispatch = useAppDispatch()
    const { getUserFromLocalStorage } = useCommon()

    const data = useAppSelector(
        (state) => state.SupervisorData.data.supervisorData
    )

    const loading = useAppSelector((state) => state.SupervisorData.data.loading)

    const tableData = useAppSelector(
        (state) => state.SupervisorData.data.tableData
    )

    // console.log(data)

    useEffect(() => {
        fetchData()
    }, [dispatch, tableData])

    const fetchData = () => {
        dispatch(getSupervisorData(getUserFromLocalStorage().costCenter))
        dispatch(getEmployeeData())
    }

    return (
        <>
            <AdaptableCard>
                <SupervisorData
                    {...{
                        data: data as AllSupervisorData[],
                        loading,
                        tableData,
                    }}
                />
            </AdaptableCard>
        </>
    )
}

export default Supervisor
