import type { CommonProps } from '@/@types/common'
import { InputHTMLAttributes, useEffect, useState, type FC } from 'react'
import {
    FieldHelperProps,
    FieldInputProps,
    FieldMetaProps,
    useField,
} from 'formik'
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
} from '@tanstack/react-table'
import Table from '@/components/ui/Table'
import Pagination from '@/components/ui/Pagination'
import Select from '@/components/ui/Select'
import Input from '@/components/ui/Input/Input'
import type { FilterFn, ColumnFiltersState } from '@tanstack/react-table'
import { rankItem } from '@tanstack/match-sorter-utils'

type Option = {
    value: number
    label: string
}

type PayCodeWiseData = {
    epf: number
}

interface DialogProps {
    data: PayCodeWiseData[]
    column: []
}

interface FormProps extends CommonProps {
    disableSubmit?: boolean
}

interface RenderProps<V = any> {
    field: FieldInputProps<V>
    meta: FieldMetaProps<V>
    helpers: FieldHelperProps<V>
}

interface FieldWrapperProps<V = any> {
    name: string
    render: (formikProps: RenderProps<V>) => React.ReactElement
}

const FieldWrapper: FC<FieldWrapperProps> = ({ name, render }) => {
    const [field, meta, helpers] = useField(name)

    return render({ field, meta, helpers })
}

const { Tr, Th, Td, THead, TBody, Sorter } = Table

interface DebouncedInputProps
    extends Omit<
        InputHTMLAttributes<HTMLInputElement>,
        'onChange' | 'size' | 'prefix'
    > {
    value: string | number
    onChange: (value: string | number) => void
    debounce?: number
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
    { value: 50, label: '50 / page' },
    { value: 100, label: '100 / page' },
    { value: 150, label: '150 / page' },
    { value: 200, label: '200 / page' },
]

const DialogComponent: React.FC<DialogProps> = ({ data, column }) => {
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

    type UnRecoveredData = {
        header: string
        accessorKey: string
    }

    const header: any = []
    column.map((item: any) => {
        header.push({ header: item, accessorKey: item })
    })

    const columns: ColumnDef<UnRecoveredData>[] = header
    console.log(column)
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
        <>
            {/* <Button onClick={handleDownloadExcel}>Print</Button> */}

            <DebouncedInput
                value={globalFilter ?? ''}
                className="p-2 font-lg shadow border border-block"
                placeholder="Search all columns..."
                onChange={(value) => setGlobalFilter(String(value))}
            />
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
                                        {header.isPlaceholder ? null : (
                                            <div
                                                {...{
                                                    className:
                                                        header.column.getCanSort()
                                                            ? 'cursor-pointer select-none'
                                                            : '',
                                                    onClick:
                                                        header.column.getToggleSortingHandler(),
                                                }}
                                            >
                                                {flexRender(
                                                    header.column.columnDef
                                                        .header,
                                                    header.getContext()
                                                )}
                                                {
                                                    <Sorter
                                                        sort={header.column.getIsSorted()}
                                                    />
                                                }
                                            </div>
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
        </>
    )
}

export default DialogComponent
