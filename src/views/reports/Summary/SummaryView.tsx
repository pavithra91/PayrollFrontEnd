import type { CommonProps, SelectOption } from '@/@types/common'
import { FC, useEffect, useState } from 'react'
import Button from '@/components/ui/Button'
import { Formik, Field, Form } from 'formik'
import { FormItem, FormContainer } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Card from '@/components/ui/Card'
import {
    FieldHelperProps,
    FieldInputProps,
    FieldMetaProps,
    useField,
} from 'formik'
import Select from '@/components/ui/Select'
import usePayrun from '@/utils/hooks/usePayrun'
import { PayrollDataSchema } from '@/@types/payroll'
import useTimeOutMessage from '@/utils/hooks/useTimeOutMessage'
import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import PayrollSummary from '../../payroll/Process/components/PayrollSummary'
import jsPDF from 'jspdf'
import autoTable, { RowInput } from 'jspdf-autotable'
import useCommon from '@/utils/hooks/useCommon'
import { FaFilePdf, FaRegFileExcel } from 'react-icons/fa'
import Avatar from '@/components/ui/Avatar/Avatar'
import { downloadExcel } from 'react-export-table-to-excel'
import Tooltip from '@/components/ui/Tooltip/Tooltip'

interface RenderProps<V = any> {
    field: FieldInputProps<V>
    meta: FieldMetaProps<V>
    helpers: FieldHelperProps<V>
}

interface FieldWrapperProps<V = any> {
    name: string
    render: (formikProps: RenderProps<V>) => React.ReactElement
}

const companyOptions: SelectOption[] = [
    { value: 2000, label: '2000' },
    { value: 3000, label: '3000' },
]

type FormLayout = 'inline'

const FieldWrapper: FC<FieldWrapperProps> = ({ name, render }) => {
    const [field, meta, helpers] = useField(name)

    return render({ field, meta, helpers })
}

