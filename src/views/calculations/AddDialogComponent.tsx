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
import { useState, useEffect } from 'react'

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

interface FormProps extends CommonProps {
    disableSubmit?: boolean
}

interface CalculationSchema {
    companyCode: number
    sequence: number
    payCode: string
    calCode: string
    calFormula: string
    calDescription: string
    payCategory: string
    contributor: string
    status: boolean
    createdBy: string
}

interface CompanyIdSelectOption {
    label: string
    value: number
}

interface ContributorSelectOption {
    label: string
    value: string
}

const companyOptions: CompanyIdSelectOption[] = [
    { value: 2000, label: '2000' },
    { value: 3000, label: '3000' },
]

const contributorOptions: ContributorSelectOption[] = [
    { value: 'E', label: 'Employee' },
    { value: 'C', label: 'Company' },
]

const FieldWrapper: FC<FieldWrapperProps> = ({ name, render }) => {
    const [field, meta, helpers] = useField(name)

    return render({ field, meta, helpers })
}

const initValues: CalculationSchema = {
    companyCode: companyOptions[0].value, // This will be the default one
    sequence: 0,
    payCode: '',
    calCode: '',
    calFormula: '',
    calDescription: '',
    payCategory: '',
    contributor: contributorOptions[0].value,
    status: true,
    createdBy: '3021ITFI',
}

const validationSchema = Yup.object().shape({
    companyCode: Yup.object().required('Please select Company Code'),
    sequence: Yup.string().required('Please enter Calculation Sequence'),
    payCode: Yup.string().required('Please enter correct EPF'),
    calCode: Yup.string().required('Please enter Cost Center'),
    calFormula: Yup.string().required('Please enter Calculation Formula'),
    payCategory: Yup.string().required('Please enter Calculation Type'),
    contributor: Yup.object().required('Please enter Contributor'),
})

const DialogComponent: React.FC<DialogProps> = ({ onClose, isOpen, props }) => {
    const [message, setMessage] = useTimeOutMessage()

    const { disableSubmit = false, className } = props

    const { getCalculations, addCalculations } = useCalculations()

    const onSubmit = async (
        values: CalculationSchema,
        setSubmitting: (isSubmitting: boolean) => void
    ) => {
        const {
            companyCode,
            sequence,
            payCode,
            calCode,
            calFormula,
            calDescription,
            payCategory,
            contributor,
            status,
            createdBy,
        } = values
        setSubmitting(true)

        const result = await addCalculations({
            companyCode,
            sequence,
            payCode,
            calCode,
            calFormula,
            calDescription,
            payCategory,
            contributor,
            status,
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
                <h5 className="mb-4">Add Calculations</h5>

                <div className={className}>
                    {message && (
                        <Alert showIcon className="mb-4" type="danger">
                            <>{message}</>
                        </Alert>
                    )}
                    <Formik<CalculationSchema>
                        initialValues={initValues}
                        validationSchema={validationSchema}
                        onSubmit={(values, { setSubmitting }) => {
                            if (!disableSubmit) {
                                const selectedCompanyCode = Array.from(
                                    Object.values(values.companyCode)
                                )

                                const selectedContributor = Array.from(
                                    Object.values(values.contributor)
                                )

                                values.companyCode = selectedCompanyCode[0]
                                values.contributor = selectedContributor[0]
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
                        }: FormikProps<CalculationSchema>) => (
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
                                                label="Sequence"
                                                invalid={
                                                    (errors.sequence &&
                                                        touched.sequence) as boolean
                                                }
                                                errorMessage={errors.sequence}
                                            >
                                                <Field
                                                    type="text"
                                                    autoComplete="off"
                                                    name="sequence"
                                                    placeholder="Sequence"
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
                                        label="Calculation Formula"
                                        invalid={
                                            (errors.calFormula &&
                                                touched.calFormula) as boolean
                                        }
                                        errorMessage={errors.calFormula}
                                    >
                                        <Field
                                            type="text"
                                            autoComplete="off"
                                            name="calFormula"
                                            placeholder="Calculation Formula"
                                            component={Input}
                                        />
                                    </FormItem>

                                    <FormItem
                                        label="Calculation Description"
                                        invalid={
                                            (errors.calDescription &&
                                                touched.calDescription) as boolean
                                        }
                                        errorMessage={errors.calDescription}
                                    >
                                        <Field
                                            type="text"
                                            autoComplete="off"
                                            name="calDescription"
                                            placeholder="Calculation Description"
                                            component={Input}
                                        />
                                    </FormItem>

                                    <div className="grid grid-cols-2 gap-4">
                                        <FormItem
                                            label="Category"
                                            invalid={
                                                (errors.payCategory &&
                                                    touched.payCategory) as boolean
                                            }
                                            errorMessage={errors.payCategory}
                                        >
                                            <Field
                                                type="text"
                                                autoComplete="off"
                                                name="payCategory"
                                                placeholder="Category"
                                                component={Input}
                                            />
                                        </FormItem>
                                        <div className="grid grid-cols-1 gap-4">
                                            <FieldWrapper
                                                name="contributor"
                                                render={({
                                                    field,
                                                    meta,
                                                    helpers,
                                                }) => (
                                                    <FormItem
                                                        label="Contributor"
                                                        invalid={
                                                            !!meta.error &&
                                                            meta.touched
                                                        }
                                                        errorMessage={
                                                            meta.error
                                                        }
                                                    >
                                                        <Select
                                                            name="contributor"
                                                            id="contributor"
                                                            value={field.value}
                                                            onChange={(
                                                                value
                                                            ) => {
                                                                helpers.setValue(
                                                                    value
                                                                )
                                                            }}
                                                            placeholder="Please Select Contributor"
                                                            options={
                                                                contributorOptions
                                                            }
                                                        ></Select>
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
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
                    <Button
                        className="ltr:mr-2 rtl:ml-2"
                        variant="plain"
                        onClick={onClose}
                    >
                        Cancel
                    </Button>
                    {/* <Button variant="solid" onClick={onDialogOk}>
                    Okay
                        </Button> */}
                </div>
            </Dialog>
        </>
    )
}

export default DialogComponent
