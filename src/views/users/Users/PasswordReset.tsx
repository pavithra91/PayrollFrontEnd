import { Alert } from "@/components/ui/Alert"
import { Dialog } from "@/components/ui/Dialog"
import useAccount from "@/utils/hooks/useAccount"
import useCommon from "@/utils/hooks/useCommon"
import Password from "../Account/Password"
import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import { useState } from "react"
import { CommonProps } from "@/@types/common"
import useTimeOutMessage from '@/utils/hooks/useTimeOutMessage'

interface DialogProps {
    isOpen: boolean // Type for the 'isOpen' prop
    onClose: () => void // Type for the 'onClose' prop
    props: FormProps
}

interface FormProps extends CommonProps {
    disableSubmit?: boolean
}

const PasswordReset: React.FC<DialogProps> = ({ onClose, isOpen, props }) => {
    const [message, setMessage] = useTimeOutMessage()

    const { disableSubmit = false, className } = props

    const { addUser } = useAccount()

    const { getUserFromLocalStorage } = useCommon()


    const [dialogIsOpen, setIsOpen] = useState(false)

    const openDialog = () => {
        setIsOpen(true)
    }

    const onDialogClose = (e: MouseEvent) => {
        console.log('onDialogClose', e)
        setIsOpen(false)
    }

    const onDialogOk = (e: MouseEvent) => {
        console.log('onDialogOk', e)
        setIsOpen(false)
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
            <Dialog isOpen={isOpen} onClose={onClose} onRequestClose={onClose}>
                {/* <h5 className="mb-4">Create User Account</h5> */}

                <div className={className}>
                    {message && (
                        <Alert showIcon className="mb-4" type="danger">
                            <>{message}</>
                        </Alert>
                    )}
                    
                </div>
                    <Password />
            </Dialog>
        </>
    )
}

export default PasswordReset
