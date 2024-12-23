import { TableQueries } from '@/@types/common'
import { useEffect, useMemo, useState } from 'react'
import DataTable, {
    ColumnDef,
    OnSortParam,
} from '@/components/shared/DataTable'
import {
    AllBungalowData,
    setSelectedRow,
    toggleNewBungalowDialog,
    toggleEditBungalowDialog,
    useAppDispatch,
    useAppSelector,
} from '../store'
import Button from '@/components/ui/Button'
import { HiOutlinePlusCircle, HiPencil } from 'react-icons/hi'
import Dialog from '@/components/ui/Dialog'
import AddBungalow from './AddBungalow'
import Badge from '@/components/ui/Badge'
import useThemeClass from '@/utils/hooks/useThemeClass'
import { useNavigate } from 'react-router-dom'
// import EditSupervisor from './EditSupervisor'

type AllTableProps = {
    data: AllBungalowData[]
    loading: boolean
    tableData: TableQueries
}

const statusColor: Record<string, string> = {
    active: 'bg-emerald-500',
    blocked: 'bg-red-500',
}

const BungalowData = ({ data, loading, tableData }: AllTableProps) => {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    const supervisorDialog = useAppSelector(
        (state) => state.BungalowData.data.newBungalowDialog
    )

    const editDialog = useAppSelector(
        (state) => state.BungalowData.data.editBungalowDialog
    )

    const onDialogOpen = () => {
        //console.log('click')
        dispatch(toggleNewBungalowDialog(true))
    }

    const onDialogClose = () => {
        dispatch(toggleNewBungalowDialog(false))
    }

    const onEditDialogClose = () => {
        dispatch(toggleEditBungalowDialog(false))
    }

    const [filteredData, setFilteredData] = useState<AllBungalowData[]>(
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
            dispatch(toggleEditBungalowDialog(true))
            dispatch(setSelectedRow(row))
        }

        return <Button size="sm" icon={<HiPencil />} onClick={onEdit}></Button>
    }

    const columns: ColumnDef<AllBungalowData>[] = useMemo(
        () => [
            {
                header: 'Id',
                accessorKey: 'id',
            },
            {
                header: 'company Code',
                accessorKey: 'companyCode',
            },
            {
                header: 'Name',
                accessorKey: 'bungalowName',
            },
            {
                header: 'address',
                accessorKey: 'address',
            },
            {
                header: 'Capacity',
                accessorKey: 'noOfRooms',
            },
            {
                header: 'Cost',
                accessorKey: 'perDayCost',
            },
            {
                header: 'Status',
                accessorKey: 'isActive',
                cell: (props) => {
                    const row = props.row.original
                    return (
                        <div className="flex items-center">
                            {row.isCloded ? (
                                <>
                                    <Badge className={statusColor['block']} />
                                    <span className="ml-2 rtl:mr-2 capitalize">
                                        {row.isCloded} Closed
                                    </span>
                                </>
                            ) : (
                                <>
                                    <Badge className={statusColor['active']} />
                                    <span className="ml-2 rtl:mr-2 capitalize">
                                        {row.isCloded} Open
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
                item.id.toString().includes(query) ||
                item.bungalowName.toLowerCase().includes(query)
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
            const aValue = a[key as keyof AllBungalowData] // Get the value of the key for item a
            const bValue = b[key as keyof AllBungalowData] // Get the value of the key for item b

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
                <h3 className="mb-4 lg:mb-0">Bungalow Management</h3>

                <div className="flex flex-col md:flex-row md:items-center gap-1">
                    <Button
                        size="sm"
                        variant="twoTone"
                        icon={<HiOutlinePlusCircle />}
                        onClick={() => navigate('/AddBungalow')}
                    >
                        Add Bungalow
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
                    <AddBungalow />
                </div>
            </Dialog>

            <Dialog
                isOpen={editDialog}
                onClose={onEditDialogClose}
                onRequestClose={onEditDialogClose}
            >
                <h4>Edit Supervisor</h4>
                <div className="mt-4">{/* <EditBungalow /> */}</div>
            </Dialog>
        </>
    )
}

export default BungalowData
