import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Table from '@/components/ui/Table'
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from '@tanstack/react-table'
import dayjs from 'dayjs'
import { useNavigate } from 'react-router-dom'

type Leave = {
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

type LatestLeaveProps = {
    data?: Leave[]
    className?: string
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

const columnHelper = createColumnHelper<Leave>()

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
]

const LeaveHistory = ({ data = [], className }: LatestLeaveProps) => {
    const navigate = useNavigate()
    data = data.slice(0, 5)
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    })

    return (
        <Card className={className}>
            <div className="flex items-center justify-between mb-6">
                <h4>Leave History</h4>
                <Button size="sm" onClick={() => navigate('/LeaveHistory')}>
                    View All
                </Button>
            </div>
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
        </Card>
    )
}

export default LeaveHistory
