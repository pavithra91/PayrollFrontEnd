import Table from '@/components/ui/Table'
import { useState, useEffect, useMemo, SetStateAction } from 'react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import AddDialogComponent from './AddDialogComponent'
import type { CommonProps } from '@/@types/common'
import usePayCodes from '@/utils/hooks/usePayCodes'
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
import { PayCodeData } from '@/@types/paycode'
import useAccount from '@/utils/hooks/useAccount'

type Option = {
    value: number
    label: string
}

interface FormProps extends CommonProps {
    disableSubmit?: boolean
}

const ViewUsers = (props: FormProps) => {
    const { getUsers } = useAccount()

    const [data, setData] = useState([])

    useEffect(() => {
        const result = getUsers()
        result.then((res) => {
            const listItems = JSON.parse(res?.data?.data ?? '')
            console.log(listItems)
            setData(listItems)
        })
    }, [])

    const { Tr, Th, Td, THead, TBody } = Table

    // const openDialog = () => {
    //     setIsOpen(true)
    // }
    // const openEditDialog = (id: any) => {
    //     setSelectedPayCode(id)
    //     setEditIsOpen(true)
    // }

    // const onDialogClose = (e: MouseEvent) => {
    //     console.log('onDialogClose', e)
    //     setIsOpen(false)
    // }

    // const onDialogOk = (e: MouseEvent) => {
    //     console.log('onDialogOk', e)
    //     setIsOpen(false)
    // }

    // const [isOpen, setIsOpen] = useState(false)
    // const [isEditOpen, setEditIsOpen] = useState(false)

    // const closeDialog = () => setIsOpen(false)
    // const closeEditDialog = () => setEditIsOpen(false)

    // const headerExtraContent = (
    //     <span className="flex items-center">
    //         <span className="mr-1 font-semibold">
    //             <Button variant="solid" onClick={openDialog}>
    //                 Add
    //             </Button>
    //             {isOpen && (
    //                 <AddDialogComponent
    //                     onClose={closeDialog}
    //                     isOpen={isOpen}
    //                     props={props}
    //                 />
    //             )}
    //         </span>
    //         <span className="text-emerald-500 text-xl"></span>
    //     </span>
    // )

    // const handleShowEditModal = (id: any) => {
    //     console.log(id)
    //     openEditDialog(id)
    // }

    // const pageSizeOption = [
    //     { value: 10, label: '10 / page' },
    //     { value: 20, label: '20 / page' },
    //     { value: 30, label: '30 / page' },
    //     { value: 40, label: '40 / page' },
    //     { value: 50, label: '50 / page' },
    // ]

    // const columns = useMemo<ColumnDef<PayCodeData>[]>(
    //     () => [
    //         {
    //             header: 'Cost Center',
    //             accessorKey: 'costCenter',
    //         },
    //         {
    //             header: 'Company Code',
    //             accessorKey: 'companyCode',
    //         },
    //         {
    //             header: 'EPF',
    //             accessorKey: 'epf',
    //         },
    //         {
    //             header: 'Cal Code',
    //             accessorKey: 'calCode',
    //         },
    //         {
    //             header: 'dDescription',
    //             accessorKey: 'description',
    //         },
    //         {
    //             header: 'Category',
    //             accessorKey: 'payCategory',
    //         },
    //         {
    //             header: 'Rate',
    //             accessorKey: 'rate',
    //         },
    //         {
    //             header: 'Is Taxable Gross',
    //             accessorKey: 'isTaxableGross',
    //             show: false,
    //         },
    //         {
    //             header: 'Created By',
    //             accessorKey: 'createdBy',
    //         },
    //         {
    //             header: 'Action',
    //             accessorKey: 'action',
    //             cell: (cell) => (
    //                 <Button
    //                     variant="solid"
    //                     onClick={() => handleShowEditModal(cell.row)}
    //                 >
    //                     Edit
    //                 </Button>
    //             ),
    //         },
    //     ],
    //     []
    // )
    // //  const [data] = useState(() => tableData())

    // const totalData = data.length

    // const table = useReactTable({
    //     data,
    //     columns,
    //     initialState: {
    //         columnVisibility: {
    //             isTaxableGross: false, //hide this column by default
    //         },
    //         //...
    //     },
    //     // Pipeline
    //     getCoreRowModel: getCoreRowModel(),
    //     getFilteredRowModel: getFilteredRowModel(),
    //     getPaginationRowModel: getPaginationRowModel(),
    // })

    // const onPaginationChange = (page: number) => {
    //     table.setPageIndex(page - 1)
    // }

    // const onSelectChange = (value = 0) => {
    //     table.setPageSize(Number(value))
    // }
    return <></>
}

export default ViewUsers
