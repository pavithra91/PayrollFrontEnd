import { Field, Form, Formik, FieldProps } from 'formik'
import { createReservation, useAppDispatch } from '../store'
import { FormItem, FormContainer } from '@/components/ui/Form'
import Button from '@/components/ui/Button'
import useCommon from '@/utils/hooks/useCommon'
import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import { Input } from '@/components/ui/Input'
import { DatePicker } from '@/components/ui/DatePicker'
import { useNavigate } from 'react-router-dom'
import { Select } from '@/components/ui/Select'
import { SelectOption } from '@/@types/common'
import Checkbox from '@/components/ui/Checkbox'
import { getBungalowData, useAppSelector } from '../../Bungalows/store'
import { useEffect, useState } from 'react'
import { DoubleSidedImage } from '@/components/shared'
import Dialog from '@/components/ui/Dialog'

const companyOptions: SelectOption[] = [
    { value: 2000, label: '2000' },
    { value: 3000, label: '3000' },
]

const categoryOptions: SelectOption[] = [
    { value: 1, label: 'CPSTL Employee' },
    { value: 2, label: 'CPC Employee' },
    { value: 3, label: 'Retired Employee' },
    { value: 4, label: 'External Reservation' },
]

type FormModel = {
    companyCode: number
    bungalowid: number
    category: number
    checkInDate: string | Date
    checkOutDate: string | Date
    noOfAdults: number
    noOfChildren: number
    contactNumber_1: string
    contactNumber_2?: string
    isAgree: boolean
}

// const validationSchema = Yup.object().shape({
//     bungalowName: Yup.string().required('Bungalow name is required'),
//     price: Yup.number()
//         .typeError('Price must be a number')
//         .required('Price is required'),
//     rooms: Yup.number()
//         .typeError('Number of rooms must be a number')
//         .required('Number of rooms is required'),
//     maxBookingPeriod: Yup.number()
//         .typeError('Maximum booking period must be a number')
//         .required('Maximum booking period is required'),
//     isCloded: Yup.boolean(),
//     reopenDate: Yup.date()
//         .nullable()
//         .when('isCloded', {
//             is: true,
//             then: (schema) =>
//                 schema.required('Start date for maintenance is required'),
//         }),
//     pax: Yup.number()
//         .typeError('Number of pax must be a number')
//         .required('Number of pax is required'),
// })

