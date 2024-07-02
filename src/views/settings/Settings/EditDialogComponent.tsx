import React, { FC, useState } from 'react'
import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import type { CommonProps, SelectOption, TaxOption } from '@/@types/common'
import useTimeOutMessage from '@/utils/hooks/useTimeOutMessage'
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
import {
    CalculationSchema,
    ContributorSelectOption,
} from '@/@types/Calculation'
import { FormContainer, FormItem } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Alert from '@/components/ui/Alert'
import Select from '@/components/ui/Select'
import * as Yup from 'yup'
import Checkbox from '@/components/ui/Checkbox'
import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import useCalculations from '@/utils/hooks/useCalculation'
import { escape } from 'lodash'
import useCommon from '@/utils/hooks/useCommon'
import useSettings from '@/utils/hooks/useSettings'
import { SystemVariableSchema } from '@/@types/System'

interface DialogProps {
    isEditOpen: boolean
    onClose: () => void
    props: FormProps
    item: any
}

const companyOptions: SelectOption[] = [
    { value: 2000, label: '2000' },
    { value: 3000, label: '3000' },
]

const categoryOptions: TaxOption[] = [
    { value: 'System_Variable', label: 'System Variable' },
    { value: 'Calculation_Variable', label: 'Calculation Variable' },
]

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
const FieldWrapper: FC<FieldWrapperProps> = ({ name, render }) => {
    const [field, meta, helpers] = useField(name)

    return render({ field, meta, helpers })
}

const EditDialog: React.FC<DialogProps> = ({
    onClose,
    isEditOpen,
    props,
    item,
}) => {
    const { getUserIDFromLocalStorage } = useCommon()

    const initValues: SystemVariableSchema = {
        id: item.getValue('id'),
        companyCode: item.getValue('companyCode'), // This will be the default one
        category_name: item.getValue('category_name'),
        variable_name: item.getValue('variable_name'),
        variable_value: item.getValue('variable_value'),
        lastUpdateBy: getUserIDFromLocalStorage(),
    }

    const validationSchema = Yup.object().shape({
        category_name: Yup.object().required('Please enter Pay Code'),
        variable_name: Yup.string().required('Please enter Calculation Code'),
        variable_value: Yup.string().required(
            'Please enter Calculation Formula'
        ),
    })

    const selectedCategory = item.getValue('category_name')

    const CategoryItem = categoryOptions.find(
        (option) => option.value === selectedCategory
    )

    const { disableSubmit = false, className } = props
    const [message, setMessage] = useTimeOutMessage()

    const { updateSystemVariable } = useSettings()

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
        values: SystemVariableSchema,
        setSubmitting: (isSubmitting: boolean) => void
    ) => {
        const {
            id,
            companyCode,
            category_name,
            variable_name,
            variable_value,
            lastUpdateBy,
        } = values
        setSubmitting(true)

        //     if (status) {
        const result = await updateSystemVariable({
            id,
            companyCode,
            category_name,
            variable_name,
            variable_value,
            lastUpdateBy,
        })

        if (result?.status === 'failed') {
            setMessage(result.message)
            openNotification(
                'danger',
                'Error Occurred While Updating Data : ' + result.message
            )
        } else {
            setMessage('Successfully Saved')
            openNotification('success', 'System Variable Updated Successfully')
            onClose()
        }

        setSubmitting(false)
        // } else {
        // const result = await deleteCalculations({
        //     id,
        //     companyCode,
        //     sequence,
        //     payCode,
        //     calCode,
        //     calFormula,
        //     calDescription,
        //     payCategory,
        //     contributor,
        //     status,
        //     lastUpdateBy,
        // })
        // if (result?.status === 'failed') {
        //     setMessage(result.message)
        //     openNotification(
        //         'danger',
        //         'Error Occurred While Deleting Data : ' + result.message
        //     )
        // } else {
        //     setMessage('Successfully Saved')
        //     openNotification('success', 'Calculation Deleted Successfully')
        //     onClose()
        // }
        // setSubmitting(false)
        // }
    }
    return (
        <>
            <Dialog
                isOpen={isEditOpen}
                onClose={onClose}
                onRequestClose={onClose}
            >
                <h5 className="mb-4">Edit Calculations {item.calCode}</h5>

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
                                const selectedCategoryType = Array.from(
                                    Object.values(values.category_name)
                                )
                                values.category_name =
                                    selectedCategoryType[0].toString()

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
                                            <FieldWrapper
                                                name="category_name"
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
                                                : 'Edit Calculation'}
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
