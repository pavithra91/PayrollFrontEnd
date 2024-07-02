import React, { FC, useState } from 'react'
import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import type { CommonProps, SelectOption } from '@/@types/common'
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

const contributorOptions: ContributorSelectOption[] = [
    { value: 'E', label: 'Employee' },
    { value: 'C', label: 'Company' },
]

const categoryOptions: SelectOption[] = [
    { value: 0, label: 'Earning' },
    { value: 1, label: 'Deduction' },
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

    const initValues: CalculationSchema = {
        id: item.getValue('id'),
        companyCode: item.getValue('companyCode'), // This will be the default one
        sequence: item.getValue('sequence'),
        payCode: item.getValue('payCode'),
        calCode: item.getValue('calCode'),
        calFormula: item.getValue('calFormula'),
        calDescription: item.getValue('calDescription') ?? '',
        payCategory: item.getValue('payCategory'),
        contributor: item.getValue('contributor'),
        status: item.getValue('status'),
        createdBy: item.getValue('createdBy'),
        lastUpdateBy: getUserIDFromLocalStorage(),
    }

    const validationSchema = Yup.object().shape({
        sequence: Yup.string().required('Please enter Calculation Sequence'),
        payCode: Yup.string().required('Please enter Pay Code'),
        calCode: Yup.string().required('Please enter Calculation Code'),
        calFormula: Yup.string().required('Please enter Calculation Formula'),
    })

    const selectedContributor = Array.from(
        Object.values(item.getValue('contributor'))
    )
    const foundItem = contributorOptions.find(
        (option) => option.value === selectedContributor[0]
    )

    const selectedCategory = item.getValue('payCategory')

    const CategoryItem = categoryOptions.find(
        (option) => option.value === parseInt(selectedCategory)
    )

    const { disableSubmit = false, className } = props
    const [message, setMessage] = useTimeOutMessage()

    const { updateCalculations, deleteCalculations } = useCalculations()

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
        values: CalculationSchema,
        setSubmitting: (isSubmitting: boolean) => void
    ) => {
        const {
            id,
            companyCode,
            sequence,
            payCode,
            calCode,
            calFormula,
            calDescription,
            payCategory,
            contributor,
            status,
            lastUpdateBy,
        } = values
        setSubmitting(true)

        if (status) {
            const result = await updateCalculations({
                id,
                companyCode,
                sequence,
                payCode,
                calCode,
                calFormula,
                calDescription,
                payCategory,
                contributor,
                status,
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
                openNotification('success', 'Calculation Updated Successfully')
                onClose()
            }

            setSubmitting(false)
        } else {
            const result = await deleteCalculations({
                id,
                companyCode,
                sequence,
                payCode,
                calCode,
                calFormula,
                calDescription,
                payCategory,
                contributor,
                status,
                lastUpdateBy,
            })

            if (result?.status === 'failed') {
                setMessage(result.message)
                openNotification(
                    'danger',
                    'Error Occurred While Deleting Data : ' + result.message
                )
            } else {
                setMessage('Successfully Saved')
                openNotification('success', 'Calculation Deleted Successfully')
                onClose()
            }

            setSubmitting(false)
        }
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
                    <Formik<CalculationSchema>
                        initialValues={initValues}
                        validationSchema={validationSchema}
                        onSubmit={(values, { setSubmitting }) => {
                            if (!disableSubmit) {
                                console.log(values)
                                const selectedContributor = Array.from(
                                    Object.values(values.contributor)
                                )

                                values.contributor = selectedContributor[0]

                                const selectedCategoryType = Array.from(
                                    Object.values(values.payCategory)
                                )
                                values.payCategory =
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
                                                    defaultValue={item.getValue(
                                                        'sequence'
                                                    )}
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
                                                defaultValue={item.getValue(
                                                    'payCode'
                                                )}
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
                                                    defaultValue={item.getValue(
                                                        'calCode'
                                                    )}
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
                                            defaultValue={item.getValue(
                                                'calFormula'
                                            )}
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
                                            defaultValue={item.getValue(
                                                'calDescription'
                                            )}
                                        />
                                    </FormItem>

                                    <div className="grid grid-cols-2 gap-4">
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
                                                    errorMessage={meta.error}
                                                >
                                                    <Select
                                                        name="payCategory"
                                                        id="payCategory"
                                                        defaultValue={
                                                            CategoryItem
                                                        }
                                                        onChange={(value) => {
                                                            helpers.setValue(
                                                                value
                                                            )
                                                        }}
                                                        placeholder="Category"
                                                        options={
                                                            categoryOptions
                                                        }
                                                    ></Select>
                                                </FormItem>
                                            )}
                                        />
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

                                    <div className="grid grid-cols-1 gap-4">
                                        <Field
                                            className="mb-0"
                                            name="status"
                                            component={Checkbox}
                                        >
                                            Active
                                        </Field>
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
