import { Field, Form, Formik, FieldProps } from 'formik'
import { createReservation, getReservationData, getRestrictedDate, getRestrictedDatesById, useAppDispatch } from '../store'
import { FormItem, FormContainer } from '@/components/ui/Form'
import Button from '@/components/ui/Button'
import useCommon from '@/utils/hooks/useCommon'
import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import { Input } from '@/components/ui/Input'
import { DatePicker } from '@/components/ui/DatePicker'
import { useNavigate } from 'react-router-dom'
import { Select } from '@/components/ui/Select'
import Checkbox from '@/components/ui/Checkbox'
import {
    getBungalowData,
    getCategoryData,
    useAppSelector,
} from '../../Bungalows/store'
import { useEffect, useState } from 'react'
import { DoubleSidedImage } from '@/components/shared'
import Dialog from '@/components/ui/Dialog'
import dayjs from 'dayjs'
import * as Yup from 'yup'
import { Card } from '@/components/ui/Card'
import { Table } from '@/components/ui/Table'
import {
    useReactTable,
    getCoreRowModel,
    flexRender,
    createColumnHelper,
} from '@tanstack/react-table'

const { Tr, Td, TBody, THead, Th } = Table

type BungalowRate = {
    categoryName: string
    amount: number
}

const companyOptions: SelectOption[] = [
    { value: 2000, label: '2000' },
    { value: 3000, label: '3000' },
]

type Rate = {
    rates: BungalowRate[]
}

interface SelectOption {
    label: string
    value: number
    occupancy?: number
    bungalowRates?: Rate
}

type FormModel = {
    companyCode: number
    bungalowid: number
    category: number
    checkInDate: string | Date
    checkOutDate: string | Date
    noOfAdults: number
    noOfChildren: number
    contactNumber_1: string
    contactNumber_2?: string
    isAgree: boolean
    totalPax: number
    maxOccupany: number
    nicNo?: string
    comment?: string
}

const validationSchema = Yup.object().shape({
    category: Yup.string()
        .test(
            'not-zero',
            'Please select a Reservation Type',
            (value) => value !== '0'
        )
        .required('Please select a Reservation Type'),
    bungalowid: Yup.string()
        .test('not-zero', 'Please select a Bungalow', (value) => value !== '0')
        .required('Please select a Bungalow'),
    noOfAdults: Yup.number()
        .min(1, 'Number of pax is required')
        .typeError('Number of pax must be a number')
        .required('Number of pax is required'),
    checkInDate: Yup.date()
        .required('Check-in date is required')
        .min(new Date(), 'Check-in date cannot be in the past')
        .test(
            'is-valid-check-in',
            'Invalid check-in date',
            function (value: any) {
                return value && !isNaN(Date.parse(value))
            }
        ),
    checkOutDate: Yup.date()
        .required('Check-out date is required')
        .min(new Date(), 'Check-out date cannot be in the past')
        .test(
            'is-valid-check-out',
            'Invalid check-out date',
            function (value: any) {
                return value && !isNaN(Date.parse(value))
            }
        ),
    contactNumber_1: Yup.string().required('Contact number is required'),
    nicNo: Yup.string().when('category', {
        is: '4',
        then: (schema) => schema.required('NIC is required'),
        otherwise: (schema) => schema.notRequired(),
    }),
})

