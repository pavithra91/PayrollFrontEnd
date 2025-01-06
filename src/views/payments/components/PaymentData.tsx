import { AllPaymentData, useAppDispatch, useAppSelector } from '../store'
import DataTable, {
    ColumnDef,
    OnSortParam,
} from '@/components/shared/DataTable'
import { useEffect, useMemo, useState } from 'react'

type AllTableProps = {
    data: AllPaymentData[]
}

const PaymentData = ({ data }: AllTableProps) => {
    const dispatch = useAppDispatch()

    const loading = useAppSelector((state) => state.PaymentData.data.loading)

    const tableData = useAppSelector(
        (state) => state.PaymentData.data.tableData
    )

    const onDialogOpen = () => {
        //console.log('click')
        //dispatch(toggleNewReservationDialog(true))
    }

    const onDialogClose = () => {
        //dispatch(toggleNewReservationDialog(false))
    }

    const onEditDialogClose = () => {
        //dispatch(toggleEditReservationDialog(false))
    }

    const [filteredData, setFilteredData] = useState<AllPaymentData[]>(
        data || []
    )

    const [pageIndex, setPageIndex] = useState<number>(tableData.pageIndex || 1)
    const [pageSize, setPageSize] = useState<number>(tableData.pageSize || 2)
    const [sortConfig, setSortConfig] = useState<OnSortParam>({
        key: 'id', // Default sorting by 'userId'
        order: 'asc',
    })

    const columns: ColumnDef<AllPaymentData>[] = useMemo(
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
                header: 'Bank Code',
                accessorKey: 'bankCode',
            },
            {
                header: 'Account No',
                accessorKey: 'accountNo',
            },
            {
                header: 'amount',
                accessorKey: 'amount',
            },
            {
                header: 'Bank Transfer Date',
                accessorKey: 'bankTransferDate',
            },
            {
                header: 'Status',
                accessorKey: 'status',
            },
        ],
        []
    )

    const handleInputChange = (val: string) => {
        const query = val.toLowerCase()
        const filtered = (data || []).filter(
            (item) =>
                item.id.toString().includes(query) ||
                item.epf.toString().includes(query)
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
            const aValue = a[key as keyof AllPaymentData] // Get the value of the key for item a
            const bValue = b[key as keyof AllPaymentData] // Get the value of the key for item b

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
        </>
    )
}

export default PaymentData
