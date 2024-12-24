import ConfirmDialog from '@/components/shared/ConfirmDialog'
import { Field, Form, Formik, FieldProps } from 'formik'
import { FormItem, FormContainer } from '@/components/ui/Form'
import { Input } from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import DatePicker from '@/components/ui/DatePicker'
import { useState } from 'react'
import { processPaymentData, useAppDispatch } from '../store'
import useCommon from '@/utils/hooks/useCommon'

type ProcessConfirmationDialogProps = {
    isOpen: boolean
    voucherNo: string
    onCancel: () => void
}

type PaymentRequest = {
    voucherNo: string
    bankDate: Date | string
    processBy: string
}

const ProcessConfirmationDialog: React.FC<ProcessConfirmationDialogProps> = ({
    isOpen,
    voucherNo,
    onCancel,
}) => {
    const [selectedDate, setSelectedDate] = useState<Date | null>(null)

    const dispatch = useAppDispatch()
    const { getUserFromLocalStorage } = useCommon()

    const handleConfirm = () => {
        const values = {
            voucherNo: voucherNo,
            bankDate: selectedDate,
            processBy: getUserFromLocalStorage().userID,
        } as PaymentRequest

        dispatch(processPaymentData(values)).then((res: any) => {
            console.log(res)
            onCancel()
        })
    }

    return (
        <>
            <ConfirmDialog
                isOpen={isOpen}
                type="warning"
                title="Confirm Voucher Processing"
                confirmButtonColor="red-600"
                onClose={onCancel}
                onRequestClose={onCancel}
                onCancel={onCancel}
                onConfirm={handleConfirm}
            >
                <DatePicker
                    size="sm"
                    placeholder="Pick a date"
                    value={selectedDate}
                    onChange={setSelectedDate} // Set selected date when picked
                    minDate={new Date()}
                />
            </ConfirmDialog>
        </>
    )
}

export default ProcessConfirmationDialog
