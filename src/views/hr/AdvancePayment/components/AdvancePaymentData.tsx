import { TableQueries } from '@/@types/common'
import { useEffect, useMemo, useState } from 'react'
import DataTable, {
    ColumnDef,
    OnSortParam,
} from '@/components/shared/DataTable'
import {
    AllAdvancePaymentData,
    setSelectedRow,
    toggleEditSupervisorDialog,
    toggleAdvancePaymentDialog,
    useAppDispatch,
    useAppSelector,
    deleteAdvancePaymentData,
} from '../store'
import Button from '@/components/ui/Button'
import { HiOutlineTrash } from 'react-icons/hi'
import useThemeClass from '@/utils/hooks/useThemeClass'
import Badge from '@/components/ui/Badge'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import { string } from 'yup'

type AllTableProps = {
    data: AllAdvancePaymentData[]
    loading: boolean
    tableData: TableQueries
}

const statusColor: Record<string, string> = {
    active: 'bg-emerald-500',
    blocked: 'bg-red-500',
}

const AdvancePaymentData = ({ data, loading, tableData }: AllTableProps) => {
    const dispatch = useAppDispatch()
    const [dialogOpen, setdialogOpen] = useState(false)
    const [selectedData, setData] = useState<any>(null)

    const [filteredData, setFilteredData] = useState<AllAdvancePaymentData[]>(
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

        const onDeleteClick = () => {
            setdialogOpen(true)
            setData(row)
            dispatch(setSelectedRow(row))
        }

        var Status = false

        if (row.status != 'Pending') {
            Status = true
        }

        return (
            <Button
                disabled={Status}
                size="sm"
                icon={<HiOutlineTrash />}
                onClick={onDeleteClick}
            ></Button>
        )
    }

    const onDialogClose = () => {
        setdialogOpen(false)
    }

    const onDelete = async () => {
        dispatch(deleteAdvancePaymentData(selectedData.id))
        onDialogClose()
        toast.push(
            <Notification
                title={'Successfuly Deleted'}
                type="success"
                duration={3500}
            >
                Request Deleted Successfully
            </Notification>,
            {
                placement: 'top-center',
            }
        )
    }

    const columns: ColumnDef<AllAdvancePaymentData>[] = useMemo(
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
                header: 'period',
                accessorKey: 'period',
            },
            {
                header: 'Full Amount',
                accessorKey: 'isFullAmount',
                cell: (props) => {
                    const row = props.row.original
                    return (
                        <div className="flex items-center">
                            {row.isFullAmount ? (
                                <>
                                    <Badge className={statusColor['active']} />
                                    <span className="ml-2 rtl:mr-2 capitalize">
                                        {row.isFullAmount} Yes
                                    </span>
                                </>
                            ) : (
                                <>
                                    <Badge className={statusColor['block']} />
                                    <span className="ml-2 rtl:mr-2 capitalize">
                                        {row.isFullAmount} No
                                    </span>
                                </>
                            )}
                        </div>
                    )
                },
            },
            {
                header: 'amount',
                accessorKey: 'amount',
            },
            {
                header: 'status',
                accessorKey: 'status',
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
            const aValue = a[key as keyof AllAdvancePaymentData] // Get the value of the key for item a
            const bValue = b[key as keyof AllAdvancePaymentData] // Get the value of the key for item b

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
                <h3 className="mb-4 lg:mb-0">Advance Payment Requests</h3>
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

            <ConfirmDialog
                isOpen={dialogOpen}
                type="danger"
                title="Delete Advance Payment Request"
                confirmButtonColor="red-600"
                onClose={onDialogClose}
                onRequestClose={onDialogClose}
                onCancel={onDialogClose}
                onConfirm={onDelete}
            >
                <p>
                    Are you sure you want to delete this advance request? Record
                    related to this product will be deleted as well. This action
                    cannot be undone.
                </p>
            </ConfirmDialog>
        </>
    )
}

export default AdvancePaymentData
