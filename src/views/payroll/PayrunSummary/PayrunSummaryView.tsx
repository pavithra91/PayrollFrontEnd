import Table from '@/components/ui/Table'
import { useState, useEffect, useMemo, SetStateAction } from 'react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import type { CommonProps } from '@/@types/common'
import Pagination from '@/components/ui/Pagination'
import Select from '@/components/ui/Select'

import {
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    flexRender,
    ColumnDef,
} from '@tanstack/react-table'
import usePayrun from '@/utils/hooks/usePayrun'
import { PayrunData } from '@/@types/Payrun'
import { Cell } from 'jspdf-autotable'

type Option = {
    value: number
    label: string
}

interface FormProps extends CommonProps {
    disableSubmit?: boolean
}

const PayrunSummaryView = (props: FormProps) => {
    const { getPayrunDetails } = usePayrun()

    const [data, setData] = useState([])

    useEffect(() => {
        const result = getPayrunDetails()
        result.then((res) => {
            const listItems = JSON.parse(res?.data?.data ?? '')
            setData(listItems)
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

    const columns = useMemo<ColumnDef<PayrunData>[]>(
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
                header: 'Period',
                accessorKey: 'period',
            },
            {
                header: 'Status',
                accessorKey: 'payrunStatus',
            },
            {
                header: '# Employees',
                accessorKey: 'noOfEmployees',
            },
            {
                header: '# Records',
                accessorKey: 'noOfRecords',
            },
            {
                header: 'Data Transfered By',
                accessorKey: 'dataTransferedBy',
            },
            {
                header: 'Data Transfered Date',
                accessorKey: 'dataTransferredDate',
                cell: (cell) => (cell.getValue() + '').substring(0, 10),
            },
            {
                header: 'Data Transfered Time',
                accessorKey: 'dataTransferredTime',
                cell: (cell) => (cell.getValue() + '').substring(11, 16),
            },
            {
                header: 'Approved By',
                accessorKey: 'approvedBy',
            },
            {
                header: 'Approved Date',
                accessorKey: 'approvedDate',
                cell: (cell) => (cell.getValue() + '').substring(0, 10),
            },
            {
                header: 'Approved Time',
                accessorKey: 'approvedTime',
                cell: (cell) => (cell.getValue() + '').substring(11, 16),
            },
            {
                header: 'Payrun By',
                accessorKey: 'payrunBy',
            },
            {
                header: 'Payrun Date',
                accessorKey: 'payrunDate',
                cell: (cell) =>
                    cell.getValue() == null
                        ? ''
                        : (cell.getValue() + '').substring(0, 10),
            },
            {
                header: 'Payrun Time',
                accessorKey: 'payrunTime',
                cell: (cell) =>
                    cell.getValue() == null
                        ? ''
                        : (cell.getValue() + '').substring(11, 16),
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
        <Card header="Payrun Summary View">
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

export default PayrunSummaryView
