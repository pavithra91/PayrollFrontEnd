import { useEffect } from 'react'
import { AdaptableCard } from '@/components/shared'
import { injectReducer } from '@/store'
import reducer, {
    getEmployeeData,
    useAppDispatch,
    useAppSelector,
    AllEmployeeData,
    getSupervisorData,
} from './store'
import EmployeeData from './components/EmployeeData'
import useCommon from '@/utils/hooks/useCommon'

injectReducer('empData', reducer)

const AssignApprovalLevels = () => {
    const dispatch = useAppDispatch()
    const { getUserFromLocalStorage } = useCommon()

    const data = useAppSelector((state) => state.empData.data.employeeData)

    const loading = useAppSelector((state) => state.empData.data.loading)

    const tableData = useAppSelector((state) => state.empData.data.tableData)

    useEffect(() => {
        fetchData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch, tableData])

    const fetchData = () => {
        dispatch(getEmployeeData())
        dispatch(getSupervisorData(getUserFromLocalStorage().costCenter))
    }

    return (
        <>
            <AdaptableCard>
                <EmployeeData
                    {...{
                        data: data as AllEmployeeData[],
                        loading,
                        tableData,
                    }}
                />

                {/* <AssignApproverDialog  /> */}
            </AdaptableCard>
        </>
    )
}

export default AssignApprovalLevels
