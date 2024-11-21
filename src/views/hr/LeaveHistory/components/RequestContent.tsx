import Button from '@/components/ui/Button'
import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import useTimeOutMessage from '@/utils/hooks/useTimeOutMessage'
import {
    HiOutlineChatAlt,
    HiOutlineClipboardList,
    HiOutlineTrash,
    HiOutlineUserCircle,
    HiX,
} from 'react-icons/hi'
import { ElementType, PropsWithChildren, ReactNode, useEffect, useState } from 'react'
import dayjs from 'dayjs'
import { FormContainer, FormItem } from '@/components/ui/Form'
import { Field, Form, Formik, FormikProps } from 'formik'
import useCommon from '@/utils/hooks/useCommon'
import { CancelModel } from '@/@types/Leave'
import useLeave from '@/utils/hooks/useLeave'

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

const TicketSection = ({
    title,
    icon,
    children,
    titleSize: Title = 'h6',
    ticketClose,
}: TicketSectionProps) => {
    return (
        <div className="flex mb-10">
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

const RequestContent = ({
    data,
    onTicketClose,
}: {
    data: any
    onTicketClose: () => void
}) => {
    const handleTicketClose = () => {
        onTicketClose?.()
    }

    const { getUserFromLocalStorage } = useCommon()
    const { cancelLeave } = useLeave()
    const [message, setMessage] = useTimeOutMessage()
    const [isAlreadyClosed, setAlreadyClosed] = useState(false)

    useEffect(() => {
    data.requestStatus == 'Pending' 
    ? setAlreadyClosed(false)
    : setAlreadyClosed(true)
}, [isAlreadyClosed])


const onSubmit = async (
    formValue: CancelModel,
    setSubmitting: (isSubmitting: boolean) => void
) => {
    setSubmitting(true)

    const { leaveRequestId } = formValue

    const result = await cancelLeave({
        leaveRequestId,
        cancelBy: getUserFromLocalStorage().userID,
    })

    console.log(result?.status)

    if (result?.status === 'failed') {
        setMessage(result.message)
        openNotification('danger', result.message)
    } else {
        setMessage('Successfully Saved')
        openNotification('success', 'Leave Request has been Cancelled')
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
        <Formik
                        initialValues={{       
                            leaveRequestId: 0,                  
                            cancelBy: getUserFromLocalStorage().userID,
                        }}
                        //validationSchema={validationSchema}
                        onSubmit={(values, { setSubmitting }) => {
                            values.leaveRequestId = data.requestId
                            onSubmit(values, setSubmitting)
                            console.log(values)
                        }}
                    >
                        {({
                            setFieldValue,
                            values,
                            isSubmitting,
                        }) => ( 
                            <Form>
                                <FormContainer>
            <div className="max-h-[700px] overflow-y-auto">
                <TicketSection
                    title={data.leaveTypeName + ' Request'}
                    icon={<HiOutlineClipboardList />}
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
                                    {dayjs(data.startDate).format(
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
                                        leaveStatusColor[data.requestStatus]
                                            .textClass
                                    }`}
                                >
                                    {leaveStatusColor[data.requestStatus].label}
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
                                    {dayjs(data.endDate).format('DD MMMM YYYY')}
                                </span>
                            </div>
                        </div>
                    </div>

                    {data.isHalfDay && (
                        <div className="grid grid-cols-2 gap-4">
                            <div className="mt-4">
                                <div className="">
                                    <span className="font-semibold mb-3 text-gray-900 dark:text-gray-100">
                                        {' '}
                                        Half Day:
                                    </span>
                                    <span className="mx-1"></span>
                                    <span>{data.halfDayType}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {data.lieuLeaveDate != '0001-01-01T00:00:00' && (
                        <div className="grid grid-cols-2 gap-4">
                            <div className="mt-4">
                                <div className="">
                                    <span className="font-semibold mb-3 text-gray-900 dark:text-gray-100">
                                        {' '}
                                        Lieu Leave:
                                    </span>
                                    <span className="mx-1"></span>
                                    <span>{data.lieuLeaveDate}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* <div className="mb-3 flex">
                        <div className="ml-2 rtl:mr-2 p-3 rounded w-100">
                            <div className="flex items-center mb-2">
                                <span className="font-semibold text-gray-900 dark:text-gray-100">
                                    Start Date:
                                </span>
                                <span className="mx-1"> | </span>
                                <span>{data.startDate}</span>
                            </div>
                        </div>
                    </div> */}
                </TicketSection>

                <TicketSection title="Description" icon={<HiOutlineChatAlt />}>
                    <div className="mt-2">
                        <p className="mt-2">{data.reason}</p>
                    </div>
                </TicketSection>

                <TicketSection title="Approvals" icon={<HiOutlineUserCircle />}>
                    <div className="mt-2">
                        <div className="grid grid-cols-3 gap-4">
                            <div className="mt-4">
                                <div className="">
                                    <span className="font-semibold mb-3 text-gray-900 dark:text-gray-100">
                                        {' '}
                                        Acting Delegate :
                                    </span>
                                    <span className="mx-1"></span>
                                    <span>{data.actingDelegate}</span>
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="mt-4">
                                <div className="">
                                    <span className="font-semibold mb-3 text-gray-900 dark:text-gray-100">
                                        {' '}
                                        Acting Delegate Approval Status :
                                    </span>
                                    <span className="mx-1"></span>
                                    <span>
                                        {data.actingDelegateApprovalStatus}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </TicketSection>
            </div>

            <div className="text-right mt-4">
                <Button
                disabled={
                    isAlreadyClosed
                }
                    className="mr-2 rtl:ml-2"
                    size="sm"
                    variant="plain"
                    onClick={() => handleTicketClose()}
                >
                    Cancel
                </Button>

                <Button
                disabled={
                    isAlreadyClosed
                }
                    className="text-red-600"
                    variant="plain"
                    size="sm"
                    icon={<HiOutlineTrash />}
                    type="submit"
                    // onClick={() => {
                    //     setFieldValue(
                    //         'status',
                    //         'Rejected'
                    //     )
                    // }}
                >
                    Delete
                </Button>
            </div>
            </FormContainer>
                            </Form>
                        )}
                    </Formik>
        </>
    )
}
export default RequestContent
