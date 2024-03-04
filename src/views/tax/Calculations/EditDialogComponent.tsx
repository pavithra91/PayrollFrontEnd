import React from 'react'
import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import type { CommonProps } from '@/@types/common'
import useTimeOutMessage from '@/utils/hooks/useTimeOutMessage'
import { Field, Form, Formik, FormikProps } from 'formik'
import { TaxCalculationSchema } from '@/@types/Calculation'
import { FormContainer, FormItem } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Alert from '@/components/ui/Alert'
import * as Yup from 'yup'

interface DialogProps {
    isEditOpen: boolean
    onClose: () => void
    props: FormProps
    item: any
}

interface FormProps extends CommonProps {
    disableSubmit?: boolean
}
const EditDialog: React.FC<DialogProps> = ({
    onClose,
    isEditOpen,
    props,
    item,
}) => {
    const initValues: TaxCalculationSchema = {
        range: item.range, // This will be the default one
        calFormula: item.calFormula,
        description: item.description,
        status: item.status,
        createdBy: item.createdBy,
    }

    const validationSchema = Yup.object().shape({
        range: Yup.string().required('Please enter Calculation Sequence'),
        calFormula: Yup.string().required('Please enter Calculation Formula'),
    })

    const { disableSubmit = false, className } = props
    const [message, setMessage] = useTimeOutMessage()

    const onSubmit = async (
        values: TaxCalculationSchema,
        setSubmitting: (isSubmitting: boolean) => void
    ) => {
        const { range, status, createdBy } = values
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
                    <Formik<TaxCalculationSchema>
                        initialValues={initValues}
                        validationSchema={validationSchema}
                        onSubmit={(values, { setSubmitting }) => {
                            if (!disableSubmit) {
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
                        }: FormikProps<TaxCalculationSchema>) => (
                            <Form>
                                <FormContainer>
                                    <div className="grid grid-cols-2 gap-4">
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
