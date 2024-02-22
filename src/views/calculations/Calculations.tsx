import { useState, useEffect } from 'react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Dialog from '@/components/ui/Dialog'
import type { MouseEvent } from 'react'
import Card from '@/components/ui/Card'
import Table from '@/components/ui/Table'
import { EmployeeSpecialTax } from '@/@types/empspecialrates'
import { Field, Form, Formik } from 'formik'
import * as Yup from 'yup'
import useTimeOutMessage from '@/utils/hooks/useTimeOutMessage'
import Alert from '@/components/ui/Alert'
import { FormItem, FormContainer } from '@/components/ui/Form'
import type { CommonProps } from '@/@types/common'
import useCalculations from '@/utils/hooks/useCalculation'

interface FormProps extends CommonProps {
    disableSubmit?: boolean
}

type EmpSPLTaxSchema = {
    companyCode: number
    payCode: string
    calCode: string
    calFormula: string
    status?: boolean
    createdBy?: string
}

const validationSchema = Yup.object().shape({
    companyCode: Yup.string().required('Please enter Company Code'),
    payCode: Yup.string().required('Please enter correct EPF'),
    calCode: Yup.string().required('Please enter Cost Center'),
    calFormula: Yup.string().required('Please enter Calculation Formula'),
})

const defaultData: EmployeeSpecialTax[] = [
    {
        id: 1,
        companyCode: 3000,
        epf: '117532',
        costcenter: 'C10110',
    },
    {
        id: 2,
        companyCode: 2000,
        epf: '117533',
        costcenter: 'C10110',
    },
    {
        id: 3,
        companyCode: 3000,
        epf: '117531',
        costcenter: 'C10110',
    },
]

const { Tr, Th, Td, THead, TBody } = Table

/*
const listItems = defaultData.map((EmployeeSpecialTax) => (
    <Tr key={EmployeeSpecialTax.id}>
        <Td>{EmployeeSpecialTax.companyCode}</Td>
        <Td>{EmployeeSpecialTax.epf}</Td>
        <Td>{EmployeeSpecialTax.costcenter}</Td>
        <Td key={EmployeeSpecialTax.id}>Edit</Td>
    </Tr>
))
*/
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
                        <Td>{item.Sequence}</Td>
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
        values: EmpSPLTaxSchema,
        setSubmitting: (isSubmitting: boolean) => void
    ) => {
        const { companyCode, payCode, calCode, calFormula, status, createdBy } =
            values
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
                            payCode: '',
                            calCode: '',
                            calFormula: '',
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
                                    <FormItem
                                        label="Company Code"
                                        invalid={
                                            (errors.companyCode &&
                                                touched.companyCode) as boolean
                                        }
                                        errorMessage={errors.companyCode}
                                    >
                                        <Field
                                            type="text"
                                            autoComplete="off"
                                            name="companyCode"
                                            placeholder="Company Code"
                                            component={Input}
                                        />
                                    </FormItem>
                                    <FormItem
                                        label="EPF"
                                        invalid={
                                            (errors.payCode &&
                                                touched.payCode) as boolean
                                        }
                                        errorMessage={errors.payCode}
                                    >
                                        <Field
                                            type="text"
                                            autoComplete="off"
                                            name="epf"
                                            placeholder="EPF"
                                            component={Input}
                                        />
                                    </FormItem>
                                    <FormItem
                                        label="Cost Center"
                                        invalid={
                                            (errors.calCode &&
                                                touched.calCode) as boolean
                                        }
                                        errorMessage={errors.calCode}
                                    >
                                        <Field
                                            type="text"
                                            autoComplete="off"
                                            name="costcenter"
                                            placeholder="Cost Center"
                                            component={Input}
                                        />
                                    </FormItem>
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
                                    <div className="text-right mt-6"></div>
                                    <Button
                                        block
                                        loading={isSubmitting}
                                        variant="solid"
                                        type="submit"
                                    >
                                        {isSubmitting
                                            ? 'Saving...'
                                            : 'Add Special Tax'}
                                    </Button>
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
