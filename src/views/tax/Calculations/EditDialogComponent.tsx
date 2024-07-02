import React, { FC } from 'react'
import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import type { CommonProps, TaxOption } from '@/@types/common'
import useTimeOutMessage from '@/utils/hooks/useTimeOutMessage'
import { TaxCalculationSchema, TaxData } from '@/@types/Calculation'
import { FormContainer, FormItem } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Alert from '@/components/ui/Alert'
import * as Yup from 'yup'
import {
    Field,
    FieldHelperProps,
    FieldInputProps,
    FieldMetaProps,
    Form,
    Formik,
    FormikProps,
    useField,
} from 'formik'

import Checkbox from '@/components/ui/Checkbox'
import useCalculations from '@/utils/hooks/useCalculation'
import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import useCommon from '@/utils/hooks/useCommon'
import Select from '@/components/ui/Select/Select'

interface DialogProps {
    isEditOpen: boolean
    onClose: () => void
    props: FormProps
    item: any
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

interface RenderProps<V = any> {
    field: FieldInputProps<V>
    meta: FieldMetaProps<V>
    helpers: FieldHelperProps<V>
}

const categoryOptions: TaxOption[] = [
    { value: 'IT', label: 'Income Tax' },
    { value: 'LT', label: 'Lump-Sum Tax' },
]

const FieldWrapper: FC<FieldWrapperProps> = ({ name, render }) => {
    const [field, meta, helpers] = useField(name)

    return render({ field, meta, helpers })
}

interface FieldWrapperProps<V = any> {
    name: string
    render: (formikProps: RenderProps<V>) => React.ReactElement
}

const EditDialog: React.FC<DialogProps> = ({
    onClose,
    isEditOpen,
    props,
    item,
}) => {
    const { getUserIDFromLocalStorage } = useCommon()

    const initValues: TaxData = {
        id: item.getValue('id'),
        companyCode: item.getValue('companyCode'),
        range: item.getValue('range'),
        description: item.getValue('description'),
        taxCategory: item.getValue('taxCategory'),
        calFormula: item.getValue('calFormula'),
        status: item.getValue('status'),
        createdBy: item.getValue('createdBy'),
        lastUpdateBy: getUserIDFromLocalStorage(),
        createdDate: item.getValue('createdDate'),
    }

    const validationSchema = Yup.object().shape({
        range: Yup.string().required('Please enter Calculation Sequence'),
        calFormula: Yup.string().required('Please enter Calculation Formula'),
    })

    const selectedCategory = item.getValue('taxCategory')

    const foundItem = categoryOptions.find(
        (option) => option.value === selectedCategory
    )

    const { disableSubmit = false, className } = props
    const [message, setMessage] = useTimeOutMessage()

    const { updateTaxCalculations } = useCalculations()

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

    const onSubmit = async (
        values: TaxData,
        setSubmitting: (isSubmitting: boolean) => void
    ) => {
        const {
            id,
            companyCode,
            range,
            description,
            taxCategory,
            calFormula,
            status,
            lastUpdateBy,
            createdBy,
        } = values
        setSubmitting(true)

        const result = await updateTaxCalculations({
            id,
            companyCode,
            range,
            calFormula,
            description,
            taxCategory,
            status,
            lastUpdateBy,
            createdBy,
        })

        if (result?.status === 'failed') {
            setMessage(result.message)
        } else {
            setMessage('Successfully Saved')
            openNotification('success', 'Changes Saved Successfully')
            onClose()
        }

        setSubmitting(false)
    }
    return (
        <>
            <Dialog
                isOpen={isEditOpen}
                onClose={onClose}
                onRequestClose={onClose}
            >
                <h5 className="mb-4">Edit Tax Details</h5>

                <div className={className}>
                    {message && (
                        <Alert showIcon className="mb-4" type="danger">
                            <>{message}</>
                        </Alert>
                    )}
                    <Formik<TaxData>
                        initialValues={initValues}
                        validationSchema={validationSchema}
                        onSubmit={(values, { setSubmitting }) => {
                            if (!disableSubmit) {
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
                        }: FormikProps<TaxData>) => (
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
                                                    <Field
                                                        disabled
                                                        type="text"
                                                        autoComplete="off"
                                                        name="companyCode"
                                                        placeholder="Company Code"
                                                        component={Input}
                                                    />
                                                </FormItem>
                                            )}
                                        />

                                        <div className="grid grid-cols-1 gap-4">
                                            <FormItem
                                                label="Range"
                                                invalid={
                                                    (errors.range &&
                                                        touched.range) as boolean
                                                }
                                                errorMessage={errors.range}
                                            >
                                                <Field
                                                    type="text"
                                                    autoComplete="off"
                                                    name="range"
                                                    placeholder="Range"
                                                    component={Input}
                                                />
                                            </FormItem>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="grid grid-cols-1 gap-4">
                                            <FieldWrapper
                                                name="taxCategory"
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
                                                            name="taxCategory"
                                                            id="taxCategory"
                                                            defaultValue={
                                                                foundItem
                                                            }
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
                                            (errors.description &&
                                                touched.description) as boolean
                                        }
                                        errorMessage={errors.description}
                                    >
                                        <Field
                                            type="text"
                                            autoComplete="off"
                                            name="description"
                                            placeholder="Calculation Description"
                                            component={Input}
                                        />
                                    </FormItem>

                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="grid grid-cols-1 gap-4">
                                            <Field
                                                className="mb-0 mx-5"
                                                name="status"
                                                component={Checkbox}
                                            >
                                                Status
                                            </Field>
                                        </div>
                                        <div className="grid grid-cols-1 gap-4"></div>
                                        <div className="grid grid-cols-1 gap-4"></div>
                                    </div>

                                    <div className="text-right mt-4"></div>

                                    <div className="grid grid-cols-1 gap-4">
                                        <Button
                                            block
                                            loading={isSubmitting}
                                            variant="solid"
                                            type="submit"
                                        >
                                            {isSubmitting
                                                ? 'Saving...'
                                                : 'Edit Changes'}
                                        </Button>
                                    </div>
                                </FormContainer>
                            </Form>
                        )}
                    </Formik>
                </div>
            </Dialog>
        </>
    )
}

export default EditDialog
