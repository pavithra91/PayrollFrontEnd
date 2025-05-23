import React, { FC } from 'react'
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
import type { PayCodeSchema } from '@/@types/paycode'
import { FormContainer, FormItem } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Alert from '@/components/ui/Alert'
import * as Yup from 'yup'
import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import usePayCodes from '@/utils/hooks/usePayCodes'
import Checkbox from '@/components/ui/Checkbox'
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

const taxationTypeOptions: TaxOption[] = [
    { value: 'IT', label: 'Income Tax' },
    { value: 'LT', label: 'Lump Sum Tax' },
    { value: 'NA', label: 'None' },
]

const categoryOptions: SelectOption[] = [
    { value: 0, label: 'Earning' },
    { value: 1, label: 'Deduction' },
]

const FieldWrapper: FC<FieldWrapperProps> = ({ name, render }) => {
    const [field, meta, helpers] = useField(name)

    return render({ field, meta, helpers })
}

const { getUserIDFromLocalStorage } = useCommon()

const EditDialog: React.FC<DialogProps> = ({
    onClose,
    isEditOpen,
    props,
    item,
}) => {
    const initValues: PayCodeSchema = {
        id: item.getValue('id'),
        companyCode: item.getValue('companyCode'), // This will be the default one
        payCode: item.getValue('payCode'),
        calCode: item.getValue('calCode'),
        description: item.getValue('description'),
        payCategory: item.getValue('payCategory'),
        rate: item.getValue('rate'),
        createdBy: item.getValue('createdBy'),
        taxationType: item.getValue('taxationType'),
        lastUpdateBy: getUserIDFromLocalStorage(),
    }

    const validationSchema = Yup.object().shape({
        payCode: Yup.string().required('Please enter Pay Code'),
        calCode: Yup.string().required('Please enter Calculation Code'),
        rate: Yup.string().required('Please enter Rate'),
    })

    const selectedTaxationType = item.getValue('taxationType')
    const selectedCategory = item.getValue('payCategory')

    const TaxationTypeItem = taxationTypeOptions.find(
        (option) => option.value === selectedTaxationType
    )
    const CategoryItem = categoryOptions.find(
        (option) => option.value === parseInt(selectedCategory)
    )

    const { disableSubmit = false, className } = props
    const [message, setMessage] = useTimeOutMessage()

    const { updatePayCodes } = usePayCodes()

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
        values: PayCodeSchema,
        setSubmitting: (isSubmitting: boolean) => void
    ) => {
        const {
            id,
            companyCode,
            payCode,
            calCode,
            description,
            payCategory,
            rate,
            createdBy,
            taxationType,
            lastUpdateBy,
        } = values
        setSubmitting(true)

        const result = await updatePayCodes({
            id,
            companyCode,
            payCode,
            calCode,
            description,
            payCategory,
            rate,
            createdBy,
            taxationType,
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
            openNotification('success', 'Pay Code Saved Successfully')
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
                <h5 className="mb-4">Edit Pay Code Mapping</h5>

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
                                const selectedTaxationType = values.taxationType
                                values.taxationType = selectedTaxationType

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
                        }: FormikProps<PayCodeSchema>) => (
                            <Form>
                                <FormContainer>
                                    <div className="grid grid-cols-2 gap-4">
                                        <FieldWrapper
                                            name="companyCode"
                                            render={({ meta }) => (
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
                                                        value={item.getValue(
                                                            'companyCode'
                                                        )}
                                                    />
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
                                                            defaultValue={
                                                                CategoryItem
                                                            }
                                                            onChange={(
                                                                value
                                                            ) => {
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
                                                disabled
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

                                    <div className="grid grid-cols-2 gap-4">
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
                                                defaultValue={item.getValue(
                                                    'rate'
                                                )}
                                            />
                                        </FormItem>
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
                                                            defaultValue={
                                                                TaxationTypeItem
                                                            }
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
                                            defaultValue={item.getValue(
                                                'description'
                                            )}
                                        />
                                    </FormItem>

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
                                                : 'Edit Mapping'}
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
