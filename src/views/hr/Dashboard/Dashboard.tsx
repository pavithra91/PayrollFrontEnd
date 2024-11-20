import ActionBar from './components/ActionBar'
import LeaveCard from './components/LeaveCard'
import NewLeaveDialog from './components/NewAdvanceDialog'
import LeaveHistory from './components/LeaveHistory'
import { useEffect, useState } from 'react'
import useLeave from '@/utils/hooks/useLeave'
import useCommon from '@/utils/hooks/useCommon'
import { injectReducer } from '@/store'
import reducer from './store'

const colors = ['red-500', 'green-500', 'yellow-500', 'purple-500', 'blue-500']

injectReducer('dashboard', reducer)

type LeaveHistory = {
    epf: string
    leaveTypeName: string
    startDate: string
    endDate: string
    lieuLeaveDate: string
    reason: string
    isHalfDay: boolean
    actingDelegate: string
    actingDelegateApprovalStatus: string
    currentLevel: number
    requestStatus: string
}

type LeaveBalance = {
    epf: string
    leaveTypeName: string
    year: number
    allocatedLeave: number
    usedLeave: number
    remainingLeave: number
    carrForwardLeave: number
}

type LeaveHistoryResponse = {
    leaveHistory: LeaveHistory[]
}

type LeaveBalanceResponse = {
    leaveBalance: LeaveBalance[]
}

const Dashboard = () => {
    const { getLeaveDashboardData } = useLeave()
    const { getUserFromLocalStorage } = useCommon()

    const [leaveBalance, setLeaveBalance] = useState<LeaveBalance[]>([])
    const [leaveHistory, setLeaveHistory] = useState<LeaveHistory[]>([])

    useEffect(() => {
        const result = getLeaveDashboardData(getUserFromLocalStorage().epf)
        result.then((res) => {
            const leaveHistoryData: LeaveHistory[] =
                (res?.data as LeaveHistoryResponse)?.leaveHistory || []

            const leaveBalanceData: LeaveBalance[] =
                (res?.data as LeaveBalanceResponse)?.leaveBalance || []

            setLeaveBalance(leaveBalanceData)
            setLeaveHistory(leaveHistoryData)
        })
    }, [])

    return (
        <>
            <ActionBar />
            <NewLeaveDialog />
            <div className="grid grid-cols-4 sm:grid-cols-4 gap-4">
                {leaveBalance.map((leave, index) => (
                    <LeaveCard
                        key={index}
                        className="xl:col-span-1"
                        data={leave}
                        colour={colors[index % colors.length]}
                    />
                ))}
            </div>

            <div className="grid grid-flow-row auto-rows-max gap-4 mt-4">
                <LeaveHistory data={leaveHistory} />
            </div>
        </>
    )
}

export default Dashboard
