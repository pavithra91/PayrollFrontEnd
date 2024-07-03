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
import type { PayCodeSchema } from '@/@types/paycode'
import usePayCodes from '@/utils/hooks/usePayCodes'
import Checkbox from '@/components/ui/Checkbox'
import useCommon from '@/utils/hooks/useCommon'

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

const categoryOptions: SelectOption[] = [
    { value: 0, label: 'Earning' },
    { value: 1, label: 'Deduction' },
]

const taxationTypeOptions: TaxOption[] = [
    { value: 'IT', label: 'Income Tax' },
    { value: 'LT', label: 'Lump Sum Tax' },
    { value: 'NA', label: 'None' },
]

const FieldWrapper: FC<FieldWrapperProps> = ({ name, render }) => {
    const [field, meta, helpers] = useField(name)

    return render({ field, meta, helpers })
}

const { getUserIDFromLocalStorage } = useCommon()

const initValues: PayCodeSchema = {
    companyCode: companyOptions[0].value, // This will be the default one
    payCode: '',
    calCode: '',
    description: '',
    payCategory: categoryOptions[0].value.toString(),
    rate: 0,
    createdBy: getUserIDFromLocalStorage(),
    id: 0,
    taxationType: 'NA',
}

const validationSchema = Yup.object().shape({
    companyCode: Yup.object().required('Please select Company Code'),
    payCode: Yup.string().required('Please enter Pay Code'),
    calCode: Yup.string().required('Please enter Calculation Code'),
    payCategory: Yup.object().required('Please enter Pay Category'),
    taxationType: Yup.object().required('Please select Taxation Type'),
    rate: Yup.number().required('Please enter Calculation Type'),
})

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
            taxationType,
            createdBy,
        } = values
        setSubmitting(true)

        console.log(values)

        const result = await addPayCodes({
            companyCode,
            payCode,
            calCode,
            description,
            payCategory,
            rate,
            createdBy,
            id: 0,
            taxationType,
        })

        if (result?.status === 'failed') {
            setMessage(result.message)
            openNotification(
                'danger',
                'Error Occurred While Saving Data : ' + result.message
            )
        } else {
            setMessage('Successfully Saved')
            openNotification('success', 'Calculation Saved Successfully')
            onClose()
        }

        setSubmitting(false)
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

                                const selectedCategoryOptions = Array.from(
                                    Object.values(values.payCategory)
                                )

                                const selectedTaxationType = Array.from(
                                    Object.values(values.taxationType)
                                )

                                values.taxationType = selectedTaxationType[0]

                                values.companyCode = selectedCompanyCode[0]
                                values.payCategory =
                                    selectedCategoryOptions[0].toString()

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
                                                            name="payCategory"
                                                            id="payCategory"
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

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="grid grid-cols-1 gap-4">
                                            <FormItem
                                                label="Rate"
                                                invalid={
                                                    (errors.rate &&
                                                        touched.rate) as boolean
                                                }
                                                errorMessage={errors.rate}
                                            >
                                                <Field
                                                    type="text"
                                                    autoComplete="off"
                                                    name="rate"
                                                    placeholder="Rate"
                                                    component={Input}
                                                />
                                            </FormItem>
                                        </div>
                                        <div className="grid grid-cols-1 gap-4">
                                            <FieldWrapper
                                                name="taxationType"
                                                render={({
                                                    field,
                                                    meta,
                                                    helpers,
                                                }) => (
                                                    <FormItem
                                                        label="Taxation Type"
                                                        invalid={
                                                            !!meta.error &&
                                                            meta.touched
                                                        }
                                                        errorMessage={
                                                            meta.error
                                                        }
                                                    >
                                                        <Select
                                                            name="taxationType"
                                                            id="taxationType"
                                                            value={field.value}
                                                            onChange={(
                                                                value
                                                            ) => {
                                                                helpers.setValue(
                                                                    value
                                                                )
                                                            }}
                                                            placeholder="Taxation Type"
                                                            options={
                                                                taxationTypeOptions
                                                            }
                                                        ></Select>
                                                    </FormItem>
                                                )}
                                            />
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
                                                : 'Add Pay Code'}
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
