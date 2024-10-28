import ViewPayrollActivities from './ViewPayrollActivities'
import { useLocation } from 'react-router-dom'

const PayrollActivities = () => {
    const location = useLocation()
    const { data } = location.state || {}
    return (
        <>
            <ViewPayrollActivities data={data} />
        </>
    )
}

export default PayrollActivities
