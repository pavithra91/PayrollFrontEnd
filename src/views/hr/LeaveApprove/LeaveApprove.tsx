import Dialog from '@/components/ui/Dialog'
import useLeave from '@/utils/hooks/useLeave'
import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import LeaveApproveForm from './components/LeaveApproveForm'

type LeaveRequestResponse = {
    leaveRequest: LeaveRequest
    approvals: Approvals[]
}

type LeaveRequest = {
    requestId: string
    epf: string
    leaveTypeName: string
    startDate: string
    endDate: string
    lieuLeaveDate: string
    reason: string
    isHalfDay: boolean
    halfDayType?: string
    actingDelegate: string
    actingDelegateApprovalStatus: string
    currentLevel: number
    requestStatus: string
}

type Approvals = {
    levelName: string
    approver: string
    status: string
}

const LeaveApprove = () => {
    const location = useLocation()
    const { getLeaveData } = useLeave()

    const { notification } = location.state || {}
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [data, setData] = useState<LeaveRequestResponse>()

    const openDialog = () => setIsDialogOpen(true)
    const closeDialog = () => setIsDialogOpen(false)

    useEffect(() => {
        if (notification) {
            openDialog()

            console.log(notification)

            const result = getLeaveData(notification.reference)
            result.then((res) => {
                const leaveRequest: LeaveRequestResponse =
                    (res?.data as LeaveRequestResponse) || []

                setData(leaveRequest)
                //console.log(leaveRequest)
            })
        }
    }, [notification])
    return (
        <>
            <h4>Leave Approval</h4>

            <Dialog
                isOpen={isDialogOpen}
                onClose={closeDialog}
                onRequestClose={closeDialog}
                width={800}
            >
                {/* <h4>Leave Request {data?.leaveRequest.epf}</h4>
                <div className="mt-4">

                </div> */}
                {data && <LeaveApproveForm leaveData={data} />}
            </Dialog>
        </>
    )
}

export default LeaveApprove
