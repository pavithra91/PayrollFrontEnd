import type { CommonProps, CompanyIdSelectOption } from '@/@types/common'
import { FC, useEffect, useState } from 'react'
import Button from '@/components/ui/Button'
import { Formik, Field, Form } from 'formik'
import { FormItem, FormContainer } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Card from '@/components/ui/Card'
import {
    FieldHelperProps,
    FieldInputProps,
    FieldMetaProps,
    useField,
} from 'formik'
import Select from '@/components/ui/Select'
import usePayrun from '@/utils/hooks/usePayrun'
import { PayrollDataSchema } from '@/@types/payroll'
import useTimeOutMessage from '@/utils/hooks/useTimeOutMessage'
import {
    ColumnDef,
    ColumnSort,
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    flexRender,
} from '@tanstack/react-table'
import Table from '@/components/ui/Table'
import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'

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

const companyOptions: CompanyIdSelectOption[] = [
    { value: 2000, label: '2000' },
    { value: 3000, label: '3000' },
]

type FormLayout = 'inline'

const FieldWrapper: FC<FieldWrapperProps> = ({ name, render }) => {
    const [field, meta, helpers] = useField(name)

    return render({ field, meta, helpers })
}

const ConfirmedDataView = (props: FormProps) => {
    const [layout, setLayout] = useState<FormLayout>('inline')
    const { getDataTransferStatistics } = usePayrun()
    const [message, setMessage] = useTimeOutMessage()
    const [data, setData] = useState<dataGrid[]>([])
    const [isDataLoad, setisDataLoad] = useState(false)
    const [isSubmitting, setisSubmitting] = useState(false)

    const { processPayroll } = usePayrun()

    const [dataFromChild, setDataFromChild] =
        useState<PayrollDataSchema | null>(null)

    const onSubmit = async (values: PayrollDataSchema) => {
        const { companyCode, period } = values

        if (values != null) {
            setDataFromChild(values)
        }
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
    }

    const arr: dataGrid[] = []

    useEffect(() => {
        if (dataFromChild != null) {
            const result = getDataTransferStatistics(dataFromChild)
            result.then((res) => {
                const listItems = JSON.parse(res?.data?.data ?? '')

                listItems[0].SAPPayData.map(
                    (item: SAPPayCodes, index: number) => {
                        arr.push({
                            sapPayCode: item.PayCode,
                            sapAmount: item.Amount.toLocaleString('en-US', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                            }),
                            sapLineCount: item.Line_Item_Count,
                        })
                    }
                )
                setData(arr)
                console.log(arr)
                setisDataLoad(true)
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

    const columns: ColumnDef<dataGrid>[] = [
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
    ]

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

    const getUsernameFromLocalStorage = () => {
        const user = JSON.parse(localStorage.getItem('admin') ?? '')
        const userName = JSON.parse(user.auth).user.userName
        return userName
    }

    const processPayrollData = async () => {
        setisSubmitting(true)

        if (isDataLoad && dataFromChild != null) {
            const companyCode = dataFromChild.companyCode
            const period = dataFromChild.period
            const approvedBy = getUsernameFromLocalStorage()

            const result = await processPayroll({
                companyCode,
                period,
                approvedBy,
            })

            console.log(result?.status)

            if (result?.status === 'failed') {
                setMessage(result.message)
                openNotification('danger', result.message)
            } else {
                setMessage('Successfully Saved')
                openNotification('success', 'Payroll Process Successfully')
            }

            console.log(isSubmitting)

            setisSubmitting(false)
        }
    }

    const openNotification = (
        type: 'success' | 'warning' | 'danger' | 'info',
        message: string
    ) => {
        toast.push(
            <Notification
                title={type.charAt(0).toUpperCase() + type.slice(1)}
                type={type}
            >
                {message}
            </Notification>
        )
    }
    return (
        <>
            <Card header="Process">
                <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-2 ...">
                        <Formik
                            initialValues={{
                                companyCode: 0,
                                period: 202312,
                            }}
                            onSubmit={(values, { setSubmitting }) => {
                                //    if (!disableSubmit) {
                                const selectedCompanyCode = Array.from(
                                    Object.values(values.companyCode)
                                )

                                values.companyCode = selectedCompanyCode[0]

                                onSubmit(values)
                                //  }
                            }}
                        >
                            <Form>
                                <FormContainer layout={layout}>
                                    <div className="grid grid-cols-1 gap-4">
                                        <FieldWrapper
                                            name="companyCode"
                                            render={({
                                                field,
                                                meta,
                                                helpers,
                                            }) => (
                                                <FormItem
                                                    label="Company Code"
                                                    invalid={
                                                        !!meta.error &&
                                                        meta.touched
                                                    }
                                                    errorMessage={meta.error}
                                                >
                                                    <Select
                                                        name="companyCode"
                                                        id="companyCode"
                                                        value={field.value}
                                                        onChange={(value) => {
                                                            helpers.setValue(
                                                                value
                                                            )
                                                        }}
                                                        placeholder="Please Select"
                                                        options={companyOptions}
                                                    ></Select>
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <FormItem label="Period">
                                        <Field
                                            type="text"
                                            name="period"
                                            placeholder="Please enter Period"
                                            component={Input}
                                        />
                                    </FormItem>
                                    <FormItem>
                                        <Button type="submit">Load</Button>
                                    </FormItem>
                                </FormContainer>
                            </Form>
                        </Formik>
                    </div>

                    <div className="...">
                        <span className="mr-1 font-semibold">
                            <Button
                                variant="solid"
                                color="blue-600"
                                onClick={processPayrollData}
                                loading={isSubmitting}
                            >
                                {isSubmitting
                                    ? 'Processing...'
                                    : 'Process Payroll'}
                            </Button>
                        </span>
                    </div>
                </div>
            </Card>
            <div className="mb-4"></div>
            <Card>
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
            </Card>
        </>
    )
}
export default ConfirmedDataView
