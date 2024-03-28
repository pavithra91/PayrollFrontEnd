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
import Pagination from '@/components/ui/Pagination'
import Select from '@/components/ui/Select'
import LoadData from './LoadData'
import ConfirmData from './ConfirmData'
import RejectData from './RejectData'
import { Tag } from '@/components/ui/Tag'
import jsPDF from 'jspdf'
import autoTable, { RowInput } from 'jspdf-autotable'
import { number } from 'yup'

type Option = {
    value: number
    label: string
}

interface FormProps extends CommonProps {
    disableSubmit?: boolean
}

const TransferDataView = (props: FormProps) => {
    const { getDataTransferStatistics } = usePayrun()

    const openDialog = () => {
        setIsOpen(true)
    }

    const closeDialog = () => {
        setIsOpen(false)
    }

    const openConfirmDialog = () => {
        if (isDataLoad) {
            setIsConfirmOpen(true)
        }
    }

    const closeConfirmDialog = () => {
        setIsConfirmOpen(false)
    }

    const openRejectDialog = () => {
        if (isDataLoad) {
            setIsRejectOpen(true)
        }
    }

    const closeRejectDialog = () => {
        setIsRejectOpen(false)
    }

    const [data, setData] = useState([])

    const [isOpen, setIsOpen] = useState(false)
    const [isDataLoad, setisDataLoad] = useState(false)
    const [isConfirmOpen, setIsConfirmOpen] = useState(false)
    const [isRejectOpen, setIsRejectOpen] = useState(false)

    const [dataFromChild, setDataFromChild] = useState(null)
    const [printData, setPrintData] = useState<PostData[]>()

    const handleChildData = (data: any) => {
        setDataFromChild(data)
    }

    interface PostData {
        SAPPayData: []
    }

    type SAPPayCodes = {
        PayCode: number
        Amount: number
        Line_Item_Count: number
    }

    type dataGrid = {
        sapPayCode: number
        sapAmount: string
        sapLineCount: number
        nonSAPPayCode: number
        nonSapAmount: number
        nonSapLineCount: number
        status: boolean
    }

    const arr: dataGrid[] = []

    useEffect(() => {
        if (dataFromChild != null) {
            const result = getDataTransferStatistics(dataFromChild)
            result.then((res) => {
                const listItems = JSON.parse(res?.data?.data ?? '')

                setPrintData(listItems)

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
                            sapAmount: item.Amount.toLocaleString('en-US', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                            }),
                            sapLineCount: item.Line_Item_Count,
                            nonSAPPayCode:
                                listItems[0].nonSAPPayData[index].PayCode,
                            nonSapAmount: listItems[0].nonSAPPayData[
                                index
                            ].Amount.toLocaleString('en-US', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                            }),
                            nonSapLineCount:
                                listItems[0].nonSAPPayData[index]
                                    .Line_Item_Count,
                            status: matched,
                        })
                    }
                )
                setData(arr)
                setisDataLoad(true)
            })
        }
    }, [dataFromChild])

    const handlePDFDownload = () => {
        if (printData != null) {
            Object.entries(data).forEach((key) => {
                console.log(key)

                console.log(data[key].status)
                if (data[key].status === true) {
                    data[key].status = 'Matched'
                } else {
                    data[key].status = 'Un Matched'
                }
            })

            //console.log(data)

            const doc = new jsPDF()

            doc.text('Data Transfer Report', 100, 10, { align: 'center' })

            autoTable(doc, {
                columnStyles: { europe: { halign: 'center' } },
                body: data,
                columns: [
                    { header: 'SAP PayCode', dataKey: 'sapPayCode' },
                    { header: 'SAP Amount', dataKey: 'sapAmount' },
                    { header: 'SAP Item Count', dataKey: 'sapLineCount' },
                    { header: 'Non SAP PayCode', dataKey: 'nonSAPPayCode' },
                    { header: 'Non SAP Amount', dataKey: 'nonSapAmount' },
                    {
                        header: 'Non SAP Item Count',
                        dataKey: 'nonSapLineCount',
                    },
                    { header: 'Status', dataKey: 'status' },
                ],
            })

            doc.save('my_table_report.pdf')
        }
    }

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
                <Button
                    variant="solid"
                    color="blue-600"
                    onClick={handlePDFDownload}
                >
                    Print
                </Button>
            </span>
            <span className="mr-1 font-semibold">
                <Button
                    variant="solid"
                    color="green-500"
                    onClick={openConfirmDialog}
                >
                    Confirm
                </Button>
                {isConfirmOpen && (
                    <ConfirmData
                        onClose={closeConfirmDialog}
                        isConfirmOpen={isConfirmOpen}
                        props={props}
                        data={dataFromChild}
                    />
                )}
            </span>
            <span className="mr-1 font-semibold">
                <Button
                    variant="solid"
                    color="red-500"
                    onClick={openRejectDialog}
                >
                    Reject
                </Button>
                {isRejectOpen && (
                    <RejectData
                        onClose={closeRejectDialog}
                        isRejectOpen={isRejectOpen}
                        props={props}
                        data={dataFromChild}
                    />
                )}
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
