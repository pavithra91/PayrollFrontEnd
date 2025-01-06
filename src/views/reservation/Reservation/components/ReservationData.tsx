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
    toggleCancelReservationDialog,
    useAppDispatch,
    useAppSelector,
    cancelReservation,
} from '../store'
import Button from '@/components/ui/Button'
import { HiOutlinePlusCircle, HiOutlineTrash, HiPencil } from 'react-icons/hi'
import Dialog from '@/components/ui/Dialog'
import useThemeClass from '@/utils/hooks/useThemeClass'
import { useNavigate } from 'react-router-dom'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import useCommon from '@/utils/hooks/useCommon'
import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'

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

    const { getUserFromLocalStorage } = useCommon()

    const[selectedReservation, setSelectedReservation] = useState<number>(0)

    const selectedRow = useAppSelector(
        (state) => state.ReservationData.data.selectedRow
    )

    const editDialog = useAppSelector(
        (state) => state.ReservationData.data.cancelReservationDialog
    )

    const cancelDialog = useAppSelector(
        (state) => state.ReservationData.data.cancelReservationDialog
    )

    const onDialogOpen = () => {
        //console.log('click')
        dispatch(toggleNewReservationDialog(true))
    }

    const onDialogClose = () => {
        dispatch(toggleNewReservationDialog(false))
    }

    const onEditDialogClose = () => {
        // dispatch(toggleEditReservationDialog(false))
    }

    const onCancel = () => {
        dispatch(toggleCancelReservationDialog(false))
    }

    const onCancelReservation = () => {
        const request = {
            id : selectedReservation,
            lastUpdateBy: getUserFromLocalStorage().epf
        }
        dispatch(cancelReservation(request)).then((res)=>{
            dispatch(toggleCancelReservationDialog(false))
            if(res.payload == "success")
            {
                openNotification(
                    'success',
                    'Reservation Cancelled Successfully',
                    'Your reservation has been cancelled. Thank you for your cooperation.'
                )
            }
            else
            {
                openNotification(
                    'danger',
                    'Reservation Cancellation Failed',
                    'We encountered an issue while processing your cancellation. Please try again later or contact Secretariat function.'
                )
            }
        })
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

        const onCancellation = () => {
            setSelectedReservation(row.id)
            dispatch(toggleCancelReservationDialog(true))
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
                        <Button
                            size="sm"
                            icon={<HiOutlineTrash />}
                            onClick={onCancellation}
                        ></Button>
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
                cell: (cell) => (cell.getValue() + '').substring(0, 10),
            },
            {
                header: 'Check Out',
                accessorKey: 'checkOutDate',
                cell: (cell) => (cell.getValue() + '').substring(0, 10),
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

    const openNotification = (
        type: 'success' | 'warning' | 'danger' | 'info',
        title: string,
        message: string
    ) => {
        toast.push(
            <Notification title={title} type={type}>
                {message}
            </Notification>
        )
    }

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

            <ConfirmDialog
                isOpen={cancelDialog}
                type="danger"
                title="Are you sure you want to cancel the reservation?"
                confirmButtonColor="red-600"
                onClose={onCancel}
                onRequestClose={onCancel}
                onCancel={onCancel}
                onConfirm={onCancelReservation}
            >
                Please note that if you cancel the booking during the
                cancellation period, you may be subject to a cancellation
                charge. Once you proceed with the cancellation, the action
                cannot be undone..
            </ConfirmDialog>
        </>
    )
}

export default ReservationData
