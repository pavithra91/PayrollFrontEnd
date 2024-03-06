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
    ColumnSort,
    getSortedRowModel,
} from '@tanstack/react-table'
import { CalculationData } from '@/@types/Calculation'
import Pagination from '@/components/ui/Pagination'
import Select from '@/components/ui/Select'
import type { PayrollDataSchema } from '@/@types/payroll'
import LoadData from './LoadData'
import { Tag } from '@/components/ui/Tag'
import jsPDF from 'jspdf'

type Option = {
    value: number
    label: string
}

interface FormProps extends CommonProps {
    disableSubmit?: boolean
}

const TransferDataView = (props: FormProps) => {
    const { getDataTransferStatistics } = usePayrun()

    const [data, setData] = useState([])

    const initValues: PayrollDataSchema = {
        companyCode: 3000, // This will be the default one
        period: 202312,
    }

    const openDialog = () => {
        setIsOpen(true)
    }

    const closeDialog = () => {
        setIsOpen(false)
        // console.log(dataFromChild)
    }
    const handlePDFDownload = () => {
        const tableData = arr

        // Create a new PDF document
        const doc = new jsPDF()

        doc.text('Hello world!', 10, 10)
        // Save the PDF document
        doc.save('my_table_report.pdf')
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

    const closeEditDialog = () => setEditIsOpen(false)

    const [dataFromChild, setDataFromChild] = useState(null)

    const handleChildData = (data: any) => {
        setDataFromChild(data)
    }

    // console.log(dataFromChild)

    const payrollDataArr: {
        sapPayCode: any
        sapAmount: number
        sapLineCount: any
        nonSapPayCode: any
        nonSapAmount: number
        nonSapLineCount: number
        status: boolean
    }[] = []

    type SAPPayCodes = {
        PayCode: number
        Amount: number
        Line_Item_Count: number
    }

    interface CompanyIdSelectOption {
        sapPayCode: number
        sapAmount: number
        sapLineCount: number
        nonSAPPayCode: number
        nonSapAmount: number
        nonSapLineCount: number
        status: boolean
    }

    const arr: CompanyIdSelectOption[] = []

    useEffect(() => {
        if (dataFromChild != null) {
            const result = getDataTransferStatistics(dataFromChild)
            result.then((res) => {
                const listItems = JSON.parse(res?.data?.data ?? '')

                listItems[0].SAPPayData.map(
                    (item: SAPPayCodes, index: number) => {
                        var matched = false
                        let nonSAPAmount = parseFloat(
                            listItems[0].nonSAPPayData[index].Amount
                        )
                        let nonSAPLineCount = parseFloat(
                            listItems[0].nonSAPPayData[index].Line_Item_Count
                        )
                        if (
                            listItems[0].nonSAPPayData[index].PayCode ===
                                item.PayCode &&
                            nonSAPLineCount === item.Line_Item_Count &&
                            nonSAPAmount == item.Amount
                        ) {
                            matched = true
                        }

                        arr.push({
                            sapPayCode: item.PayCode,
                            sapAmount: item.Amount,
                            sapLineCount: item.Line_Item_Count,
                            nonSAPPayCode:
                                listItems[0].nonSAPPayData[index].PayCode,
                            nonSapAmount:
                                listItems[0].nonSAPPayData[index].Amount,
                            nonSapLineCount:
                                listItems[0].nonSAPPayData[index]
                                    .Line_Item_Count,
                            status: matched,
                        })
                    }
                )

                setData(arr)
            })
        }
    }, [dataFromChild])

    const { Tr, Th, Td, THead, TBody, Sorter } = Table

    const pageSizeOption = [
        { value: 10, label: '10 / page' },
        { value: 20, label: '20 / page' },
        { value: 30, label: '30 / page' },
        { value: 40, label: '40 / page' },
        { value: 50, label: '50 / page' },
    ]

    const columns = useMemo<ColumnDef<typeof arr>[]>(
        () => [
            {
                header: 'SAP',
                enableSorting: false,
                columns: [
                    {
                        header: 'Pay Code',
                        accessorKey: 'sapPayCode',
                    },
                    {
                        header: 'SAP Amount',
                        accessorKey: 'sapAmount',
                    },
                    {
                        header: 'Record Count',
                        accessorKey: 'sapLineCount',
                    },
                ],
            },

            {
                header: 'Non SAP',
                enableSorting: false,
                columns: [
                    {
                        header: 'Pay Code',
                        accessorKey: 'nonSAPPayCode',
                    },
                    {
                        header: 'Non SAP Amount',
                        accessorKey: 'nonSapAmount',
                    },
                    {
                        header: 'Record Count',
                        accessorKey: 'nonSapLineCount',
                    },
                ],
            },
            {
                header: 'Status',
                accessorKey: 'status',
                cell: ({ row }) => {
                    const { status } = row.original
                    return (
                        <Tag
                            className={
                                status == true
                                    ? 'text-green-600 bg-green-300 dark:text-green-100 dark:bg-green-500/20 border-0'
                                    : 'text-red-600 bg-red-200 dark:text-red-100 dark:bg-red-500/20 border-0'
                            }
                        >
                            {status == true ? 'Matched' : 'Not Matched'}
                        </Tag>
                    )
                },
            },
        ],
        []
    )

    const totalData = data.length
    const [sorting, setSorting] = useState<ColumnSort[]>([])

    const table = useReactTable({
        data,
        columns,
        state: {
            sorting,
        },
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        onSortingChange: setSorting,
    })

    const onPaginationChange = (page: number) => {
        table.setPageIndex(page - 1)
    }

    const onSelectChange = (value = 0) => {
        table.setPageSize(Number(value))
    }

    const headerExtraContent = (
        <span className="flex items-center">
            <span className="mr-1 font-semibold">
                <Button variant="solid" onClick={openDialog}>
                    Load
                </Button>
                {isOpen && (
                    <LoadData
                        onClose={closeDialog}
                        isOpen={isOpen}
                        props={props}
                        onSendData={handleChildData}
                    />
                )}
            </span>
            <span className="mr-1 font-semibold">
                <Button variant="solid" onClick={handlePDFDownload}>
                    Print
                </Button>
            </span>
            <span className="text-emerald-500 text-xl"></span>
        </span>
    )

    return (
        <Card header="Control" headerExtra={headerExtraContent}>
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
        </Card>
    )
}

export default TransferDataView
