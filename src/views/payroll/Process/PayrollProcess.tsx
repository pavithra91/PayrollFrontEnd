import Button from '@/components/ui/Button'
import { Formik, Field, Form, FieldProps } from 'formik'
import { FormItem, FormContainer } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import { useState } from 'react'
import { SelectOption } from '@/@types/common'
import Select from '@/components/ui/Select'
import reducer, {
    getPayrunByPeriod,
    setComData,
    simulatePayroll,
    toggleProcessPayrollDialog,
    toggleSimulationLoading,
    toggleUnrecoveredDialog,
    useAppDispatch,
    useAppSelector,
    createUnRecFile,
    getPayrollSummary,
    toggleShowSimulation,
} from './store'
import { injectReducer } from '@/store'
import useCommon from '@/utils/hooks/useCommon'
import Loading from '@/components/shared/Loading'
import Statistics from './components/Statistics'
import ConfirmDataView from './components/ConfirmDataView'
import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import PayrollSummary from './components/PayrollSummary'
import { Card } from '@/components/ui/Card'

injectReducer('PayrollData', reducer)

type FormModel = {
    companyCode: number
    period: number
}

interface SimulateItem {
    ResultType: string
    CurrentValue: number
    Percentage: string
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

const PayrollProcess = () => {
    const dispatch = useAppDispatch()
    const [payrollData, setPayrollData] = useState<dataGrid[]>([])
    const [isConfirmOpen, setIsConfirmOpen] = useState(false)
    const [isPayrollDataAvailable, setPayrollDataAvailable] = useState(false)
    const [simulateData, setSimulateData] = useState<Array<SimulateItem>>([])
    const { getUserIDFromLocalStorage } = useCommon()

    const simulationLoading = useAppSelector(
        (state) => state.PayrollData.data.simulationLoading
    )

    const showSimulation = useAppSelector(
        (state) => state.PayrollData.data.showSimulation
    )

    const payrollProcessBtn = useAppSelector(
        (state) => state.PayrollData.data.processPayrollDialog
    )

    const unrecoveredBtn = useAppSelector(
        (state) => state.PayrollData.data.unrecoveredDialog
    )

    const approvalData = useAppSelector(
        (state) => state.PayrollData.data.comData
    )

    const onSubmit = (
        formValue: FormModel,
        setSubmitting: (isSubmitting: boolean) => void
    ) => {
        setSubmitting(true)

        const { companyCode, period } = formValue

        const values = {
            companyCode: companyCode,
            period: period,
        }

        dispatch(setComData(values))

        dispatch(getPayrunByPeriod(values)).then((res: any) => {
            const listItems = JSON.parse(res.payload.data ?? '')
            if (listItems.length > 0) {
                if (listItems[0].payrunStatus == 'Confirmed') {
                    dispatch(toggleSimulationLoading(true))
                    dispatch(toggleProcessPayrollDialog(true))
                    dispatch(toggleUnrecoveredDialog(false))
                    dispatch(toggleShowSimulation(true))


                    const values = {
                        companyCode: companyCode,
                        period: period,
                        approvedBy: getUserIDFromLocalStorage(),
                    }

                    dispatch(setComData(values))

                    dispatch(simulatePayroll(values)).then((res: any) => {
                        const listItems = JSON.parse(res.payload.data)

                        setSimulateData(listItems)

                        dispatch(toggleSimulationLoading(false))
                    })
                } else if (listItems[0].payrunStatus == 'EPF/TAX Calculated') {
                    dispatch(toggleProcessPayrollDialog(false))
                    dispatch(toggleUnrecoveredDialog(true))

                    dispatch(getPayrollSummary(values)).then((res: any) => {

                        dispatch(toggleShowSimulation(false))
                        const listItems = JSON.parse(res.payload.data)

                        setPayrollData(listItems)
                    })
                } else if (listItems[0].payrunStatus == 'Unrec File Created') {
                    dispatch(toggleProcessPayrollDialog(false))
                    dispatch(toggleUnrecoveredDialog(false))

                    dispatch(getPayrollSummary(values)).then((res: any) => {
                        dispatch(toggleShowSimulation(false))

                        const listItems = JSON.parse(res.payload.data)

                        setPayrollData(listItems)

                        openNotification(
                            'info',
                            'Payrun Already Processed for Period : ' + period
                        )
                    })
                }
            }
        })
    }

    const ProcessPayroll = () => {
        setIsConfirmOpen(true)

        if(!showSimulation)
        {
            const value = {
                companyCode: approvalData.companyCode,
                period: approvalData.period,
            }

            dispatch(getPayrollSummary(value)).then((res: any) => {
                console.log(res)

                const listItems = JSON.parse(res.payload.data)

                setPayrollData(listItems)
            })
        }
    }

    const createUnrecovered = () => {
        const values = {
            companyCode: approvalData.companyCode,
            period: approvalData.period,
            approvedBy: getUserIDFromLocalStorage(),
        }

        dispatch(createUnRecFile(values)).then((res: any) => {
            if (res.payload.msgCode === 'S') {
                openNotification(
                    'success',
                    'Unrecovered File Created Successfully'
                )
            } else {
                openNotification('danger', res.payload.message)
            }

            const value = {
                companyCode: approvalData.companyCode,
                period: approvalData.period,
            }

            dispatch(getPayrollSummary(value)).then((res: any) => {
                console.log(res)

                const listItems = JSON.parse(res.payload.data)

                setPayrollData(listItems)
            })
        })
    }

    const closeConfirmDialog = () => {
        setIsConfirmOpen(false)
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
        <div className="col-span-4 ...">
        <Card header="Process" className='mb-3'>
                <Formik
                    initialValues={{
                        companyCode: 0,
                        period: 202501,
                    }}
                    enableReinitialize={true}
                    //validationSchema={validationSchema}
                    onSubmit={(values, { setSubmitting }) => {
                        onSubmit(values, setSubmitting)
                        // console.log(values)
                        setSubmitting(true)
                    }}
                >
                    {({
                        touched,
                        errors,
                        values,
                        setFieldValue,
                        isSubmitting,
                    }) => (
                        <Form>
                            <FormContainer layout="inline">
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                                    <div className="lg:col-span-2">
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                            <div className="..">
                                                <FormItem
                                                    label="Company Code"
                                                    invalid={
                                                        errors.companyCode &&
                                                        touched.companyCode
                                                    }
                                                    errorMessage={
                                                        errors.companyCode
                                                    }
                                                >
                                                    <Field name="companyCode">
                                                        {({
                                                            field,
                                                            form,
                                                        }: FieldProps) => (
                                                            <Select<SelectOption>
                                                                size="sm"
                                                                field={field}
                                                                form={form}
                                                                options={
                                                                    companyOptions
                                                                }
                                                                value={companyOptions.filter(
                                                                    (option) =>
                                                                        option.value ===
                                                                        values.companyCode
                                                                )}
                                                                onChange={(
                                                                    option
                                                                ) => {
                                                                    form.setFieldValue(
                                                                        field.name,
                                                                        option?.value
                                                                    )
                                                                }}
                                                            />
                                                        )}
                                                    </Field>
                                                </FormItem>
                                            </div>
                                            <div className="..">
                                                <FormItem label="Period">
                                                    <Field
                                                        size="sm"
                                                        type="text"
                                                        name="period"
                                                        placeholder="Please enter Period"
                                                        component={Input}
                                                    />
                                                </FormItem>
                                            </div>
                                            <div className="..">
                                                <Button
                                                    size="sm"
                                                    variant="twoTone"
                                                    type="submit"
                                                    // icon={<HiOutlinePlusCircle />}
                                                    // onClick={() => navigate('/AddReservation')}
                                                >
                                                    Load Data
                                                </Button>

                                                {payrollProcessBtn && (
                                                    <>
                                                        <Button
                                                            className="ml-3"
                                                            size="sm"
                                                            variant="twoTone"
                                                            type="submit"
                                                            // icon={<HiOutlinePlusCircle />}
                                                            onClick={
                                                                ProcessPayroll
                                                            }
                                                        >
                                                            Process Payroll
                                                        </Button>
                                                    </>
                                                )}

                                                {/* <Button className='ml-3'
                                                    size="sm"
                                                    variant="twoTone"
                                                    type="submit"
                                                    // icon={<HiOutlinePlusCircle />}
                                                    // onClick={() => navigate('/AddReservation')}
                                                >
                                                    Create Unrecovered
                                                </Button> */}
                                            </div>
                                        </div>
                                    </div>
                                    {unrecoveredBtn && (
                                        <>
                                            <Button
                                                size="sm"
                                                variant="twoTone"
                                                type="submit"
                                                // icon={<HiOutlinePlusCircle />}
                                                onClick={createUnrecovered}
                                            >
                                                Create Unrecovered
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </FormContainer>
                        </Form>
                    )}
                </Formik>
                </Card>
                {showSimulation && (<Loading loading={simulationLoading}>
                    <Statistics data={simulateData} />
                </Loading>)}

                {!showSimulation && (<>
                    <PayrollSummary data={payrollData} />
                </>)}

                {isConfirmOpen && (
                    <ConfirmDataView
                        onClose={closeConfirmDialog}
                        isConfirmOpen={isConfirmOpen}
                    />
                )}
            </div>


        </>
    )
}
export default PayrollProcess
