import { TableQueries } from '@/@types/common'
import { useEffect, useMemo, useState } from 'react'
import DataTable, {
    ColumnDef,
    OnSortParam,
} from '@/components/shared/DataTable'
import {
    AllSupervisorData,
    setSelectedRow,
    toggleEditSupervisorDialog,
    toggleNewSupervisorDialog,
    useAppDispatch,
    useAppSelector,
} from '../store'
import Button from '@/components/ui/Button'
import { HiOutlinePlusCircle, HiPencil } from 'react-icons/hi'
import Dialog from '@/components/ui/Dialog'
import AddSupervisor from './AddSupervisor'
import Badge from '@/components/ui/Badge'
import useThemeClass from '@/utils/hooks/useThemeClass'
import EditSupervisor from './EditSupervisor'

type AllTableProps = {
    data: AllSupervisorData[]
    loading: boolean
    tableData: TableQueries
}

const statusColor: Record<string, string> = {
    active: 'bg-emerald-500',
    blocked: 'bg-red-500',
}

const SupervisorData = ({ data, loading, tableData }: AllTableProps) => {
    const dispatch = useAppDispatch()

    const supervisorDialog = useAppSelector(
        (state) => state.SupervisorData.data.newSupervisorDialog
    )

    const editDialog = useAppSelector(
        (state) => state.SupervisorData.data.editSupervisorDialog
    )

    const onDialogOpen = () => {
        //console.log('click')
        dispatch(toggleNewSupervisorDialog(true))
    }

    const onDialogClose = () => {
        dispatch(toggleNewSupervisorDialog(false))
    }

    const onEditDialogClose = () => {
        dispatch(toggleEditSupervisorDialog(false))
    }

    const [filteredData, setFilteredData] = useState<AllSupervisorData[]>(
        data || []
    )

    const [pageIndex, setPageIndex] = useState<number>(tableData.pageIndex || 1)
    const [pageSize, setPageSize] = useState<number>(tableData.pageSize || 2)
    const [sortConfig, setSortConfig] = useState<OnSortParam>({
        key: 'id', // Default sorting by 'userId'
        order: 'asc',
    })

    const ActionColumn = ({ row }: { row: any }) => {
        const { textTheme } = useThemeClass()

        const onEdit = () => {
            dispatch(toggleEditSupervisorDialog(true))
            dispatch(setSelectedRow(row))
        }

        return (
            // <div
            //     className={`${textTheme} cursor-pointer select-none font-semibold`}
            //     onClick={onEdit}
            // >
            //     Edit
            // </div>
            <Button size="sm" icon={<HiPencil />} onClick={onEdit}></Button>
        )
    }

    const columns: ColumnDef<AllSupervisorData>[] = useMemo(
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
                header: 'Name',
                accessorKey: 'empName',
            },
            {
                header: 'grade',
                accessorKey: 'grade',
            },
            {
                header: 'Status',
                accessorKey: 'isActive',
                cell: (props) => {
                    const row = props.row.original
                    return (
                        <div className="flex items-center">
                            {row.isActive ? (
                                <>
                                    <Badge className={statusColor['active']} />
                                    <span className="ml-2 rtl:mr-2 capitalize">
                                        {row.isActive} Active
                                    </span>
                                </>
                            ) : (
                                <>
                                    <Badge className={statusColor['block']} />
                                    <span className="ml-2 rtl:mr-2 capitalize">
                                        {row.isActive} Deactive
                                    </span>
                                </>
                            )}
                        </div>
                    )
                },
            },
            {
                header: 'Role',
                accessorKey: 'isManager',
                cell: (props) => {
                    const row = props.row.original
                    return (
                        <div className="flex items-center">
                            {row.isManager ? (
                                <>
                                    <Badge className={statusColor['active']} />
                                    <span className="ml-2 rtl:mr-2 capitalize">
                                        {row.isManager} Manager
                                    </span>
                                </>
                            ) : (
                                <>
                                    <Badge className={statusColor['block']} />
                                    <span className="ml-2 rtl:mr-2 capitalize">
                                        {row.isManager} Supervisor
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
                cell: (props) => {
                    const row = props.row.original
                    return <ActionColumn row={row} />
                },
            },
        ],
        []
    )

    const handleInputChange = (val: string) => {
        const query = val.toLowerCase()
        const filtered = (data || []).filter(
            (item) =>
                item.epf.toString().includes(query) ||
                item.empName.toLowerCase().includes(query)
        )

        setFilteredData(filtered)
        setPageIndex(1) // Reset to first page on search
    }

    const onPaginationChange = (page: number) => {
        setPageIndex(page)
    }

    const onSort = (sort: OnSortParam) => {
        const { key, order } = sort

        const sortedData = [...filteredData] // Clone the filtered data for sorting

        sortedData.sort((a, b) => {
            const aValue = a[key as keyof AllSupervisorData] // Get the value of the key for item a
            const bValue = b[key as keyof AllSupervisorData] // Get the value of the key for item b

            // Compare values for strings
            if (typeof aValue === 'string' && typeof bValue === 'string') {
                // Use localeCompare for string comparison
                return order === 'asc'
                    ? aValue.localeCompare(bValue)
                    : bValue.localeCompare(aValue)
            }

            return 0
        })

        setFilteredData(sortedData)
        setSortConfig({ key, order })
    }

    const startIndex = (pageIndex - 1) * pageSize
    const endIndex = startIndex + pageSize
    const paginatedData = filteredData?.slice(startIndex, endIndex) || []

    useEffect(() => {
        setFilteredData(data)
    }, [data])
    return (
        <>
            <div className="lg:flex items-center justify-between mb-4">
                <h3 className="mb-4 lg:mb-0">Supervisors</h3>

                <div className="flex flex-col md:flex-row md:items-center gap-1">
                    <Button
                        size="sm"
                        variant="twoTone"
                        icon={<HiOutlinePlusCircle />}
                        onClick={onDialogOpen}
                    >
                        Add Supervisor
                    </Button>
                </div>
            </div>

            <DataTable
                columns={columns}
                data={paginatedData}
                loading={loading}
                pagingData={{
                    total: filteredData?.length as number,
                    pageIndex: tableData?.pageIndex as number,
                    pageSize: tableData?.pageSize as number,
                }}
                onPaginationChange={onPaginationChange}
                onSort={onSort}
            />

            <Dialog
                isOpen={supervisorDialog}
                onClose={onDialogClose}
                onRequestClose={onDialogClose}
            >
                <h4>Assign Supervisor</h4>
                <div className="mt-4">
                    <AddSupervisor />
                </div>
            </Dialog>

            <Dialog
                isOpen={editDialog}
                onClose={onEditDialogClose}
                onRequestClose={onEditDialogClose}
            >
                <h4>Edit Supervisor</h4>
                <div className="mt-4">
                    <EditSupervisor />
                </div>
            </Dialog>
        </>
    )
}

export default SupervisorData
