import { useState, useEffect } from 'react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Dialog from '@/components/ui/Dialog'
import type { MouseEvent } from 'react'
import Card from '@/components/ui/Card'
import Table from '@/components/ui/Table'
import { Field, Form, Formik } from 'formik'
import * as Yup from 'yup'
import useTimeOutMessage from '@/utils/hooks/useTimeOutMessage'
import Alert from '@/components/ui/Alert'
import { FormItem, FormContainer } from '@/components/ui/Form'
import type { CommonProps } from '@/@types/common'
import useCalculations from '@/utils/hooks/useCalculation'
import Select from '@/components/ui/Select'

interface FormProps extends CommonProps {
    disableSubmit?: boolean
}

const contributorOptions = [
    { value: 'E', label: 'Employee' },
    { value: 'C', label: 'Company' },
]

const companyOptions = [
    { value: 2000, label: '2000' },
    { value: 3000, label: '3000' },
]

type CalculationSchema = {
    companyCode: number
    sequence: number
    payCode: string
    calCode: string
    calFormula: string
    calDescription: string
    payCategory: string
    contributor: string
    status?: boolean
    createdBy?: string
}

const validationSchema = Yup.object().shape({
    companyCode: Yup.object()
        .shape({ value: Yup.string(), label: Yup.string() })
        .required('Please enter Company Code'),
    sequence: Yup.string().required('Please enter Calculation Sequence'),
    payCode: Yup.string().required('Please enter correct EPF'),
    calCode: Yup.string().required('Please enter Cost Center'),
    calFormula: Yup.string().required('Please enter Calculation Formula'),
    payCategory: Yup.string().required('Please enter Calculation Type'),
    contributor: Yup.string().required('Please enter Contributor'),
})

const { Tr, Th, Td, THead, TBody } = Table

const EmpSplTaxView = (props: FormProps) => {
    const [message, setMessage] = useTimeOutMessage()

    const { disableSubmit = false, className } = props

    const { getCalculations } = useCalculations()

    const [data, setData] = useState([])

    useEffect(() => {
        const result = getCalculations()
        result.then((res) => {
            const listItems = JSON.parse(res?.data?.data ?? '').map(
                (item: any) => (
                    <Tr key={item.id}>
                        <Td>{item.companyCode}</Td>
                        <Td>{item.sequence}</Td>
                        <Td>{item.payCode}</Td>
                        <Td>{item.calCode}</Td>
                        <Td>{item.calFormula}</Td>
                        <Td>{item.calDescription}</Td>
                        <Td>{item.payCategory}</Td>
                        <Td>{item.contributor}</Td>
                        <Td key={item.id}>Edit</Td>
                    </Tr>
                )
            )

            setData(listItems)
        })
    }, [])

    const onSignIn = async (
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

        //    const result = await getCalculations()

        //     if (result?.status === 'failed') {
        //      setMessage(result.message)
        //   }
        //    setMessage('Successfully Saved')
        //    setSubmitting(false)
        //    setIsOpen(false)
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

    const headerExtraContent = (
        <span className="flex items-center">
            <span className="mr-1 font-semibold">
                <Button variant="solid" onClick={() => openDialog()}>
                    Add
                </Button>
            </span>
            <span className="text-emerald-500 text-xl"></span>
        </span>
    )

    return (
        <div>
            <Card header="Calculations" headerExtra={headerExtraContent}>
                <Table>
                    <THead>
                        <Tr>
                            <Th>Company</Th>
                            <Th>Sequence</Th>
                            <Th>Pay Code</Th>
                            <Th>Cal Code</Th>
                            <Th>Formula</Th>
                            <Th>Description</Th>
                            <Th>Category</Th>
                            <Th>Contributor</Th>
                            <Th></Th>
                        </Tr>
                    </THead>
                    <TBody>{data}</TBody>
                </Table>
            </Card>

            <Dialog
                isOpen={dialogIsOpen}
                onClose={onDialogClose}
                onRequestClose={onDialogClose}
            >
                <h5 className="mb-4">Add Calculations</h5>

                <div className={className}>
                    {message && (
                        <Alert showIcon className="mb-4" type="danger">
                            <>{message}</>
                        </Alert>
                    )}
                    <Formik
                        initialValues={{
                            companyCode: 3000,
                            sequence: 0,
                            payCode: '',
                            calCode: '',
                            calFormula: '',
                            calDescription: '',
                            payCategory: '',
                            contributor: '',
                            status: true,
                            createdBy: '3021ITFI',
                        }}
                        validationSchema={validationSchema}
                        onSubmit={(values, { setSubmitting }) => {
                            if (!disableSubmit) {
                                console.log(values)
                                onSignIn(values, setSubmitting)
                            } else {
                                setSubmitting(false)
                            }
                        }}
                    >
                        {({ touched, errors, isSubmitting }) => (
                            <Form>
                                <FormContainer>
                                    <div className="grid grid-cols-2 gap-4">
                                        <FormItem
                                            label="Company Code"
                                            invalid={
                                                (errors.companyCode &&
                                                    touched.companyCode) as boolean
                                            }
                                            errorMessage={errors.companyCode}
                                        >
                                            <Select
                                                name="companyCode"
                                                placeholder="Please Select"
                                                options={companyOptions}
                                            ></Select>
                                        </FormItem>

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
                                            <FormItem
                                                label="Contributor"
                                                invalid={
                                                    (errors.contributor &&
                                                        touched.contributor) as boolean
                                                }
                                                errorMessage={
                                                    errors.contributor
                                                }
                                            >
                                                <Select
                                                    name="contributor"
                                                    placeholder="Please Select Contributor"
                                                    options={contributorOptions}
                                                ></Select>
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
                        onClick={onDialogClose}
                    >
                        Cancel
                    </Button>
                    {/* <Button variant="solid" onClick={onDialogOk}>
                        Okay
                            </Button> */}
                </div>
            </Dialog>
        </div>
    )
}

export default EmpSplTaxView
