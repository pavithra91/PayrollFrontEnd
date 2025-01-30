import Dialog from '@/components/ui/Dialog'
import type { CommonProps } from '@/@types/common'
import Button from '@/components/ui/Button'
import usePayrun from '@/utils/hooks/usePayrun'
import useTimeOutMessage from '@/utils/hooks/useTimeOutMessage'
import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import { useState } from 'react'
import useCommon from '@/utils/hooks/useCommon'
import { toggleProcessPayrollDialog, toggleShowSimulation, toggleUnrecoveredDialog, useAppDispatch, useAppSelector } from '../store'

interface DialogProps {
    isConfirmOpen: boolean // Type for the 'isOpen' prop
    onClose: () => void // Type for the 'onClose' prop
}

interface FormProps extends CommonProps {
    disableSubmit?: boolean
}

const ConfirmDataView: React.FC<DialogProps> = ({
    onClose,
    isConfirmOpen,
}) => {

        const dispatch = useAppDispatch()
    const { processPayroll } = usePayrun()
    const [message, setMessage] = useTimeOutMessage()
    const [isSubmitting, setSubmitting] = useState(false)
    const { getUserIDFromLocalStorage } = useCommon()

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

        const approvalData = useAppSelector(
            (state) => state.PayrollData.data.comData
        )

    const ConfirmDataTransfer = {
        companyCode: approvalData.companyCode,
        period: approvalData.period,
        approvedBy: getUserIDFromLocalStorage(),
    }
    const ProcessData = async () => {
        setSubmitting(true)

        const result = await processPayroll(ConfirmDataTransfer)

        if (result?.status === 'failed') {
            setMessage('Error')
            openNotification('danger', result.message)
            setSubmitting(false)
        } else {
            dispatch(toggleProcessPayrollDialog(false))
            dispatch(toggleUnrecoveredDialog(true))
            dispatch(toggleShowSimulation(false))
            
            setMessage('Successfully Saved')
            openNotification('success', 'Payroll Process Successfully')
            setSubmitting(false)
            onClose()
        }
    }
    return (
        <>
            <Dialog
                isOpen={isConfirmOpen}
                onClose={onClose}
                onRequestClose={onClose}
            >
                <h5 className="mb-4">Process Payroll</h5>

                <p className="mb-4">
                    Confirming payroll for Company Code : {approvalData.companyCode}{' '}
                    Period : {approvalData.period} is a permanent action. Once
                    confirmed, salaries cannot be reversed. Please ensure all
                    payroll details are accurate before proceeding.
                </p>

                <p>Company Code : {approvalData.companyCode}</p>
                <p>Period : {approvalData.period}</p>

                <div className="text-right mt-6">
                    <Button
                        variant="solid"
                        loading={isSubmitting}
                        onClick={ProcessData}
                    >
                        Process
                    </Button>
                    <Button
                        className="ltr:mr-2 rtl:ml-2"
                        variant="plain"
                        onClick={onClose}
                    >
                        Cancel
                    </Button>
                </div>
            </Dialog>
        </>
    )
}

export default ConfirmDataView
