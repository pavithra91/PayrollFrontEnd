import useCalculations from '@/utils/hooks/useCalculation'
import { useState, useEffect, useMemo } from 'react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import type { CommonProps } from '@/@types/common'
import Table from '@/components/ui/Table'
import {
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    flexRender,
    ColumnDef,
} from '@tanstack/react-table'
import { CalculationData } from '@/@types/Calculation'
import Pagination from '@/components/ui/Pagination'
import Select from '@/components/ui/Select'
import Badge from '@/components/ui/Badge'
import Tag from '@/components/ui/Tag/Tag'
import useSettings from '@/utils/hooks/useSettings'
import AddDialogComponent from './AddDialogComponent'
import EditDialog from './EditDialogComponent'

type Option = {
    value: number
    label: string
}

interface FormProps extends CommonProps {
    disableSubmit?: boolean
}

const statusColor: Record<string, string> = {
    active: 'bg-emerald-500',
    blocked: 'bg-red-500',
}

const ViewSettings = (props: FormProps) => {
    const { getSystemSettings } = useSettings()

    const [SelectedSettinng, setSelectedSettinng] = useState({})

    const [data, setData] = useState([])

    useEffect(() => {
        const result = getSystemSettings()
        result.then((res) => {
            const listItems = JSON.parse(res?.data?.data ?? '')
            setData(listItems)
        })
    }, [])

    const handleRefresh = async () => {
        const result = getSystemSettings()
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
        setSelectedSettinng(id)
        setEditIsOpen(true)
    }

    const onDialogClose = (e: MouseEvent) => {
        console.log('onDialogClose', e)
        setIsOpen(false)
    }

    const onDialogOk = (e: MouseEvent) => {
        console.log('onDialogOk', e)
        setIsOpen(false)
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
        console.log(id)
        openEditDialog(id)
    }

    const pageSizeOption = [
        { value: 10, label: '10 / page' },
        { value: 20, label: '20 / page' },
        { value: 30, label: '30 / page' },
        { value: 40, label: '40 / page' },
        { value: 50, label: '50 / page' },
    ]

    const columns = useMemo<ColumnDef<CalculationData>[]>(
        () => [
            {
                header: 'Id',
                accessorKey: 'id',
            },
            {
                header: 'Company Code',
                accessorKey: 'companyCode',
            },
            {
                header: 'Category',
                accessorKey: 'category_name',
                cell: (cell) => (
                    <div className="flex items-center">
                        <span className="ml-2 rtl:mr-2 capitalize">
                            {cell.getValue() == 'System_Variable' ? (
                                <Tag prefix prefixClass="bg-emerald-500">
                                    System Variable
                                </Tag>
                            ) : (
                                <Tag suffix suffixClass="bg-rose-500">
                                    Calculation Variable
                                </Tag>
                            )}
                        </span>
                    </div>
                ),
            },
            {
                header: 'Name',
                accessorKey: 'variable_name',
            },
            {
                header: 'Value',
                accessorKey: 'variable_value',
            },
            {
                header: 'Created By',
                accessorKey: 'createdBy',
            },
            {
                header: 'Created Date',
                accessorKey: 'createdDate',
                cell: (cell) => (cell.getValue() + '').substring(0, 10),
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

    const totalData = data.length

    const table = useReactTable({
        data,
        columns,
        initialState: {
            columnVisibility: {
                isTaxableGross: false, //hide this column by default
            },
            //...
        },
        // Pipeline
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
        <Card header="System Variables" headerExtra={headerExtraContent}>
            {isEditOpen && (
                <EditDialog
                    onClose={closeEditDialog}
                    isEditOpen={isEditOpen}
                    props={props}
                    item={SelectedSettinng}
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
                                            header.column.columnDef.header,
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
                                                cell.column.columnDef.cell,
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
                    currentPage={table.getState().pagination.pageIndex + 1}
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
                        onChange={(option) => onSelectChange(option?.value)}
                    />
                </div>
            </div>
        </Card>
    )
}

export default ViewSettings
