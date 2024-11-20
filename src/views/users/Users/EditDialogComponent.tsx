import React, { FC } from 'react'
import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import type { CommonProps, RoleSelectOption } from '@/@types/common'
import useTimeOutMessage from '@/utils/hooks/useTimeOutMessage'
import {
    Field,
    FieldHelperProps,
    FieldInputProps,
    FieldMetaProps,
    Form,
    Formik,
    FormikProps,
    useField,
} from 'formik'
import { FormContainer, FormItem } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Alert from '@/components/ui/Alert'
import Select from '@/components/ui/Select'
import * as Yup from 'yup'
import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import Checkbox from '@/components/ui/Checkbox'
import { AccountSchema } from '@/@types/Account'
import useAccount from '@/utils/hooks/useAccount'

interface DialogProps {
    isEditOpen: boolean
    onClose: () => void
    props: FormProps
    item: any
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

const FieldWrapper: FC<FieldWrapperProps> = ({ name, render }) => {
    const [field, meta, helpers] = useField(name)

    return render({ field, meta, helpers })
}

const getUserIDFromLocalStorage = () => {
    const user = JSON.parse(localStorage.getItem('admin') ?? '')
    const userID = JSON.parse(user.auth).user.userID
    return userID
}

const roleOptions: RoleSelectOption[] = [
    { value: 'Admin', label: 'Admin' },
    { value: 'User', label: 'User' },
    { value: 'Supervisor', label: 'Supervisor' },
]

const EditDialog: React.FC<DialogProps> = ({
    onClose,
    isEditOpen,
    props,
    item,
}) => {
    const foundItem = roleOptions.find(
        (option) => option.value === item.getValue('role')
    )

    const initValues: AccountSchema = {
        id: item.getValue('id'),
        companyCode: item.getValue('companyCode'), // This will be the default one
        costCenter: item.getValue('costCenter'),
        epf: item.getValue('epf'),
        empName: item.getValue('empName'),
        role: item.getValue('role'),
        userID: item.getValue('userID'),
        status: item.getValue('status'),
        isAccountLocked: item.getValue('isAccountLocked'),
        createdBy: item.getValue('createdBy'),
        lastUpdateBy: getUserIDFromLocalStorage(),
        password: '',
    }

    const validationSchema = Yup.object().shape({
        costCenter: Yup.string().required('Please enter Cost Center'),
        empName: Yup.string().required('Please enter User Name'),
        role: Yup.object().required('Please enter User Role'),
    })

    const { disableSubmit = false, className } = props
    const [message, setMessage] = useTimeOutMessage()

    const { updateUser } = useAccount()

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

    const onSubmit = async (
        values: AccountSchema,
        setSubmitting: (isSubmitting: boolean) => void
    ) => {
        const {
            id,
            companyCode,
            costCenter,
            epf,
            empName,
            role,
            userID,
            status,
            isAccountLocked,
            lastUpdateBy,
            createdBy,
        } = values
        setSubmitting(true)

        const result = await updateUser({
            id,
            companyCode,
            costCenter,
            epf,
            empName,
            role,
            userID,
            status,
            isAccountLocked,
            lastUpdateBy,
            password: '',
            createdBy,
        })

        if (result?.status === 'failed') {
            setMessage(result.message)
        } else {
            setMessage('Successfully Saved')
            openNotification('success', 'Changes Saved Successfully')
            onClose()
        }

        setSubmitting(false)
    }
    return (
        <>
            <Dialog
                isOpen={isEditOpen}
                onClose={onClose}
                onRequestClose={onClose}
            >
                <h5 className="mb-4">Edit User Details</h5>

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
                                const selectedRole = Array.from(
                                    Object.values(values.role)
                                )

                                values.role = selectedRole[0]
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
                                            render={({ meta }) => (
                                                <FormItem
                                                    label="Company Code"
                                                    invalid={
                                                        !!meta.error &&
                                                        meta.touched
                                                    }
                                                    errorMessage={meta.error}
                                                >
                                                    <Field
                                                        disabled
                                                        type="text"
                                                        autoComplete="off"
                                                        name="companyCode"
                                                        placeholder="Company Code"
                                                        component={Input}
                                                        value={item.getValue(
                                                            'companyCode'
                                                        )}
                                                    />
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
                                                    value={item.getValue(
                                                        'costCenter'
                                                    )}
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
                                                disabled
                                                type="text"
                                                autoComplete="off"
                                                name="epf"
                                                placeholder="EPF"
                                                component={Input}
                                                value={item.getValue('epf')}
                                            />
                                        </FormItem>
                                        <div className="grid grid-cols-1 gap-4">
                                            <FormItem
                                                label="User ID"
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
                                                    placeholder="User ID"
                                                    component={Input}
                                                    value={item.getValue(
                                                        'userID'
                                                    )}
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
                                            value={item.getValue('empName')}
                                        />
                                    </FormItem>

                                    <div className="grid grid-cols-4 gap-4">
                                        <div className="col-span-2 ...">
                                            <FieldWrapper
                                                name="role"
                                                render={({
                                                    field,
                                                    meta,
                                                    helpers,
                                                }) => (
                                                    <FormItem
                                                        label="User Role"
                                                        invalid={
                                                            !!meta.error &&
                                                            meta.touched
                                                        }
                                                        errorMessage={
                                                            meta.error
                                                        }
                                                    >
                                                        <Select
                                                            name="role"
                                                            id="role"
                                                            defaultValue={
                                                                foundItem
                                                            }
                                                            onChange={(
                                                                value
                                                            ) => {
                                                                helpers.setValue(
                                                                    value
                                                                )
                                                            }}
                                                            placeholder="Please Select User Role"
                                                            options={
                                                                roleOptions
                                                            }
                                                        ></Select>
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        <div className="col-span-2 ...">
                                            <div className="...">
                                                <Field
                                                    className="mb-0 mx-8 my-3"
                                                    name="status"
                                                    component={Checkbox}
                                                >
                                                    Status
                                                </Field>
                                            </div>

                                            <div className="...">
                                                <Field
                                                    className="mb-0 mx-8  my-3"
                                                    name="isAccountLocked"
                                                    component={Checkbox}
                                                >
                                                    Account Locked
                                                </Field>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4"></div>

                                    <div className="text-right mt-4"></div>

                                    <div className="grid grid-cols-1 gap-4">
                                        <Button
                                            block
                                            loading={isSubmitting}
                                            variant="solid"
                                            type="submit"
                                        >
                                            {isSubmitting
                                                ? 'Saving...'
                                                : 'Edit Changes'}
                                        </Button>
                                    </div>
                                </FormContainer>
                            </Form>
                        )}
                    </Formik>
                </div>
            </Dialog>
        </>
    )
}

export default EditDialog
