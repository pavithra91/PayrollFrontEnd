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

injectReducer('SupervisorData', reducer)

const Supervisor = () => {
    const dispatch = useAppDispatch()

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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch, tableData])

    const fetchData = () => {
        dispatch(getSupervisorData())
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
