import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import React from 'react'
import { Field, Form, Formik, FormikProps } from 'formik'
import { FormItem, FormContainer } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Alert from '@/components/ui/Alert'
import Select from '@/components/ui/Select'
import type { CommonProps } from '@/@types/common'
import type { FC, MouseEvent } from 'react'
import {
    FieldHelperProps,
    FieldInputProps,
    FieldMetaProps,
    useField,
} from 'formik'
import * as Yup from 'yup'
import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import useCalculations from '@/utils/hooks/useCalculation'
import useTimeOutMessage from '@/utils/hooks/useTimeOutMessage'
import { useState } from 'react'
import type { PayCodeSchema, CompanyIdSelectOption } from '@/@types/paycode'
import usePayCodes from '@/utils/hooks/usePayCodes'

interface DialogProps {
    isOpen: boolean // Type for the 'isOpen' prop
    onClose: () => void // Type for the 'onClose' prop
    props: FormProps
}

interface FormProps extends CommonProps {
    disableSubmit?: boolean
}

interface RenderProps<V = any> {
    field: FieldInputProps<V>
    meta: FieldMetaProps<V>
    helpers: FieldHelperProps<V>
}

interface FieldWrapperProps<V = any> {
    name: string
    render: (formikProps: RenderProps<V>) => React.ReactElement
}

const companyOptions: CompanyIdSelectOption[] = [
    { value: 2000, label: '2000' },
    { value: 3000, label: '3000' },
]

const FieldWrapper: FC<FieldWrapperProps> = ({ name, render }) => {
    const [field, meta, helpers] = useField(name)

    return render({ field, meta, helpers })
}

const getUsernameFromLocalStorage = () => {
    const user = JSON.parse(localStorage.getItem('admin') ?? '')
    const userName = JSON.parse(user.auth).user.userName
    return userName
}

const initValues: PayCodeSchema = {
    companyCode: companyOptions[0].value, // This will be the default one
    payCode: '',
    calCode: '',
    description: '',
    payCategory: '',
    rate: 0,
    createdBy: getUsernameFromLocalStorage(),
}

const validationSchema = Yup.object().shape({
    companyCode: Yup.object().required('Please select Company Code'),
    payCode: Yup.string().required('Please enter Pay Code'),
    calCode: Yup.string().required('Please enter Calculation Code'),
    payCategory: Yup.string().required('Please enter Calculation Type'),
    rate: Yup.number().required('Please enter Calculation Type'),
})

