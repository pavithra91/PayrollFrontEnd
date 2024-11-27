import * as Yup from 'yup'
import { Field, Form, Formik, FieldProps } from 'formik'
import { FormItem, FormContainer } from '@/components/ui/Form'
import Select from '@/components/ui/Select'
import { Button, DatePicker, Input, Switcher } from '@/components/ui'
import dayjs from 'dayjs'
import Checkbox from '@/components/ui/Checkbox/Checkbox'
import { useEffect, useState } from 'react'
import Radio from '@/components/ui/Radio'
import useAccount from '@/utils/hooks/useAccount'
import useCommon from '@/utils/hooks/useCommon'
import DoubleSidedImage from '@/components/shared/DoubleSidedImage'
import AdaptableCard from '@/components/shared/AdaptableCard'
import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import useTimeOutMessage from '@/utils/hooks/useTimeOutMessage'
import { LeaveRequest } from '@/@types/Leave'
import useLeave from '@/utils/hooks/useLeave'
import { useNavigate } from 'react-router-dom'

type LeaveTypeOption = {
    value: string
    label: string
}

type ManagerOption = {
    value: string
    label: string
}

type ActingDelegateOption = {
    epf: string
    name: string
}

const leaveApprovalOptions = [
    {
        value: '14215',
        label: 'Samanmalie Gajadeera',
    },
    {
        value: '14443',
        label: 'Sakunthala Ekanayake',
    },
]

const validationSchema = Yup.object().shape({
    leaveType: Yup.string().required('Leave Type Required'),
    reason: Yup.string().required('Reason required'),
    startDate: Yup.date().required('Start Date Required'),
    halfDayType: Yup.string().when(
        'ishalfDay',
        ([ishalfDay], validationSchema) => {
            return ishalfDay
                ? Yup.string().required('Half day Type Required')
                : Yup.string().notRequired()
        }
    ),
})

