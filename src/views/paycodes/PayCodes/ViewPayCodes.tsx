import Table from '@/components/ui/Table'
import { useState, useEffect, useMemo, InputHTMLAttributes } from 'react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import AddDialogComponent from './AddDialogComponent'
import type { CommonProps } from '@/@types/common'
import EditDialog from './EditDialogComponent'
import usePayCodes from '@/utils/hooks/usePayCodes'
import Pagination from '@/components/ui/Pagination'
import Select from '@/components/ui/Select'

import {
    ColumnDef,
    ColumnSort,
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    flexRender,
    getFacetedRowModel,
    getFacetedMinMaxValues,
    FilterFn,
    ColumnFiltersState,
} from '@tanstack/react-table'
import { PayCodeData } from '@/@types/paycode'
import Tag from '@/components/ui/Tag/Tag'
import { rankItem } from '@tanstack/match-sorter-utils'
import Input from '@/components/ui/Input/Input'
import Loading from '@/components/shared/Loading'

type Option = {
    value: number
    label: string
}

interface FormProps extends CommonProps {
    disableSubmit?: boolean
}

interface DebouncedInputProps
    extends Omit<
        InputHTMLAttributes<HTMLInputElement>,
        'onChange' | 'size' | 'prefix'
    > {
    value: string | number
    onChange: (value: string | number) => void
    debounce?: number
}

const ViewPayCodes = (props: FormProps) => {
    function DebouncedInput({
        value: initialValue,
        onChange,
        debounce = 500,
        ...props
    }: DebouncedInputProps) {
        const [value, setValue] = useState(initialValue)

        useEffect(() => {
            setValue(initialValue)
        }, [initialValue])

        useEffect(() => {
            const timeout = setTimeout(() => {
                onChange(value)
            }, debounce)

            return () => clearTimeout(timeout)
        }, [value])

        return (
            <div className="flex justify-end">
                <div className="flex items-center mb-4">
                    <span className="mr-2">Search:</span>
                    <Input
                        {...props}
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                    />
                </div>
            </div>
        )
    }
    const { getPayCodes } = usePayCodes()

    const [selectedPayCode, setSelectedPayCode] = useState({})

    const [data, setData] = useState([])
    const [isDataLoad, setisDataLoad] = useState(false)

    useEffect(() => {
        setisDataLoad(true)
        const result = getPayCodes()
        result.then((res) => {
            const listItems = JSON.parse(res?.data?.data ?? '')
            setData(listItems)
            setisDataLoad(false)
        })
    }, [])

    const handleRefresh = async () => {
        const result = getPayCodes()
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
        setSelectedPayCode(id)
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
        openEditDialog(id)
    }

    const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
        // Rank the item
        const itemRank = rankItem(row.getValue(columnId), value)

        // Store the itemRank info
        addMeta({
            itemRank,
        })

        // Return if the item should be filtered in/out
        return itemRank.passed
    }

    const pageSizeOption = [
        { value: 10, label: '10 / page' },
        { value: 20, label: '20 / page' },
        { value: 30, label: '30 / page' },
        { value: 40, label: '40 / page' },
        { value: 50, label: '50 / page' },
    ]

    const columns = useMemo<ColumnDef<PayCodeData>[]>(
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
                header: 'Pay Code',
                accessorKey: 'payCode',
            },
            {
                header: 'Cal Code',
                accessorKey: 'calCode',
            },
            {
                header: 'Description',
                accessorKey: 'description',
            },
            {
                header: 'Category',
                accessorKey: 'payCategory',
                cell: (cell) => (
                    <div className="flex items-center">
                        <span className="ml-2 rtl:mr-2 capitalize">
                            {cell.getValue() == '0' ? (
                                <Tag prefix prefixClass="bg-emerald-500">
                                    Earning
                                </Tag>
                            ) : (
                                <Tag prefix prefixClass="bg-rose-500">
                                    Deduction
                                </Tag>
                            )}
                        </span>
                    </div>
                ),
            },
            {
                header: 'Rate',
                accessorKey: 'rate',
            },
            {
                header: 'Taxation Type',
                accessorKey: 'taxationType',
                cell: (cell) => (
                    <div className="flex items-center">
                        <span className="ml-2 rtl:mr-2 capitalize">
                            {cell.getValue() == 'IT' ? (
                                <Tag className="bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-100 rounded border-0">
                                    Income Tax
                                </Tag>
                            ) : cell.getValue() == 'LT' ? (
                                <Tag className="text-red-600 bg-red-100 dark:text-red-100 dark:bg-red-500/20 rounded border-0">
                                    Lump Sum Tax
                                </Tag>
                            ) : (
                                <Tag className="text-amber-600 bg-amber-100 dark:text-amber-100 dark:bg-amber-500/20 rounded border-0">
                                    None
                                </Tag>
                            )}
                        </span>
                    </div>
                ),
            },
            {
                header: 'Created By',
                accessorKey: 'createdBy',
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

    const [sorting, setSorting] = useState<ColumnSort[]>([])

    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [globalFilter, setGlobalFilter] = useState('')

    const table = useReactTable({
        data,
        columns,
        filterFns: {
            fuzzy: fuzzyFilter,
        },
        state: {
            columnFilters,
            globalFilter,
            sorting,
        },
        onColumnFiltersChange: setColumnFilters,
        onGlobalFilterChange: setGlobalFilter,
        globalFilterFn: fuzzyFilter,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFacetedRowModel: getFacetedRowModel(),
        getFacetedMinMaxValues: getFacetedMinMaxValues(),
        onSortingChange: setSorting,
        debugHeaders: true,
        debugColumns: false,
    })

    const onPaginationChange = (page: number) => {
        table.setPageIndex(page - 1)
    }

    const onSelectChange = (value = 0) => {
        table.setPageSize(Number(value))
    }

    return (
        <Card header="Pay Codes" headerExtra={headerExtraContent}>
            {isEditOpen && (
                <EditDialog
                    onClose={closeEditDialog}
                    isEditOpen={isEditOpen}
                    props={props}
                    item={selectedPayCode}
                />
            )}
            <DebouncedInput
                value={globalFilter ?? ''}
                className="p-2 font-lg shadow border border-block"
                placeholder="Search all columns..."
                onChange={(value) => setGlobalFilter(String(value))}
            />
            <Loading loading={isDataLoad}></Loading>
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

export default ViewPayCodes
