import Dialog from '@/components/ui/Dialog'
import useLeave from '@/utils/hooks/useLeave'
import { useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import LeaveApproveForm from './components/LeaveApproveForm'
import { injectReducer } from '@/store'
import reducer, {
    getLeaveApproveData,
    LeaveApproveData,
    useAppDispatch,
    useAppSelector,
} from './store'
import DataTable from '@/components/shared/DataTable'
import type { ColumnDef } from '@/components/shared/DataTable'
import useThemeClass from '@/utils/hooks/useThemeClass'

injectReducer('leaveApprove', reducer)

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

    const dispatch = useAppDispatch()

    const leaveApproveData = useAppSelector(
        (state) => state.leaveApprove.data.leaveApproveDataList
    )

    //console.log(leaveApproveData)

    const loading = useAppSelector((state) => state.leaveApprove.data.loading)

    useEffect(() => {
        if (notification) {
            dispatch(getLeaveApproveData())
            openDialog()

            const result = getLeaveData(notification.reference, notification.id)
            result.then((res) => {
                const leaveRequest: LeaveRequestResponse =
                    (res?.data as LeaveRequestResponse) || []

                setData(leaveRequest)
            })
        } else {
            dispatch(getLeaveApproveData())
        }
    }, [notification])

    const ActionColumn = ({ row }: { row: any }) => {
        const { textTheme } = useThemeClass()

        const onEdit = () => {
            //dispatch(setDrawerOpen())
            //dispatch(setSelectedLeaveType(row))

            console.log(row)
            const leaveRequests: LeaveRequestResponse = {
                leaveRequest: row.requestId,
                approvals: row.approver_id,
            }

            console.log(leaveRequests)

            setData(leaveRequests)
            openDialog()
        }

        return (
            <div
                className={`${textTheme} cursor-pointer select-none font-semibold`}
                onClick={onEdit}
            >
                Edit
            </div>
        )
    }

    const columns: ColumnDef<LeaveApproveData>[] = useMemo(
        () => [
            {
                header: 'Id',
                accessorKey: 'id',
            },
            {
                header: 'epf',
                accessorKey: 'epf',
            },
            {
                header: 'comments',
                accessorKey: 'comments',
            },
            {
                header: '',
                id: 'action',
                cell: (props) => <ActionColumn row={props.row.original} />,
            },
            // {
            //     header: 'Max Days',
            //     accessorKey: 'maxDays',
            // },
        ],
        []
    )
    return (
        <>
            <h4>Leave Approval</h4>

            <DataTable
                columns={columns}
                data={leaveApproveData}
                loading={loading}
                // pagingData={{
                //     total: tableData.total as number,
                //     pageIndex: tableData.pageIndex as number,
                //     pageSize: tableData.pageSize as number,
                // }}
                //onPaginationChange={onPaginationChange}
                //onSelectChange={onSelectChange}
                //onSort={onSort}
            />

            <Dialog
                isOpen={isDialogOpen}
                onClose={closeDialog}
                onRequestClose={closeDialog}
                width={800}
            >
                {data && <LeaveApproveForm leaveData={data} />}
            </Dialog>
        </>
    )
}

export default LeaveApprove