const RequestLeave = () => {
    //const dispatch = useAppDispatch()

    const [message, setMessage] = useTimeOutMessage()
    const { getUsersbyCostCenter } = useAccount()
    const { getUserFromLocalStorage } = useCommon()
    const { getAvailableLeaveTypeList, requestLeave } = useLeave()
    const navigate = useNavigate()

    const [isHalfDay, setHalfDay] = useState(false)
    const [isPastDaysAllowd, setPastDaysAllowd] = useState(false)
    const [DelegateData, setDelegateData] = useState<ManagerOption[]>([])
    const [LeaveTypeData, setLeaveTypeData] = useState<ManagerOption[]>([])
    const [isleavestartDate, setleavestartDate] = useState<string | null>(null)

    const handleDateChange = (date: Date | null) => {
        setleavestartDate(date ? dayjs(date).format() : null)
    }

    const epf = getUserFromLocalStorage().epf
    const costCenter = getUserFromLocalStorage().costCenter

    const dateGap = 30

    const minDate = dayjs(isleavestartDate)
        .subtract(dateGap, 'day')
        .startOf('day')
        .toDate()

    const maxDate = dayjs(isleavestartDate).toDate()

    useEffect(() => {
        const result = getUsersbyCostCenter(costCenter)
        result.then((res) => {
            const listItems = JSON.parse(res?.data?.data ?? '')

            const formattedData = listItems
                .filter((item: any) => item.epf !== epf)
                .map((item: any) => ({
                    value: item.epf,
                    label: item.empName,
                }))
            setDelegateData(formattedData)
            setPastDaysAllowd(true)
        })

        const leaveTypes = getAvailableLeaveTypeList(epf)
        leaveTypes.then((res) => {
            const listItems = res?.data?.items ?? []
            const formattedData = listItems.map((item: any) => ({
                value: item.leaveTypeId,
                label: item.leaveTypeName,
            }))
            setLeaveTypeData(formattedData)
        })
    }, [])

    const onSubmit = async (
        values: LeaveRequest,
        setSubmitting: (isSubmitting: boolean) => void
    ) => {
        const {
            leaveType,
            reason,
            startDate,
            endDate,
            ishalfDay,
            halfDayType,
            manager,
            actDelegate,
            noOfDays,
        } = values
        setSubmitting(true)

        if (noOfDays < 0) {
            openNotification(
                'danger',
                'Leave start date can not be less than leave end date'
            )
            setSubmitting(false)
            return
        }

        const result = await requestLeave({
            epf: getUserFromLocalStorage().epf,
            leaveType,
            reason,
            startDate,
            endDate,
            ishalfDay,
            halfDayType,
            manager,
            actDelegate,
            noOfDays,
            requestBy: getUserFromLocalStorage().userID,
        })

        if (result?.status === 'failed') {
            setMessage(result.message)
            openNotification(
                'danger',
                'Error Occurred While Saving Data : ' + result.message
            )
        } else {
            setMessage('Successfully Saved')
            openNotification('success', 'Leave request send for approval')
            setTimeout(() => {
                setSubmitting(false)
                navigate('/Dashboard')
            }, 500)
        }

        setSubmitting(false)
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
            <div className="lg:flex items-center justify-between mb-4">
                <h2>Leave Request</h2>
            </div>

            <Formik
                initialValues={{
                    epf: '',
                    leaveType: '',
                    reason: '',
                    ishalfDay: false,
                    halfDayType: '',
                    startDate: '',
                    endDate: '',
                    lieuLeaveDate: '',
                    manager: '',
                    actDelegate: '',
                    noOfDays: 0,
                }}
                validationSchema={validationSchema}
                onSubmit={(values, { setSubmitting }) => {
                    const date1 = dayjs(values.startDate)
                    const date2 = dayjs(values.endDate)
                    values.noOfDays = date2.diff(date1, 'd')

                    if (isHalfDay) {
                        values.endDate = values.startDate
                        values.noOfDays = 0.5
                    }

                    console.log(values)
                    onSubmit(values, setSubmitting)
                }}
            >
                {({ touched, errors, setFieldValue, values }) => (
                    <Form>
                        <FormContainer>
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                                <div className="lg:col-span-2">
                                    <FormItem
                                        label="Leave Type"
                                        asterisk={true}
                                        invalid={
                                            errors.leaveType &&
                                            touched.leaveType
                                        }
                                        errorMessage={errors.leaveType}
                                    >
                                        <Field name="leaveType">
                                            {({ field, form }: FieldProps) => (
                                                <Select<LeaveTypeOption>
                                                    field={field}
                                                    form={form}
                                                    options={LeaveTypeData}
                                                    value={LeaveTypeData.filter(
                                                        (option) =>
                                                            option.value ===
                                                            values.leaveType
                                                    )}
                                                    onChange={(option) => {
                                                        form.setFieldValue(
                                                            field.name,
                                                            option?.value
                                                        )
                                                        form.setFieldValue(
                                                            'startDate',
                                                            ''
                                                        )
                                                    }}
                                                />
                                            )}
                                        </Field>
                                    </FormItem>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="..">
                                            <FormItem>
                                                <Field name="ishalfDay">
                                                    {({
                                                        field,
                                                    }: FieldProps) => (
                                                        <Checkbox
                                                            {...field}
                                                            onChange={() => {
                                                                const value =
                                                                    !field.value
                                                                setFieldValue(
                                                                    'ishalfDay',
                                                                    value
                                                                )
                                                                // Clear additional info when unchecked
                                                                if (!value) {
                                                                    setFieldValue(
                                                                        'additionalInfo',
                                                                        setHalfDay(
                                                                            false
                                                                        )
                                                                    )
                                                                } else {
                                                                    setFieldValue(
                                                                        'additionalInfo',
                                                                        setHalfDay(
                                                                            true
                                                                        )
                                                                    )
                                                                }
                                                            }}
                                                        >
                                                            Half Day
                                                        </Checkbox>
                                                    )}
                                                </Field>
                                            </FormItem>
                                        </div>

                                        <div className="..">
                                            {isHalfDay && (
                                                <FormItem
                                                    invalid={
                                                        errors.halfDayType &&
                                                        touched.halfDayType
                                                    }
                                                    errorMessage={
                                                        errors.halfDayType
                                                    }
                                                >
                                                    <Field name="halfDayType">
                                                        {({
                                                            field,
                                                            form,
                                                        }: FieldProps<LeaveRequest>) => (
                                                            <Radio.Group
                                                                value={
                                                                    values.halfDayType
                                                                }
                                                                onChange={(
                                                                    val: any
                                                                ) =>
                                                                    form.setFieldValue(
                                                                        field.name,
                                                                        val
                                                                    )
                                                                }
                                                            >
                                                                <Radio
                                                                    defaultChecked
                                                                    value={1}
                                                                    color="green-500"
                                                                >
                                                                    Morning
                                                                </Radio>
                                                                <Radio
                                                                    value={2}
                                                                >
                                                                    Evening
                                                                </Radio>
                                                            </Radio.Group>
                                                        )}
                                                    </Field>
                                                </FormItem>
                                            )}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="..">
                                            <FormItem
                                                asterisk={true}
                                                label="Leave Start Date"
                                                invalid={
                                                    errors.startDate &&
                                                    touched.startDate
                                                }
                                                errorMessage={errors.startDate}
                                            >
                                                <Field
                                                    name="startDate"
                                                    placeholder="Date"
                                                >
                                                    {({
                                                        field,
                                                        form,
                                                    }: FieldProps) => (
                                                        <DatePicker
                                                            field={field}
                                                            minDate={
                                                                values.leaveType ==
                                                                '6'
                                                                    ? new Date()
                                                                    : undefined
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

                                                                handleDateChange(
                                                                    date
                                                                )
                                                            }}
                                                        />
                                                    )}
                                                </Field>
                                            </FormItem>
                                        </div>

                                        <div className="..">
                                            {!isHalfDay && (
                                                <FormItem
                                                    label="Leave End Date"
                                                    invalid={
                                                        errors.endDate &&
                                                        touched.endDate
                                                    }
                                                    errorMessage={
                                                        errors.endDate
                                                    }
                                                >
                                                    <Field
                                                        name="endDate"
                                                        placeholder="Date"
                                                    >
                                                        {({
                                                            field,
                                                            form,
                                                        }: FieldProps) => (
                                                            <DatePicker
                                                                minDate={dayjs(
                                                                    isleavestartDate
                                                                ).toDate()}
                                                                field={field}
                                                                form={form}
                                                                value={
                                                                    field.value
                                                                }
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
                                            )}
                                        </div>
                                    </div>

                                    <div
                                        className={
                                            values.leaveType == '6'
                                                ? 'sm:grid sm:grid-cols-2 gap-4'
                                                : 'w-full'
                                        }
                                    >
                                        <div className="..">
                                            {values.leaveType == '6' && (
                                                <FormItem
                                                    label="Lieu Leave Date"
                                                    invalid={
                                                        errors.lieuLeaveDate &&
                                                        touched.lieuLeaveDate
                                                    }
                                                    errorMessage={
                                                        errors.lieuLeaveDate
                                                    }
                                                >
                                                    <Field
                                                        name="lieuLeaveDate"
                                                        placeholder="Lieu Leave Date"
                                                    >
                                                        {({
                                                            field,
                                                            form,
                                                        }: FieldProps) => (
                                                            <DatePicker
                                                                minDate={
                                                                    minDate
                                                                }
                                                                maxDate={
                                                                    maxDate
                                                                }
                                                                field={field}
                                                                form={form}
                                                                value={
                                                                    field.value
                                                                }
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
                                            )}
                                        </div>
                                        <div className="..">
                                            <FormItem
                                                label="Forward for Approval"
                                                asterisk={true}
                                                invalid={
                                                    errors.manager &&
                                                    touched.manager
                                                }
                                                errorMessage={errors.manager}
                                            >
                                                <Field name="manager">
                                                    {({
                                                        field,
                                                        form,
                                                    }: FieldProps) => (
                                                        <Select<ManagerOption>
                                                            field={field}
                                                            form={form}
                                                            options={
                                                                leaveApprovalOptions
                                                            }
                                                            value={leaveApprovalOptions.filter(
                                                                (option) =>
                                                                    option.value ===
                                                                    values.manager
                                                            )}
                                                            onChange={(
                                                                option
                                                            ) =>
                                                                form.setFieldValue(
                                                                    field.name,
                                                                    option?.value
                                                                )
                                                            }
                                                        />
                                                    )}
                                                </Field>
                                            </FormItem>
                                        </div>
                                    </div>
                                    <AdaptableCard
                                        divider
                                        className="mb-4 my-0 py-0"
                                    >
                                        <FormItem
                                            label="Acting Delegate"
                                            asterisk={true}
                                            invalid={
                                                errors.actDelegate &&
                                                touched.actDelegate
                                            }
                                            errorMessage={errors.actDelegate}
                                        >
                                            <Field name="actDelegate">
                                                {({
                                                    field,
                                                    form,
                                                }: FieldProps) => (
                                                    <Select<ManagerOption>
                                                        field={field}
                                                        form={form}
                                                        options={DelegateData}
                                                        value={DelegateData.filter(
                                                            (option) =>
                                                                option.value ===
                                                                values.actDelegate
                                                        )}
                                                        onChange={(option) =>
                                                            form.setFieldValue(
                                                                field.name,
                                                                option?.value
                                                            )
                                                        }
                                                    />
                                                )}
                                            </Field>
                                        </FormItem>

                                        <FormItem
                                            asterisk={true}
                                            label="Reason"
                                            invalid={
                                                errors.reason && touched.reason
                                            }
                                            errorMessage={errors.reason}
                                        >
                                            <Field
                                                textArea
                                                type="text"
                                                autoComplete="off"
                                                name="reason"
                                                placeholder="Enter Reason"
                                                component={Input}
                                            />
                                        </FormItem>
                                    </AdaptableCard>

                                    <Button block variant="solid" type="submit">
                                        Submit for Approval
                                    </Button>
                                </div>
                                <div className="lg:col-span-1">
                                    <DoubleSidedImage
                                        width={350}
                                        src="/img/others/leave.png"
                                        darkModeSrc="/img/others/leave.png"
                                    />
                                </div>
                            </div>
                        </FormContainer>
                    </Form>
                )}
            </Formik>
        </>
    )
}

export default RequestLeave
