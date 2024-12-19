import { useEffect, useState } from 'react'
import { AdaptableCard } from '@/components/shared'
import { injectReducer } from '@/store'
import reducer, {
    AllAdvancePaymentData,
    getAdvancePaymentData,
    processAdvancePaymentData,
    useAppDispatch,
    useAppSelector,
} from './store'
import useCommon from '@/utils/hooks/useCommon'
import AdvancePaymentData from './components/AdvancePaymentData'
import dayjs from 'dayjs'
import { Formik, Field, Form } from 'formik'
import { FormItem, FormContainer } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import { downloadExcel } from 'react-export-table-to-excel'
import { Tooltip } from '@/components/ui/Tooltip'
import Avatar from '@/components/ui/Avatar'
import { FaRegFileExcel } from 'react-icons/fa'

injectReducer('AdvancePaymentData', reducer)

type FormModel = {
    period: number
}

type AdvancePaymentRequest = {
    companyCode?: number
    period: string
    processBy: string
}

const AdvancePayment = () => {
    const dispatch = useAppDispatch()
    const { getUserFromLocalStorage } = useCommon()

    const currentDate = dayjs().format('YYYYMM')
    const [currentPeriod, setCurrentPeriod] = useState(0)
    // const [isDataLoaded, setisDataLoaded] = useState(false)

    const data = useAppSelector(
        (state) => state.AdvancePaymentData.data.advancePaymentData
    )

    const loading = useAppSelector(
        (state) => state.AdvancePaymentData.data.loading
    )

    const tableData = useAppSelector(
        (state) => state.AdvancePaymentData.data.tableData
    )

    useEffect(() => {
        // setCurrentPeriod(Number(currentDate))
        fetchData(0)
    }, [dispatch, tableData, currentPeriod])

    const fetchData = (period: number) => {
        dispatch(getAdvancePaymentData(currentPeriod))
    }

    const onSubmit = (
        formValue: FormModel,
        setSubmitting: (isSubmitting: boolean) => void
    ) => {
        const { period } = formValue

        setCurrentPeriod(period)

        fetchData(currentPeriod)

        setSubmitting(false)

        // if (data.length > 0) {
        //     openNotification('success', 'Data Load Successfully')
        // } else {
        //     openNotification('warning', 'No Data Available')
        // }
    }

    const header = [
        'ID',
        'Period',
        'EPF',
        'Name',
        'isFullAmount',
        'Amount',
        'Status',
        'Request By',
    ]

    function handleDownloadExcel() {
        if (data.length == 0) {
            openNotification(
                'danger',
                'No Data Found',
                'Please load data to download'
            )
            return
        }

        downloadExcel({
            fileName: 'Advance Payment Report',
            sheet: 'Advance Payment',
            tablePayload: {
                header,
                // accept two different data structures
                body: data,
            },
        })

        const value: AdvancePaymentRequest = {
            period: currentDate,
            processBy: getUserFromLocalStorage().userId,
        }

        dispatch(processAdvancePaymentData(value)).then((action) => {
            if (action.payload === 'success') {
                openNotification(
                    'success',
                    'Success',
                    'Advance Requests Processed for period: ' + currentDate
                )
            } else {
                openNotification(
                    'danger',
                    'Error',
                    'An error occurred while processing the data.'
                )
            }
        })
    }

    const openNotification = (
        type: 'success' | 'warning' | 'danger' | 'info',
        title: string,
        message: string
    ) => {
        toast.push(
            <Notification title={title} type={type}>
                {message}
            </Notification>
        )
    }

    return (
        <>
            <AdaptableCard>
                <div className="lg:flex items-center justify-between mb-4">
                    <h3 className="mb-4 lg:mb-0">Advance Payment Requests</h3>
                </div>
                <div className="lg:flex items-center justify-between mb-4">
                    <h3 className="mb-4 lg:mb-0"></h3>
                    <div className="flex flex-col md:flex-row md:items-left gap-1">
                        <div className="grid col-1">
                            <Formik
                                initialValues={{
                                    period: Number(currentDate),
                                }}
                                onSubmit={async (values, { setSubmitting }) => {
                                    onSubmit(values, setSubmitting)
                                }}
                                // onSubmit={(values, { setSubmitting }) => {
                                //     onSubmit(values, setSubmitting)
                                //     setSubmitting(true)
                                // }}
                            >
                                <Form>
                                    <FormContainer layout="inline">
                                        <FormItem label="Period">
                                            <Field
                                                type="text"
                                                name="period"
                                                placeholder="Please enter Period"
                                                component={Input}
                                            />
                                        </FormItem>
                                        <FormItem>
                                            <Button type="submit">
                                                Submit
                                            </Button>
                                        </FormItem>
                                    </FormContainer>
                                </Form>
                            </Formik>
                        </div>
                        <div className="grid col-1">
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
                    </div>
                </div>

                <AdvancePaymentData
                    {...{
                        data: data as AllAdvancePaymentData[],
                        loading,
                        tableData,
                    }}
                />
            </AdaptableCard>
        </>
    )
}
export default AdvancePayment
