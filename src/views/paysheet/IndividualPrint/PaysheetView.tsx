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
import jsPDF, { GState } from 'jspdf'
import EmpData from './EmpData'
import useCommon from '@/utils/hooks/useCommon'
import { getSinhalaFont } from '@/assets/fonts'
import AuthorityCheck from '@/components/shared/AuthorityCheck'

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
type payData = {
    empData: string
    salData: string
    earningData: string
    deductionData: string
    unRecoveredData: string
    loanData: string
}

const PaysheetView = (props: FormProps) => {
    const { getPaysheetByEPF, getPaysheetPDF } = usePayrun()
    const { formatDate, getUserFromLocalStorage } = useCommon()

    const [payrollData, setPayrollData] = useState<payData | null>(null)
    const [isDataAvailable, setIsDataAvailable] = useState(false)

    const [isSubmitting, setisSubmitting] = useState(false)
    const [dataFromChild, setDataFromChild] =
        useState<PaysheetDataSchema | null>(null)
    const [layout, setLayout] = useState<FormLayout>('inline')

    const onSubmit = async (values: PaysheetDataSchema) => {
        const { epf, period } = values
        console.log(values)
        if (epf == 0) {
            values.epf = getUserFromLocalStorage().epf
        }

        if (values != null) {
            setDataFromChild(values)
        }
    }

    useEffect(() => {
        if (dataFromChild != null) {
            const payRunResults = getPaysheetByEPF(dataFromChild)

            payRunResults.then((res) => {
                if (res?.status == 'failed') {
                    openNotification(
                        'danger',
                        'Error',
                        'No Employee Data Found'
                    )
                } else {
                    const listItems = JSON.parse(res?.data?.data ?? '')

                    console.log('ListItem ' + listItems)
                    if (listItems[0].empData.length > 2) {
                        setPayrollData(listItems[0])
                        setIsDataAvailable(true)
                    } else {
                        openNotification('danger', 'Error', 'No Data Available')
                    }
                }
            })
        }
    }, [dataFromChild])

    const openNotification = (
        type: 'success' | 'warning' | 'danger' | 'info',
        title: string,
        message: string
    ) => {
        toast.push(
            <Notification
                title={title.charAt(0).toUpperCase() + title.slice(1)}
                type={type}
            >
                {message}
            </Notification>
        )
    }

    const viewPDF = () => {
        console.log(dataFromChild)
        if (dataFromChild != null) {
            const values = {
                companyCode: 3000,
                period: dataFromChild.period,
                approvedBy: dataFromChild.epf.toString(),
            }

            const paysheetURL = getPaysheetPDF(values)

            paysheetURL.then((res) => {
                console.log(res)
                window.open(res?.data?.data, '_blank')
            })
        }
    }

    const printReport = () => {
        if (payrollData != null) {
            const doc = new jsPDF('p', 'mm', [330, 305])

            doc.setFont('Courier', 'Regular')

            doc.setFontSize(14)

            doc.text('Employee Paysheet', 100, 10, { align: 'center' })

            doc.setFontSize(12)

            let emp = JSON.parse(payrollData.empData)
            let earnings = JSON.parse(payrollData.earningData)
            let deductions = JSON.parse(payrollData.deductionData)
            let summary = JSON.parse(payrollData.salData)
            let loandData = JSON.parse(payrollData.loanData)

            doc.text(emp[0].epf.toString(), 175, 50, { align: 'left' })
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
                    y = y + 4
                }
            )

            let z = 180
            y = y + 5

            doc.text('GROSS PAY', z, y, { align: 'left' })
            doc.text(summary[0].taxableGross.toFixed(2), 232, y, {
                align: 'right',
            })

            y = y + 6

            deductions.forEach(
                (element: {
                    payCode: { toString: () => string | string[] }
                    amount: number
                    balanceAmount: number
                }) => {
                    doc.text(element.payCode.toString(), x, y, {
                        align: 'left',
                    })

                    if (element.balanceAmount <= 0) {
                        doc.text(element.amount.toFixed(2).toString(), 232, y, {
                            align: 'right',
                        })
                        y = y + 4
                    } else {
                        doc.text(
                            element.balanceAmount.toFixed(2).toString(),
                            180,
                            y,
                            {
                                align: 'right',
                            }
                        )
                        doc.text(element.amount.toFixed(2).toString(), 232, y, {
                            align: 'right',
                        })

                        doc.text(
                            (element.balanceAmount - element.amount)
                                .toFixed(2)
                                .toString(),
                            252,
                            y,
                            {
                                align: 'right',
                            }
                        )
                        y = y + 4
                    }
                }
            )

            y = y + 5

            doc.text('DEDUCTIONS', z, y, { align: 'left' })

            y = 289
            z = 247
            let tottalContribution =
                parseFloat(summary[0].comp_contribution) +
                parseFloat(summary[0].emp_contribution)
            doc.text(summary[0].comp_contribution.toFixed(2), z, y, {
                align: 'left',
            })

            z = 273

            doc.text(tottalContribution.toFixed(2), z, y, { align: 'left' })

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
            doc.output('dataurlnewwindow')
        }
    }

    function demoUsingTTFFont() {
        const AmiriRegular = getSinhalaFont()
        const doc = new jsPDF({ filters: ['ASCIIHexEncode'] })

        doc.addFileToVFS('FMAbhaya x-normal.ttf', AmiriRegular)
        doc.addFont('FMAbhaya x-normal.ttf', 'FMAbhaya x', 'normal')

        doc.setFont('FMAbhaya x') // set font
        doc.setFontSize(20)

        doc.text(',xld Lksc f;,a f;d. .nvd mrahka;h', 10, 10)

        doc.save('test.pdf')
    }

    const printReportA4 = () => {
        if (payrollData != null) {
            // const doc = new jsPDF('p', 'mm', [297, 210])

            let period = formatDate(dataFromChild?.period + '')

            const doc = new jsPDF({
                orientation: 'p',
                unit: 'mm',
                format: [297, 210],
                // encryption: {
                //     userPassword: 'user',
                //     ownerPassword: 'owner',
                //     userPermissions: ['print', 'modify', 'copy', 'annot-forms'],
                // },
            })

            doc.addFont('courier', 'ariel', 'helvetica', 'normal')

            const AmiriRegular = getSinhalaFont()

            doc.addFileToVFS('FMAbhaya x-normal.ttf', AmiriRegular)
            doc.addFont('FMAbhaya x-normal.ttf', 'FMAbhaya x', 'normal')

            doc.setFont('FMAbhaya x') // set font
            doc.setFontSize(20)

            doc.text(',xld Lksc f;,a f;d. .nvd mrahka;h', 50, 10)

            doc.setFontSize(14)
            doc.text('fiajl jegqma m;s%ldj', 80, 25)

            doc.setFont('courier')
            doc.setFontSize(16)
            doc.text('CEYLON PETROLEUM STORAGE TERMINALS LIMITED', 30, 17)

            doc.setFontSize(14)
            doc.text('Employee Pay Sheet', 75, 30)

            doc.setFontSize(12)

            doc.setFontSize(10)

            let emp = JSON.parse(payrollData.empData)
            let earnings = JSON.parse(payrollData.earningData)
            let deductions = JSON.parse(payrollData.deductionData)
            let summary = JSON.parse(payrollData.salData)
            let loandData = JSON.parse(payrollData.loanData)
            let unRecoveredData = JSON.parse(payrollData.unRecoveredData)

            doc.text(emp[0].epf.toString(), 20, 40, { align: 'left' })
            doc.text(period ? period : '', 40, 40, {
                align: 'left',
            })
            doc.text(emp[0].empName.toString(), 100, 40, { align: 'left' })
            doc.text(emp[0].empGrade.toString(), 190, 40, { align: 'left' })

            let x = 60
            let y = 50
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
                    doc.text(element.amount.toFixed(2).toString(), x + 35, y, {
                        align: 'right',
                    })
                    y = y + 4
                }
            )

            let z = 50
            y = y + 5

            doc.text('GROSS PAY', z, y, { align: 'left' })
            doc.text(summary[0].taxableGross.toFixed(2), x + 35, y, {
                align: 'right',
            })

            y = y + 6

            deductions.forEach(
                (element: {
                    payCode: { toString: () => string | string[] }
                    paytype: { toString: () => string | string[] }
                    amount: number
                    balanceAmount: number
                }) => {
                    doc.text(element.payCode.toString(), x, y, {
                        align: 'left',
                    })

                    if (element.balanceAmount <= 0) {
                        let tempx = 0
                        if (element.paytype == 'U') {
                            tempx = x + 65
                        } else {
                            tempx = x + 35
                        }

                        doc.text(
                            element.amount.toFixed(2).toString(),
                            tempx,
                            y,
                            {
                                align: 'right',
                            }
                        )
                        y = y + 4
                    } else {
                        doc.text(
                            element.balanceAmount.toFixed(2).toString(),
                            x - 10,
                            y,
                            {
                                align: 'right',
                            }
                        )
                        doc.text(
                            element.amount.toFixed(2).toString(),
                            x + 35,
                            y,
                            {
                                align: 'right',
                            }
                        )

                        doc.text(
                            (element.balanceAmount - element.amount)
                                .toFixed(2)
                                .toString(),
                            x + 95,
                            y,
                            {
                                align: 'right',
                            }
                        )

                        if (unRecoveredData.length > 0) {
                            const data = unRecoveredData.filter(
                                (item: any) => item.payCode === element.payCode
                            )

                            data.map((item: any) => {
                                doc.text(
                                    item.amount.toFixed(2).toString(),
                                    x + 65,
                                    y,
                                    {
                                        align: 'right',
                                    }
                                )
                            })
                        }

                        y = y + 4
                    }
                }
            )

            y = y + 5

            doc.text('DEDUCTIONS', z, y, { align: 'left' })
            doc.text(summary[0].deductionGross.toFixed(2), x + 35, y, {
                align: 'right',
            })

            y = 289
            z = 247
            let tottalContribution =
                parseFloat(summary[0].comp_contribution) +
                parseFloat(summary[0].emp_contribution)
            doc.text(summary[0].comp_contribution.toFixed(2), z, y, {
                align: 'left',
            })

            z = 273

            doc.text(tottalContribution.toFixed(2), z, y, { align: 'left' })

            var img = new Image()
            img.src = '/img/others/Confidential.png'

            doc.saveGraphicsState()
            doc.setGState(new GState({ opacity: 0.1 }))
            doc.addImage(img, 'png', 30, 80, 160, 110)

            doc.restoreGraphicsState()

            const result = doc.output('blob')

            console.log(result)

            doc.output('dataurlnewwindow')
        }
    }

    return (
        <>
            <Card header="Paysheet View">
                <Formik
                    initialValues={{
                        epf: 0,
                        period: 202409,
                    }}
                    onSubmit={(values) => {
                        //    if (!disableSubmit) {

                        console.log(values)
                        onSubmit(values)
                        //  }
                    }}
                >
                    <Form>
                        <FormContainer layout={layout}>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <AuthorityCheck
                                    userAuthority={
                                        getUserFromLocalStorage().authority
                                    }
                                    authority={['Admin', 'FIAdmin', 'FIEX1']}
                                >
                                    <FormItem label="EPF">
                                        <Field
                                            className="mt-1"
                                            size="sm"
                                            type="text"
                                            name="epf"
                                            placeholder="Please enter EPF"
                                            component={Input}
                                        />
                                    </FormItem>
                                </AuthorityCheck>

                                <div className="..">
                                    <FormItem label="Period">
                                        <Field
                                            className="mt-1"
                                            size="sm"
                                            type="text"
                                            name="period"
                                            placeholder="Please enter Period"
                                            component={Input}
                                        />
                                    </FormItem>

                                    <Button size="sm" type="submit">
                                        Load
                                    </Button>
                                    <Button
                                        className="ml-1"
                                        size="sm"
                                        onClick={viewPDF}
                                        type="submit"
                                    >
                                        Print
                                    </Button>
                                </div>
                            </div>
                        </FormContainer>
                    </Form>
                </Formik>
            </Card>
            <br />
            {isDataAvailable && (
                <EmpData
                    empData={payrollData?.empData ?? ''}
                    earningsData={payrollData?.earningData ?? ''}
                    deductionsData={payrollData?.deductionData ?? ''}
                    salData={payrollData?.salData ?? ''}
                    unRecoveredData={payrollData?.unRecoveredData ?? ''}
                    loanData={payrollData?.loanData ?? ''}
                />
            )}
        </>
    )
}

export default PaysheetView
