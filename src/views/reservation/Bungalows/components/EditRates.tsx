import {
    bungalowRates,
    editBungalow,
    getBungalowData,
    toggleEditBungalowDialog,
    updateBungalowRates,
    useAppDispatch,
    useAppSelector,
} from '../store'
import { FormItem, FormContainer } from '@/components/ui/Form'
import Button from '@/components/ui/Button'
import useCommon from '@/utils/hooks/useCommon'
import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import { Field, Form, Formik, FieldProps } from 'formik'
import Input from '@/components/ui/Input'
import { HiOutlineClipboardCheck } from 'react-icons/hi'
import { FaRegSave } from 'react-icons/fa'
import { FcCancel } from 'react-icons/fc'

const EditRates = () => {
    const dispatch = useAppDispatch()
    //const navigate = useNavigate()

    const { getUserFromLocalStorage } = useCommon()

    const selectedRow = useAppSelector(
        (state) => state.BungalowData.data.selectedRow
    )

    const onEditDialogClose = () => {
        dispatch(toggleEditBungalowDialog(false))
    }

    const onSubmit = (
        formValue: bungalowRates,
        setSubmitting: (isSubmitting: boolean) => void
    ) => {
        setSubmitting(true)

        const { rates, bungalowId } = formValue

        const values = {
            bungalowId: bungalowId,
            rates: rates,
            lastupdateBy: getUserFromLocalStorage().userID,
        }

        dispatch(updateBungalowRates(values)).then((res)=>{
            if(res.payload == "success")
            {
                openNotification('success', 'Rate has been updated!')
                dispatch(getBungalowData())
                dispatch(toggleEditBungalowDialog(false))
            }
            else
            {
                openNotification('danger', 'Error occurred while processing your request!')
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

    return (
        <>
            <Formik
                initialValues={{
                    bungalowId: selectedRow.id || 0,
                    rates: selectedRow.bungalowRates?.rates || [],
                }}
                enableReinitialize={true}
                //validationSchema={validationSchema}
                onSubmit={(values, { setSubmitting }) => {
                    onSubmit(values, setSubmitting)
                    //console.log(values)
                    setSubmitting(true)
                }}
            >
                {({ values, touched, errors, setFieldValue, isSubmitting }) => (
                    <Form>
                        <FormContainer>
                            {selectedRow.bungalowRates?.rates.map(
                                (rate, index) => {
                                    return (
                                        <div key={index}>
                                            <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                                                <div className="..">

                                                <div className="font-semibold mt-4 ml-4">{rate.categoryName}</div>
                                                </div>
                                                <div className="col-span-3">
                                                    <FormItem>
                                                        <Field
                                                            as={Input}
                                                            name={`rates[${index}].amount`}
                                                            placeholder={
                                                                rate.amount
                                                            }
                                                        />
                                                    </FormItem>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                }
                            )}
                            <div className="flex justify-end gap-4">
                                <span>
                                    <Button
                                        size="sm"
                                        variant="twoTone"
                                        type="submit"
                                        icon={<FaRegSave />}
                                    >
                                        Save
                                    </Button>
                                </span>
                                <span>
                                    <Button
                                        size="sm"
                                        variant="twoTone"
                                        icon={<FcCancel />}
                                        onClick={onEditDialogClose}
                                    >
                                        Cancel
                                    </Button>
                                </span>
                            </div>
                        </FormContainer>
                    </Form>
                )}
            </Formik>
        </>
    )
}
export default EditRates
