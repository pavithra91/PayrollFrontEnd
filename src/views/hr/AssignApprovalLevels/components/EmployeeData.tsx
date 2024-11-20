import { useMemo, useRef, useState } from 'react'
import cloneDeep from 'lodash/cloneDeep'
import {
    AllEmployeeData,
    useAppDispatch,
    setTableData,
    toggleNewAssignLevelDialog,
    getEmployeeData,
    useAppSelector,
} from '../store'
import DataTable from '@/components/shared/DataTable'
import type { ColumnDef, OnSortParam } from '@/components/shared'
import { TableQueries } from '@/@types/common'
import Button from '@/components/ui/Button'
import { HiOutlinePlusCircle } from 'react-icons/hi'
import AssignApproverDialog from './AssignApproverDialog'
import ActionColumn from './ActionColumn'
import QueryInput from './QueryInput'

type AllTableProps = {
    data?: AllEmployeeData[]
    loading: boolean
    tableData: TableQueries
}

const EmployeeData = ({ data, loading, tableData }: AllTableProps) => {
    const dispatch = useAppDispatch()

    const onAddLeaveApprovalLevel = () => {
        dispatch(toggleNewAssignLevelDialog(true))
    }

    const [filteredData, setFilteredData] = useState<AllEmployeeData[]>(
        data || []
    )

    const [pageIndex, setPageIndex] = useState<number>(tableData.pageIndex || 1)
    const [pageSize, setPageSize] = useState<number>(tableData.pageSize || 2)
    const [sortConfig, setSortConfig] = useState<OnSortParam>({
        key: 'id', // Default sorting by 'userId'
        order: 'asc',
    })

    const inputRef = useRef(null)

    const columns: ColumnDef<AllEmployeeData>[] = useMemo(
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
                header: 'Approval Level',
                accessorKey: 'approvalLevel',
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
                item.approvalLevel.toLowerCase().includes(query)
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
            const aValue = a[key as keyof AllEmployeeData] // Get the value of the key for item a
            const bValue = b[key as keyof AllEmployeeData] // Get the value of the key for item b

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

    return (
        <>
            <div className="lg:flex items-center justify-between mb-4">
                <h3 className="mb-4 lg:mb-0">Assign Employees to Approver</h3>
                {/* <Button
                    size="sm"
                    variant="twoTone"
                    icon={<HiOutlinePlusCircle />}
                    onClick={onAddLeaveApprovalLevel}
                >
                    Assign Employee
                </Button> */}

                <QueryInput ref={inputRef} onInputChange={handleInputChange} />
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

            <AssignApproverDialog />
        </>
    )
}

export default EmployeeData
