import type { CommonProps, SelectOption } from '@/@types/common'
import { FC, useEffect, useState } from 'react'
import {
    FieldHelperProps,
    FieldInputProps,
    FieldMetaProps,
    useField,
} from 'formik'
import usePayrun from '@/utils/hooks/usePayrun'
import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import { PayrollDataSchema } from '@/@types/payroll'
import Button from '@/components/ui/Button'
import { Formik, Field, Form } from 'formik'
import { FormItem, FormContainer } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Card from '@/components/ui/Card'
import Select from '@/components/ui/Select'
import jsPDF from 'jspdf'
import useCommon from '@/utils/hooks/useCommon'

type payData = {
    empData: string
    salData: string
    earningData: string
    deductionData: string
}

type FormLayout = 'inline'

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

const FieldWrapper: FC<FieldWrapperProps> = ({ name, render }) => {
    const [field, meta, helpers] = useField(name)

    return render({ field, meta, helpers })
}

const companyOptions: SelectOption[] = [
    { value: 2000, label: '2000' },
    { value: 3000, label: '3000' },
]

const PaysheetView = (props: FormProps) => {
    const { printPaysheets } = usePayrun()
    const { formatDate } = useCommon()

    const [payrollData, setPayrollData] = useState<payData[]>([])
    const [isDataAvailable, setIsDataAvailable] = useState(false)

    const [isSubmitting, setisSubmitting] = useState(false)
    const [dataFromChild, setDataFromChild] =
        useState<PayrollDataSchema | null>(null)
    const [layout, setLayout] = useState<FormLayout>('inline')

    const onSubmit = async (values: PayrollDataSchema) => {
        const { companyCode, period } = values

        if (values != null) {
            setDataFromChild(values)
        }
    }

    useEffect(() => {
        if (dataFromChild != null) {
            const payRunResults = printPaysheets(dataFromChild)
            payRunResults.then((res) => {
                const listItems = JSON.parse(res?.data?.data ?? '')
                console.log(listItems)
                if (listItems.length > 0) {
                    setPayrollData(listItems)
                    setIsDataAvailable(true)
                } else {
                    openNotification('danger', 'No Data Available')
                }
            })
        }
    }, [dataFromChild])

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

    const printReport = () => {
        if (payrollData != null) {
            const doc = new jsPDF('p', 'mm', [330, 305])

            doc.addFont('courier', 'Arial', 'helvetica', 'normal')

            doc.setFont('courier')

            doc.setFontSize(12)
            let PaySheetCount = 0

            payrollData.forEach((element) => {
                console.log('test')
                let emp = JSON.parse(element.empData)
                let earnings = JSON.parse(element.earningData)
                let deductions = JSON.parse(element.deductionData)
                let summary = JSON.parse(element.salData)
                PaySheetCount += 1

                let period = formatDate(dataFromChild?.period + '')

                doc.text(PaySheetCount.toString().padStart(4, '0'), 150, 50, {
                    align: 'left',
                })
                doc.text(emp[0].epf.toString(), 175, 50, { align: 'left' })
                doc.text(period ? period : '', 190, 50, {
                    align: 'left',
                })
                doc.text(emp[0].empName.toString(), 217, 50, { align: 'left' })
                doc.text(emp[0].empGrade.toString(), 308, 50, { align: 'left' })

                let x = 197
                let y = 73
                earnings.forEach(
                    (element: {
                        payCode: { toString: () => string | string[] }
                        amount: {
                            toFixed: (arg0: number) => {
                                (): any
                                new (): any
                                toString: { (): string | string[]; new (): any }
                            }
                        }
                    }) => {
                        doc.text(element.payCode.toString(), x, y, {
                            align: 'left',
                        })
                        doc.text(element.amount.toFixed(2).toString(), 232, y, {
                            align: 'right',
                        })
                        y = y + 5

                        if (y > 255) {
                            doc.addPage()
                            y = 73
                        }
                    }
                )

                let z = 180
                y = y + 5

                doc.text('GROSS PAY', z, y, { align: 'left' })
                doc.text(summary[0].taxableGross.toFixed(2), 232, y, {
                    align: 'right',
                })

                y = y + 6

                if (y > 255) {
                    doc.addPage()
                    y = 73
                }

                deductions.forEach(
                    (element: {
                        payCode: { toString: () => string | string[] }
                        balanceAmount: number
                        amount: number
                    }) => {
                        if (element.balanceAmount > 0) {
                            doc.text(
                                element.balanceAmount.toFixed(2).toString(),
                                182,
                                y,
                                {
                                    align: 'right',
                                }
                            )

                            doc.text(
                                (element.balanceAmount - element.amount)
                                    .toFixed(2)
                                    .toString(),
                                262,
                                y,
                                {
                                    align: 'right',
                                }
                            )
                        }

                        doc.text(element.payCode.toString(), x, y, {
                            align: 'left',
                        })
                        doc.text(element.amount.toFixed(2).toString(), 232, y, {
                            align: 'right',
                        })
                        y = y + 5

                        if (y > 255) {
                            doc.addPage()
                            y = 73
                        }
                    }
                )

                y = y + 5

                doc.text('DEDUCTIONS', z, y, { align: 'left' })

                doc.text(summary[0].deductionGross.toFixed(2), 232, y, {
                    align: 'right',
                })

                y = 289
                z = 247

                doc.text(summary[0].netAmount.toFixed(2), 217, y, {
                    align: 'left',
                })

                let tottalContribution =
                    parseFloat(summary[0].comp_contribution) +
                    parseFloat(summary[0].emp_contribution)
                doc.text(summary[0].comp_contribution.toFixed(2), z, y, {
                    align: 'left',
                })

                z = 273

                doc.text(tottalContribution.toFixed(2), z, y, { align: 'left' })
                doc.addPage()
            })

            doc.save('output.pdf')
        }
    }

    return (
        <>
            <Card header="Paysheet Print">
                <div className="grid grid-cols-6 gap-4">
                    <div className="col-span-4 ...">
                        <Formik
                            initialValues={{
                                companyCode: 3000,
                                period: 202312,
                            }}
                            onSubmit={(values) => {
                                //    if (!disableSubmit) {
                                const selectedCompanyCode = Array.from(
                                    Object.values(values.companyCode)
                                )

                                values.companyCode = selectedCompanyCode[0]

                                console.log(values)
                                onSubmit(values)
                                //  }
                            }}
                        >
                            <Form>
                                <FormContainer layout={layout}>
                                    <div className="grid grid-cols-1 gap-4">
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
                                    </div>
                                    <FormItem label="Period">
                                        <Field
                                            type="text"
                                            name="period"
                                            placeholder="Please enter Period"
                                            component={Input}
                                        />
                                    </FormItem>
                                    <FormItem>
                                        <Button type="submit">Load</Button>
                                    </FormItem>
                                </FormContainer>
                            </Form>
                        </Formik>
                    </div>

                    <div className="col-span-1..."></div>

                    <div className="col-span-1...">
                        <span className="mr-1 font-semibold">
                            <Button
                                variant="solid"
                                color="blue-600"
                                onClick={printReport}
                                loading={isSubmitting}
                            >
                                {isSubmitting ? 'Processing...' : 'Print'}
                            </Button>
                        </span>
                    </div>
                </div>
            </Card>
        </>
    )
}

export default PaysheetView
