import type { CompanyIdSelectOption, ResetOptions } from '@/@types/common'
import { FC, useState } from 'react'
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
import useTimeOutMessage from '@/utils/hooks/useTimeOutMessage'
import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import Checkbox from '@/components/ui/Checkbox/Checkbox'
import useCommon from '@/utils/hooks/useCommon'
import * as Yup from 'yup'

interface RenderProps<V = any> {
    field: FieldInputProps<V>
    meta: FieldMetaProps<V>
    helpers: FieldHelperProps<V>
}

interface FieldWrapperProps<V = any> {
    name: string
    render: (formikProps: RenderProps<V>) => React.ReactElement
}

const companyOptions: CompanyIdSelectOption[] = [
    { value: 2000, label: '2000' },
    { value: 3000, label: '3000' },
]

type FormLayout = 'inline'

const FieldWrapper: FC<FieldWrapperProps> = ({ name, render }) => {
    const [field, meta, helpers] = useField(name)

    return render({ field, meta, helpers })
}

const validationSchema = Yup.object().shape({
    companyCode: Yup.object().required('Please select Company Code'),
    period: Yup.number().required('Please enter Period'),
})

const Develeopment = () => {
    const { deleteData } = useCommon()

    const [layout, setLayout] = useState<FormLayout>('inline')
    const [message, setMessage] = useTimeOutMessage()

    const [isSubmitting, setisSubmitting] = useState(false)

    const onSubmit = async (values: ResetOptions) => {
        const { companyCode, period, resetData, resetTempData } = values

        setisSubmitting(true)

        if (resetData != false && resetTempData != false) {
            const result = await deleteData(values)

            if (result?.status === 'failed') {
                setMessage(result.message)
                openNotification(
                    'Error',
                    'danger',
                    'Error Occurred While Deleting Data : ' + result.message
                )
            } else {
                setMessage('Successfully Deleted')
                openNotification(
                    'Success',
                    'success',
                    'Data Deleted Successfully'
                )
            }
        } else {
            openNotification(
                'Error',
                'danger',
                'Please Select at least one Option!'
            )
        }

        setisSubmitting(false)
    }

    const openNotification = (
        title: string,
        type: 'success' | 'warning' | 'danger' | 'info',
        message: string
    ) => {
        toast.push(
            <Notification
                title={title.charAt(0).toUpperCase() + title.slice(1)}
                type={type}
            >
                {message}
            </Notification>
        )
    }

    const getUserIDFromLocalStorage = () => {
        const user = JSON.parse(localStorage.getItem('admin') ?? '')
        const userID = JSON.parse(user.auth).user.userID
        return userID
    }

    return (
        <>
            <Card header="Reset Data">
                <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-10 ...">
                        <Formik<ResetOptions>
                            validationSchema={validationSchema}
                            initialValues={{
                                companyCode: 3000,
                                period: 202312,
                                resetData: true,
                                resetTempData: false,
                            }}
                            onSubmit={(values) => {
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
                                </FormContainer>

                                <FormContainer>
                                    <FormItem>
                                        <Field
                                            color="green-500"
                                            className="mb-0"
                                            name="resetData"
                                            component={Checkbox}
                                        >
                                            Reset Data
                                        </Field>
                                    </FormItem>

                                    <FormItem>
                                        <Field
                                            color="green-500"
                                            className="mb-0"
                                            name="resetTempData"
                                            component={Checkbox}
                                        >
                                            Delete Temp Data
                                        </Field>
                                    </FormItem>

                                    <FormItem>
                                        <Button
                                            type="submit"
                                            color="red-500"
                                            variant="solid"
                                            loading={isSubmitting}
                                        >
                                            {isSubmitting
                                                ? 'Deleting'
                                                : 'Delete Data'}
                                        </Button>
                                    </FormItem>
                                </FormContainer>
                            </Form>
                        </Formik>
                    </div>

                    <div className="col-span-1..."></div>
                </div>
            </Card>
            <div className="mb-4"></div>
            <Card></Card>
        </>
    )
}
export default Develeopment
