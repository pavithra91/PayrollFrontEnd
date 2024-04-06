import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import React from 'react'
import { Field, Form, Formik, FormikProps } from 'formik'
import { FormItem, FormContainer } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Alert from '@/components/ui/Alert'
import Select from '@/components/ui/Select'
import type { CommonProps } from '@/@types/common'
import type { FC, MouseEvent } from 'react'
import {
    FieldHelperProps,
    FieldInputProps,
    FieldMetaProps,
    useField,
} from 'formik'
import * as Yup from 'yup'
import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import useTimeOutMessage from '@/utils/hooks/useTimeOutMessage'
import { useState } from 'react'
import type { CompanyIdSelectOption, RoleSelectOption } from '@/@types/common'
import Checkbox from '@/components/ui/Checkbox'
import { AccountSchema } from '@/@types/Account'
import useAccount from '@/utils/hooks/useAccount'

interface DialogProps {
    isOpen: boolean // Type for the 'isOpen' prop
    onClose: () => void // Type for the 'onClose' prop
    props: FormProps
}

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

const roleOptions: RoleSelectOption[] = [
    { value: 'Admin', label: 'Admin' },
    { value: 'User', label: 'User' },
]

const FieldWrapper: FC<FieldWrapperProps> = ({ name, render }) => {
    const [field, meta, helpers] = useField(name)

    return render({ field, meta, helpers })
}

const getUserIDFromLocalStorage = () => {
    const user = JSON.parse(localStorage.getItem('admin') ?? '')
    const userID = JSON.parse(user.auth).user.userID
    return userID
}

const initValues: AccountSchema = {
    companyCode: companyOptions[0].value, // This will be the default one
    costCenter: '',
    epf: 0,
    empName: '',
    role: roleOptions[0].value,
    userID: '',
    password: '',
    status: false,
    createdBy: getUserIDFromLocalStorage(),
}

const validationSchema = Yup.object().shape({
    companyCode: Yup.object().required('Please select Company Code'),
    costCenter: Yup.string().required('Please enter Cost Center'),
    epf: Yup.string().required('Please enter EPF'),
    userID: Yup.string().required('Please enter User ID'),
    empName: Yup.string().required('Please enter User Name'),
    password: Yup.string().required('Please enter Password'),
    role: Yup.object().required('Please select User Role'),
})

