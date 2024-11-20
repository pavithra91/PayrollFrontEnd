import * as Yup from 'yup'
import { FormContainer, FormItem } from '@/components/ui/Form'
import { Field, Form, Formik, FormikProps } from 'formik'
import { Input } from '@/components/ui/Input'
import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import Switcher from '@/components/ui/Switcher'
import Button from '@/components/ui/Button'
import useTimeOutMessage from '@/utils/hooks/useTimeOutMessage'
import { LeaveTypeSchema } from '@/@types/Leave'
import useLeave from '@/utils/hooks/useLeave'
import useCommon from '@/utils/hooks/useCommon'
import { toggleNewLeaveTypeDialog, useAppDispatch } from '../store'

const validationSchema = Yup.object().shape({
    leaveTypeName: Yup.string().required('Leave Type Name Required'),
    description: Yup.string().required('Description Required'),
    maxDays: Yup.number(),
})

const NewLeaveTypeForm = () => {
    const dispatch = useAppDispatch()

    const [message, setMessage] = useTimeOutMessage()

    const { addLeaveType } = useLeave()

    const { getUserFromLocalStorage } = useCommon()

    const onDialogClose = () => {
        dispatch(toggleNewLeaveTypeDialog(false))
    }

    const onSubmit = async (
        values: LeaveTypeSchema,
        setSubmitting: (isSubmitting: boolean) => void
    ) => {
        const {
            leaveTypeName,
            description,
            maxDays,
            carryForwardAllowed,
            createdBy,
        } = values
        setSubmitting(true)

        const result = await addLeaveType({
            leaveTypeName,
            description,
            maxDays,
            carryForwardAllowed,
            createdBy,
        })

        console.log(result?.status)

        if (result?.status === 'failed') {
            setMessage(result.message)
            openNotification('danger', result.message)
        } else {
            setMessage('Successfully Saved')
            openNotification('success', 'New Leave Type Added Successfully')
        }

        setSubmitting(false)
        onDialogClose()
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
                    leaveTypeName: '',
                    description: '',
                    maxDays: 0,
                    carryForwardAllowed: false,
                    createdBy: getUserFromLocalStorage().userID,
                }}
                validationSchema={validationSchema}
                onSubmit={(values, { setSubmitting }) => {
                    onSubmit(values, setSubmitting)
                }}
            >
                {({ touched, errors, setFieldValue, values, isSubmitting }) => (
                    <Form>
                        <FormContainer>
                            <FormItem label="Leave Type Name">
                                <Field
                                    type="text"
                                    autoComplete="off"
                                    name="leaveTypeName"
                                    placeholder="Name"
                                    component={Input}
                                />
                            </FormItem>

                            <FormItem label="Description">
                                <Field
                                    type="text"
                                    autoComplete="off"
                                    name="description"
                                    placeholder="Description"
                                    component={Input}
                                />
                            </FormItem>

                            <FormItem label="Maximum Days">
                                <Field
                                    type="text"
                                    autoComplete="off"
                                    name="maxDays"
                                    placeholder="Maximum Days"
                                    component={Input}
                                />
                            </FormItem>

                            <FormItem
                                asterisk
                                label="Carry Forward Allowed"
                                invalid={
                                    errors.carryForwardAllowed &&
                                    touched.carryForwardAllowed
                                }
                                errorMessage={errors.carryForwardAllowed}
                            >
                                <div>
                                    <Field
                                        name="carryForwardAllowed"
                                        component={Switcher}
                                    />
                                </div>
                            </FormItem>

                            <div className="grid grid-cols-1 gap-4">
                                <Button
                                    block
                                    loading={isSubmitting}
                                    variant="solid"
                                    type="submit"
                                >
                                    {isSubmitting ? 'Saving...' : 'Save'}
                                </Button>
                            </div>
                        </FormContainer>
                    </Form>
                )}
            </Formik>
        </>
    )
}

export default NewLeaveTypeForm
