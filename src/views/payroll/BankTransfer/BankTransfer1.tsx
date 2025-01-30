import Button from '@/components/ui/Button'
import { Formik, Field, Form, FieldProps } from 'formik'
import { FormItem, FormContainer } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import { SelectOption } from '@/@types/common'
import Select from '@/components/ui/Select'
import reducer, {
    addRowItem,
    AllPayrollData,
    getBankTransferData,
    removeRowItem,
    setComData,
    setTableData,
    useAppDispatch,
    useAppSelector,
} from './store'
import { injectReducer } from '@/store'
import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import { Card } from '@/components/ui/Card'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ColumnDef } from '@tanstack/react-table'
import cloneDeep from 'lodash/cloneDeep'
import DataTable, {
    DataTableResetHandle,
    OnSortParam,
} from '@/components/shared/DataTable'
import BankTransferTableTools from './components/BankTransferTableTools'
import RemoveConfirmation from './components/RemoveConfirmation'

injectReducer('BankTransferData', reducer)

type FormModel = {
    companyCode: number
    period: number
}

const companyOptions: SelectOption[] = [
    { value: 2000, label: '2000' },
    { value: 3000, label: '3000' },
]

const BankTransfer = () => {
    const dispatch = useAppDispatch()

    const tableRef = useRef<DataTableResetHandle>(null)

    const loading = useAppSelector(
        (state) => state.BankTransferData.data.loading
    )

    const data = useAppSelector(
        (state) => state.BankTransferData.data.payrollData
    )

    const approvalData = useAppSelector(
        (state) => state.BankTransferData.data.comData
    )

    const [payrollData, setPayrollData] = useState<[]>([])

    const { pageIndex, pageSize, sort, query, total, companyCode, period } = useAppSelector(
        (state) => state.BankTransferData.data.tableData
    )

    
    const onSubmit = (
        formValue: FormModel,
        setSubmitting: (isSubmitting: boolean) => void
    ) => {
        setSubmitting(true)

        const { companyCode, period } = formValue

        const values = {
            companyCode: companyCode,
            period: period,
        }

        dispatch(setComData(values))

        console.log('{ pageIndex, pageSize, sort, query }', {
            pageIndex,
            pageSize,
            sort,
            query,
        })
        
        dispatch(
            getBankTransferData({ pageIndex, pageSize, sort, query, companyCode, period })
        ).then((res: any) => {
            const listItems = JSON.parse(res.payload.data)

            const startIndex = (1 - 1) * (pageSize || 1)
            const endIndex = startIndex + (pageSize || 1)
            const paginatedData = listItems?.slice(startIndex, endIndex) || []

            setPayrollData(paginatedData)
        })
    }

    // const fetchData = useCallback(() => {
    //     console.log('{ pageIndex, pageSize, sort, query }', {
    //         pageIndex,
    //         pageSize,
    //         sort,
    //         query,
    //     })
    //     dispatch(
    //         getBankTransferData({ pageIndex, pageSize, sort, query })
    //     ).then((res: any) => {
    //         const listItems = JSON.parse(res.payload.data)

    //         setPayrollData(listItems)
    //     })
    // }, [dispatch, pageIndex, pageSize, sort, query])

    // useEffect(() => {
    //     // dispatch(setSelectedRows([]))
    //     fetchData()
    // }, [dispatch, fetchData, pageIndex, pageSize, sort])

    useEffect(() => {
        if (tableRef) {
            tableRef.current?.resetSelected()
        }
    }, [data])

    const tableData = useMemo(
        () => ({ pageIndex, pageSize, sort, query, total, companyCode, period }),
        [pageIndex, pageSize, sort, query, total, companyCode, period]
    )

    const columns: ColumnDef<AllPayrollData>[] = useMemo(
        () => [
            {
                header: 'id',
                accessorKey: 'id',
            },
            {
                header: 'epf',
                accessorKey: 'epf',
            },
            {
                header: 'empName',
                accessorKey: 'empName',
            },
            {
                header: 'grade',
                accessorKey: 'grade',
            },
            {
                header: 'taxable Gross',
                accessorKey: 'taxableGross',
            },
            {
                header: 'emp contribution',
                accessorKey: 'emp_contribution',
            },
            {
                header: 'etf',
                accessorKey: 'etf',
            },

            // {
            //     header: '',
            //     id: 'action',
            //     cell: (props) => <ActionColumn row={props.row.original} />,
            // },
        ],
        []
    )

    const onPaginationChange = (page: number) => {
        const newTableData = cloneDeep(tableData)
        newTableData.pageIndex = page
        newTableData.companyCode = approvalData.companyCode
        newTableData.period = approvalData.period
        dispatch(setTableData(newTableData))

        dispatch(
            getBankTransferData(newTableData)
        ).then((res: any) => {
            const listItems = JSON.parse(res.payload.data)

            const currentPageSize = newTableData.pageSize || 10  // Default page size if undefined
            const startIndex = (page - 1) * currentPageSize
            const endIndex = startIndex + currentPageSize
            const paginatedData = listItems?.slice(startIndex, endIndex) || []

            setPayrollData(paginatedData)
        })
    }

    const onSelectChange = (value: number) => {
        const newTableData = cloneDeep(tableData)
        newTableData.pageSize = Number(value)
        newTableData.pageIndex = 1
        dispatch(setTableData(newTableData))
    }

    const onSort = (sort: OnSortParam) => {
        const newTableData = cloneDeep(tableData)
        newTableData.sort = sort
        dispatch(setTableData(newTableData))
    }

    const onRowSelect = (checked: boolean, row: AllPayrollData) => {
        if (checked) {
            dispatch(addRowItem([row.id]))
        } else {
            dispatch(removeRowItem(row.id.toString()))
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
            <div className="col-span-4 ...">
                <Card header="Bank Transfer" className="mb-3">
                    <div className="grid grid-cols-1 lg:grid-cols-6 gap-4">
                        <div className="lg:col-span-5">
                            <Formik
                                initialValues={{
                                    companyCode: 0,
                                    period: 202501,
                                }}
                                enableReinitialize={true}
                                //validationSchema={validationSchema}
                                onSubmit={(values, { setSubmitting }) => {
                                    onSubmit(values, setSubmitting)
                                    // console.log(values)
                                    setSubmitting(true)
                                }}
                            >
                                {({
                                    touched,
                                    errors,
                                    values,
                                    setFieldValue,
                                    isSubmitting,
                                }) => (
                                    <Form>
                                        <FormContainer layout="inline">
                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                                <div className="..">
                                                    <FormItem
                                                        label="Company Code"
                                                        invalid={
                                                            errors.companyCode &&
                                                            touched.companyCode
                                                        }
                                                        errorMessage={
                                                            errors.companyCode
                                                        }
                                                    >
                                                        <Field name="companyCode">
                                                            {({
                                                                field,
                                                                form,
                                                            }: FieldProps) => (
                                                                <Select<SelectOption>
                                                                    size="sm"
                                                                    field={
                                                                        field
                                                                    }
                                                                    form={form}
                                                                    options={
                                                                        companyOptions
                                                                    }
                                                                    value={companyOptions.filter(
                                                                        (
                                                                            option
                                                                        ) =>
                                                                            option.value ===
                                                                            values.companyCode
                                                                    )}
                                                                    onChange={(
                                                                        option
                                                                    ) => {
                                                                        form.setFieldValue(
                                                                            field.name,
                                                                            option?.value
                                                                        )
                                                                    }}
                                                                />
                                                            )}
                                                        </Field>
                                                    </FormItem>
                                                </div>
                                                <div className="..">
                                                    <FormItem label="Period">
                                                        <Field
                                                            size="sm"
                                                            type="text"
                                                            name="period"
                                                            placeholder="Please enter Period"
                                                            component={Input}
                                                        />
                                                    </FormItem>
                                                </div>
                                                <div className="..">
                                                    <Button
                                                        size="sm"
                                                        variant="twoTone"
                                                        type="submit"
                                                        // icon={<HiOutlinePlusCircle />}
                                                        // onClick={() => navigate('/AddReservation')}
                                                    >
                                                        Load Data
                                                    </Button>
                                                </div>
                                            </div>
                                        </FormContainer>
                                    </Form>
                                )}
                            </Formik>
                        </div>
                        <div className="lg:col-span-1"></div>
                    </div>
                    <BankTransferTableTools />
                    <RemoveConfirmation />

                    <DataTable
                        ref={tableRef}
                        selectable
                        columns={columns}
                        data={payrollData}
                        loading={loading}
                        pagingData={{
                            total: tableData.total as number,
                            pageIndex: tableData.pageIndex as number,
                            pageSize: tableData.pageSize as number,
                        }}
                        onPaginationChange={onPaginationChange}
                        onSelectChange={onSelectChange}
                        onSort={onSort}
                        onCheckBoxChange={onRowSelect}
                        //onIndeterminateCheckBoxChange={onAllRowSelect}
                    />
                </Card>
            </div>
        </>
    )
}
export default BankTransfer
