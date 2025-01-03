import { useEffect, useState } from 'react'
import { AdaptableCard } from '@/components/shared'
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
import DatePickerRange from '@/components/ui/DatePicker/DatePickerRange'
import { getCategoryData } from '../Bungalows/store'
import { SelectOption } from '@/@types/common'
import { Select } from '@/components/ui/Select'

injectReducer('PaymentData', reducer)

type FormModel = {
    category: number
    fromDate: Date | string
    toDate: Date | string
}

const ReservationPayments = () => {
    const dispatch = useAppDispatch()
    const { getUserFromLocalStorage } = useCommon()

    const [categoryData, setCategoryData] = useState<SelectOption[]>([])
    const [dateRange, setDateRange] = useState<[Date | null, Date | null]>()
    const [paymentData, setPaymentData] = useState<AllPaymentData>()

    const data = useAppSelector((state) => state.PaymentData.data.paymentData)

    const loading = useAppSelector((state) => state.PaymentData.data.loading)

    const tableData = useAppSelector(
        (state) => state.PaymentData.data.tableData
    )

    useEffect(() => {
        var categories = dispatch(getCategoryData())

        categories.then((res) => {
            const listItems = (res?.payload as { items: any[] })?.items ?? []
            var formattedData = listItems.map((item: any) => ({
                value: item.id,
                label: item.categoryName,
            }))

            setCategoryData(formattedData)
        })
    }, [dispatch])

    const onSubmit = (
        formValue: FormModel,
        setSubmitting: (isSubmitting: boolean) => void
    ) => {
        setSubmitting(true)

        const { category, fromDate, toDate } = formValue

        const values = {
            category: category,
            fromDate: fromDate,
            toDate: toDate,
        }

        dispatch(getPaymentData(values)).then((res: any) => {
            const fetchedData = res.payload.items

            console.log(fetchedData)

            setPaymentData(fetchedData)

            setSubmitting(false)

            if (fetchedData.length === 0) {
                // openNotification('warning', 'No Voucher data available')
            }
        })
    }

    return (
        <>
            <AdaptableCard>
                <div className="lg:flex items-center justify-between mb-4">
                    <h3 className="mb-4 lg:mb-0">Payment Processing</h3>
                </div>

                <div className="lg:flex items-center justify-between mb-4">
                    <h3 className="mb-4 lg:mb-0"></h3>

                    <div className="flex flex-col md:flex-row md:items-right gap-1">
                        <Formik
                            initialValues={{
                                category: 0,
                                fromDate: '',
                                toDate: '',
                            }}
                            enableReinitialize={true}
                            //validationSchema={validationSchema}
                            onSubmit={(values, { setSubmitting }) => {
                                onSubmit(values, setSubmitting)
                                console.log(values)
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
                                    <FormContainer>
                                        <div className="grid grid-cols-1 gap-4">
                                            <div className="flex justify-end gap-4">
                                                <FormItem
                                                    invalid={
                                                        errors.category &&
                                                        touched.category
                                                    }
                                                    errorMessage={
                                                        errors.category
                                                    }
                                                >
                                                    <Field name="category">
                                                        {({
                                                            field,
                                                            form,
                                                        }: FieldProps) => (
                                                            <Select<SelectOption>
                                                                size="sm"
                                                                field={field}
                                                                form={form}
                                                                options={
                                                                    categoryData
                                                                }
                                                                value={categoryData.filter(
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

                                                <FormItem
                                                    invalid={
                                                        touched.fromDate &&
                                                        !!errors.fromDate
                                                    }
                                                    errorMessage={
                                                        errors.fromDate
                                                    }
                                                >
                                                    <Field name="fromDate">
                                                    {({ field }: { field: any }) => (
                                                            <DatePickerRange
                                                                {...field} 
                                                                size="sm"
                                                                startDate={
                                                                    values.fromDate
                                                                }
                                                                endDate={
                                                                    values.toDate
                                                                }
                                                                value={
                                                                    dateRange
                                                                }
                                                                onChange={(
                                                                    dates
                                                                ) => {
                                                                    
                                                                    const [
                                                                        start,
                                                                        end,
                                                                    ] = dates
                                                                    setFieldValue(
                                                                        'fromDate',
                                                                        start
                                                                    )
                                                                    setFieldValue(
                                                                        'toDate',
                                                                        end
                                                                    )
                                                                }}
                                                                placeholder="Select date range"
                                                            />
                                                        )}
                                                    </Field>
                                                </FormItem>
                                                <Button
                                                    size="sm"
                                                    variant="twoTone"
                                                    type="submit"
                                                    // icon={<HiOutlinePlusCircle />}
                                                    // onClick={() => navigate('/AddReservation')}
                                                >
                                                    Load Data
                                                </Button>
                                            </div>
                                        </div>
                                    </FormContainer>
                                </Form>
                            )}
                        </Formik>
                    </div>
                </div>
            </AdaptableCard>
        </>
    )
}

export default ReservationPayments
