import Dialog from '@/components/ui/Dialog'
import useLeave from '@/utils/hooks/useLeave'
import { useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import LeaveApproveForm from './components/LeaveApproveForm'
import { injectReducer } from '@/store'
import reducer, {
    closeDialog,
    openDialog,
    getLeaveApproveData,
    LeaveApproveData,
    useAppDispatch,
    useAppSelector,
} from './store'
import DataTable from '@/components/shared/DataTable'
import type { ColumnDef } from '@/components/shared/DataTable'
import useThemeClass from '@/utils/hooks/useThemeClass'
import Badge from '@/components/ui/Badge'
import { leaveStatusColor } from '@/@types/common'
import useCommon from '@/utils/hooks/useCommon'

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
    const { getUserFromLocalStorage } = useCommon()

    const { notification } = location.state || {}
    const [data, setData] = useState<LeaveRequestResponse>()

    const dispatch = useAppDispatch()

    const leaveApproveData = useAppSelector(
        (state) => state.leaveApprove.data.leaveApproveDataList.items
    )

    console.log(leaveApproveData)

    const loading = useAppSelector((state) => state.leaveApprove.data.loading)

    const dialogOpen = useAppSelector(
        (state) => state.leaveApprove.data.dialogOpen
    )

    const onDialogClose = () => {
        dispatch(closeDialog())
    }

    const onDialogOpen = () => {
        dispatch(openDialog())
    }



    useEffect(() => {
        if (notification) {
            dispatch(getLeaveApproveData(getUserFromLocalStorage().epf))
            onDialogOpen()

            const result = getLeaveData(notification.reference, notification.id)
            result.then((res) => {
                const leaveRequest: LeaveRequestResponse =
                    (res?.data as LeaveRequestResponse) || []

                setData(leaveRequest)
            })
        } else {
            dispatch(getLeaveApproveData(getUserFromLocalStorage().epf))
        }
    }, [notification])

    const ActionColumn = ({ row }: { row: any }) => {
        const { textTheme } = useThemeClass()

        const onEdit = () => {
            const result = getLeaveData(row.requestId)
            result.then((res) => {
                const leaveRequest: LeaveRequestResponse =
                    (res?.data as LeaveRequestResponse) || []

                setData(leaveRequest)
            })

            onDialogOpen()
        }

        return (
            <div
                className={`${textTheme} cursor-pointer select-none font-semibold`}
                onClick={onEdit}
            >
                View
            </div>
        )
    }

    const columns: ColumnDef<LeaveApproveData>[] = useMemo(
        () => [
            {
                header: 'Id',
                accessorKey: 'requestId',
            },
            {
                header: 'epf',
                accessorKey: 'epf',
            },
            {
                header: 'start Date',
                accessorKey: 'startDate',
                cell: (cell) => (cell.getValue() + '').substring(0, 10),
            },
            {
                header: 'end Date',
                accessorKey: 'endDate',
                cell: (cell) => (cell.getValue() + '').substring(0, 10),
            },
            {
                header: 'No of Days',
                accessorKey: 'noOfDays',
            },
            {
                header: 'My Status',
                accessorKey: 'approverStatus',
                cell: (props) => {
                    const row = props.row.original
                    return (
                        <div className="flex items-center">
                            <Badge
                                className={
                                    leaveStatusColor[row.approverStatus]
                                        .dotClass
                                }
                            />
                            <span className="ml-2 rtl:mr-2 capitalize">
                                {row.approverStatus}
                            </span>
                        </div>
                    )
                },
            },
            {
                header: 'request Status',
                accessorKey: 'requestStatus',
                cell: (props) => {
                    const row = props.row.original
                    return (
                        <div className="flex items-center">
                            <Badge
                                className={
                                    leaveStatusColor[row.requestStatus]
                                        .dotClass
                                }
                            />
                            <span className="ml-2 rtl:mr-2 capitalize">
                                {row.requestStatus}
                            </span>
                        </div>
                    )
                },
            },
            {
                header: '',
                id: 'action',
                cell: (props) => <ActionColumn row={props.row.original} />,
            },
        ],
        []
    )
    return (
        <>
            <h4 className="mb-5">Leave Approval</h4>

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
                isOpen={dialogOpen}
                onClose={onDialogClose}
                onRequestClose={onDialogClose}
                width={800}
            >
                {data && <LeaveApproveForm leaveData={data} />}
            </Dialog>
        </>
    )
}

export default LeaveApprove