const DialogComponent: React.FC<DialogProps> = ({ onClose, isOpen, props }) => {
    const [message, setMessage] = useTimeOutMessage()

    const { disableSubmit = false, className } = props

    const { addUser } = useAccount()

    const onSubmit = async (
        values: AccountSchema,
        setSubmitting: (isSubmitting: boolean) => void
    ) => {
        const {
            companyCode,
            costCenter,
            epf,
            empName,
            role,
            userID,
            password,
            status,
            createdBy,
        } = values
        setSubmitting(true)

        const result = await addUser({
            companyCode,
            costCenter,
            epf,
            empName,
            role,
            userID,
            password,
            status,
            createdBy,
        })

        console.log(result?.status)

        if (result?.status === 'failed') {
            setMessage(result.message)
            console.log(result.message)
            openNotification('danger', result.message)
        } else {
            setMessage('Successfully Saved')
            openNotification('success', 'User Account Created Successfully')
            onClose()
        }

        setSubmitting(false)
    }

    const [dialogIsOpen, setIsOpen] = useState(false)

    const openDialog = () => {
        setIsOpen(true)
    }

    const onDialogClose = (e: MouseEvent) => {
        console.log('onDialogClose', e)
        setIsOpen(false)
    }

    const onDialogOk = (e: MouseEvent) => {
        console.log('onDialogOk', e)
        setIsOpen(false)
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
            <Dialog isOpen={isOpen} onClose={onClose} onRequestClose={onClose}>
                <h5 className="mb-4">Create User Account</h5>

                <div className={className}>
                    {message && (
                        <Alert showIcon className="mb-4" type="danger">
                            <>{message}</>
                        </Alert>
                    )}
                    <Formik<AccountSchema>
                        initialValues={initValues}
                        validationSchema={validationSchema}
                        onSubmit={(values, { setSubmitting }) => {
                            if (!disableSubmit) {
                                const selectedCompanyCode = Array.from(
                                    Object.values(values.companyCode)
                                )

                                const selectedRole = Array.from(
                                    Object.values(values.role)
                                )

                                values.companyCode = selectedCompanyCode[0]
                                values.role = selectedRole[0]
                                console.log(values)

                                onSubmit(values, setSubmitting)
                            } else {
                                setSubmitting(false)
                            }
                        }}
                    >
                        {({
                            touched,
                            errors,
                            isSubmitting,
                        }: FormikProps<AccountSchema>) => (
                            <Form>
                                <FormContainer>
                                    <div className="grid grid-cols-2 gap-4">
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
                                        <div className="grid grid-cols-1 gap-4">
                                            <FormItem
                                                label="Cost Center"
                                                invalid={
                                                    (errors.costCenter &&
                                                        touched.costCenter) as boolean
                                                }
                                                errorMessage={errors.costCenter}
                                            >
                                                <Field
                                                    type="text"
                                                    autoComplete="off"
                                                    name="costCenter"
                                                    placeholder="Cost Center"
                                                    component={Input}
                                                />
                                            </FormItem>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <FormItem
                                            label="EPF"
                                            invalid={
                                                (errors.epf &&
                                                    touched.epf) as boolean
                                            }
                                            errorMessage={errors.epf}
                                        >
                                            <Field
                                                type="text"
                                                autoComplete="off"
                                                name="epf"
                                                placeholder="EPF"
                                                component={Input}
                                            />
                                        </FormItem>
                                        <div className="grid grid-cols-1 gap-4">
                                            <FormItem
                                                label="user ID"
                                                invalid={
                                                    (errors.userID &&
                                                        touched.userID) as boolean
                                                }
                                                errorMessage={errors.userID}
                                            >
                                                <Field
                                                    type="text"
                                                    autoComplete="off"
                                                    name="userID"
                                                    placeholder="user ID"
                                                    component={Input}
                                                />
                                            </FormItem>
                                        </div>
                                    </div>

                                    <FormItem
                                        label="Name"
                                        invalid={
                                            (errors.empName &&
                                                touched.empName) as boolean
                                        }
                                        errorMessage={errors.empName}
                                    >
                                        <Field
                                            type="text"
                                            autoComplete="off"
                                            name="empName"
                                            placeholder="Name"
                                            component={Input}
                                        />
                                    </FormItem>

                                    <FieldWrapper
                                        name="role"
                                        render={({ field, meta, helpers }) => (
                                            <FormItem
                                                label="Role"
                                                invalid={
                                                    !!meta.error && meta.touched
                                                }
                                                errorMessage={meta.error}
                                            >
                                                <Select
                                                    name="role"
                                                    id="role"
                                                    value={field.value}
                                                    onChange={(value) => {
                                                        helpers.setValue(value)
                                                    }}
                                                    placeholder="Please Select"
                                                    options={roleOptions}
                                                ></Select>
                                            </FormItem>
                                        )}
                                    />

                                    <FormItem
                                        label="Password"
                                        invalid={
                                            (errors.password &&
                                                touched.password) as boolean
                                        }
                                        errorMessage={errors.password}
                                    >
                                        <Field
                                            type="text"
                                            autoComplete="off"
                                            name="password"
                                            placeholder="Password"
                                            component={Input}
                                        />
                                    </FormItem>

                                    <div className="grid grid-cols-1 gap-4">
                                        <Field
                                            className="mb-0 mx-2"
                                            name="status"
                                            component={Checkbox}
                                        >
                                            Status
                                        </Field>
                                    </div>

                                    <div className="text-right mt-6"></div>

                                    <div className="grid grid-cols-1 gap-4">
                                        <Button
                                            block
                                            loading={isSubmitting}
                                            variant="solid"
                                            type="submit"
                                        >
                                            {isSubmitting
                                                ? 'Saving...'
                                                : 'Create User'}
                                        </Button>
                                    </div>
                                </FormContainer>
                            </Form>
                        )}
                    </Formik>
                </div>
                <div className="text-right mt-6">
                    {/* <Button
                        className="ltr:mr-2 rtl:ml-2"
                        variant="plain"
                        onClick={onClose}
                    >
                        Cancel
                    </Button> */}
                    {/* <Button variant="solid" onClick={onDialogOk}>
                    Okay
                        </Button> */}
                </div>
            </Dialog>
        </>
    )
}

export default DialogComponent
