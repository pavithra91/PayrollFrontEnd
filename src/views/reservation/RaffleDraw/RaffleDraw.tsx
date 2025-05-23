import { useEffect, useState } from 'react'
import { AdaptableCard } from '@/components/shared'
import { injectReducer } from '@/store'
import reducer, {
    AllRaffleDrawData,
    getRaffleDrawData,
    useAppDispatch,
    useAppSelector,
} from './store'
import useCommon from '@/utils/hooks/useCommon'
import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import Button from '@/components/ui/Button'
import { Field, Form, Formik, FieldProps } from 'formik'
import { FormItem, FormContainer } from '@/components/ui/Form'
import DatePicker from '@/components/ui/DatePicker'
import RaffleDrawData from './components/RaffleDrawData'

injectReducer('RaffleDrawData', reducer)

type FormModel = {
    raffleDrawDate: Date | string
}

const RaffleDraw = () => {
    const dispatch = useAppDispatch()
    const { getUserFromLocalStorage } = useCommon()
    const [raffleDraData, setRaffleDraData] = useState<AllRaffleDrawData[]>([])

    const data = useAppSelector(
        (state) => state.RaffleDrawData.data.raffleDrawData
    )

    const loading = useAppSelector((state) => state.RaffleDrawData.data.loading)

    const tableData = useAppSelector(
        (state) => state.RaffleDrawData.data.tableData
    )

    const onSubmit = (
        formValue: FormModel,
        setSubmitting: (isSubmitting: boolean) => void
    ) => {
        setSubmitting(true)

        const { raffleDrawDate } = formValue

        const values = {
            raffleDrawDate: raffleDrawDate,
        }

        dispatch(getRaffleDrawData(values)).then((res: any) => {
            const fetchedData = res.payload.items

            console.log(fetchedData)

            setRaffleDraData(fetchedData)

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
                    <h3 className="mb-4 lg:mb-0">Raffle Draw Results</h3>
                </div>

                <div className="lg:flex items-center justify-between mb-4">
                    <h3 className="mb-4 lg:mb-0"></h3>

                    <div className="flex flex-col md:flex-row md:items-right gap-1">
                        <Formik
                            initialValues={{
                                raffleDrawDate: '',
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
                                                <div className="flex flex-wrap gap-4 justify-end">
                                                    <div className="flex justify-end">
                                                        <FormItem
                                                            // label="Raffle Draw Date"
                                                            invalid={
                                                                errors.raffleDrawDate &&
                                                                touched.raffleDrawDate
                                                            }
                                                            errorMessage={
                                                                errors.raffleDrawDate
                                                            }
                                                        >
                                                            <Field
                                                                name="raffleDrawDate"
                                                                placeholder="Raffle Draw Date"
                                                            >
                                                                {({
                                                                    field,
                                                                    form,
                                                                }: FieldProps) => (
                                                                    <DatePicker
                                                                        field={
                                                                            field
                                                                        }
                                                                        form={
                                                                            form
                                                                        }
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
                                                    </div>
                                                    <div className="text-right">
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
                                            </div>
                                        </div>
                                    </FormContainer>
                                </Form>
                            )}
                        </Formik>
                    </div>
                </div>

                {raffleDraData.length != 0 && (
                    <>
                        <RaffleDrawData data={raffleDraData} />
                    </>
                )}
            </AdaptableCard>
        </>
    )
}

export default RaffleDraw
