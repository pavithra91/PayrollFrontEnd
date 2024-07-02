import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import React from 'react'
import { Field, Form, Formik, FormikProps } from 'formik'
import { FormItem, FormContainer } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Alert from '@/components/ui/Alert'
import Select from '@/components/ui/Select'
import type { CommonProps, SelectOption, TaxOption } from '@/@types/common'
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
import useTimeOutMessage from '@/utils/hooks/useTimeOutMessage'
import { useState } from 'react'
import useCommon from '@/utils/hooks/useCommon'
import { SystemVariableSchema } from '@/@types/System'
import useSettings from '@/utils/hooks/useSettings'

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

const companyOptions: SelectOption[] = [
    { value: 2000, label: '2000' },
    { value: 3000, label: '3000' },
]

const categoryOptions: TaxOption[] = [
    { value: 'System_Variable', label: 'System Variable' },
    { value: 'Calculation_Variable', label: 'Calculation Variable' },
]

const FieldWrapper: FC<FieldWrapperProps> = ({ name, render }) => {
    const [field, meta, helpers] = useField(name)

    return render({ field, meta, helpers })
}

const { getUserIDFromLocalStorage } = useCommon()

const initValues: SystemVariableSchema = {
    id: 0,
    companyCode: companyOptions[0].value,
    category_name: categoryOptions[0].value,
    variable_name: '',
    variable_value: '',
    createdBy: getUserIDFromLocalStorage(),
}

const validationSchema = Yup.object().shape({
    companyCode: Yup.object().required('Please select Company Code'),
    variable_name: Yup.string().required('Please enter Calculation Sequence'),
    variable_value: Yup.string().required('Please enter Pay Code'),
})

const DialogComponent: React.FC<DialogProps> = ({ onClose, isOpen, props }) => {
    const [message, setMessage] = useTimeOutMessage()

    const { disableSubmit = false, className } = props

    const { addSystemVariable } = useSettings()

    const onSubmit = async (
        values: SystemVariableSchema,
        setSubmitting: (isSubmitting: boolean) => void
    ) => {
        const {
            id,
            companyCode,
            category_name,
            variable_name,
            variable_value,
            createdBy,
        } = values
        setSubmitting(true)

        const result = await addSystemVariable({
            id,
            companyCode,
            category_name,
            variable_name,
            variable_value,
            createdBy,
        })

        if (result?.status === 'failed') {
            setMessage(result.message)
            openNotification(
                'danger',
                'Error Occurred While Saving Data : ' + result.message
            )
        } else {
            setMessage('Successfully Saved')
            openNotification('success', 'System Variable Saved Successfully')
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
                <h5 className="mb-4">Add System Variable</h5>

                <div className={className}>
                    {message && (
                        <Alert showIcon className="mb-4" type="danger">
                            <>{message}</>
                        </Alert>
                    )}
                    <Formik<SystemVariableSchema>
                        initialValues={initValues}
                        validationSchema={validationSchema}
                        onSubmit={(values, { setSubmitting }) => {
                            if (!disableSubmit) {
                                const selectedCompanyCode = Array.from(
                                    Object.values(values.companyCode)
                                )

                                const selectedCategoryOptions = Array.from(
                                    Object.values(values.category_name)
                                )

                                values.companyCode = selectedCompanyCode[0]
                                values.category_name =
                                    selectedCategoryOptions[0]

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
                        }: FormikProps<SystemVariableSchema>) => (
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
                                            <FieldWrapper
                                                name="payCategory"
                                                render={({
                                                    field,
                                                    meta,
                                                    helpers,
                                                }) => (
                                                    <FormItem
                                                        label="Category"
                                                        invalid={
                                                            !!meta.error &&
                                                            meta.touched
                                                        }
                                                        errorMessage={
                                                            meta.error
                                                        }
                                                    >
                                                        <Select
                                                            name="category_name"
                                                            id="category_name"
                                                            value={field.value}
                                                            onChange={(
                                                                value
                                                            ) => {
                                                                helpers.setValue(
                                                                    value
                                                                )
                                                            }}
                                                            placeholder="Please Select Category"
                                                            options={
                                                                categoryOptions
                                                            }
                                                        ></Select>
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <FormItem
                                            label="Variable Name"
                                            invalid={
                                                (errors.variable_name &&
                                                    touched.variable_name) as boolean
                                            }
                                            errorMessage={errors.variable_name}
                                        >
                                            <Field
                                                type="text"
                                                autoComplete="off"
                                                name="variable_name"
                                                placeholder="Variable Name"
                                                component={Input}
                                            />
                                        </FormItem>
                                        <div className="grid grid-cols-1 gap-4">
                                            <FormItem
                                                label="Variable Value"
                                                invalid={
                                                    (errors.variable_value &&
                                                        touched.variable_value) as boolean
                                                }
                                                errorMessage={
                                                    errors.variable_value
                                                }
                                            >
                                                <Field
                                                    type="text"
                                                    autoComplete="off"
                                                    name="variable_value"
                                                    placeholder="Variable Value"
                                                    component={Input}
                                                />
                                            </FormItem>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="grid grid-cols-1 gap-4"></div>
                                    </div>

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
