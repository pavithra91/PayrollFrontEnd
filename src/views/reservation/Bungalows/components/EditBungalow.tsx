import {
    editBungalow,
    toggleEditBungalowDialog,
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
import DatePicker from '@/components/ui/DatePicker/DatePicker'
import { Checkbox } from '@/components/ui/Checkbox'
import RichTextEditor from '@/components/shared/RichTextEditor'
import { useNavigate } from 'react-router-dom'

type FormModel = {
    id: number
    bungalowName: string
    description: string
    contactNumber: string
    address: string
    noOfRooms: number
    maxBookingPeriod: number
    isCloded: boolean
    reopenDate?: string | null
    maxOccupancy: number
    lastUpdateBy?: string
}

const EditBungalow = () => {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    const { getUserFromLocalStorage } = useCommon()

    const selectedRow = useAppSelector(
        (state) => state.BungalowData.data.selectedRow
    )

    console.log(selectedRow)

    const onSubmit = (
        formValue: FormModel,
        setSubmitting: (isSubmitting: boolean) => void
    ) => {
        setSubmitting(true)

        const {
            id,
            bungalowName,
            description,
            contactNumber,
            address,
            noOfRooms,
            maxBookingPeriod,
            isCloded,
            reopenDate,
            maxOccupancy,
        } = formValue

        const values = {
            id: id,
            bungalowName: bungalowName,
            description: description,
            address: address,
            contactNumber: contactNumber,
            perDayCost: 0,
            noOfRooms: noOfRooms,
            maxBookingPeriod: maxBookingPeriod,
            mainImg: '',
            reopenDate: reopenDate,
            isCloded: isCloded,
            maxOccupancy: maxOccupancy,
            lastUpdateBy: getUserFromLocalStorage().userID,
        }

        dispatch(editBungalow(values))

        openNotification('success', bungalowName + ' has updated')

        dispatch(toggleEditBungalowDialog(false))
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
            <div className="lg:flex items-center justify-between mb-4">
                <h2>Edit Bungalow</h2>
            </div>
            <Formik
                initialValues={{
                    id: selectedRow.id || 0,
                    bungalowName: selectedRow.bungalowName || '',
                    description: selectedRow.description || '',
                    contactNumber: selectedRow.contactNumber || '',
                    address: selectedRow.address || '',
                    noOfRooms: selectedRow.noOfRooms || 0,
                    maxBookingPeriod: selectedRow.maxBookingPeriod || 0,
                    isCloded: selectedRow.isCloded || false,
                    reopenDate: selectedRow.reopenDate || null,
                    maxOccupancy: selectedRow.maxOccupancy || 0,
                }}
                enableReinitialize={true}
                //validationSchema={validationSchema}
                onSubmit={(values, { setSubmitting }) => {
                    onSubmit(values, setSubmitting)
                    setSubmitting(true)
                }}
            >
                {({ values, touched, errors, setFieldValue, isSubmitting }) => (
                    <Form>
                        <FormContainer>
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                                <div className="lg:col-span-2">
                                    <FormItem
                                        label="Bungalow Name:"
                                        invalid={
                                            touched.bungalowName &&
                                            !!errors.bungalowName
                                        }
                                        errorMessage={errors.bungalowName}
                                    >
                                        <Field
                                            as={Input}
                                            name="bungalowName"
                                            placeholder="Enter bungalow name"
                                        />
                                    </FormItem>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="..">
                                            <FormItem
                                                label="Address:"
                                                invalid={
                                                    touched.address &&
                                                    !!errors.address
                                                }
                                                errorMessage={errors.address}
                                            >
                                                <Field
                                                    as={Input}
                                                    name="address"
                                                    placeholder="Enter bungalow Address"
                                                />
                                            </FormItem>
                                        </div>
                                        <div className="..">
                                            <FormItem
                                                label="Contact Number:"
                                                invalid={
                                                    touched.contactNumber &&
                                                    !!errors.contactNumber
                                                }
                                                errorMessage={
                                                    errors.contactNumber
                                                }
                                            >
                                                <Field
                                                    as={Input}
                                                    name="contactNumber"
                                                    placeholder="Enter Contact Number"
                                                />
                                            </FormItem>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="..">
                                            <FormItem
                                                label="No Of Rooms:"
                                                invalid={
                                                    touched.noOfRooms &&
                                                    !!errors.noOfRooms
                                                }
                                                errorMessage={errors.noOfRooms}
                                            >
                                                <Field
                                                    as={Input}
                                                    name="noOfRooms"
                                                    placeholder="Enter No Of Rooms"
                                                />
                                            </FormItem>
                                        </div>
                                        <div className="..">
                                            <FormItem
                                                label="Maximum Occupancy:"
                                                invalid={
                                                    touched.maxOccupancy &&
                                                    !!errors.maxOccupancy
                                                }
                                                errorMessage={
                                                    errors.maxOccupancy
                                                }
                                            >
                                                <Field
                                                    as={Input}
                                                    name="maxOccupancy"
                                                    placeholder="Maximum Occupancy"
                                                />
                                            </FormItem>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="..">
                                            <FormItem
                                                label="max Booking Period:"
                                                invalid={
                                                    touched.maxBookingPeriod &&
                                                    !!errors.maxBookingPeriod
                                                }
                                                errorMessage={
                                                    errors.maxBookingPeriod
                                                }
                                            >
                                                <Field
                                                    as={Input}
                                                    name="maxBookingPeriod"
                                                    placeholder="Enter max Booking Period"
                                                />
                                            </FormItem>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-1 gap-4">
                                        <FormItem
                                            label="Description"
                                            labelClass="!justify-start"
                                            invalid={
                                                (errors.description &&
                                                    touched.description) as boolean
                                            }
                                            errorMessage={errors.description}
                                        >
                                            <Field name="description">
                                                {({
                                                    field,
                                                    form,
                                                }: FieldProps) => (
                                                    <RichTextEditor
                                                        value={field.value}
                                                        onChange={(val) =>
                                                            form.setFieldValue(
                                                                field.name,
                                                                val
                                                            )
                                                        }
                                                    />
                                                )}
                                            </Field>
                                        </FormItem>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="..">
                                            <FormItem
                                                label="Close for Maintenance:"
                                                invalid={
                                                    touched.isCloded &&
                                                    !!errors.isCloded
                                                }
                                                errorMessage={errors.isCloded}
                                            >
                                                <Field
                                                    type="checkbox"
                                                    name="isCloded"
                                                    as={Checkbox}
                                                    checked={values.isCloded}
                                                    onChange={() =>
                                                        setFieldValue(
                                                            'isCloded',
                                                            !values.isCloded
                                                        )
                                                    }
                                                />
                                            </FormItem>
                                        </div>
                                        <div className="..">
                                            {values.isCloded && (
                                                <>
                                                    <FormItem
                                                        label="Reopen Date"
                                                        invalid={
                                                            errors.reopenDate &&
                                                            touched.reopenDate
                                                        }
                                                        errorMessage={
                                                            errors.reopenDate
                                                        }
                                                    >
                                                        <Field
                                                            name="reopenDate"
                                                            placeholder="Reopen Date"
                                                        >
                                                            {({
                                                                field,
                                                                form,
                                                            }: FieldProps) => (
                                                                <DatePicker
                                                                    field={
                                                                        field
                                                                    }
                                                                    form={form}
                                                                    value={
                                                                        field.value
                                                                    }
                                                                    onChange={(
                                                                        date
                                                                    ) => {
                                                                        form.setFieldValue(
                                                                            field.name,
                                                                            date
                                                                        )
                                                                    }}
                                                                />
                                                            )}
                                                        </Field>
                                                    </FormItem>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="lg:col-span-1">
                                    {/* <DoubleSidedImage
                                    width={350}
                                    src="/img/others/leave.png"
                                    darkModeSrc="/img/others/leave.png"
                                /> */}
                                </div>
                            </div>
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                                <div className="col-span-6 ..."></div>
                                <div className="..">
                                    <Button
                                        size="sm"
                                        variant="twoTone"
                                        // icon={<HiOutlinePlusCircle />}
                                        onClick={() => {
                                            navigate('/CircuitBungalow')
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                    </div>
                                    <div className="..">
                                    <Button
                                        size="sm"
                                        variant="twoTone"
                                        type="submit"
                                        // icon={<HiOutlinePlusCircle />}
                                        // onClick={onDialogOpen}
                                    >
                                        Edit Bungalow
                                    </Button>
                                    </div>


                            </div>
                        </FormContainer>
                    </Form>
                )}
            </Formik>
        </>
    )
}

export default EditBungalow
