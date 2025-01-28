import Button from '@/components/ui/Button'
import { Formik, Field, Form, FieldProps } from 'formik'
import { FormItem, FormContainer } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Card from '@/components/ui/Card'
import {
    FieldHelperProps,
    FieldInputProps,
    FieldMetaProps,
    useField,
} from 'formik'
import { useState } from 'react'
import { SelectOption } from '@/@types/common'
import Select from '@/components/ui/Select'
import reducer, {
    AllPayrollData,
    getPayrunByPeriod,
    processPayroll,
    simulatePayroll,
    toggleProcessPayrollDialog,
    useAppDispatch,
    useAppSelector,
} from './store'
import { injectReducer } from '@/store'
import useCommon from '@/utils/hooks/useCommon'

injectReducer('PaymentData', reducer)

type FormModel = {
    companyCode: number
    period: number
}


const companyOptions: SelectOption[] = [
    { value: 2000, label: '2000' },
    { value: 3000, label: '3000' },
]

const PayrollProcess = () => {

    const dispatch = useAppDispatch()
    const [payrollData, setPayrollData] = useState()
    const [simulateData, setSimulatePayrollData] = useState()
    const { getUserIDFromLocalStorage } = useCommon()

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
    
            dispatch(getPayrunByPeriod(values)).then((res: any) => {

                const listItems = JSON.parse(res.payload.data ?? '')

                if (listItems.length > 0) {
                    if(listItems[0].payrunStatus == "Confirmed")
                    {
                        dispatch(toggleProcessPayrollDialog(true))

                        const values = {
                            companyCode: companyCode,
                            period: period,
                            approvedBy: getUserIDFromLocalStorage()
                        }

                        dispatch(simulatePayroll(values)).then((res: any) => {

                        })
                    }
                }
            })
        }

    return (
        <>
            <div className="col-span-4 ...">
                <Formik
                    initialValues={{
                        companyCode: 0,
                        period: 202409,
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
                                            <div className="...">
                                                <FormItem
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
                                            <div className="flex justify-end">
                                                <FormItem label="Period">
                                                    <Field
                                                        type="text"
                                                        name="period"
                                                        placeholder="Please enter Period"
                                                        component={Input}
                                                    />
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
                                            <div className="..."></div>
                                        </div>
                                    </div>
                                </div>
                            </FormContainer>
                        </Form>
                    )}
                </Formik>
            </div>
        </>
    )
}
export default PayrollProcess
