import Dialog from '@/components/ui/Dialog'
import type { CommonProps } from '@/@types/common'
import Button from '@/components/ui/Button'
import usePayrun from '@/utils/hooks/usePayrun'
import useTimeOutMessage from '@/utils/hooks/useTimeOutMessage'
import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import { useState } from 'react'
import useCommon from '@/utils/hooks/useCommon'

interface DialogProps {
    isConfirmOpen: boolean // Type for the 'isOpen' prop
    onClose: () => void // Type for the 'onClose' prop
    props: FormProps
    data: any
}

interface FormProps extends CommonProps {
    disableSubmit?: boolean
}

const { getUserIDFromLocalStorage } = useCommon()

const DialogComponent: React.FC<DialogProps> = ({
    onClose,
    isConfirmOpen,
    props,
    data,
}) => {
    const { confirmDataTransfer } = usePayrun()
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

    const ConfirmDataTransfer = {
        companyCode: data.companyCode,
        period: data.period,
        approvedBy: getUserIDFromLocalStorage(),
    }

    const confirmData = async () => {
        if (data.unmatchedData) {
            setMessage('Warning')
            openNotification(
                'warning',
                'There are unmached Data. Please check Again!'
            )
            setSubmitting(false)
        } else if (data.paycodeMacthed.length > 0) {
            setMessage('Warning')
            openNotification(
                'warning',
                'Paycodes missing. Please check and map paycode : ' +
                    data.paycodeMacthed
            )
            setSubmitting(false)
        } else {
            setSubmitting(true)
            const result = await confirmDataTransfer(ConfirmDataTransfer)

            if (result?.status === 'failed') {
                setMessage('Error')
                openNotification('danger', result.message)
                setSubmitting(false)
            } else {
                setMessage('Successfully Saved')
                openNotification('success', 'Data Transfer Confirmed')
                setSubmitting(false)
                onClose()
            }
        }
    }

    return (
        <>
            <Dialog
                isOpen={isConfirmOpen}
                onClose={onClose}
                onRequestClose={onClose}
            >
                <h5 className="mb-4">Confirm Data</h5>

                <p className="mb-4">
                    Are you sure you want to Confirm the data transfer? Please
                    take a moment to review it for accuracy before clicking
                    'Confirm Data Transfer'
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
                        onClick={confirmData}
                    >
                        Confirm
                    </Button>
                </div>
            </Dialog>
        </>
    )
}

export default DialogComponent