const DialogComponent: React.FC<DialogProps> = ({ onClose, isOpen, props }) => {
    const [message, setMessage] = useTimeOutMessage()

    const { disableSubmit = false, className } = props

    const { addPayCodes } = usePayCodes()

    const onSubmit = async (
        values: PayCodeSchema,
        setSubmitting: (isSubmitting: boolean) => void
    ) => {
        const {
            companyCode,
            payCode,
            calCode,
            description,
            payCategory,
            rate,
            createdBy,
        } = values
        setSubmitting(true)

        const result = await addPayCodes({
            companyCode,
            payCode,
            calCode,
            description,
            payCategory,
            rate,
            createdBy,
        })

        console.log(result?.status)

        if (result?.status === 'failed') {
            setMessage(result.message)
        } else {
            setMessage('Successfully Saved')
            openNotification('success', 'Calculation Saved Successfully')
            onClose()
        }

        setSubmitting(false)

        // if (result?.status === 'failed') {
        //     setMessage(result.message)
        //     openNotification('danger', result.message)
        // }

        // setMessage('Successfully Saved')
        // openNotification('success', 'Calculation Saved Successfully')
        // setSubmitting(false)
        // setIsOpen(false)
        // onClose()
    }

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
                <h5 className="mb-4">Map Pay Codes</h5>

                <div className={className}>
                    {message && (
                        <Alert showIcon className="mb-4" type="danger">
                            <>{message}</>
                        </Alert>
                    )}
                    <Formik<PayCodeSchema>
                        initialValues={initValues}
                        validationSchema={validationSchema}
                        onSubmit={(values, { setSubmitting }) => {
                            if (!disableSubmit) {
                                const selectedCompanyCode = Array.from(
                                    Object.values(values.companyCode)
                                )

                                values.companyCode = selectedCompanyCode[0]
                                console.log(values)

                                onSubmit(values, setSubmitting)
                            } else {
                                setSubmitting(false)
                            }
                        }}
                    >
                        {({
                            touched,
                            errors,
                            isSubmitting,
                        }: FormikProps<PayCodeSchema>) => (
                            <Form>
                                <FormContainer>
                                    <div className="grid grid-cols-2 gap-4">
                                        <FieldWrapper
                                            name="companyCode"
                                            render={({
                                                field,
                                                meta,
                                                helpers,
                                            }) => (
                                                <FormItem
                                                    label="Company Code"
                                                    invalid={
                                                        !!meta.error &&
                                                        meta.touched
                                                    }
                                                    errorMessage={meta.error}
                                                >
                                                    <Select
                                                        name="companyCode"
                                                        id="companyCode"
                                                        value={field.value}
                                                        onChange={(value) => {
                                                            helpers.setValue(
                                                                value
                                                            )
                                                        }}
                                                        placeholder="Please Select"
                                                        options={companyOptions}
                                                    ></Select>
                                                </FormItem>
                                            )}
                                        />
                                        <div className="grid grid-cols-1 gap-4">
                                            <FormItem
                                                label="Category"
                                                invalid={
                                                    (errors.payCategory &&
                                                        touched.payCategory) as boolean
                                                }
                                                errorMessage={
                                                    errors.payCategory
                                                }
                                            >
                                                <Field
                                                    type="text"
                                                    autoComplete="off"
                                                    name="payCategory"
                                                    placeholder="Category"
                                                    component={Input}
                                                />
                                            </FormItem>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <FormItem
                                            label="Pay Code"
                                            invalid={
                                                (errors.payCode &&
                                                    touched.payCode) as boolean
                                            }
                                            errorMessage={errors.payCode}
                                        >
                                            <Field
                                                type="text"
                                                autoComplete="off"
                                                name="payCode"
                                                placeholder="Pay Code"
                                                component={Input}
                                            />
                                        </FormItem>
                                        <div className="grid grid-cols-1 gap-4">
                                            <FormItem
                                                label="Calculation Code"
                                                invalid={
                                                    (errors.calCode &&
                                                        touched.calCode) as boolean
                                                }
                                                errorMessage={errors.calCode}
                                            >
                                                <Field
                                                    type="text"
                                                    autoComplete="off"
                                                    name="calCode"
                                                    placeholder="Calculation Code"
                                                    component={Input}
                                                />
                                            </FormItem>
                                        </div>
                                    </div>

                                    <FormItem
                                        label="Description"
                                        invalid={
                                            (errors.description &&
                                                touched.description) as boolean
                                        }
                                        errorMessage={errors.description}
                                    >
                                        <Field
                                            type="text"
                                            autoComplete="off"
                                            name="description"
                                            placeholder="Description"
                                            component={Input}
                                        />
                                    </FormItem>

                                    <div className="text-right mt-6"></div>

                                    <div className="grid grid-cols-1 gap-4">
                                        <Button
                                            block
                                            loading={isSubmitting}
                                            variant="solid"
                                            type="submit"
                                        >
                                            {isSubmitting
                                                ? 'Saving...'
                                                : 'Add Calculation'}
                                        </Button>
                                    </div>
                                </FormContainer>
                            </Form>
                        )}
                    </Formik>
                </div>
                <div className="text-right mt-6">
                    {/* <Button
                        className="ltr:mr-2 rtl:ml-2"
                        variant="plain"
                        onClick={onClose}
                    >
                        Cancel
                    </Button> */}
                    {/* <Button variant="solid" onClick={onDialogOk}>
                    Okay
                        </Button> */}
                </div>
            </Dialog>
        </>
    )
}

export default DialogComponent
