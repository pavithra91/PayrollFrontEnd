import Table from '@/components/ui/Table'
import useCalculations from '@/utils/hooks/useCalculation'
import { useState, useEffect, useMemo } from 'react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import AddDialogComponent from './AddDialogComponent'
import type { CommonProps } from '@/@types/common'
import EditDialog from './EditDialogComponent'
import Badge from '@/components/ui/Badge'
import {
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    flexRender,
    ColumnDef,
} from '@tanstack/react-table'
import Pagination from '@/components/ui/Pagination'
import Select from '@/components/ui/Select'
import { TaxData } from '@/@types/Calculation'

type Option = {
    value: number
    label: string
}

const statusColor: Record<string, string> = {
    active: 'bg-emerald-500',
    blocked: 'bg-red-500',
}

interface FormProps extends CommonProps {
    disableSubmit?: boolean
}

const ViewCalculations = (props: FormProps) => {
    const { getTaxCalculations } = useCalculations()

    const [data, setData] = useState([])

    const [selectTaxID, setSelectTaxID] = useState({})

    useEffect(() => {
        const result = getTaxCalculations()
        result.then((res) => {
            const listItems = JSON.parse(res?.data?.data ?? '')
            setData(listItems)
        })
    }, [])

    const handleRefresh = async () => {
        const result = getTaxCalculations()
        result.then((res) => {
            const listItems = JSON.parse(res?.data?.data ?? '')
            setData(listItems)
        })
    }

    const { Tr, Th, Td, THead, TBody } = Table

    const openDialog = () => {
        setIsOpen(true)
    }
    const openEditDialog = (id: any) => {
        setSelectTaxID(id)
        setEditIsOpen(true)
    }

    const [isOpen, setIsOpen] = useState(false)
    const [isEditOpen, setEditIsOpen] = useState(false)

    const closeDialog = () => {
        setIsOpen(false)
        handleRefresh()
    }
    const closeEditDialog = () => {
        setEditIsOpen(false)
        handleRefresh()
    }

    const headerExtraContent = (
        <span className="flex items-center">
            <span className="mr-1 font-semibold">
                <Button variant="solid" onClick={openDialog}>
                    Add
                </Button>
                {isOpen && (
                    <AddDialogComponent
                        onClose={closeDialog}
                        isOpen={isOpen}
                        props={props}
                    />
                )}
            </span>
            <span className="text-emerald-500 text-xl"></span>
        </span>
    )

    const handleShowEditModal = (id: any) => {
        openEditDialog(id)
    }

    const pageSizeOption = [
        { value: 10, label: '10 / page' },
        { value: 20, label: '20 / page' },
        { value: 30, label: '30 / page' },
        { value: 40, label: '40 / page' },
        { value: 50, label: '50 / page' },
    ]

    const columns = useMemo<ColumnDef<TaxData>[]>(
        () => [
            {
                header: 'Id',
                accessorKey: 'id',
            },
            {
                header: 'Company Cide',
                accessorKey: 'companyCode',
            },
            {
                header: 'Range',
                accessorKey: 'range',
            },
            {
                header: 'Formula',
                accessorKey: 'calFormula',
            },
            {
                header: 'Description',
                accessorKey: 'description',
            },
            {
                header: 'Created By',
                accessorKey: 'createdBy',
            },
            {
                header: 'Created Date',
                accessorKey: 'createdDate',
            },
            {
                header: 'Status',
                accessorKey: 'status',
                cell: (cell) => (
                    <div className="flex items-center">
                        <Badge
                            className={
                                statusColor[
                                    cell.getValue() == true
                                        ? 'active'
                                        : 'blocked'
                                ]
                            }
                        />
                        <span className="ml-2 rtl:mr-2 capitalize">
                            {cell.getValue() == true ? 'Active' : 'Inactive'}
                        </span>
                    </div>
                ),
            },
            {
                header: 'Action',
                accessorKey: 'action',
                cell: (cell) => (
                    <Button
                        variant="solid"
                        onClick={() => handleShowEditModal(cell.row)}
                    >
                        Edit
                    </Button>
                ),
            },
        ],
        []
    )
    //  const [data] = useState(() => tableData())

    const totalData = data.length

    const table = useReactTable({
        data,
        columns,
        initialState: {
            columnVisibility: {
                companyCode: true, //hide this column by default
            },
            //...
        },
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    })

    const onPaginationChange = (page: number) => {
        table.setPageIndex(page - 1)
    }

    const onSelectChange = (value = 0) => {
        table.setPageSize(Number(value))
    }

    return (
        <>
            <>
                <Card
                    header="Tax Calculations"
                    headerExtra={headerExtraContent}
                >
                    {isEditOpen && (
                        <EditDialog
                            onClose={closeEditDialog}
                            isEditOpen={isEditOpen}
                            props={props}
                            item={selectTaxID}
                        />
                    )}
                    <Table>
                        <THead>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <Tr key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => {
                                        return (
                                            <Th
                                                key={header.id}
                                                colSpan={header.colSpan}
                                            >
                                                {flexRender(
                                                    header.column.columnDef
                                                        .header,
                                                    header.getContext()
                                                )}
                                            </Th>
                                        )
                                    })}
                                </Tr>
                            ))}
                        </THead>
                        <TBody>
                            {table.getRowModel().rows.map((row) => {
                                return (
                                    <Tr key={row.id}>
                                        {row.getVisibleCells().map((cell) => {
                                            return (
                                                <Td key={cell.id}>
                                                    {flexRender(
                                                        cell.column.columnDef
                                                            .cell,
                                                        cell.getContext()
                                                    )}
                                                </Td>
                                            )
                                        })}
                                    </Tr>
                                )
                            })}
                        </TBody>
                    </Table>

                    <div className="flex items-center justify-between mt-4">
                        <Pagination
                            pageSize={table.getState().pagination.pageSize}
                            currentPage={
                                table.getState().pagination.pageIndex + 1
                            }
                            total={totalData}
                            onChange={onPaginationChange}
                        />
                        <div style={{ minWidth: 130 }}>
                            <Select<Option>
                                size="sm"
                                isSearchable={false}
                                value={pageSizeOption.filter(
                                    (option) =>
                                        option.value ===
                                        table.getState().pagination.pageSize
                                )}
                                options={pageSizeOption}
                                onChange={(option) =>
                                    onSelectChange(option?.value)
                                }
                            />
                        </div>
                    </div>
                </Card>
            </>
        </>
    )
}

export default ViewCalculations
