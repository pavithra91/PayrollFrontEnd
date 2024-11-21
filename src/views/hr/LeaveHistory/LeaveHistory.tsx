import Dialog from '@/components/ui/Dialog'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Table from '@/components/ui/Table'
import useCommon from '@/utils/hooks/useCommon'
import useLeave from '@/utils/hooks/useLeave'
import useThemeClass from '@/utils/hooks/useThemeClass'
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from '@tanstack/react-table'
import dayjs from 'dayjs'
import { lazy, Suspense, useEffect, useState } from 'react'
import { HiOutlinePencil } from 'react-icons/hi'
import reducer, {
    closeDialog,
    openDialog,
    useAppDispatch,
    useAppSelector,
} from './store'
import { injectReducer } from '@/store'
injectReducer('leaveHistory', reducer)

const RequestContent = lazy(() => import('./components/RequestContent'))

type LeaveHistoryResponse = {
    leaveHistory: LeaveHistory[]
}

type LeaveHistory = {
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

const leaveStatusColor: Record<
    string,
    {
        label: string
        dotClass: string
        textClass: string
    }
> = {
    Approved: {
        label: 'Approved',
        dotClass: 'bg-emerald-500',
        textClass: 'text-emerald-500',
    },
    Pending: {
        label: 'Pending',
        dotClass: 'bg-amber-500',
        textClass: 'text-amber-500',
    },
    Rejected: {
        label: 'Rejected',
        dotClass: 'bg-red-500',
        textClass: 'text-red-500',
    },
    Cancelled: {
        label: 'Cancelled',
        dotClass: 'bg-blue-500',
        textClass: 'text-blue-500',
    },
}

const { Tr, Td, TBody, THead, Th } = Table

const columnHelper = createColumnHelper<LeaveHistory>()

const LeaveHistory = () => {
    const { getLeaveDashboardData } = useLeave()
    const { getUserFromLocalStorage } = useCommon()
    const dispatch = useAppDispatch()
    const [data, setLeaveHistory] = useState<LeaveHistory[]>([])
    const [SelectedLeaveHistory, setSelectedLeaveHistory] = useState()

    useEffect(() => {
        const result = getLeaveDashboardData(getUserFromLocalStorage().epf)
        result.then((res) => {
            const leaveHistoryData: LeaveHistory[] =
                (res?.data as LeaveHistoryResponse)?.leaveHistory || []
            setLeaveHistory(leaveHistoryData)

           // console.log(leaveHistoryData)
        })
    }, [])

    const dialogOpen = useAppSelector(
        (state) => state.leaveHistory.data.dialogOpen
    )

    const onDialogClose = () => {
        dispatch(closeDialog())
    }

    const onDialogOpen = () => {
        dispatch(openDialog())
    }

    const ActionColumn = ({ row }: { row: any }) => {
        const { textTheme } = useThemeClass()

        const onEdit = () => {
            setSelectedLeaveHistory(row)
            onDialogOpen()
        }

        return (
            <div className="flex justify-end text-lg">
                <span
                    className={`cursor-pointer p-2 hover:${textTheme}`}
                    onClick={onEdit}
                >
                    <HiOutlinePencil />
                </span>
            </div>
        )
    }

    const columns = [
        columnHelper.accessor('startDate', {
            header: 'Start Date',
            cell: (props) => {
                const row = props.row.original
                return <span>{dayjs(row.startDate).format('DD/MM/YYYY')}</span>
            },
        }),
        columnHelper.accessor('endDate', {
            header: 'End Date',
            cell: (props) => {
                const row = props.row.original
                return <span>{dayjs(row.endDate).format('DD/MM/YYYY')}</span>
            },
        }),
        columnHelper.accessor('leaveTypeName', {
            header: 'Leave Type',
            cell: (props) => props.row.original.leaveTypeName,
        }),
        columnHelper.accessor('actingDelegate', {
            header: 'Acting Delegate',
            cell: (props) => props.row.original.actingDelegate,
        }),
        columnHelper.accessor('actingDelegateApprovalStatus', {
            header: 'Delegate Approval',
            cell: (props) => {
                const { actingDelegateApprovalStatus } = props.row.original
                return (
                    <div className="flex items-center">
                        <Badge
                            className={
                                leaveStatusColor[actingDelegateApprovalStatus]
                                    .dotClass
                            }
                        />
                        <span
                            className={`ml-2 rtl:mr-2 capitalize font-semibold ${leaveStatusColor[actingDelegateApprovalStatus].textClass}`}
                        >
                            {
                                leaveStatusColor[actingDelegateApprovalStatus]
                                    .label
                            }
                        </span>
                    </div>
                )
            },
        }),
        columnHelper.accessor('requestStatus', {
            header: 'Status',
            cell: (props) => {
                const { requestStatus } = props.row.original
                return (
                    <div className="flex items-center">
                        <Badge
                            className={leaveStatusColor[requestStatus].dotClass}
                        />
                        <span
                            className={`ml-2 rtl:mr-2 capitalize font-semibold ${leaveStatusColor[requestStatus].textClass}`}
                        >
                            {leaveStatusColor[requestStatus].label}
                        </span>
                    </div>
                )
            },
        }),
        {
            header: 'Action',
            id: 'action',
            cell: (props: any) => <ActionColumn row={props.row.original} />,
        },
    ]

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    })

    return (
        <>
            <div className="flex items-center justify-between mb-6">
                <h4>Leave History</h4>
            </div>
            <Card>
                <Table>
                    <THead>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <Tr key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <Th
                                            key={header.id}
                                            colSpan={header.colSpan}
                                        >
                                            {flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                        </Th>
                                    )
                                })}
                            </Tr>
                        ))}
                    </THead>
                    <TBody>
                        {table.getRowModel().rows.map((row) => {
                            return (
                                <Tr key={row.id}>
                                    {row.getVisibleCells().map((cell) => {
                                        return (
                                            <Td key={cell.id}>
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext()
                                                )}
                                            </Td>
                                        )
                                    })}
                                </Tr>
                            )
                        })}
                    </TBody>
                </Table>

                <Dialog
                    isOpen={dialogOpen}
                    width={800}
                    height={520}
                    // closable={dialogView !== 'TICKET'}
                    onClose={onDialogClose}
                    onRequestClose={onDialogClose}
                >
                    <Suspense fallback={<div>Loading...</div>}>
                        <RequestContent
                            data={SelectedLeaveHistory}
                            onTicketClose={onDialogClose}
                        />
                    </Suspense>
                </Dialog>
            </Card>
        </>
    )
}

export default LeaveHistory
