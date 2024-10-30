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
    onSendData: any
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
    onSendData,
}) => {
    const { getPayrunByPeriod, createBankTransferFile } = usePayrun()
    const { getUserIDFromLocalStorage } = useCommon()
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
        setSubmitting(true)

        const payRunResults = getPayrunByPeriod(ConfirmDataTransfer)
        payRunResults.then((res) => {
            const listItems = JSON.parse(res?.data?.data ?? '')

            if (listItems.length > 0) {
                if (listItems[0].payrunStatus == 'Unrec File Created') {
                    const bankTransfer =
                        createBankTransferFile(ConfirmDataTransfer)

                    bankTransfer.then((res) => {
                        const result = res?.status

                        if (result == 'success') {
                            //onSendData(listItems)
                            setMessage('Successfully Saved')
                            openNotification(
                                'success',
                                'Background Task Created Successfully. Please check Logs for more information'
                            )
                            setSubmitting(false)
                            onClose()
                        } else {
                            setMessage('Error')
                            openNotification(
                                'danger',
                                'Error Ouccered! Failed to Create Background Task'
                            )
                            setSubmitting(false)
                            onClose()
                        }
                    })
                } else {
                    setMessage('Error')
                    openNotification(
                        'danger',
                        'Payrun Status needs to be in Unrec File Created'
                    )
                    setSubmitting(false)
                }
            }
        })

        // if (result?.status === 'failed') {
        //     setMessage('Error')
        //     openNotification('danger', result.message)
        //     setSubmitting(false)
        // } else {
        //     setMessage('Successfully Saved')
        //     openNotification('success', 'Data Transfer Confirmed')
        //     setSubmitting(false)
        //     onClose()
        // }
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
                    Are you sure you want to Create the Bank file transfer?
                    Please take a moment to review it for accuracy before
                    clicking 'Create Bank Transfer File'
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
