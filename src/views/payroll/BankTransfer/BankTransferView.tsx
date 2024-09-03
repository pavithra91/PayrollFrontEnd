import type { CommonProps, SelectOption } from '@/@types/common'
import { FC, useEffect, useMemo, useState } from 'react'
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
import usePayrun from '@/utils/hooks/usePayrun'
import { PayrollDataSchema } from '@/@types/payroll'
import useTimeOutMessage from '@/utils/hooks/useTimeOutMessage'
import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import useCommon from '@/utils/hooks/useCommon'
import ConfirmData from './ConfirmData'
import BankFileView from './BankFileView'

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

type FormLayout = 'inline'

const companyOptions: SelectOption[] = [
    { value: 2000, label: '2000' },
    { value: 3000, label: '3000' },
]

const FieldWrapper: FC<FieldWrapperProps> = ({ name, render }) => {
    const [field, meta, helpers] = useField(name)

    return render({ field, meta, helpers })
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

const BankTransferView = (props: FormProps) => {
    const [layout, setLayout] = useState<FormLayout>('inline')
    const [isDataLoad, setisDataLoad] = useState(false)

    const [dataFromChild, setDataFromChild] =
        useState<PayrollDataSchema | null>(null)

    const [isConfirmOpen, setIsConfirmOpen] = useState(false)

    const openConfirmDialog = () => {
        setIsConfirmOpen(true)
    }

    const closeConfirmDialog = () => {
        setIsConfirmOpen(false)
    }

    type DataFromBankFile = {
        id: number
        epf: string
        isPaysheetUploaded: boolean
        isSMSSend: boolean
        message: string
    }

    interface ConfirmDialogData {
        companyCode?: number
        period?: number
    }

    let _confirmData: ConfirmDialogData = {
        companyCode: 0,
        period: 0,
    }

    const [dataFromBankFile, setDataFromBankFile] = useState<DataFromBankFile>()

    const handleChildData = (data: any) => {
        setDataFromBankFile(data)
        setisDataLoad(true)
    }

    const onSubmit = async (values: PayrollDataSchema) => {
        const { companyCode, period } = values

        if (values != null) {
            setDataFromChild(values)
            openNotification('success', 'Load Data', 'Data Load Successfully')
        } else {
            openNotification('warning', 'Warning', 'Failed to load Data')
        }
    }

    _confirmData.companyCode = dataFromChild?.companyCode
    _confirmData.period = dataFromChild?.period

    return (
        <>
            <Card header="Create Bank Transfer">
                <div className="grid grid-cols-6 gap-4">
                    <div className="col-span-4 ...">
                        <Formik
                            initialValues={{
                                companyCode: 0,
                                period: 202406,
                            }}
                            onSubmit={(values, { setSubmitting }) => {
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
                                    <FormItem>
                                        <Button type="submit">Load</Button>
                                    </FormItem>
                                </FormContainer>
                            </Form>
                        </Formik>
                    </div>

                    <span className="mr-1 font-semibold">
                        <Button
                            variant="solid"
                            color="green-500"
                            onClick={openConfirmDialog}
                        >
                            Create Bank Transfer
                        </Button>
                        {isConfirmOpen && (
                            <ConfirmData
                                onClose={closeConfirmDialog}
                                isConfirmOpen={isConfirmOpen}
                                props={props}
                                data={_confirmData}
                                onSendData={handleChildData}
                            />
                        )}
                    </span>
                </div>
            </Card>
            <div className="mb-4"></div>
            {isDataLoad && (
                <Card>
                    <BankFileView props={props} data={dataFromBankFile} />
                </Card>
            )}
        </>
    )
}
export default BankTransferView
