import { useEffect } from 'react'
import { AdaptableCard } from '@/components/shared'
import { injectReducer } from '@/store'
import reducer, {
    AllScheduleJobsData,
    getScheduleJobsData,
    useAppDispatch,
    useAppSelector,
} from './store'
import ScheduleJobsData from './components/ScheduleJobsData'

injectReducer('JobsData', reducer)

const ScheduleJobs = () => {
    const dispatch = useAppDispatch()

    const data = useAppSelector((state) => state.JobsData.data.scheduleJobsData)

    const loading = useAppSelector((state) => state.JobsData.data.loading)

    const tableData = useAppSelector((state) => state.JobsData.data.tableData)

    console.log(data)

    useEffect(() => {
        fetchData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch, tableData])

    const fetchData = () => {
        dispatch(getScheduleJobsData())
    }

    return (
        <>
            <AdaptableCard>
                <ScheduleJobsData
                    {...{
                        data: data as AllScheduleJobsData[],
                        loading,
                        tableData,
                    }}
                />
            </AdaptableCard>
        </>
    )
}

export default ScheduleJobs
