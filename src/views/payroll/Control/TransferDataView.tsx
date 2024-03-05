import usePayrun from '@/utils/hooks/usePayrun'
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

type Option = {
    value: number
    label: string
}

interface FormProps extends CommonProps {
    disableSubmit?: boolean
}

const TransferDataView = (props: FormProps) => {
    const { getDataTransferStatistics } = usePayrun()

    const [selectedCalculation, setSelectedCalculation] = useState({})

    const [data, setData] = useState([])

    useEffect(() => {
        const result = getDataTransferStatistics()
        result.then((res) => {
            const listItems = JSON.parse(res?.data?.data ?? '')

            setData(listItems)

            console.log('data load')
        })
    }, [])

    const { Tr, Th, Td, THead, TBody } = Table

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
                header: 'Sequence',
                accessorKey: 'sequence',
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
                header: 'Formula',
                accessorKey: 'calFormula',
            },
            {
                header: 'Description',
                accessorKey: 'calDescription',
            },
            {
                header: 'Category',
                accessorKey: 'payCategory',
            },
            {
                header: 'Contributor',
                accessorKey: 'contributor',
            },
            {
                header: 'Status',
                accessorKey: 'status',
                show: false,
            },
            {
                header: 'Created By',
                accessorKey: 'createdBy',
            },
            {
                header: 'Action',
                accessorKey: 'action',
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
        <Card header="Control">
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

export default TransferDataView
