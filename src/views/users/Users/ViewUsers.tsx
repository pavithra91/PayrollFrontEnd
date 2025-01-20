import Table from '@/components/ui/Table'
import { useState, useEffect, useMemo } from 'react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import AddDialogComponent from './AddDialogComponent'
import EditDialog from './EditDialogComponent'
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
import useAccount from '@/utils/hooks/useAccount'
import { AccountData } from '@/@types/Account'
import Badge from '@/components/ui/Badge'
import { HiOutlineKey, HiPencil } from 'react-icons/hi'
import PasswordReset from './PasswordReset'

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

const ViewUsers = (props: FormProps) => {
    const { getUsers } = useAccount()

    const [data, setData] = useState([])

    const [selectedUserID, setSelectedUserID] = useState({})

    useEffect(() => {
        const result = getUsers()
        result.then((res) => {
            const listItems = JSON.parse(res?.data?.data ?? '')
            setData(listItems)
        })
    }, [])

    const handleRefresh = async () => {
        const result = getUsers()
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
        setSelectedUserID(id)
        setEditIsOpen(true)
    }

    const openPasswordResetDialog = (id: any) => {
        setSelectedUserID(id)
        setIsPasswordResetOpen(true)
    }

    const [isOpen, setIsOpen] = useState(false)
    const [isEditOpen, setEditIsOpen] = useState(false)
    const [isPasswordResetOpen, setIsPasswordResetOpen] = useState(false)

    const closeDialog = () => {
        setIsOpen(false)
        handleRefresh
    }
    const closeEditDialog = () => {
        setEditIsOpen(false)
        handleRefresh()
    }
    const closePasswordResetDialog =() => {
        setIsPasswordResetOpen(false)
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

    const handleShowPasswordResetModal = (id: any) => {
        openPasswordResetDialog(id)
    }

    const pageSizeOption = [
        { value: 10, label: '10 / page' },
        { value: 20, label: '20 / page' },
        { value: 30, label: '30 / page' },
        { value: 40, label: '40 / page' },
        { value: 50, label: '50 / page' },
    ]

    const columns = useMemo<ColumnDef<AccountData>[]>(
        () => [
            {
                header: 'Id',
                accessorKey: 'id',
                show: false,
            },
            {
                header: 'Cost Center',
                accessorKey: 'costCenter',
            },
            {
                header: 'User ID',
                accessorKey: 'userID',
            },
            {
                header: 'EPF',
                accessorKey: 'epf',
            },
            {
                header: 'Name',
                accessorKey: 'empName',
            },
            {
                header: 'Role',
                accessorKey: 'role',
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
                header: 'Account Locked',
                accessorKey: 'isAccountLocked',
                cell: (cell) => (
                    <div className="flex items-center">
                        <Badge
                            className={
                                statusColor[
                                    cell.getValue() == true
                                        ? 'blocked'
                                        : 'active'
                                ]
                            }
                        />
                        <span className="ml-2 rtl:mr-2 capitalize">
                            {cell.getValue() == true ? 'Locked' : 'Active'}
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
                    <>
                        <div className="ltr:text-right rtl:text-left">
                            <Button
                                size="sm"
                                icon={<HiPencil />}
                                onClick={() => handleShowEditModal(cell.row)}
                            ></Button>
                            <span className="ml-1"></span>
                            <Button
                                size="sm"
                                icon={<HiOutlineKey />}
                                onClick={() => handleShowPasswordResetModal(cell.row)}
                            ></Button>
                        </div>
                    </>
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
                id: false, //hide this column by default
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
        <>
            <Card header="User Accounts" headerExtra={headerExtraContent}>
                {isEditOpen && (
                    <EditDialog
                        onClose={closeEditDialog}
                        isEditOpen={isEditOpen}
                        props={props}
                        item={selectedUserID}
                    />
                )}

{isPasswordResetOpen && (
                    <PasswordReset
                        onClose={closePasswordResetDialog}
                        isOpen={isPasswordResetOpen}
                        props={props}
                        //item={selectedUserID}
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
        </>
    )
}

export default ViewUsers
