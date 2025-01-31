import Button from '@/components/ui/Button'
import { Formik, Field, Form, FieldProps } from 'formik'
import { FormItem, FormContainer } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import { SelectOption, TableQueries } from '@/@types/common'
import Select from '@/components/ui/Select'
import reducer, {
    addRowItem,
    AllPayrollData,
    getBankTransferData,
    removeRowItem,
    setComData,
    setSelectedRows,
    setTableData,
    useAppDispatch,
    useAppSelector,
} from './store'
import { injectReducer } from '@/store'
import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import { Card } from '@/components/ui/Card'
import {
    ChangeEvent,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react'
import { ColumnDef } from '@tanstack/react-table'
import cloneDeep from 'lodash/cloneDeep'
import DataTable, {
    DataTableResetHandle,
    OnSortParam,
    Row,
} from '@/components/shared/DataTable'
import BankTransferTableTools from './components/BankTransferTableTools'
import RemoveConfirmation from './components/RemoveConfirmation'
import paginate from '@/utils/paginate'
import { HiOutlineSearch } from 'react-icons/hi'
import debounce from 'lodash/debounce'

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

    const searchInput = useRef<HTMLInputElement>(null)

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

    const [payrollData, setPayrollData] = useState<AllPayrollData[]>([])
    const [pagingData, setPaggingData] = useState<AllPayrollData[]>([])
    const [filteredData, setFilteredData] = useState<AllPayrollData[]>([])

    const { pageIndex, pageSize, sort, query, total, companyCode, period } =
        useAppSelector((state) => state.BankTransferData.data.tableData)

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
            getBankTransferData({
                pageIndex,
                pageSize,
                sort,
                query,
                companyCode,
                period,
            })
        ).then((res: any) => {
            const listItems = JSON.parse(res.payload.data)

            const startIndex = (1 - 1) * (pageSize || 1)
            const endIndex = startIndex + (pageSize || 1)
            const paginatedData = listItems?.slice(startIndex, endIndex) || []

            setPayrollData(listItems)
            setPaggingData(paginatedData)
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
    //         setFilteredData(listItems)
    //     })
    // }, [dispatch, pageIndex, pageSize, sort, query])

    // useEffect(() => {
    //      dispatch(setSelectedRows([]))
    //     fetchData()
    // }, [dispatch, fetchData, pageIndex, pageSize, sort])

    useEffect(() => {
        if (tableRef) {
            tableRef.current?.resetSelected()
        }
    }, [data])

    const tableData = useMemo(
        () => ({
            pageIndex,
            pageSize,
            sort,
            query,
            total,
            companyCode,
            period,
        }),
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

        const pagedData = paginate(
            payrollData,
            newTableData.pageSize || 10,
            page
        )

        setPaggingData(pagedData)
    }

    const onSelectChange = (value: number) => {
        alert('onSelectChange')
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

    // const onRowSelect = useCallback(
    //     (checked: boolean, row: AllPayrollData) => {
    //         if (checked) {
    //             dispatch(addRowItem([row.id]))

    //         } else {
    //             dispatch(removeRowItem(row.id.toString()))
    //         }
    //     },
    //     [dispatch]
    // )

    const onAllRowSelect = useCallback(
        (checked: boolean, rows: Row<AllPayrollData>[]) => {
            if (checked) {
                const originalRows = rows.map((row) => row.original)
                const selectedIds: string[] = []
                originalRows.forEach((row) => {
                    selectedIds.push(row.id.toString())
                })
                dispatch(setSelectedRows(selectedIds))
            } else {
                dispatch(setSelectedRows([]))
            }
        },
        [dispatch]
    )

    const handleInputChange = (val: string) => {
        const query = val.toLowerCase()
        const filtered = (payrollData || []).filter(
            (item) =>
                item.empName.toString().includes(query) ||
                item.grade.toLowerCase().includes(query) ||
                item.epf.includes(query)
        )

        setPaggingData(filtered)

        const filteredData = paginate(filtered, 10, 1)
        setPaggingData(filteredData)
    }

    const onEdit = (e: ChangeEvent<HTMLInputElement>) => {
        handleInputChange(e.target.value)
    }

    return (
        <>
            <div className="col-span-4 ...">
                <Card header="Bank Transfer" className="mb-3">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                        <div className="lg:col-span-2">
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
                        <div className="lg:col-span-1 flex justify-end">
                            <BankTransferTableTools />
                        </div>
                    </div>

                    <Input
                        ref={searchInput}
                        className="lg:w-52 mb-2"
                        size="sm"
                        placeholder="Search"
                        prefix={<HiOutlineSearch className="text-lg" />}
                        onChange={onEdit}
                    />
                    <RemoveConfirmation />
                </Card>

                <DataTable
                    ref={tableRef}
                    selectable
                    columns={columns}
                    data={pagingData}
                    loading={loading}
                    pagingData={{
                        total: tableData.total as number,
                        pageIndex: tableData.pageIndex as number,
                        pageSize: tableData.pageSize as number,
                    }}
                    onPaginationChange={onPaginationChange}
                    onSelectChange={onSelectChange}
                    // onSort={onSort}
                    onCheckBoxChange={onRowSelect}
                    onIndeterminateCheckBoxChange={onAllRowSelect}
                />
            </div>
        </>
    )
}
export default BankTransfer
