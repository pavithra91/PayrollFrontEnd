import { TableQueries } from '@/@types/common'
import { useEffect, useMemo, useState } from 'react'
import DataTable, {
    ColumnDef,
    OnSortParam,
} from '@/components/shared/DataTable'
import {
    AllReservationData,
    setSelectedRow,
    toggleNewReservationDialog,
    toggleEditReservationDialog,
    useAppDispatch,
    useAppSelector,
} from '../store'
import Button from '@/components/ui/Button'
import { HiOutlineCash, HiOutlinePlusCircle, HiPencil } from 'react-icons/hi'
import Dialog from '@/components/ui/Dialog'
// import AddBungalow from './AddBungalow'
import Badge from '@/components/ui/Badge'
import useThemeClass from '@/utils/hooks/useThemeClass'
import { useNavigate } from 'react-router-dom'
// import EditBungalow from './EditBungalow'

type AllTableProps = {
    data: AllReservationData[]
    loading: boolean
    tableData: TableQueries
}

const statusColor: Record<string, string> = {
    active: 'bg-emerald-500',
    blocked: 'bg-red-500',
}

const ReservationData = ({ data, loading, tableData }: AllTableProps) => {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    console.log(data)

    const supervisorDialog = useAppSelector(
        (state) => state.ReservationData.data.newReservationDialog
    )

    const editDialog = useAppSelector(
        (state) => state.ReservationData.data.editReservationDialog
    )

    const onDialogOpen = () => {
        //console.log('click')
        dispatch(toggleNewReservationDialog(true))
    }

    const onDialogClose = () => {
        dispatch(toggleNewReservationDialog(false))
    }

    const onEditDialogClose = () => {
        dispatch(toggleEditReservationDialog(false))
    }

    const [filteredData, setFilteredData] = useState<AllReservationData[]>(
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
            dispatch(setSelectedRow(row))
            navigate('/EditReservation')
        }

        const onRateEdit = () => {
            dispatch(toggleEditReservationDialog(true))
        }
        return (
            <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="..">
                        <Button
                            size="sm"
                            icon={<HiPencil />}
                            onClick={onEdit}
                        ></Button>
                    </div>
                    <div className="..">
                        {/* <Button
                            size="sm"
                            icon={<HiOutlineCash />}
                            onClick={onRateEdit}
                        ></Button> */}
                    </div>
                </div>
            </>
        )
    }

    const columns: ColumnDef<AllReservationData>[] = useMemo(
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
                header: 'Check In',
                accessorKey: 'checkInDate',
            },
            {
                header: 'Check Out',
                accessorKey: 'checkOutDate',
            },
            {
                header: 'Pax Count',
                accessorKey: 'totalPax',
            },
            {
                header: 'bungalow Name',
                accessorKey: 'bungalowName',
            },
            {
                header: 'Status',
                accessorKey: 'bookingStatus',
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
                item.bungalowid.toString().includes(query)
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
            const aValue = a[key as keyof AllReservationData] // Get the value of the key for item a
            const bValue = b[key as keyof AllReservationData] // Get the value of the key for item b

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
                <h3 className="mb-4 lg:mb-0">Bungalow Reservations</h3>

                <div className="flex flex-col md:flex-row md:items-center gap-1">
                    <Button
                        size="sm"
                        variant="twoTone"
                        icon={<HiOutlinePlusCircle />}
                        onClick={() => navigate('/AddReservation')}
                    >
                        Create Reservation
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
                isOpen={editDialog}
                onClose={onEditDialogClose}
                onRequestClose={onEditDialogClose}
            >
                <h4>Edit Rates</h4>
                <div className="mt-4">{/* <EditRates /> */}</div>
            </Dialog>
        </>
    )
}

export default ReservationData
