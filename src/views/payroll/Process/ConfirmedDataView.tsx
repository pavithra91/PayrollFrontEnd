import type { CommonProps, CompanyIdSelectOption } from '@/@types/common'
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

interface FormProps extends CommonProps {
    disableSubmit?: boolean
}

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

const ConfirmedDataView = (props: FormProps) => {
    const [layout, setLayout] = useState<FormLayout>('inline')

    return (
        <>
            <Card header="Process">
                <Formik
                    initialValues={{
                        companyCode: '',
                        period: '202312',
                    }}
                    onSubmit={async (values) => {
                        await new Promise((r) => setTimeout(r, 500))
                        alert(JSON.stringify(values, null, 2))
                    }}
                >
                    <Form>
                        <FormContainer layout={layout}>
                            <div className="grid grid-cols-1 gap-4">
                                <FieldWrapper
                                    name="companyCode"
                                    render={({ field, meta, helpers }) => (
                                        <FormItem
                                            label="Company Code"
                                            invalid={
                                                !!meta.error && meta.touched
                                            }
                                            errorMessage={meta.error}
                                        >
                                            <Select
                                                name="companyCode"
                                                id="companyCode"
                                                value={field.value}
                                                onChange={(value) => {
                                                    helpers.setValue(value)
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
                            <FormItem>
                                <Button type="submit">Load</Button>
                            </FormItem>
                        </FormContainer>
                    </Form>
                </Formik>
            </Card>
        </>
    )
}
export default ConfirmedDataView