const AddReservation = () => {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    const [BungalowData, setBungalowData] = useState<SelectOption[]>([])
    const [termsDialog, settermsDialog] = useState(false)

    const [imageSrc, setImageSrc] = useState('') // Default src

    const handleSelectChange = (value: string) => {
        const newSrc = '/img/bungalow/' + value + '.jpg'
        setImageSrc(newSrc)
    }

    useEffect(() => {
        fetchData()
    }, [dispatch])

    const fetchData = () => {
        var data = dispatch(getBungalowData())
        data.then((res) => {
            const listItems = (res?.payload as { items: any[] })?.items ?? []
            const formattedData = listItems.map((item: any) => ({
                value: item.id,
                label: item.bungalowName,
            }))
            setBungalowData(formattedData)
        })
    }

    const { getUserFromLocalStorage } = useCommon()

    const onOpenTerms = () => {
        settermsDialog(true)
    }

    const onTermsDialogClose = () => {
        settermsDialog(false)
        //dispatch(toggleEditBungalowDialog(false))
    }

    const onSubmit = (
        formValue: FormModel,
        setSubmitting: (isSubmitting: boolean) => void
    ) => {
        setSubmitting(true)

        const {
            companyCode,
            bungalowid,
            category,
            checkInDate,
            checkOutDate,
            noOfAdults,
            noOfChildren,
            contactNumber_1,
            contactNumber_2,
        } = formValue

        const values = {
            epf: getUserFromLocalStorage().epf,
            companyCode: companyCode,
            bungalowid: bungalowid,
            category: category,
            checkInDate: checkInDate,
            checkOutDate: checkOutDate,
            noOfAdults: noOfAdults,
            noOfChildren: noOfChildren,
            totalPax: noOfAdults + noOfChildren,
            contactNumber_1: contactNumber_1,
            contactNumber_2: contactNumber_2,
            createdBy: getUserFromLocalStorage().userID,
        }

        dispatch(createReservation(values))

        openNotification('success', 'New Bungalow has been added')

        setTimeout(() => {
            setSubmitting(false)
            navigate('/CircuitBungalow')
        }, 500)
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
                <h2>Create Reservation</h2>
            </div>

            <Formik
                initialValues={{
                    companyCode: 0,
                    epf: '',
                    bungalowid: 0,
                    category: 0,
                    checkInDate: '',
                    checkOutDate: '',
                    noOfAdults: 0,
                    noOfChildren: 0,
                    totalPax: 0,
                    contactNumber_1: '',
                    contactNumber_2: '',
                    isAgree: false,
                }}
                enableReinitialize={true}
                //validationSchema={validationSchema}
                onSubmit={(values, { setSubmitting }) => {
                    onSubmit(values, setSubmitting)
                    console.log(values)
                    setSubmitting(true)
                }}
            >
                {({ values, touched, errors, setFieldValue, isSubmitting }) => (
                    <Form>
                        <FormContainer>
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                                <div className="lg:col-span-2">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="..">
                                            <FormItem
                                                label="Reservation Type"
                                                asterisk={true}
                                                invalid={
                                                    errors.category &&
                                                    touched.category
                                                }
                                                errorMessage={errors.category}
                                            >
                                                <Field name="category">
                                                    {({
                                                        field,
                                                        form,
                                                    }: FieldProps) => (
                                                        <Select<SelectOption>
                                                            field={field}
                                                            form={form}
                                                            options={
                                                                categoryOptions
                                                            }
                                                            value={categoryOptions.filter(
                                                                (option) =>
                                                                    option.value ===
                                                                    values.category
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
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="..">
                                            <FormItem
                                                label="Company Code"
                                                asterisk={true}
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
                                            <FormItem
                                                label="Bangalow"
                                                asterisk={true}
                                                invalid={
                                                    errors.bungalowid &&
                                                    touched.bungalowid
                                                }
                                                errorMessage={errors.bungalowid}
                                            >
                                                <Field name="bungalowid">
                                                    {({
                                                        field,
                                                        form,
                                                    }: FieldProps) => (
                                                        <Select<SelectOption>
                                                            field={field}
                                                            form={form}
                                                            options={
                                                                BungalowData
                                                            }
                                                            value={BungalowData.filter(
                                                                (option) =>
                                                                    option.value ===
                                                                    values.bungalowid
                                                            )}
                                                            onChange={(
                                                                option
                                                            ) => {
                                                                form.setFieldValue(
                                                                    field.name,
                                                                    option?.value
                                                                )
                                                                handleSelectChange(
                                                                    option?.value.toString() ||
                                                                        ''
                                                                )
                                                            }}
                                                        />
                                                    )}
                                                </Field>
                                            </FormItem>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="..">
                                            <FormItem
                                                asterisk={true}
                                                label="Check In Date"
                                                invalid={
                                                    errors.checkInDate &&
                                                    touched.checkInDate
                                                }
                                                errorMessage={
                                                    errors.checkInDate
                                                }
                                            >
                                                <Field
                                                    name="checkInDate"
                                                    placeholder="Check In Date"
                                                >
                                                    {({
                                                        field,
                                                        form,
                                                    }: FieldProps) => (
                                                        <DatePicker
                                                            field={field}
                                                            form={form}
                                                            value={field.value}
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
                                        </div>
                                        <div className="..">
                                            <FormItem
                                                asterisk={true}
                                                label="Check Out Date"
                                                invalid={
                                                    errors.checkOutDate &&
                                                    touched.checkOutDate
                                                }
                                                errorMessage={
                                                    errors.checkOutDate
                                                }
                                            >
                                                <Field
                                                    name="checkOutDate"
                                                    placeholder="Check Out Date"
                                                >
                                                    {({
                                                        field,
                                                        form,
                                                    }: FieldProps) => (
                                                        <DatePicker
                                                            field={field}
                                                            form={form}
                                                            value={field.value}
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
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="..">
                                            <FormItem
                                                asterisk={true}
                                                label="No Of Adults:"
                                                invalid={
                                                    touched.noOfAdults &&
                                                    !!errors.noOfAdults
                                                }
                                                errorMessage={errors.noOfAdults}
                                            >
                                                <Field
                                                    as={Input}
                                                    name="noOfAdults"
                                                    placeholder="Enter No Of Adults"
                                                />
                                            </FormItem>
                                        </div>
                                        <div className="..">
                                            <FormItem
                                                label="No Of Children:"
                                                invalid={
                                                    touched.noOfChildren &&
                                                    !!errors.noOfChildren
                                                }
                                                errorMessage={
                                                    errors.noOfChildren
                                                }
                                            >
                                                <Field
                                                    as={Input}
                                                    name="noOfChildren"
                                                    placeholder="No Of Children"
                                                />
                                            </FormItem>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="..">
                                            <FormItem
                                                asterisk={true}
                                                label="Contact Number 1:"
                                                invalid={
                                                    touched.contactNumber_1 &&
                                                    !!errors.contactNumber_1
                                                }
                                                errorMessage={
                                                    errors.contactNumber_1
                                                }
                                            >
                                                <Field
                                                    as={Input}
                                                    name="contactNumber_1"
                                                    placeholder="Enter Contact Number"
                                                />
                                            </FormItem>
                                        </div>
                                        <div className="..">
                                            <FormItem
                                                label="Contact Number 2:"
                                                invalid={
                                                    touched.contactNumber_2 &&
                                                    !!errors.contactNumber_2
                                                }
                                                errorMessage={
                                                    errors.contactNumber_2
                                                }
                                            >
                                                <Field
                                                    as={Input}
                                                    name="Contact Number 2"
                                                    placeholder="Enter Contact Number 2"
                                                />
                                            </FormItem>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="..">
                                            <div className="grid grid-flow-col auto-cols-max gap-4">
                                                <div className="..">
                                                    <FormItem
                                                        //label="Agree to Terms & Condition:"
                                                        invalid={
                                                            touched.isAgree &&
                                                            !!errors.isAgree
                                                        }
                                                        errorMessage={
                                                            errors.isAgree
                                                        }
                                                    >
                                                        <Field
                                                            type="checkbox"
                                                            name="isAgree"
                                                            as={Checkbox}
                                                            checked={
                                                                values.isAgree
                                                            }
                                                            onChange={() =>
                                                                setFieldValue(
                                                                    'isAgree',
                                                                    !values.isAgree
                                                                )
                                                            }
                                                        ></Field>
                                                    </FormItem>
                                                </div>
                                                <div
                                                    className=".."
                                                    onClick={onOpenTerms}
                                                >
                                                    Agree to
                                                    <strong className="text-blue-500">
                                                        {' '}
                                                        Terms & Condition{' '}
                                                    </strong>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="lg:col-span-1">
                                    <DoubleSidedImage
                                        width={350}
                                        src={imageSrc}
                                        darkModeSrc="/img/others/leave.png"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                                <div className="col-span-6 ..."></div>
                                <div className="..">
                                    <Button
                                        size="sm"
                                        variant="twoTone"
                                        type="submit"
                                        // icon={<HiOutlinePlusCircle />}
                                        // onClick={onDialogOpen}
                                    >
                                        Create Reservation
                                    </Button>
                                </div>
                            </div>
                        </FormContainer>
                    </Form>
                )}
            </Formik>

            <Dialog
                isOpen={termsDialog}
                onClose={onTermsDialogClose}
                onRequestClose={onTermsDialogClose}
            >
                <h4>Terms & Conditions</h4>
                <div className="mt-4">
                    <embed
                        src="/Terms.pdf"
                        width="100%"
                        height="500px"
                        type="application/pdf"
                    />
                </div>
            </Dialog>
        </>
    )
}

export default AddReservation