const AddReservation = () => {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    const [BungalowData, setBungalowData] = useState<SelectOption[]>([])
    const [categoryData, setCategoryData] = useState<SelectOption[]>([])
    const [data, setRateData] = useState<BungalowRate[]>([])
    const [termsDialog, settermsDialog] = useState(false)
    const [restrictedDates, setRestrictedDates] = useState<any>([])
    const [checkInDate, setCheckInDate] = useState<Date | null>(null)

    const [imageSrc, setImageSrc] = useState('')

    const handleSelectChange = (value: string) => {
        const newSrc = '/img/bungalow/' + value + '.jpg'
        setImageSrc(newSrc)

        const arr: BungalowRate[] = []
        BungalowData.map((items: any) => {
            if (items.value == value) {
                items.bungalowRates.rates.map((items: any) => {
                    arr.push(items)
                })
            }
        })

        dispatch(getRestrictedDatesById(parseInt(value, 10))).then((res) => {
            console.log(res.payload)
            setRestrictedDates(res.payload)
        })

        setRateData(arr)
    }

    useEffect(() => {
        fetchData()
        dispatch(getRestrictedDate()).then((res) => {
            setRestrictedDates(res.payload)
        })
    }, [dispatch])

    const fetchData = () => {
        var bungalowData = dispatch(getBungalowData())
        var categories = dispatch(getCategoryData())

        bungalowData.then((res) => {
            const listItems = (res?.payload as { items: any[] })?.items ?? []
            
            const formattedData = listItems.filter(x=>x.isCloded == false).map((item: any) => ({
                value: item.id,
                label: item.bungalowName,
                occupancy: item.maxOccupancy,
                bungalowRates: item.bungalowRates,
            }))

            setBungalowData(formattedData)
        })

        categories.then((res) => {
            const listItems = (res?.payload as { items: any[] })?.items ?? []
            var formattedData = listItems.map((item: any) => ({
                value: item.id,
                label: item.categoryName,
            }))

            getUserFromLocalStorage().authority.map((items: any) => {
                if (items === 'User') {
                    formattedData = formattedData.filter(
                        (item: any) => item.value !== 5
                    )

                    console.log(formattedData)
                }
            })

            setCategoryData(formattedData)
        })
    }

    const { getUserFromLocalStorage } = useCommon()

    const onOpenTerms = () => {
        settermsDialog(true)
    }

    const onTermsDialogClose = () => {
        settermsDialog(false)
    }

    const onSubmit = (
        formValue: FormModel,
        setSubmitting: (isSubmitting: boolean) => void
    ) => {
        setSubmitting(true)

        const {
            companyCode,
            bungalowid,
            category,
            checkInDate,
            checkOutDate,
            noOfAdults,
            noOfChildren,
            contactNumber_1,
            contactNumber_2,
            totalPax,
            maxOccupany,
            isAgree,
            nicNo,
            comment,
        } = formValue

        if (totalPax > maxOccupany) {
            openNotification(
                'warning',
                'Total number of people cannot exceed the maximum occupancy limit.'
            )
            return
        }

        if (dayjs(checkInDate) > dayjs(checkOutDate)) {
            openNotification(
                'warning',
                'Check-out date must be after check-in date.'
            )
            return
        }

        const date1 = dayjs(checkOutDate)
        const date2 = dayjs(checkInDate)

        if (date1.diff(date2, 'days') > 2) {
            openNotification('danger', 'You can not Select more than 3 days.')
            return
        }

        if (!isAgree) {
            openNotification(
                'danger',
                'You must agree to the terms and conditions!'
            )
            return
        }

        const values = {
            epf: getUserFromLocalStorage().epf,
            companyCode: companyCode,
            bungalowid: bungalowid,
            category: category,
            checkInDate: checkInDate,
            checkOutDate: checkOutDate,
            noOfAdults: noOfAdults,
            noOfChildren: noOfChildren,
            totalPax: noOfAdults + noOfChildren,
            contactNumber_1: contactNumber_1,
            contactNumber_2: contactNumber_2,
            nicNo: nicNo,
            comment: comment,
            createdBy: getUserFromLocalStorage().userID,
        }

        dispatch(createReservation(values)).then((res) => {

            if (res.payload != null) {

                if(res.payload.status != "Error")
                {
                    openNotification('success', 'Your Reservation has been added')
                    dispatch(getReservationData(getUserFromLocalStorage().epf))
                    setTimeout(() => {
                        setSubmitting(false)
                        navigate('/Reservation')
                    }, 500)
                }
                else
                {
                    openNotification('danger', res.payload.msg)
                }
            } else {
                openNotification('danger', 'The dates are already booked.')
            }
        })
    }

    const disableCertainDate = (date: Date) => {
        const disabledDates = restrictedDates

        return disabledDates.some(
            (disabledDate: { day: number; month: number }) =>
                date.getDate() === disabledDate.day &&
                date.getMonth() === disabledDate.month
        )
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

    const BungalowRateColumn = ({ row }: { row: BungalowRate }) => {
        return (
            <div className="flex items-center gap-2">
                <span className="font-semibold">{row.categoryName}</span>
            </div>
        )
    }

    const columnHelper = createColumnHelper<BungalowRate>()

    const columns = [
        columnHelper.accessor('categoryName', {
            header: 'Reservation Type',
            cell: (props) => {
                const row = props.row.original
                return <BungalowRateColumn row={row} />
            },
        }),
        columnHelper.accessor('amount', {
            header: 'Rate',
        }),
    ]

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    })

    return (
        <>
            <div className="lg:flex items-center justify-between mb-4">
                <h2>Create Reservation</h2>
            </div>

            <Formik
                initialValues={{
                    companyCode: 0,
                    epf: '',
                    bungalowid: 0,
                    category: 0,
                    checkInDate: '',
                    checkOutDate: '',
                    noOfAdults: 0,
                    noOfChildren: 0,
                    totalPax: 0,
                    contactNumber_1: '',
                    contactNumber_2: '',
                    isAgree: false,
                    maxOccupany: 0,
                    nicNo: '',
                    comment: '',
                }}
                enableReinitialize={true}
                validationSchema={validationSchema}
                onSubmit={(values, { setSubmitting }) => {
                    onSubmit(values, setSubmitting)
                    //console.log(values)
                    setSubmitting(true)
                }}
            >
                {({ values, touched, errors, setFieldValue, isSubmitting }) => {
                useEffect(() => {
                    if (values.category === 1 && companyOptions.length > 0) {
                        setFieldValue('companyCode', companyOptions[1].value)
                    }
                    else if(values.category === 2 && companyOptions.length > 1)
                    {
                        setFieldValue('companyCode', companyOptions[0].value)
                    }
                    else if (values.category === 3 || values.category === 4) {
                        setFieldValue('companyCode', 0)
                    }
                }, [values.category, setFieldValue])

                const isCompanyDisabled = values.category === 1 || values.category === 2 || values.category === 4;
                const filteredCompanyOptions = isCompanyDisabled ? [] : companyOptions;

                return (      <Form>
                    <FormContainer>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                            <div className="lg:col-span-2">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="..">
                                        <FormItem
                                            label="Reservation Type"
                                            asterisk={true}
                                            invalid={
                                                errors.category &&
                                                touched.category
                                            }
                                            errorMessage={errors.category}
                                        >
                                            <Field name="category">
                                                {({
                                                    field,
                                                    form,
                                                }: FieldProps) => (
                                                    <Select<SelectOption>
                                                        field={field}
                                                        form={form}
                                                        options={
                                                            categoryData
                                                        }
                                                        value={categoryData.filter(
                                                            (option) =>
                                                                option.value ===
                                                                values.category
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
                                        {values.category == 4 && (
                                            <FormItem
                                                label="NIC Number:"
                                                invalid={
                                                    touched.nicNo &&
                                                    !!errors.nicNo
                                                }
                                                errorMessage={errors.nicNo}
                                            >
                                                <Field
                                                    as={Input}
                                                    name="nicNo"
                                                    placeholder="Enter NIC Number"
                                                />
                                            </FormItem>
                                        )}
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="..">
                                        <FormItem
                                            label="Company Code"
                                            asterisk={true}
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
                                                    isDisabled={isCompanyDisabled}
                                                        field={field}
                                                        form={form}
                                                        options={
                                                            companyOptions
                                                        }
                                                        value={companyOptions.filter(
                                                            (option) =>
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
                                        <FormItem
                                            label="Bangalow"
                                            asterisk={true}
                                            invalid={
                                                errors.bungalowid &&
                                                touched.bungalowid
                                            }
                                            errorMessage={errors.bungalowid}
                                        >
                                            <Field name="bungalowid">
                                                {({
                                                    field,
                                                    form,
                                                }: FieldProps) => (
                                                    <Select<SelectOption>
                                                        field={field}
                                                        form={form}
                                                        options={
                                                            BungalowData
                                                        }
                                                        value={BungalowData.filter(
                                                            (option) =>
                                                                option.value ===
                                                                values.bungalowid
                                                        )}
                                                        onChange={(
                                                            option
                                                        ) => {
                                                            form.setFieldValue(
                                                                field.name,
                                                                option?.value
                                                            )
                                                            setFieldValue(
                                                                'maxOccupany',
                                                                option?.occupancy ||
                                                                    0
                                                            )
                                                            handleSelectChange(
                                                                option?.value.toString() ||
                                                                    ''
                                                            )
                                                        }}
                                                    />
                                                )}
                                            </Field>
                                        </FormItem>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="..">
                                        <FormItem
                                            asterisk={true}
                                            label="Check In Date"
                                            invalid={
                                                errors.checkInDate &&
                                                touched.checkInDate
                                            }
                                            errorMessage={
                                                errors.checkInDate
                                            }
                                        >
                                            <Field
                                                name="checkInDate"
                                                placeholder="Check In Date"
                                            >
                                                {({
                                                    field,
                                                    form,
                                                }: FieldProps) => (
                                                    <DatePicker
                                                        field={field}
                                                        minDate={new Date()}
                                                        disableDate={
                                                            disableCertainDate
                                                        }
                                                        form={form}
                                                        value={field.value}
                                                        onChange={(
                                                            date
                                                        ) => {
                                                            form.setFieldValue(
                                                                field.name,
                                                                date
                                                            )
                                                            setCheckInDate(
                                                                date
                                                            )
                                                        }}
                                                    />
                                                )}
                                            </Field>
                                        </FormItem>
                                    </div>
                                    <div className="..">
                                        <FormItem
                                            asterisk={true}
                                            label="Check Out Date"
                                            invalid={
                                                errors.checkOutDate &&
                                                touched.checkOutDate
                                            }
                                            errorMessage={
                                                errors.checkOutDate
                                            }
                                        >
                                            <Field
                                                name="checkOutDate"
                                                placeholder="Check Out Date"
                                            >
                                                {({
                                                    field,
                                                    form,
                                                }: FieldProps) => (
                                                    <DatePicker
                                                        field={field}
                                                        form={form}
                                                        minDate={
                                                            checkInDate ||
                                                            new Date()
                                                        }
                                                        maxDate={dayjs(
                                                            checkInDate
                                                        )
                                                            .add(2, 'day')
                                                            .toDate()}
                                                        disableDate={
                                                            disableCertainDate
                                                        }
                                                        value={field.value}
                                                        onChange={(
                                                            date
                                                        ) => {
                                                            form.setFieldValue(
                                                                field.name,
                                                                date
                                                            )
                                                        }}
                                                    />
                                                )}
                                            </Field>
                                        </FormItem>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="..">
                                        <FormItem
                                            asterisk={true}
                                            label="No Of Adults:"
                                            invalid={
                                                touched.noOfAdults &&
                                                !!errors.noOfAdults
                                            }
                                            errorMessage={errors.noOfAdults}
                                        >
                                            <Field
                                                as={Input}
                                                name="noOfAdults"
                                                placeholder="Enter No Of Adults"
                                                onChange={(
                                                    e: React.ChangeEvent<HTMLInputElement>
                                                ) => {
                                                    const value =
                                                        Number(
                                                            e.target.value
                                                        ) || 0
                                                    setFieldValue(
                                                        'noOfAdults',
                                                        value
                                                    )

                                                    // Update totalNoOfPeople dynamically
                                                    setFieldValue(
                                                        'totalPax',
                                                        value +
                                                            values.noOfChildren
                                                    )
                                                }}
                                            />
                                        </FormItem>
                                    </div>
                                    <div className="..">
                                        <FormItem
                                            label="No Of Children:"
                                            invalid={
                                                touched.noOfChildren &&
                                                !!errors.noOfChildren
                                            }
                                            errorMessage={
                                                errors.noOfChildren
                                            }
                                        >
                                            <Field
                                                as={Input}
                                                name="noOfChildren"
                                                placeholder="No Of Children"
                                                onChange={(
                                                    e: React.ChangeEvent<HTMLInputElement>
                                                ) => {
                                                    const value =
                                                        Number(
                                                            e.target.value
                                                        ) || 0
                                                    setFieldValue(
                                                        'noOfChildren',
                                                        value
                                                    )

                                                    // Update totalPax dynamically
                                                    setFieldValue(
                                                        'totalPax',
                                                        value +
                                                            values.noOfAdults
                                                    )
                                                }}
                                            />
                                        </FormItem>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="..">
                                        <FormItem
                                            asterisk={true}
                                            label="Contact Number 1:"
                                            invalid={
                                                touched.contactNumber_1 &&
                                                !!errors.contactNumber_1
                                            }
                                            errorMessage={
                                                errors.contactNumber_1
                                            }
                                        >
                                            <Field
                                                as={Input}
                                                name="contactNumber_1"
                                                placeholder="Enter Contact Number"
                                            />
                                        </FormItem>
                                    </div>
                                    <div className="..">
                                        <FormItem
                                            label="Contact Number 2:"
                                            invalid={
                                                touched.contactNumber_2 &&
                                                !!errors.contactNumber_2
                                            }
                                            errorMessage={
                                                errors.contactNumber_2
                                            }
                                        >
                                            <Field
                                                as={Input}
                                                name="Contact Number 2"
                                                placeholder="Enter Contact Number 2"
                                            />
                                        </FormItem>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-1 gap-4">
                                    <FormItem
                                        label="Special Requests"
                                        invalid={
                                            errors.comment &&
                                            touched.comment
                                        }
                                        errorMessage={errors.comment}
                                    >
                                        <Field
                                            textArea
                                            type="text"
                                            autoComplete="off"
                                            name="comment"
                                            placeholder="Special Requests"
                                            component={Input}
                                        />
                                    </FormItem>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="..">
                                        <div className="grid grid-flow-col auto-cols-max gap-4">
                                            <div className="..">
                                                <FormItem
                                                    invalid={
                                                        touched.isAgree &&
                                                        !!errors.isAgree
                                                    }
                                                    errorMessage={
                                                        errors.isAgree
                                                    }
                                                >
                                                    <Field
                                                        type="checkbox"
                                                        name="isAgree"
                                                        as={Checkbox}
                                                        checked={
                                                            values.isAgree
                                                        }
                                                        onChange={() =>
                                                            setFieldValue(
                                                                'isAgree',
                                                                !values.isAgree
                                                            )
                                                        }
                                                    ></Field>
                                                </FormItem>
                                            </div>
                                            <div
                                                className=".."
                                                onClick={onOpenTerms}
                                            >
                                                Agree to
                                                <strong className="text-blue-500">
                                                    {' '}
                                                    Terms & Condition{' '}
                                                </strong>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="lg:col-span-1">
                                {data && data.length > 0 && (
                                    <>
                                        <Card>
                                            <DoubleSidedImage
                                                width={350}
                                                src={imageSrc}
                                                darkModeSrc="/img/others/leave.png"
                                            />
                                        </Card>
                                        <Card className="mt-4">
                                            <div className="flex items-center justify-between mb-4">
                                                <h4>Bungalow Rates</h4>
                                            </div>
                                            <Table>
                                                <THead>
                                                    {table
                                                        .getHeaderGroups()
                                                        .map(
                                                            (
                                                                headerGroup
                                                            ) => (
                                                                <Tr
                                                                    key={
                                                                        headerGroup.id
                                                                    }
                                                                >
                                                                    {headerGroup.headers.map(
                                                                        (
                                                                            header
                                                                        ) => {
                                                                            return (
                                                                                <Th
                                                                                    key={
                                                                                        header.id
                                                                                    }
                                                                                    colSpan={
                                                                                        header.colSpan
                                                                                    }
                                                                                >
                                                                                    {flexRender(
                                                                                        header
                                                                                            .column
                                                                                            .columnDef
                                                                                            .header,
                                                                                        header.getContext()
                                                                                    )}
                                                                                </Th>
                                                                            )
                                                                        }
                                                                    )}
                                                                </Tr>
                                                            )
                                                        )}
                                                </THead>
                                                <TBody>
                                                    {table
                                                        .getRowModel()
                                                        .rows.map((row) => {
                                                            return (
                                                                <Tr
                                                                    key={
                                                                        row.id
                                                                    }
                                                                >
                                                                    {row
                                                                        .getVisibleCells()
                                                                        .map(
                                                                            (
                                                                                cell
                                                                            ) => {
                                                                                return (
                                                                                    <Td
                                                                                        key={
                                                                                            cell.id
                                                                                        }
                                                                                    >
                                                                                        {flexRender(
                                                                                            cell
                                                                                                .column
                                                                                                .columnDef
                                                                                                .cell,
                                                                                            cell.getContext()
                                                                                        )}
                                                                                    </Td>
                                                                                )
                                                                            }
                                                                        )}
                                                                </Tr>
                                                            )
                                                        })}
                                                </TBody>
                                            </Table>
                                        </Card>
                                    </>
                                )}
                            </div>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                            <div className="col-span-6 ..."></div>
                            <div className="..">
                                <Button
                                    size="sm"
                                    variant="twoTone"
                                    type="submit"
                                    // icon={<HiOutlinePlusCircle />}
                                    // onClick={onDialogOpen}
                                >
                                    Create Reservation
                                </Button>
                            </div>
                        </div>
                    </FormContainer>
                </Form>         );
            }}
                {/* {({ values, touched, errors, setFieldValue, isSubmitting }) => (
                    
                )} */}
            </Formik>

            <Dialog
                isOpen={termsDialog}
                onClose={onTermsDialogClose}
                onRequestClose={onTermsDialogClose}
            >
                <h4>Terms & Conditions</h4>
                <div className="mt-4">
                    <embed
                        src="/Terms.pdf"
                        width="100%"
                        height="500px"
                        type="application/pdf"
                    />
                </div>
            </Dialog>
        </>
    )
}

export default AddReservation
