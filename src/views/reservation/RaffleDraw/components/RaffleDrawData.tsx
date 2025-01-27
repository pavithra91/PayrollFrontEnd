import { AllRaffleDrawData, useAppDispatch, useAppSelector } from '../store'
import DataTable, {
    ColumnDef,
    OnSortParam,
} from '@/components/shared/DataTable'
import { useEffect, useMemo, useState } from 'react'

type AllTableProps = {
    data: AllRaffleDrawData[]
}

const RaffleDrawData = ({ data }: AllTableProps) => {
    const dispatch = useAppDispatch()

    const loading = useAppSelector((state) => state.RaffleDrawData.data.loading)

    const tableData = useAppSelector(
        (state) => state.RaffleDrawData.data.tableData
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

    const [filteredData, setFilteredData] = useState<AllRaffleDrawData[]>(
        data || []
    )

    const [pageIndex, setPageIndex] = useState<number>(tableData.pageIndex || 1)
    const [pageSize, setPageSize] = useState<number>(tableData.pageSize || 2)
    const [sortConfig, setSortConfig] = useState<OnSortParam>({
        key: 'id', // Default sorting by 'userId'
        order: 'asc',
    })

    const columns: ColumnDef<AllRaffleDrawData>[] = useMemo(
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
                header: 'Company Code',
                accessorKey: 'companyCode',
            },
            {
                header: 'Name',
                accessorKey: 'empName',
            },
            {
                header: 'Rank',
                accessorKey: 'rank',
            },
            {
                header: 'Bungalow',
                accessorKey: 'bungalowName',
            },
            {
                header: 'Check In Date',
                accessorKey: 'checkInDate',
                cell: (cell) => (cell.getValue() + '').substring(0, 10),
            },
            {
                header: 'Check Out Date',
                accessorKey: 'checkOutDate',
                cell: (cell) => (cell.getValue() + '').substring(0, 10),
            },
            {
                header: 'Pax',
                accessorKey: 'noOfPax',
            },
            {
                header: 'Contact Number',
                accessorKey: 'contactNumber',
            },
            {
                header: 'cost',
                accessorKey: 'cost',
            },
        ],
        []
    )

    const handleInputChange = (val: string) => {
        const query = val.toLowerCase()
        const filtered = (data || []).filter(
            (item) =>
                item.id.toString().includes(query) ||
                item.rank.toString().includes(query)
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
            const aValue = a[key as keyof AllRaffleDrawData] // Get the value of the key for item a
            const bValue = b[key as keyof AllRaffleDrawData] // Get the value of the key for item b

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

export default RaffleDrawData
