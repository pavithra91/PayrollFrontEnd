import { useEffect, useMemo } from 'react'
import {
    getList,
    LeaveType,
    LeaveTypeState,
    setDrawerOpen,
    setSelectedLeaveType,
    useAppDispatch,
    useAppSelector,
} from '../store'
import DataTable from '@/components/shared/DataTable'
import type { OnSortParam, ColumnDef } from '@/components/shared/DataTable'
import cloneDeep from 'lodash/cloneDeep'
import Badge from '@/components/ui/Badge'
import useThemeClass from '@/utils/hooks/useThemeClass'
import LeaveTypeEditDialog from './LeaveTypeEditDialog'

const statusColor: Record<string, string> = {
    active: 'bg-emerald-500',
    blocked: 'bg-red-500',
}

const LeaveTypeListContent = () => {
    const dispatch = useAppDispatch()

    const loading = useAppSelector((state) => state.leaveTypeList.data.loading)

    const leaveTypeList = useAppSelector(
        (state) => state.leaveTypeList.data.leaveTypeList.items
    )

    useEffect(() => {
        dispatch(getList())
    }, [dispatch])

    const ActionColumn = ({ row }: { row: LeaveType }) => {
        const { textTheme } = useThemeClass()

        const onEdit = () => {
            dispatch(setDrawerOpen())
            dispatch(setSelectedLeaveType(row))
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

    const columns: ColumnDef<LeaveType>[] = useMemo(
        () => [
            {
                header: 'Id',
                accessorKey: 'leaveTypeId',
            },
            {
                header: 'Name',
                accessorKey: 'leaveTypeName',
            },
            {
                header: 'Description',
                accessorKey: 'description',
            },
            {
                header: 'Max Days',
                accessorKey: 'maxDays',
            },
            {
                header: 'Carry Forward Allowed',
                accessorKey: 'carryForwardAllowed',
                cell: (props) => {
                    const row = props.row.original
                    return (
                        <div className="flex items-center">
                            {row.carryForwardAllowed ? (
                                <>
                                    <Badge className={statusColor['active']} />
                                    <span className="ml-2 rtl:mr-2 capitalize">
                                        {row.carryForwardAllowed} Allowed
                                    </span>
                                </>
                            ) : (
                                <>
                                    <Badge className={statusColor['block']} />
                                    <span className="ml-2 rtl:mr-2 capitalize">
                                        {row.carryForwardAllowed} Not Allowed
                                    </span>
                                </>
                            )}
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
            <DataTable
                columns={columns}
                data={leaveTypeList}
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
            <LeaveTypeEditDialog />
        </>
    )
}

export default LeaveTypeListContent
