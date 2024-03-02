import React, { FC, useState } from 'react'
import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import type { CommonProps } from '@/@types/common'
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
    CompanyIdSelectOption,
    ContributorSelectOption,
} from '@/@types/Calculation'
import { FormContainer, FormItem } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Alert from '@/components/ui/Alert'
import Select from '@/components/ui/Select'
import * as Yup from 'yup'

interface DialogProps {
    isEditOpen: boolean
    onClose: () => void
    props: FormProps
    item: any
}

const companyOptions: CompanyIdSelectOption[] = [
    { value: 2000, label: '2000' },
    { value: 3000, label: '3000' },
]

const contributorOptions: ContributorSelectOption[] = [
    { value: 'E', label: 'Employee' },
    { value: 'C', label: 'Company' },
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
    const selectedContributor = Array.from(Object.values(item.contributor))
    const foundItem = contributorOptions.find(
        (option) => option.value === selectedContributor[0]
    )
    console.log(foundItem?.label)

    const initValues: CalculationSchema = {
        companyCode: item.companyCode, // This will be the default one
        sequence: item.sequence,
        payCode: item.payCode,
        calCode: item.calCode,
        calFormula: item.calFormula,
        calDescription: item.calDescription,
        payCategory: item.payCategory,
        contributor: 'test',
        status: item.status,
        createdBy: item.createdBy,
    }

    const validationSchema = Yup.object().shape({
        sequence: Yup.string().required('Please enter Calculation Sequence'),
        payCode: Yup.string().required('Please enter Pay Code'),
        calCode: Yup.string().required('Please enter Calculation Code'),
        calFormula: Yup.string().required('Please enter Calculation Formula'),
        payCategory: Yup.string().required('Please enter Calculation Type'),
        contributor: Yup.object().required('Please enter Contributor'),
    })

    const { disableSubmit = false, className } = props
    const [message, setMessage] = useTimeOutMessage()

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

        // const result = await addCalculations({
        //     companyCode,
        //     sequence,
        //     payCode,
        //     calCode,
        //     calFormula,
        //     calDescription,
        //     payCategory,
        //     contributor,
        //     status,
        //     createdBy,
        // })
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
                                const selectedContributor = Array.from(
                                    Object.values(values.contributor)
                                )

                                values.contributor = selectedContributor[0]
                                //   console.log(values)

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
