import Dialog from '@/components/ui/Dialog'
import type { CommonProps } from '@/@types/common'
import Button from '@/components/ui/Button'
import usePayrun from '@/utils/hooks/usePayrun'
import useTimeOutMessage from '@/utils/hooks/useTimeOutMessage'
import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import { useState } from 'react'

interface DialogProps {
    isRejectOpen: boolean // Type for the 'isOpen' prop
    onClose: () => void // Type for the 'onClose' prop
    props: FormProps
    data: any
}

interface FormProps extends CommonProps {
    disableSubmit?: boolean
}

const getUsernameFromLocalStorage = () => {
    const user = JSON.parse(localStorage.getItem('admin') ?? '')
    const userID = JSON.parse(user.auth).user.userID
    return userID
}

const DialogComponent: React.FC<DialogProps> = ({
    onClose,
    isRejectOpen,
    props,
    data,
}) => {
    const { rollbackDataTransfer } = usePayrun()
    const [message, setMessage] = useTimeOutMessage()
    const [isSubmitting, setSubmitting] = useState(false)

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

    const RejectDataTransfer = {
        companyCode: data.companyCode,
        period: data.period,
        approvedBy: getUsernameFromLocalStorage(),
    }
    const rejectData = async () => {
        setSubmitting(true)
        const result = await rollbackDataTransfer(RejectDataTransfer)

        if (result?.status === 'failed') {
            setMessage('Error')
            openNotification('danger', result.message)
            setSubmitting(false)
        } else {
            setMessage('Successfully Saved')
            openNotification('success', 'Temp Data Deleted Successfully')
            setSubmitting(false)
            onClose()
        }
    }
    return (
        <>
            <Dialog
                isOpen={isRejectOpen}
                onClose={onClose}
                onRequestClose={onClose}
            >
                <h5 className="mb-4">Reject Data</h5>

                <p className="mb-4">
                    Are you sure you want to Reject the data transfer? Clicking
                    'Rollback Data' will restore your data to a previous state.
                    All transfered data for Company Code : {data.companyCode}{' '}
                    Period : {data.period} will be deleted. Please confirm only
                    if you intend to revert to the previous version
                </p>

                <p>Company Code : {data.companyCode}</p>
                <p>Period : {data.period}</p>

                <div className="text-right mt-6">
                    <Button
                        className="ltr:mr-2 rtl:ml-2"
                        variant="plain"
                        onClick={onClose}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="solid"
                        loading={isSubmitting}
                        onClick={rejectData}
                    >
                        Reject
                    </Button>
                </div>
            </Dialog>
        </>
    )
}

export default DialogComponent
