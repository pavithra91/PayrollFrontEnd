import { Field, Form, Formik, FieldProps } from 'formik'
import {
    AllSupervisorData,
    useAppDispatch,
    useAppSelector,
    toggleNewSupervisorDialog,
    addSupervisor,
    getSupervisorData,
} from '../store'
import { Select } from '@/components/ui/Select'
import { FormItem, FormContainer } from '@/components/ui/Form'
import AsyncSelect from 'react-select/async'
import { useState } from 'react'
import Button from '@/components/ui/Button'
import useCommon from '@/utils/hooks/useCommon'
import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'

type FormModel = {
    userId: string
    epf: string
    isActive: boolean
    createdBy?: string
}

const AddSupervisor = () => {
    const dispatch = useAppDispatch()

    const { getUserFromLocalStorage } = useCommon()

    const employeeData = useAppSelector(
        (state) => state.SupervisorData.data.employeeData
    )

    var arr: { value: string; label: string }[] = []

    employeeData.map((items) => {
        arr.push({ value: items.epf, label: items.empName + ' - ' + items.epf })
    })

    const onSubmit = (
        formValue: FormModel,
        setSubmitting: (isSubmitting: boolean) => void
    ) => {
        setSubmitting(true)

        const { userId, epf } = formValue

        const values = {
            userId: userId,
            epf: epf,
            isActive: true,
            createdBy: getUserFromLocalStorage().userID,
        }

        dispatch(addSupervisor(values))

        openNotification(
            'success',
            'User ' + userId + ' has added as a Supervisor'
        )

        dispatch(toggleNewSupervisorDialog(false))
    }

    const filterEmployees = (inputValue: string) => {
        return arr.filter((i) =>
            i.label.toLowerCase().includes(inputValue.toLowerCase())
        )
    }

    const loadOptions = (
        inputValue: string,
        callback: (arg0: AllSupervisorData[]) => void
    ) => {
        setTimeout(() => {
            callback(filterEmployees(inputValue))
        }, 1000)
    }

    const [_, setValue] = useState('')

    const handleInputChange = (newValue: string) => {
        const inputValue = newValue.replace(/\W/g, '')
        setValue(inputValue)
        return inputValue
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
                    userId: '',
                    epf: '',
                    isActive: true,
                }}
                enableReinitialize={true}
                //validationSchema={validationSchema}
                onSubmit={(values, { setSubmitting }) => {
                    values.userId = values.epf
                    values.epf = values.epf
                    onSubmit(values, setSubmitting)
                    setSubmitting(true)
                }}
            >
                {({ values, touched, errors, setFieldValue, isSubmitting }) => (
                    <Form>
                        <FormContainer>
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                                <div className="col-span-2 ...">
                                    <FormItem
                                        invalid={
                                            (errors.epf && touched.epf) as ''
                                        }
                                        errorMessage={errors.epf as string}
                                    >
                                        <Field name="epf">
                                            {({ field, form }: FieldProps) => (
                                                <Select
                                                    cacheOptions
                                                    loadOptions={loadOptions}
                                                    defaultOptions
                                                    onInputChange={
                                                        handleInputChange
                                                    }
                                                    componentAs={AsyncSelect}
                                                    onChange={(option) => {
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
                                    <Button
                                        size="sm"
                                        variant="twoTone"
                                        type="submit"
                                        // icon={<HiOutlinePlusCircle />}
                                        // onClick={onDialogOpen}
                                    >
                                        Add to Supervisor
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

export default AddSupervisor