const SummaryView = () => {
    const { getPayrunByPeriod, getPayrollSummary } = usePayrun()

    const [layout, setLayout] = useState<FormLayout>('inline')
    const [message, setMessage] = useTimeOutMessage()

    const [payrollData, setPayrollData] = useState<dataGrid[]>([])
    const [isSubmitting, setisSubmitting] = useState(false)

    const [dataFromChild, setDataFromChild] =
        useState<PayrollDataSchema | null>(null)

    const onSubmit = async (values: PayrollDataSchema) => {
        if (values != null) {
            setDataFromChild(values)
        }
    }

    type dataGrid = {
        sapPayCode: number
        sapAmount: string
        sapLineCount: number
    }

    useEffect(() => {
        if (dataFromChild != null) {
            const payRunResults = getPayrunByPeriod(dataFromChild)

            payRunResults.then((res) => {
                if (res?.status == 'success') {
                    const listItems = JSON.parse(res?.data?.data ?? '')
                    if (listItems.length > 0) {
                        if (listItems[0].payrunStatus != 'Unrec File Created') {
                            openNotification(
                                'danger',
                                'Error',
                                'Please Create Unrecovered File to Download Payroll Summary'
                            )
                        }

                        const result = getPayrollSummary(dataFromChild)

                        result.then((res) => {
                            if (res?.status == 'success') {
                                const listItems = JSON.parse(
                                    res?.data?.data ?? ''
                                )

                                setPayrollData(listItems)
                            } else {
                                setPayrollData([])
                            }
                        })
                    } else {
                    }
                } else {
                    openNotification(
                        'danger',
                        'Error',
                        'No Data for Period : ' + dataFromChild.period
                    )
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

    const { getUserIDFromLocalStorage } = useCommon()

    const printReport = () => {
        if (payrollData.length != 0 && dataFromChild != null) {
            let companyName = ''
            if (dataFromChild?.companyCode == 3000) {
                companyName =
                    'Ceylon Petroleum Storage Terminals Limited (CPSTL)'
            } else {
                companyName = 'Ceylon Petroleum Corporation (CPC)'
            }
            const doc = new jsPDF()
            doc.text('Payroll Summary Report', 100, 10, { align: 'center' })

            doc.setFontSize(10)
            doc.text('Company : ' + companyName, 10, 20, {
                align: 'left',
            })
            doc.text(
                'Period : ' + dataFromChild?.period,
                doc.internal.pageSize.getWidth() - 45,
                20,
                { align: 'left' }
            )
            doc.text('Printed By : ' + getUserIDFromLocalStorage(), 10, 26, {
                align: 'left',
            })

            autoTable(doc, {
                startY: 31,
                columnStyles: { europe: { halign: 'center' } },
                body: payrollData,
                margin: { bottom: 20 },
                columns: [
                    { header: 'Location', dataKey: 'location' },
                    { header: 'EPF', dataKey: 'epf' },
                    { header: 'Name', dataKey: 'empName' },
                    { header: 'EPF Employee', dataKey: 'emp_contribution' },
                    { header: 'EPF Company', dataKey: 'comp_contribution' },
                    {
                        header: 'ETF',
                        dataKey: 'etf',
                    },
                    { header: 'TAX', dataKey: 'tax' },
                ],
            })
            const pageCount = (doc as any).internal.getNumberOfPages()

            for (let i = 1; i <= pageCount; i++) {
                doc.setFontSize(10)
                // Go to page i
                doc.setPage(i)
                var pageSize = doc.internal.pageSize
                var pageHeight = pageSize.height
                    ? pageSize.height
                    : pageSize.getHeight()
                doc.text(
                    'Page ' + String(i) + ' of ' + String(pageCount),
                    doc.internal.pageSize.getWidth() / 2,
                    pageHeight - 8,
                    { align: 'center' }
                ) //data.settings.margin.left if you want it on the left
            }

            doc.setPage(pageCount)

            var pageSize = doc.internal.pageSize
            var pageHeight = pageSize.height
                ? pageSize.height
                : pageSize.getHeight()

            doc.text(
                'Checked By',
                doc.internal.pageSize.getWidth() / 8 + 8,
                pageHeight - 15,
                { align: 'left' }
            )
            doc.text(
                '....................................',
                doc.internal.pageSize.getWidth() / 8,
                pageHeight - 20,
                { align: 'left' }
            )

            doc.text(
                'Approved By',
                doc.internal.pageSize.getWidth() - 20,
                pageHeight - 15,
                { align: 'right' }
            )
            doc.text(
                '....................................',
                doc.internal.pageSize.getWidth() - 12,
                pageHeight - 20,
                { align: 'right' }
            )

            doc.save(
                'payroll_summary_report - ' + dataFromChild?.period + '.pdf'
            )
        }
    }

    const header = [
        'Company Code',
        'Location',
        'Period',
        'EPF',
        'Name',
        'Grade',
        'EPF Employee Contribution',
        'EPF Company Contribution',
        'ETF',
        'Taxable Gross',
        'EPF Gross',
        'Tax',
        'Lump Sum Tax',
    ]

    function handleDownloadExcel() {
        if (payrollData.length == 0) {
            openNotification(
                'danger',
                'No Data Found',
                'Please load data to download'
            )
            return
        }
        downloadExcel({
            fileName: 'payroll_summary_report - ' + dataFromChild?.period,
            sheet: dataFromChild?.period + '',
            tablePayload: {
                header,
                // accept two different data structures
                body: payrollData,
            },
        })
    }

    return (
        <>
            <Card header="Payroll Summary">
                <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-10 ...">
                        <Formik
                            initialValues={{
                                companyCode: 0,
                                period: 202312,
                            }}
                            onSubmit={(values) => {
                                //    if (!disableSubmit) {
                                const selectedCompanyCode = Array.from(
                                    Object.values(values.companyCode)
                                )

                                values.companyCode = selectedCompanyCode[0]

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
                        <div className="grid grid-cols-12 gap-4">
                            <div className="col-span-3 ...">
                                <Tooltip
                                    title="Download to Excel File"
                                    placement="top"
                                >
                                    <Avatar
                                        className="mr-4 bg-emerald-500"
                                        icon={<FaRegFileExcel />}
                                        onClick={handleDownloadExcel}
                                    />
                                </Tooltip>
                            </div>
                            <div className="...">
                                <Tooltip
                                    title="Download to PDF File"
                                    placement="top"
                                >
                                    <Avatar
                                        className="mr-4 bg-red-500"
                                        icon={<FaFilePdf />}
                                        onClick={printReport}
                                    />
                                </Tooltip>
                            </div>

                            <div className="..."></div>
                        </div>
                    </div>
                </div>
            </Card>
            <div className="mb-4"></div>
            <Card>
                <PayrollSummary data={payrollData} />
            </Card>
        </>
    )
}
export default SummaryView
