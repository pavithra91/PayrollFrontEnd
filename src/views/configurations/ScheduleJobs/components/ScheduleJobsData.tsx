import { TableQueries } from '@/@types/common'
import {
    AllScheduleJobsData,
    toggleNewJobDialog,
    useAppDispatch,
    useAppSelector,
} from '../store'
import { useEffect, useMemo, useState } from 'react'
import DataTable, {
    ColumnDef,
    OnSortParam,
} from '@/components/shared/DataTable'
import ActionColumn from './ActionColumn'
import Dialog from '@/components/ui/Dialog'
import JobContent from './JobContent'
import Badge from '@/components/ui/Badge'

type AllTableProps = {
    data: AllScheduleJobsData[]
    loading: boolean
    tableData: TableQueries
}

const statusColor: Record<string, string> = {
    active: 'bg-emerald-500',
    blocked: 'bg-red-500',
}

const ScheduleJobsData = ({ data, loading, tableData }: AllTableProps) => {
    const dispatch = useAppDispatch()

    const jobDialog = useAppSelector(
        (state) => state.JobsData.data.newJobDialog
    )

    const onDialogClose = () => {
        dispatch(toggleNewJobDialog(false))
    }

    const [filteredData, setFilteredData] = useState<AllScheduleJobsData[]>(
        data || []
    )

    const [pageIndex, setPageIndex] = useState<number>(tableData.pageIndex || 1)
    const [pageSize, setPageSize] = useState<number>(tableData.pageSize || 2)
    const [sortConfig, setSortConfig] = useState<OnSortParam>({
        key: 'id', // Default sorting by 'userId'
        order: 'asc',
    })

    const columns: ColumnDef<AllScheduleJobsData>[] = useMemo(
        () => [
            {
                header: 'Id',
                accessorKey: 'id',
            },
            {
                header: 'Name',
                accessorKey: 'jobName',
            },
            {
                header: 'Group',
                accessorKey: 'groupName',
            },
            {
                header: 'Crone Expression',
                accessorKey: 'cronExpression',
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
                item.jobName.toString().includes(query) ||
                item.groupName.toLowerCase().includes(query)
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
            const aValue = a[key as keyof AllScheduleJobsData] // Get the value of the key for item a
            const bValue = b[key as keyof AllScheduleJobsData] // Get the value of the key for item b

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
                <h3 className="mb-4 lg:mb-0">Backgroud Job Scheduler</h3>
                {/* <Button
                    size="sm"
                    variant="twoTone"
                    icon={<HiOutlinePlusCircle />}
                    onClick={onAddLeaveApprovalLevel}
                >
                    Assign Employee
                </Button> */}

                {/* <QueryInput ref={inputRef} onInputChange={handleInputChange} /> */}
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
                isOpen={jobDialog}
                onClose={onDialogClose}
                onRequestClose={onDialogClose}
            >
                <h4>Backgroud Job</h4>
                <div className="mt-4">
                    <JobContent />
                </div>
            </Dialog>
        </>
    )
}

export default ScheduleJobsData
