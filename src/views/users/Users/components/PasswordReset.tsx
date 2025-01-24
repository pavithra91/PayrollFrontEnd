import { Field, Form, Formik } from 'formik'
import { FormItem, FormContainer } from '@/components/ui/Form'
import Button from '@/components/ui/Button'
import useCommon from '@/utils/hooks/useCommon'
import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import { Input } from '@/components/ui/Input'
import { useNavigate } from 'react-router-dom'
import { resetUserPassword, useAppDispatch } from '../store'
import * as Yup from 'yup'

interface FormModel {
    password: string
    lastUpdateBy?: string
}

type PasswordResetProps = {
    onClose: () => void
}

const validationSchema = Yup.object().shape({
    password: Yup.string().required('Please enter Password'),
})

const PasswordReset: React.FC<PasswordResetProps> = ({ onClose }) => {
    const dispatch = useAppDispatch()

    const { getUserFromLocalStorage } = useCommon()

    const onSubmit = (
        formValue: FormModel,
        setSubmitting: (isSubmitting: boolean) => void
    ) => {
        setSubmitting(true)

        const { password } = formValue

        const values = {
            password: password,
            lastUpdateBy: getUserFromLocalStorage().userID,
        }

        dispatch(resetUserPassword(values))

        openNotification('success', 'User Password has been reset')

        setTimeout(() => {
            setSubmitting(false)
            onClose()
        }, 500)
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
                <h2>Reset User Password</h2>
            </div>

            <Formik
                initialValues={{
                    password: '',
                }}
                enableReinitialize={true}
                validationSchema={validationSchema}
                onSubmit={(values, { setSubmitting }) => {
                    onSubmit(values, setSubmitting)
                    console.log(values)
                    setSubmitting(true)
                }}
            >
                {({ touched, errors }) => (
                    <Form>
                        <FormContainer>
                            <FormItem
                                asterisk
                                label="New Password:"
                                invalid={touched.password && !!errors.password}
                                errorMessage={errors.password}
                            >
                                <Field
                                    type="password"
                                    as={Input}
                                    name="password"
                                    placeholder="Enter Password"
                                />
                            </FormItem>
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                                <div className="col-span-8 ..."></div>
                                <div className=".. ml-4">
                                    <Button
                                        size="sm"
                                        variant="twoTone"
                                        type="submit"
                                        // icon={<HiOutlinePlusCircle />}
                                        // onClick={onDialogOpen}
                                    >
                                        Reset Password
                                    </Button>
                                </div>
                            </div>
                        </FormContainer>
                    </Form>
                )}
            </Formik>
        </>
    )
}

export default PasswordReset
