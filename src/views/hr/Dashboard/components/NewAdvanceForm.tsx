import * as Yup from 'yup'
import { toggleNewAdvanceDialog, useAppDispatch } from '../store'
import { Field, Form, Formik, FieldProps } from 'formik'
import { FormItem, FormContainer } from '@/components/ui/Form'
import { Button, Input } from '@/components/ui'
import Checkbox from '@/components/ui/Checkbox/Checkbox'
import { useState } from 'react'
import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import useCommon from '@/utils/hooks/useCommon'
import useTimeOutMessage from '@/utils/hooks/useTimeOutMessage'
import useLeave from '@/utils/hooks/useLeave'
import { AdvancePayment } from '@/@types/Leave'

const validationSchema = Yup.object().shape({
    amount: Yup.number().when(
        'isFullAmount',
        ([isFullAmount], validationSchema) => {
            return isFullAmount
                ? Yup.string().notRequired()
                : Yup.number()
                      .required('Amount Required')
                      .moreThan(0, 'Amount must be greater than zero')
        }
    ),
})

const NewAdvanceForm = () => {
    const dispatch = useAppDispatch()
    const { getUserFromLocalStorage } = useCommon()
    const { addAdvancePayment } = useLeave()

    const [message, setMessage] = useTimeOutMessage()
    const [isFullAmount, setFullAmount] = useState(true)

    const onSubmit = async (
        formValue: AdvancePayment,
        setSubmitting: (isSubmitting: boolean) => void
    ) => {
        setSubmitting(true)

        const { epf, isFullAmount, amount } = formValue

        const values = {
            epf,
            isFullAmount,
            amount,
        }

        setSubmitting(true)

        const result = await addAdvancePayment({
            epf,
            isFullAmount,
            amount,
            createdBy: getUserFromLocalStorage().userID,
        })

        console.log(result?.status)

        if (result?.status === 'failed') {
            setMessage(result.message)
            openNotification('danger', result.message)
        } else {
            setMessage('Successfully Saved')
            openNotification('success', 'Advance Request Send for Approval')
        }

        setSubmitting(false)
        //dispatch(putProject(values))
        dispatch(toggleNewAdvanceDialog(false))
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
                    epf: getUserFromLocalStorage().epf,
                    name: getUserFromLocalStorage().userName,
                    isFullAmount: true,
                    amount: 0,
                }}
                validationSchema={validationSchema}
                onSubmit={(values, { setSubmitting }) => {
                    if (values.isFullAmount) {
                        values.amount = 0
                    }
                    onSubmit(values, setSubmitting)
                }}
            >
                {({ touched, errors, setFieldValue, values }) => (
                    <Form>
                        <FormContainer>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="..">
                                    <FormItem label="EPF">
                                        <Field
                                            disabled
                                            type="text"
                                            autoComplete="off"
                                            name="epf"
                                            placeholder="EPF"
                                            component={Input}
                                        />
                                    </FormItem>
                                </div>
                                <div className="..">
                                    <FormItem label="Name">
                                        <Field
                                            disabled
                                            type="text"
                                            autoComplete="off"
                                            name="name"
                                            placeholder="Name"
                                            component={Input}
                                        />
                                    </FormItem>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="..">
                                    <FormItem>
                                        <Field name="isFullAmount">
                                            {({ field }: FieldProps) => (
                                                <Checkbox
                                                    defaultChecked
                                                    {...field}
                                                    onChange={() => {
                                                        const value =
                                                            !field.value
                                                        setFieldValue(
                                                            'isFullAmount',
                                                            value
                                                        )
                                                        // Clear additional info when unchecked
                                                        if (!value) {
                                                            setFieldValue(
                                                                'additionalInfo',
                                                                setFullAmount(
                                                                    false
                                                                )
                                                            )
                                                        } else {
                                                            setFieldValue(
                                                                'additionalInfo',
                                                                setFullAmount(
                                                                    true
                                                                )
                                                            )
                                                        }
                                                    }}
                                                >
                                                    Full Amount
                                                </Checkbox>
                                            )}
                                        </Field>
                                    </FormItem>
                                </div>

                                {!isFullAmount && (
                                    <FormItem
                                        asterisk={true}
                                        label="Amount"
                                        invalid={
                                            errors.amount && touched.amount
                                        }
                                        errorMessage={errors.amount}
                                    >
                                        <Field
                                            disable
                                            type="text"
                                            autoComplete="off"
                                            name="amount"
                                            placeholder=""
                                            component={Input}
                                        />
                                    </FormItem>
                                )}
                            </div>

                            <Button block variant="solid" type="submit">
                                Submit for Approval
                            </Button>
                        </FormContainer>
                    </Form>
                )}
            </Formik>
        </>
    )
}

export default NewAdvanceForm
