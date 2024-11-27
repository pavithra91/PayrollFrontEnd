import Button from '@/components/ui/Button'
import dayjs from 'dayjs'
import {
    ElementType,
    PropsWithChildren,
    ReactNode,
    useEffect,
    useState,
} from 'react'
import { FcApproval } from 'react-icons/fc'
import {
    HiOutlineChatAlt,
    HiOutlineClipboardList,
    HiOutlineTrash,
    HiOutlineUserCircle,
    HiPlusCircle,
    HiTag,
    HiX,
} from 'react-icons/hi'
import * as Yup from 'yup'
import { FormContainer, FormItem } from '@/components/ui/Form'
import { Field, Form, Formik, FormikProps } from 'formik'
import useCommon from '@/utils/hooks/useCommon'
import Input from '@/components/ui/Input'
import { Timeline } from '@/components/ui/Timeline'
import Avatar, { AvatarProps } from '@/components/ui/Avatar'
import { Tag } from '@/components/ui/Tag'
import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import useTimeOutMessage from '@/utils/hooks/useTimeOutMessage'
import { ApprovalModel } from '@/@types/Leave'
import useLeave from '@/utils/hooks/useLeave'
import ConfirmDialog from '@/components/shared/ConfirmDialog'

type TicketSectionProps = PropsWithChildren<{
    title?: string
    icon?: ReactNode
    titleSize?: ElementType
    ticketClose?: () => void
}>

const leaveStatusColor: Record<
    string,
    {
        label: string
        dotClass: string
        textClass: string
    }
> = {
    Approved: {
        label: 'Approved',
        dotClass: 'bg-emerald-500',
        textClass: 'text-emerald-500',
    },
    Pending: {
        label: 'Pending',
        dotClass: 'bg-amber-500',
        textClass: 'text-amber-500',
    },
    Rejected: {
        label: 'Rejected',
        dotClass: 'bg-red-500',
        textClass: 'text-red-500',
    },
    Cancelled: {
        label: 'Cancelled',
        dotClass: 'bg-blue-500',
        textClass: 'text-blue-500',
    },
}

type TimelineAvatarProps = AvatarProps

const TimelineAvatar = ({ children, ...rest }: TimelineAvatarProps) => {
    return (
        <Avatar {...rest} size={25} shape="circle">
            {children}
        </Avatar>
    )
}

const validationSchema = Yup.object().shape({
    comment: Yup.string().when([], (isActingDelegate, validationSchema) => {
        return isActingDelegate
            ? Yup.string().notRequired()
            : Yup.string().required('Half day Type Required')
    }),
})

type LeaveRequestResponse = {
    leaveRequest: LeaveRequest
    approvals: Approvals[]
}

type LeaveRequest = {
    epf: string
    leaveTypeName: string
    startDate: string
    endDate: string
    lieuLeaveDate: string
    reason: string
    isHalfDay: boolean
    halfDayType?: string
    actingDelegate: string
    actingDelegateApprovalStatus: string
    currentLevel: number
    requestStatus: string
}

type Approvals = {
    levelName: string
    approver: string
    status: string
}

const TicketSection = ({
    title,
    icon,
    children,
    titleSize: Title = 'h6',
    ticketClose,
}: TicketSectionProps) => {
    return (
        <div className="flex">
            <div className="text-2xl">{icon}</div>
            <div className="ml-2 rtl:mr-2 w-full">
                <div className="flex justify-between">
                    <Title>{title}</Title>
                    {ticketClose && (
                        <Button
                            size="sm"
                            shape="circle"
                            variant="plain"
                            icon={<HiX className="text-lg" />}
                            onClick={() => ticketClose()}
                        />
                    )}
                </div>
                {children}
            </div>
        </div>
    )
}

