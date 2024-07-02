import type { SelectOption } from '@/@types/common'
import { FC, useEffect, useState } from 'react'
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
import { PayrollDataSchema } from '@/@types/payroll'
import useCommon from '@/utils/hooks/useCommon'
import UnrecoveredTableView from './UnrecoveredTableView'
import { FaFilePdf, FaRegFileExcel } from 'react-icons/fa'
import Avatar from '@/components/ui/Avatar/Avatar'
import { downloadExcel } from 'react-export-table-to-excel'
import Tooltip from '@/components/ui/Tooltip/Tooltip'
import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'

interface RenderProps<V = any> {
    field: FieldInputProps<V>
    meta: FieldMetaProps<V>
    helpers: FieldHelperProps<V>
}

interface FieldWrapperProps<V = any> {
    name: string
    render: (formikProps: RenderProps<V>) => React.ReactElement
}

const companyOptions: SelectOption[] = [
    { value: 2000, label: '2000' },
    { value: 3000, label: '3000' },
]

type FormLayout = 'inline'

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

const FieldWrapper: FC<FieldWrapperProps> = ({ name, render }) => {
    const [field, meta, helpers] = useField(name)

    return render({ field, meta, helpers })
}
const UnrecoveredView = () => {
    const { getUnrecoveredList } = useCommon()

    const [layout, setLayout] = useState<FormLayout>('inline')

    const [dataFromChild, setDataFromChild] =
        useState<PayrollDataSchema | null>(null)

    const [UnrecoveredData, setUnrecoveredData] = useState<UnRecoveredData[]>(
        []
    )

    type UnRecoveredData = {
        epf: number
        costCenter: string
        location: string
        payCode: number
        amount: number
    }

    const onSubmit = async (values: PayrollDataSchema) => {
        const { companyCode, period } = values

        if (values != null) {
            setDataFromChild(values)
        }
    }

    useEffect(() => {
        if (dataFromChild != null) {
            const unrecoveredResults = getUnrecoveredList(dataFromChild)

            unrecoveredResults.then((res) => {
                if (res?.status == 'success') {
                    const listItems = JSON.parse(res?.data?.data ?? '')
                    setUnrecoveredData(listItems)
                } else {
                    setUnrecoveredData([])
                }
            })
        }
    }, [dataFromChild])

    const header = ['EPF', 'Cost Center', 'Location', 'Pay Code', 'Amount']

    function handleDownloadExcel() {
        if (UnrecoveredData.length == 0) {
            openNotification(
                'danger',
                'No Data Found',
                'Please load data to download'
            )
            return
        }
        downloadExcel({
            fileName: 'Unrecovered_report - ' + dataFromChild?.period,
            sheet: dataFromChild?.period + '',
            tablePayload: {
                header,
                // accept two different data structures
                body: UnrecoveredData,
            },
        })
    }

    return (
        <>
            <Card header="Unrecovered List Report">
                <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-10 ...">
                        <Formik
                            initialValues={{
                                companyCode: 0,
                                period: 202312,
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
                                    <FormItem>
                                        <Button type="submit">Load</Button>
                                    </FormItem>
                                </FormContainer>
                            </Form>
                        </Formik>
                    </div>

                    <div className="col-span-1..."></div>

                    <div className="col-span-1...">
                        <div className="grid grid-cols-12 gap-4">
                            <div className="col-span-3 ...">
                                <Tooltip
                                    title="Download to Excel File"
                                    placement="top"
                                >
                                    <Avatar
                                        className="mr-4 bg-emerald-500"
                                        icon={<FaRegFileExcel />}
                                        onClick={handleDownloadExcel}
                                    />
                                </Tooltip>
                            </div>
                            <div className="col-span-3 ...">
                                <Tooltip
                                    title="Download to PDF File"
                                    placement="top"
                                >
                                    <Avatar
                                        className="mr-4 bg-red-500"
                                        icon={<FaFilePdf />}
                                        onClick={handleDownloadExcel}
                                    />
                                </Tooltip>
                            </div>

                            <div className="col-span-6 ..."></div>
                        </div>
                    </div>
                </div>
            </Card>
            <div className="mb-4"></div>
            <Card>
                <UnrecoveredTableView data={UnrecoveredData} />
            </Card>
        </>
    )
}

export default UnrecoveredView
