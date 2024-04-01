import type { CommonProps } from '@/@types/common'
// import type { payData } from '@/@types/paysheet'
import { FC, useEffect, useState } from 'react'
import {
    FieldHelperProps,
    FieldInputProps,
    FieldMetaProps,
    useField,
} from 'formik'
import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import { PaysheetDataSchema } from '@/@types/payroll'
import usePayrun from '@/utils/hooks/usePayrun'
import Button from '@/components/ui/Button'
import { Formik, Field, Form } from 'formik'
import { FormItem, FormContainer } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Card from '@/components/ui/Card'
import jsPDF from 'jspdf'
import autoTable, { RowInput } from 'jspdf-autotable'

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

type empData = {
    epf: number
    empName: string
    companyCode: number
    location: number
    costCenter: string
    empGrade: string
    gradeCode: number
}

type salData = {
    epfGross: number
    taxableGross: number
    tax: number
    emp_contribution: number
    comp_contribution: number
    etf: number
}

type earningData = {
    name: string
    payCode: number
    amount: number
    calCode: string
}

type payData = {
    empData: empData
    salData: salData
    earningData: earningData
    deductionData: number
}

const PaysheetView = (props: FormProps) => {
    const { getPaysheetByEPF } = usePayrun()

    const [payrollData, setPayrollData] = useState<payData[]>([])

    const [isSubmitting, setisSubmitting] = useState(false)
    const [dataFromChild, setDataFromChild] =
        useState<PaysheetDataSchema | null>(null)
    const [layout, setLayout] = useState<FormLayout>('inline')

    const onSubmit = async (values: PaysheetDataSchema) => {
        const { epf, period } = values

        if (values != null) {
            setDataFromChild(values)
        }
    }

    useEffect(() => {
        if (dataFromChild != null) {
            const payRunResults = getPaysheetByEPF(dataFromChild)
            payRunResults.then((res) => {
                const listItems = JSON.parse(res?.data?.data ?? '')
                if (listItems.length > 0) {
                    console.log(listItems[0].earningData)
                    setPayrollData(listItems[0])
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
            const doc = new jsPDF()
            doc.text('Employee Paysheet', 100, 10, { align: 'center' })

            let emp = JSON.parse(payrollData.empData)
            let earnings = JSON.parse(payrollData.earningData)

            // console.log(earnings)

            doc.text(emp[0].epf.toString(), 20, 20, { align: 'center' })
            doc.text(emp[0].empName.toString(), 100, 20, { align: 'center' })
            doc.text(emp[0].empGrade.toString(), 150, 20, { align: 'center' })

            let x = 30
            let y = 50
            earnings.forEach((element) => {
                // console.log(element.payCode)
                doc.text(element.payCode.toString(), x, y, {
                    align: 'center',
                })
                doc.text(element.amount.toString(), x + 80, y, {
                    align: 'center',
                })
                y = y + 10
            })

            // autoTable(doc, {
            //     columnStyles: { europe: { halign: 'center' } },
            //     body: payrollData,
            //     margin: {bottom: 20},
            //     columns: [
            //         { header: 'Location', dataKey: 'location' },
            //         { header: 'EPF', dataKey: 'epf' },
            //         { header: 'Name', dataKey: 'empName' },
            //         { header: 'EPF Employee', dataKey: 'emp_contribution' },
            //         { header: 'EPF Company', dataKey: 'comp_contribution' },
            //         {
            //             header: 'ETF',
            //             dataKey: 'etf',
            //         },
            //         { header: 'TAX', dataKey: 'tax' },
            //     ],
            // })
            // const pageCount = (doc as any).internal.getNumberOfPages()
            // for (let i = 1; i <= pageCount; i++) {
            //     doc.setFontSize(10);
            //     // Go to page i
            //     doc.setPage(i);
            //     var pageSize = doc.internal.pageSize;
            //     var pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
            //     doc.text('Page ' + String(i) + ' of ' + String(pageCount), doc.internal.pageSize.getWidth() / 2, pageHeight - 8, {align: 'center'}); //data.settings.margin.left if you want it on the left
            //   }
            //   doc.setPage(pageCount)
            //   var pageSize = doc.internal.pageSize;
            //   var pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
            //   doc.text('Checked By', (doc.internal.pageSize.getWidth() / 8)+8, pageHeight - 15, { align: 'left' })
            //   doc.text('....................................', doc.internal.pageSize.getWidth() / 8, pageHeight - 20, { align: 'left' })
            //    doc.text('Approved By', doc.internal.pageSize.getWidth()-20, pageHeight - 15, { align: 'right' })
            //    doc.text('....................................', doc.internal.pageSize.getWidth()-12, pageHeight - 20, { align: 'right' })
            doc.save('paysheet.pdf')
        }
    }

    return (
        <>
            <Card header="Paysheet Print By EPF">
                <div className="grid grid-cols-6 gap-4">
                    <div className="col-span-4 ...">
                        <Formik
                            initialValues={{
                                epf: 0,
                                period: 202312,
                            }}
                            onSubmit={(values) => {
                                //    if (!disableSubmit) {

                                onSubmit(values)
                                //  }
                            }}
                        >
                            <Form>
                                <FormContainer layout={layout}>
                                    <div className="grid grid-cols-1 gap-4">
                                        <FormItem label="EPF">
                                            <Field
                                                type="text"
                                                name="epf"
                                                placeholder="Please enter Period"
                                                component={Input}
                                            />
                                        </FormItem>
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