const LeaveApproveForm = (leaveData: any) => {
    const { getUserFromLocalStorage } = useCommon()
    const { approveOrRejectLeave } = useLeave()

    const [isActingDelegate, setActingDelegate] = useState(false)
    const [isActingDelegateApproved, setActingDelegateApproved] =
        useState(false)
    const [isAlreadyClosed, setAlreadyClosed] = useState(false)
    const [message, setMessage] = useTimeOutMessage()
    const [pendingFormData, setPendingFormData] =
        useState<ApprovalModel | null>(null)

    useEffect(() => {
        const userEPF = getUserFromLocalStorage().epf
        const leaveRequest = leaveData.leaveData.leaveRequest

        leaveData.leaveData.leaveRequest.requestStatus != 'Pending'
            ? setAlreadyClosed(true)
            : setAlreadyClosed(false)

        if (userEPF === leaveRequest.actingDelegate) {
            setActingDelegate(true)

            leaveData.leaveData.leaveRequest.actingDelegateApprovalStatus !=
            'Pending'
                ? setAlreadyClosed(true)
                : setAlreadyClosed(false)
        } else {
            setActingDelegate(false)
        }

        // if (
        //     getUserFromLocalStorage().epf ==
        //     leaveData.leaveData.leaveRequest.actingDelegate
        // ) {
        //     setActingDelegate(true)

        //     leaveData.leaveData.leaveRequest.actingDelegateApprovalStatus !=
        //     'Pending'
        //         ? setAlreadyClosed(true)
        //         : setAlreadyClosed(false)
        // } else {
        //     setActingDelegate(false)
        // }

        // leaveData.leaveData.leaveRequest.requestStatus == 'Approved'
        //     ? setAlreadyClosed(true)
        //     : setAlreadyClosed(false)
    }, [isActingDelegate])

    const onDialogClose = () => {
        //  dispatch(toggleDeleteConfirmation(false))

        setActingDelegateApproved(false)
        setPendingFormData(null)
    }

    const onSubmit = async (
        formValue: ApprovalModel,
        setSubmitting: (isSubmitting: boolean) => void
    ) => {
        setSubmitting(true)
        // setActingDelegateApproved(true)

        const { requestId, status, approver, comment } = formValue
        const leaveRequest = leaveData.leaveData.leaveRequest

        if (!isActingDelegate && !isAlreadyClosed) {
            const leaveRequest = leaveData.leaveData.leaveRequest

            if (leaveRequest.actingDelegateApprovalStatus === 'Pending') {
                // Show confirmation dialog if acting delegate approval is pending
                setActingDelegateApproved(true)
                setPendingFormData(formValue)
                setSubmitting(false) // Stop submitting until user confirms
                return
            }
        } else {
            const result = await approveOrRejectLeave({
                requestId,
                isDelegate: isActingDelegate,
                status,
                comment,
                approver,
            })

            if (result?.status === 'failed') {
                setMessage(result.message)
                openNotification('danger', result.message)
            } else {
                setMessage('Successfully Saved')
                openNotification('success', 'Leave Request Approved/Rejected')
            }

            setAlreadyClosed(true)
            setSubmitting(false)

            return
        }
        setPendingFormData(formValue)
        onConfirmation()
        setSubmitting(false)
    }

    const onConfirmation = async () => {
        console.log(pendingFormData)
        if (pendingFormData) {
            const { requestId, status, approver, comment } = pendingFormData

            try {
                console.log('started')
                const result = await approveOrRejectLeave({
                    requestId,
                    isDelegate: isActingDelegate,
                    status,
                    comment,
                    approver,
                })

                if (result?.status === 'failed') {
                    setMessage(result.message)
                    openNotification('danger', result.message)
                } else {
                    setMessage('Successfully Saved')
                    openNotification(
                        'success',
                        'Leave Request Approved/Rejected'
                    )
                }
            } catch (error) {
                openNotification(
                    'danger',
                    'An error occurred during submission.'
                )
            } finally {
                setPendingFormData(null) // Clear temporary data
            }

            setActingDelegateApproved(false)
        } else {
            console.log('else')
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
            {leaveData && (
                <>
                    <Formik
                        initialValues={{
                            requestId:
                                leaveData.leaveData.leaveRequest.requestId,
                            status: '',
                            comment: '',
                            isDelegate: false,
                            approver: getUserFromLocalStorage().userID,
                        }}
                        validationSchema={validationSchema}
                        onSubmit={(values, { setSubmitting }) => {
                            values.requestId =
                                leaveData.leaveData.leaveRequest.requestId
                            onSubmit(values, setSubmitting)
                            //console.log(values)
                        }}
                    >
                        {({
                            touched,
                            errors,
                            setFieldValue,
                            values,
                            isSubmitting,
                        }) => (
                            <Form>
                                <FormContainer>
                                    <div className="max-h-[700px] overflow-y-auto">
                                        <div className="mb-8">
                                            <TicketSection
                                                title={
                                                    leaveData.leaveData
                                                        .leaveRequest
                                                        .leaveTypeName +
                                                    ' Request - ' +
                                                    leaveData.leaveData
                                                        .leaveRequest.epf
                                                }
                                                icon={
                                                    <HiOutlineClipboardList />
                                                }
                                                titleSize="h5"
                                            >
                                                <div className="grid grid-cols-3 gap-4">
                                                    <div className="mt-4">
                                                        <div className="">
                                                            <span className="font-semibold mb-3 text-gray-900 dark:text-gray-100">
                                                                {' '}
                                                                Start Date:
                                                            </span>
                                                            <span className="mx-1"></span>
                                                            <span>
                                                                {dayjs(
                                                                    leaveData
                                                                        .leaveData
                                                                        .leaveRequest
                                                                        .startDate
                                                                ).format(
                                                                    'DD MMMM YYYY'
                                                                )}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div className="mt-4"></div>

                                                    <div className="mt-4">
                                                        <div className="">
                                                            <span className="font-semibold mb-3 text-gray-900 dark:text-gray-100">
                                                                {' '}
                                                                Status:
                                                            </span>
                                                            <span className="mx-1"></span>

                                                            <span
                                                                className={`ml-2 rtl:mr-2 capitalize font-semibold ${
                                                                    leaveStatusColor[
                                                                        leaveData
                                                                            .leaveData
                                                                            .leaveRequest
                                                                            .requestStatus
                                                                    ].textClass
                                                                }`}
                                                            >
                                                                {
                                                                    leaveStatusColor[
                                                                        leaveData
                                                                            .leaveData
                                                                            .leaveRequest
                                                                            .requestStatus
                                                                    ].label
                                                                }
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="mt-4">
                                                        <div className="">
                                                            <span className="font-semibold mb-3 text-gray-900 dark:text-gray-100">
                                                                {' '}
                                                                End Date:
                                                            </span>
                                                            <span className="mx-1"></span>
                                                            <span>
                                                                {dayjs(
                                                                    leaveData
                                                                        .leaveData
                                                                        .leaveRequest
                                                                        .endDate
                                                                ).format(
                                                                    'DD MMMM YYYY'
                                                                )}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {leaveData.leaveData
                                                    .leaveRequest.isHalfDay && (
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div className="mt-4">
                                                            <div className="">
                                                                <span className="font-semibold mb-3 text-gray-900 dark:text-gray-100">
                                                                    {' '}
                                                                    Half Day:
                                                                </span>
                                                                <span className="mx-1"></span>
                                                                <span>
                                                                    {
                                                                        leaveData
                                                                            .leaveData
                                                                            .leaveRequest
                                                                            .halfDayType
                                                                    }
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}

                                                {leaveData.leaveData
                                                    .leaveRequest
                                                    .lieuLeaveDate !=
                                                    '0001-01-01T00:00:00' && (
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div className="mt-4">
                                                            <div className="">
                                                                <span className="font-semibold mb-3 text-gray-900 dark:text-gray-100">
                                                                    {' '}
                                                                    Lieu Leave:
                                                                </span>
                                                                <span className="mx-1"></span>
                                                                <span>
                                                                    {
                                                                        leaveData
                                                                            .leaveData
                                                                            .leaveRequest
                                                                            .lieuLeaveDate
                                                                    }
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </TicketSection>
                                        </div>
                                        <div className="mb-1">
                                            <div className="grid grid-rows-2 grid-flow-col gap-4">
                                                <div className="col-span-2">
                                                    <TicketSection
                                                        title="Description"
                                                        icon={
                                                            <HiOutlineChatAlt />
                                                        }
                                                    >
                                                        <div className="grid grid-rows-2 grid-flow-col gap-4">
                                                            <div className="col-span-2">
                                                                <div className="mt-2">
                                                                    <div className="">
                                                                        {
                                                                            leaveData
                                                                                .leaveData
                                                                                .leaveRequest
                                                                                .reason
                                                                        }
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </TicketSection>
                                                </div>
                                                <div className="col-span-2">
                                                    {!isActingDelegate && (
                                                        <FormItem
                                                            asterisk={true}
                                                            label="Comment"
                                                            invalid={
                                                                errors.comment &&
                                                                touched.comment
                                                            }
                                                            errorMessage={
                                                                errors.comment
                                                            }
                                                        >
                                                            <Field
                                                                disabled={
                                                                    isAlreadyClosed
                                                                }
                                                                type="text"
                                                                autoComplete="off"
                                                                name="comment"
                                                                placeholder="Enter Comment"
                                                                component={
                                                                    Input
                                                                }
                                                            />
                                                        </FormItem>
                                                    )}
                                                </div>

                                                <div className="col-span-2"></div>
                                                <div className="row-span-3">
                                                    <TicketSection
                                                        title="Approvals"
                                                        icon={
                                                            <HiOutlineUserCircle />
                                                        }
                                                    >
                                                        <Timeline className="mt-2">
                                                            <Timeline.Item
                                                                media={
                                                                    <TimelineAvatar className="text-gray-700 bg-gray-200 dark:text-gray-100">
                                                                        <HiTag />
                                                                    </TimelineAvatar>
                                                                }
                                                            >
                                                                <div className="flex items-center">
                                                                    <span className="font-semibold text-gray-900 dark:text-gray-100">
                                                                        {
                                                                            leaveData
                                                                                .leaveData
                                                                                .leaveRequest
                                                                                .actingDelegate
                                                                        }{' '}
                                                                    </span>

                                                                    <span className="mx-2">
                                                                        {
                                                                            ' acting delegate approval status '
                                                                        }
                                                                        {
                                                                            leaveData
                                                                                .leaveData
                                                                                .leaveRequest
                                                                                .actingDelegateApprovalStatus
                                                                        }{' '}
                                                                    </span>
                                                                </div>
                                                            </Timeline.Item>
                                                            {leaveData.leaveData.approvals.map(
                                                                (
                                                                    elm: Approvals
                                                                ) => (
                                                                    <Timeline.Item
                                                                        key={
                                                                            elm.levelName
                                                                        }
                                                                        media={
                                                                            <TimelineAvatar className="text-gray-700 bg-gray-200 dark:text-gray-100">
                                                                                <HiTag />
                                                                            </TimelineAvatar>
                                                                        }
                                                                    >
                                                                        <div className="flex items-center">
                                                                            <span className="font-semibold text-gray-900 dark:text-gray-100">
                                                                                {
                                                                                    elm.approver
                                                                                }{' '}
                                                                            </span>
                                                                            <span className="mx-2">
                                                                                {' '}
                                                                                {
                                                                                    elm.levelName
                                                                                }{' '}
                                                                                approval
                                                                                Status{' '}
                                                                            </span>
                                                                            <Tag
                                                                                prefix
                                                                                className="mr-2 rtl:ml-2 cursor-pointer"
                                                                                prefixClass="bg-rose-500"
                                                                            >
                                                                                {
                                                                                    elm.status
                                                                                }
                                                                            </Tag>
                                                                        </div>
                                                                    </Timeline.Item>
                                                                )
                                                            )}
                                                        </Timeline>
                                                    </TicketSection>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <hr />

                                    <div className="text-right mt-2">
                                        <Button
                                            disabled={isAlreadyClosed}
                                            className="text-red-600"
                                            loading={isSubmitting}
                                            variant="plain"
                                            size="sm"
                                            icon={<HiOutlineTrash />}
                                            type="submit"
                                            onClick={() => {
                                                setFieldValue(
                                                    'status',
                                                    'Rejected'
                                                )
                                                setFieldValue(
                                                    'comment',
                                                    values.comment
                                                )
                                            }}
                                        >
                                            Reject
                                        </Button>

                                        <Button
                                            disabled={isAlreadyClosed}
                                            className="mr-2 rtl:ml-2"
                                            loading={isSubmitting}
                                            size="sm"
                                            variant="plain"
                                            type="submit"
                                            icon={<FcApproval />}
                                            onClick={() => {
                                                setFieldValue(
                                                    'status',
                                                    'Approved'
                                                )
                                            }}
                                        >
                                            Approve
                                        </Button>
                                    </div>
                                </FormContainer>
                            </Form>
                        )}
                    </Formik>

                    <ConfirmDialog
                        isOpen={isActingDelegateApproved}
                        type="danger"
                        title="Confirm without Prior Approvals"
                        confirmButtonColor="red-600"
                        onClose={onDialogClose}
                        onRequestClose={onDialogClose}
                        onCancel={onDialogClose}
                        onConfirm={onConfirmation}
                    >
                        <p>
                            Acting delegate approval is pending. Are you sure
                            you want to continue? This action cannot be undone.
                        </p>
                    </ConfirmDialog>
                </>
            )}
        </>
    )
}

export default LeaveApproveForm
