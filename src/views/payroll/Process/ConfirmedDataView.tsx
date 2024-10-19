import type { CommonProps, SelectOption } from '@/@types/common'
import { FC, SetStateAction, useEffect, useMemo, useState } from 'react'
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
import PayrollSummary from './PayrollSummary'
import useCommon from '@/utils/hooks/useCommon'
import Statistic from './Statistics'
import ConfirmDiaglog from '../Process/ConfirmDiaglog'
import { Spinner } from '@/components/ui'
import { ImSpinner9 } from 'react-icons/im'
import Loading from '@/components/shared/Loading'

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

interface SimulateItem {
    ResultType: string
    CurrentValue: number
    Percentage: string
}

type FormLayout = 'inline'

type SAPPayCodes = {
    PayCode: number
    Amount: number
    Line_Item_Count: number
}

type dataGrid = {
    sapPayCode: number
    sapAmount: string
    sapLineCount: number
}

const arr: dataGrid[] = []

const companyOptions: SelectOption[] = [
    { value: 2000, label: '2000' },
    { value: 3000, label: '3000' },
]

const FieldWrapper: FC<FieldWrapperProps> = ({ name, render }) => {
    const [field, meta, helpers] = useField(name)

    return render({ field, meta, helpers })
}

const ConfirmedDataView = (props: FormProps) => {
    const [isUnrecoveredActive, setIsUnrecoveredActive] = useState(false)
    const [isDataLoaded, setDataLoaded] = useState(false)

    const [isProcessPayrollBloacked, setIsProcessPayrollBloacked] =
        useState(false)

    const [layout, setLayout] = useState<FormLayout>('inline')
    const {
        getPayrunByPeriod,
        getPayrollSummary,
        getDataTransferStatistics,
        simulatePayroll,
        createUnRecovered,
    } = usePayrun()
    const { getUserIDFromLocalStorage } = useCommon()

    const [message, setMessage] = useTimeOutMessage()
    const [data, setData] = useState<dataGrid[]>([])

    const [payrollData, setPayrollData] = useState<dataGrid[]>([])

    const [simulateData, setSimulateData] = useState<Array<SimulateItem>>([])

    const [isDataLoad, setisDataLoad] = useState(false)
    const [payrunStatus, setPayrunStatus] = useState('')
    const [isUnRecoveredSubmitting, setisUnRecoveredSubmitting] =
        useState(false)

    const [dataFromChild, setDataFromChild] =
        useState<PayrollDataSchema | null>(null)

    const [isConfirmOpen, setIsConfirmOpen] = useState(false)

    const openConfirmDialog = () => {
        if (isDataLoad) {
            setIsConfirmOpen(true)
        }
    }

    const closeConfirmDialog = () => {
        setIsConfirmOpen(false)
    }

    type DataFromPayroll = {
        status: boolean
    }

    const [DataFromPayroll, setDataFromPayroll] = useState<DataFromPayroll>()

    const fetchedContent = useMemo(() => {
        if (DataFromPayroll) {
            return true
        } else {
            return false
        }
    }, [DataFromPayroll])

    const handleChildData = (data: any) => {
        setDataFromPayroll(data)

        if (DataFromPayroll) {
            setIsUnrecoveredActive(true)
            setIsProcessPayrollBloacked(true)
        }
    }

    const onSubmit = async (values: PayrollDataSchema) => {
        const { companyCode, period } = values
        setisDataLoad(true)
        if (values != null) {
            setDataFromChild(values)
        }
    }

    useEffect(() => {
        if (dataFromChild != null) {
            setDataLoaded(true)
            const result = getDataTransferStatistics(dataFromChild)
            result.then((res) => {
                const listItems = JSON.parse(res?.data?.data ?? '')

                listItems[0].SAPPayData.map(
                    (item: SAPPayCodes, index: number) => {
                        arr.push({
                            sapPayCode: item.PayCode,
                            sapAmount: item.Amount.toLocaleString('en-US', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                            }),
                            sapLineCount: item.Line_Item_Count,
                        })
                    }
                )
                setData(arr)
                setisDataLoad(true)
            })

            const payRunResults = getPayrunByPeriod(dataFromChild)
            payRunResults.then((res) => {
                setDataLoaded(true)
                const listItems = JSON.parse(res?.data?.data ?? '')
                if (listItems.length > 0) {
                    if (listItems[0].payrunStatus == 'Confirmed') {
                        setPayrunStatus('Confirmed')
                        const ConfirmDataTransfer = {
                            companyCode: dataFromChild.companyCode,
                            period: dataFromChild.period,
                            approvedBy: '',
                        }

                        const payrollSimulationResult =
                            simulatePayroll(ConfirmDataTransfer)

                        payrollSimulationResult.then((res) => {
                            const listItems = JSON.parse(res?.data?.data ?? '')

                            const array:
                                | Array<SimulateItem>
                                | ((prevState: never[]) => never[]) = []

                            listItems.map((item: any) => {
                                array.push(item)
                            })

                            setSimulateData(array)
                            setDataLoaded(false)

                            setisDataLoad(false)

                            setIsProcessPayrollBloacked(false)
                            setIsUnrecoveredActive(false)
                        })
                    } else if (
                        listItems[0].payrunStatus == 'EPF/TAX Calculated'
                    ) {
                        setPayrunStatus('EPF/TAX Calculated')
                        setIsUnrecoveredActive(true)
                        setIsProcessPayrollBloacked(true)
                        handleChildData(true)
                        const result = getPayrollSummary(dataFromChild)
                        result.then((res) => {
                            console.log(res)
                            const listItems = JSON.parse(res?.data?.data ?? '')

                            setPayrollData(listItems)
                            setDataLoaded(false)
                        })
                    } else if (
                        listItems[0].payrunStatus == 'Unrec File Created'
                    ) {
                        setPayrunStatus('Unrec File Created')
                        const result = getPayrollSummary(dataFromChild)
                        result.then((res) => {
                            const listItems = JSON.parse(res?.data?.data ?? '')

                            setPayrollData(listItems)
                        })

                        setIsProcessPayrollBloacked(true)
                        setIsUnrecoveredActive(false)
                        setDataLoaded(false)

                        console.log(isDataLoad)
                    } else {
                        setIsProcessPayrollBloacked(false)
                        setIsUnrecoveredActive(false)
                        setDataLoaded(false)
                    }
                }
            })
        }
    }, [dataFromChild])

    const createUnrecovered = async () => {
        setisUnRecoveredSubmitting(true)

        if (isDataLoad && dataFromChild != null) {
            const companyCode = dataFromChild.companyCode
            const period = dataFromChild.period
            const approvedBy = getUserIDFromLocalStorage()

            const result = await createUnRecovered({
                companyCode,
                period,
                approvedBy,
            })

            if (result?.status === 'failed') {
                setMessage(result.message)
                openNotification('danger', result.message)
            } else {
                setMessage('Successfully Saved')
                openNotification(
                    'success',
                    'Unrecovered File Created Successfully'
                )
            }

            setisUnRecoveredSubmitting(false)
        }
    }

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
    return (
        <>
            <Card header="Process">
                <div className="grid grid-cols-6 gap-4">
                    <div className="col-span-4 ...">
                        <Formik
                            initialValues={{
                                companyCode: 0,
                                period: 202409,
                            }}
                            onSubmit={(values, { setSubmitting }) => {
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

                    {!fetchedContent && <div className="col-span-1..."></div>}

                    {isDataLoad && (
                        <div className="col-span-1...">
                            <span className="mr-1 font-semibold">
                                {!isProcessPayrollBloacked && (
                                    <Button
                                        disabled={fetchedContent}
                                        variant="solid"
                                        color="blue-600"
                                        onClick={openConfirmDialog}
                                    >
                                        Process Payroll
                                    </Button>
                                )}

                                {isConfirmOpen && (
                                    <ConfirmDiaglog
                                        onClose={closeConfirmDialog}
                                        isConfirmOpen={isConfirmOpen}
                                        props={props}
                                        data={dataFromChild}
                                        onSendData={handleChildData}
                                    />
                                )}
                            </span>
                        </div>
                    )}

                    {fetchedContent && (
                        <div className="col-span-1...">
                            <span className="mr-1 font-semibold">
                                <Button
                                    variant="solid"
                                    color="emerald-600"
                                    onClick={createUnrecovered}
                                    loading={isUnRecoveredSubmitting}
                                >
                                    {isUnRecoveredSubmitting
                                        ? 'Processing...'
                                        : 'Create Unrecovered'}
                                </Button>
                            </span>
                        </div>
                    )}
                </div>
            </Card>
            <div className="mb-4"></div>

            <Card>
                {fetchedContent ? (
                    <>
                        <PayrollSummary data={payrollData} />
                    </>
                ) : (
                    // <DataSummary data={data} />
                    <>
                        <Loading loading={isDataLoaded}>
                            <Statistic data={simulateData} />
                        </Loading>
                    </>
                )}
            </Card>
        </>
    )
}
export default ConfirmedDataView
