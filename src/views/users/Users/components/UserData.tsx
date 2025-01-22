import { useEffect, useMemo } from 'react'
import {
    getUserList,
    Users,
    setDrawerOpen,
    setSelectedUser,
    useAppDispatch,
    useAppSelector,
} from '../store'
import DataTable from '@/components/shared/DataTable'
import type { ColumnDef } from '@/components/shared/DataTable'
import Badge from '@/components/ui/Badge'
import useThemeClass from '@/utils/hooks/useThemeClass'
import { Button } from '@/components/ui/Button'
import { HiOutlineKey, HiPencil } from 'react-icons/hi'

const statusColor: Record<string, string> = {
    active: 'bg-emerald-500',
    blocked: 'bg-red-500',
}

const UserData = () => {
    const dispatch = useAppDispatch()

     const loading = useAppSelector((state) => state.userList.data.loading)

    const userList = useAppSelector(
        (state) => state.userList.data.userList
    )

    useEffect(() => {
        dispatch(getUserList())
    }, [dispatch])

    const ActionColumn = ({ row }: { row: Users }) => {
        const { textTheme } = useThemeClass()

        const onEdit = () => {
            dispatch(setDrawerOpen())
            dispatch(setSelectedUser(row))
        }

        return <>
        <Button size="sm" icon={<HiPencil />} onClick={onEdit}></Button>
        <Button size="sm" icon={<HiOutlineKey />} onClick={onEdit}></Button>
        </>
        
    }

    const columns: ColumnDef<Users>[] = useMemo(
        () => [
            {
                header: 'Id',
                accessorKey: 'id',
                show: false,
            },
            {
                header: 'Cost Center',
                accessorKey: 'costCenter',
            },
            {
                header: 'User ID',
                accessorKey: 'userID',
            },
            {
                header: 'EPF',
                accessorKey: 'epf',
            },
            {
                header: 'Name',
                accessorKey: 'empName',
            },
            {
                header: 'Role',
                accessorKey: 'role',
            },
            {
                header: 'Status',
                accessorKey: 'status',
                cell: (props) => {
                    const row = props.row.original
                    return (
                        <div className="flex items-center">
                        <Badge
                            className={
                                statusColor[
                                    props.getValue() == true
                                        ? 'active'
                                        : 'blocked'
                                ]
                            }
                        />
                        <span className="ml-2 rtl:mr-2 capitalize">
                            {props.getValue() == true ? 'Active' : 'Inactive'}
                        </span>
                    </div>
                    )
                },
            },
            {
                header: 'Account Locked',
                accessorKey: 'isAccountLocked',
                cell: (props) => {
                    const row = props.row.original
                    return (
                        <div className="flex items-center">
                        <Badge
                            className={
                                statusColor[
                                    props.getValue() == true
                                        ? 'blocked'
                                        : 'active'
                                ]
                            }
                        />
                        <span className="ml-2 rtl:mr-2 capitalize">
                            {props.getValue() == true ? 'Locked' : 'Active'}
                        </span>
                    </div>
                    )
                },
            },
            {
                header: 'Created By',
                accessorKey: 'createdBy',
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
                data={userList}
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
            {/* <LeaveTypeEditDialog /> */}
        </>
    )
}

export default UserData