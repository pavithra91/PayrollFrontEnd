import { useEffect, useState } from 'react'
import {
    AdaptableCard,
    AuthorityCheck,
    ConfirmDialog,
} from '@/components/shared'
import { injectReducer } from '@/store'
import reducer, {
    AllPaymentData,
    getPaymentData,
    useAppDispatch,
    useAppSelector,
} from './store'
import useCommon from '@/utils/hooks/useCommon'
import Button from '@/components/ui/Button'
import { Field, Form, Formik, FieldProps } from 'formik'
import { FormItem, FormContainer } from '@/components/ui/Form'
import { Input } from '@/components/ui/Input'
import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import PaymentData from './components/PaymentData'
import Dialog from '@/components/ui/Dialog'
import ProcessConfirmationDialog from './components/ProcessConfirmationDialog'
// import ReservationData from './components/ReservationData'

injectReducer('PaymentData', reducer)

type FormModel = {
    voucherNo: string
}

const Payments = () => {
    const dispatch = useAppDispatch()
    const { getUserFromLocalStorage } = useCommon()

    const [voucherNo, setvoucherNo] = useState('')

    const [state, setState] = useState({
        data: [] as AllPaymentData[], // stores the fetched payment data
        isProcess: false, // stores the 'Process' button state
        isReset: false, // stores the 'Reset' button state
        isShowData: false, // flag for whether data should be shown
    })

    const onProcess = () => {
        //settermsDialog(true)
    }

    const onSubmit = (
        formValue: FormModel,
        setSubmitting: (isSubmitting: boolean) => void
    ) => {
        setSubmitting(true)

        const { voucherNo } = formValue

        const values = {
            voucherNo: voucherNo,
        }
        setvoucherNo(voucherNo)
        dispatch(getPaymentData(values.voucherNo)).then((res: any) => {
            const fetchedData = res.payload.items

            setState((prevState) => ({
                ...prevState,
                data: fetchedData,
                isProcess:
                    fetchedData.length > 0 &&
                    fetchedData[0].status === 'Transferred',
                isReset:
                    fetchedData.length > 0 &&
                    fetchedData[0].status === 'Processed',
                isShowData: fetchedData.length > 0, // only show data if it's not empty
            }))

            setSubmitting(false)

            if (fetchedData.length === 0) {
                openNotification('warning', 'No Voucher data available')
            }
        })
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
    const [confirmDialog, setConfirmDialog] = useState(false)
    const handleProcess = () => {
        setConfirmDialog(true)
    }

    const handleConfirm = (values: { bankTransferDate: string }) => {
        setConfirmDialog(false)
        console.log('Processing voucher:', values.bankTransferDate)
        // Add processing logic here
    }

    const handleCancel = () => {
        setConfirmDialog(false)
    }

    return (
        <>
            <AdaptableCard>
                <div className="lg:flex items-center justify-between mb-4">
                    <h3 className="mb-4 lg:mb-0">Voucher Processing</h3>
                </div>

                <div className="lg:flex items-center justify-between mb-4">
                    <h3 className="mb-4 lg:mb-0"></h3>

                    <div className="flex flex-col md:flex-row md:items-right gap-1">
                        <Formik
                            initialValues={{
                                voucherNo: '',
                            }}
                            enableReinitialize={true}
                            //validationSchema={validationSchema}
                            onSubmit={(values, { setSubmitting }) => {
                                onSubmit(values, setSubmitting)
                                setSubmitting(true)
                            }}
                        >
                            {({
                                touched,
                                errors,
                                setFieldValue,
                                isSubmitting,
                            }) => (
                                <Form>
                                    <FormContainer>
                                        <div className="grid grid-cols-1 gap-4">
                                            <div className="flex justify-end gap-4">
                                                <FormItem
                                                    invalid={
                                                        touched.voucherNo &&
                                                        !!errors.voucherNo
                                                    }
                                                    errorMessage={
                                                        errors.voucherNo
                                                    }
                                                >
                                                    <Field
                                                        size="sm"
                                                        as={Input}
                                                        name="voucherNo"
                                                        placeholder="Enter Voucher No"
                                                    />
                                                </FormItem>
                                                <Button
                                                    size="sm"
                                                    variant="twoTone"
                                                    type="submit"
                                                    // icon={<HiOutlinePlusCircle />}
                                                    // onClick={() => navigate('/AddReservation')}
                                                >
                                                    Load Voucher
                                                </Button>

                                                {state.isProcess && (
                                                    <>
                                                        <Button
                                                            size="sm"
                                                            color="emerald-600"
                                                            variant="solid"
                                                            // icon={<HiOutlinePlusCircle />}
                                                            onClick={
                                                                handleProcess
                                                            }
                                                        >
                                                            Process
                                                        </Button>
                                                    </>
                                                )}
                                                <AuthorityCheck
                                                    userAuthority={
                                                        getUserFromLocalStorage()
                                                            .authority
                                                    }
                                                    authority={['Admin']}
                                                >
                                                    {state.isReset && (
                                                        <Button
                                                            size="sm"
                                                            color="red-600"
                                                            variant="solid"
                                                            // icon={<HiOutlinePlusCircle />}
                                                            // onClick={() => navigate('/AddReservation')}
                                                        >
                                                            Reset
                                                        </Button>
                                                    )}
                                                </AuthorityCheck>
                                            </div>
                                        </div>
                                    </FormContainer>
                                </Form>
                            )}
                        </Formik>
                    </div>
                </div>

                {state.isShowData && (
                    <>
                        <PaymentData data={state.data} />
                    </>
                )}

                <ProcessConfirmationDialog
                    isOpen={confirmDialog}
                    voucherNo={voucherNo}
                    onCancel={handleCancel}
                />
            </AdaptableCard>
        </>
    )
}

export default Payments
