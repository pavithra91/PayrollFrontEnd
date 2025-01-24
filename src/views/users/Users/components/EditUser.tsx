import { editUser, useAppDispatch, useAppSelector } from '../store'
import { FormItem, FormContainer } from '@/components/ui/Form'
import Button from '@/components/ui/Button'
import useCommon from '@/utils/hooks/useCommon'
import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import { Field, Form, Formik, FieldProps } from 'formik'
import Input from '@/components/ui/Input'
import DatePicker from '@/components/ui/DatePicker/DatePicker'
import { Checkbox } from '@/components/ui/Checkbox'
import RichTextEditor from '@/components/shared/RichTextEditor'
import { useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'
import Select from '@/components/ui/Select/Select'
import { RoleSelectOption, SelectOption } from '@/@types/common'
import { roleSelectionOptions } from '@/constants/roles.constant'

interface FormModel {
    id: number
    companyCode: number
    costCenter: string
    empName: string
    userID: string
    epf: string | number // Allow both types
    role: string
    isAccountLocked: boolean
    status: boolean
    createdBy?: string
    lastUpdateBy?: string
}

const companyOptions: SelectOption[] = [
    { value: 2000, label: '2000' },
    { value: 3000, label: '3000' },
]

const roleOptions: RoleSelectOption[] = roleSelectionOptions

const EditUser = () => {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    const { getUserFromLocalStorage } = useCommon()

    const selectedRow = useAppSelector(
        (state) => state.userList.data.selectedUser
    )

    console.log(selectedRow)

    const onSubmit = (
        formValue: FormModel,
        setSubmitting: (isSubmitting: boolean) => void
    ) => {
        setSubmitting(true)

        const {
            companyCode,
            costCenter,
            epf,
            empName,
            role,
            userID,
            status,
            id,
            isAccountLocked,
            lastUpdateBy,
        } = formValue

        const values = {
            id: id,
            companyCode: companyCode,
            costCenter: costCenter,
            epf: epf,
            empName: empName,
            role: role,
            userID: userID,
            status: status,
            isAccountLocked: isAccountLocked,
            password: '',
            createdBy: '',
            lastUpdateBy: getUserFromLocalStorage().userID,
        }

        dispatch(editUser(values))

        openNotification('success', epf + ' has updated')

        setTimeout(() => {
            setSubmitting(false)
            navigate('/ViewUsers')
        }, 500)
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
            <div className="lg:flex items-center justify-between mb-4">
                <h2>Edit User</h2>
            </div>
            <Formik
                initialValues={{
                    id: selectedRow.id || 0,
                    companyCode: selectedRow.companyCode || 3000,
                    costCenter: selectedRow.costCenter || '',
                    empName: selectedRow.empName || '',
                    userID: selectedRow.userID || '',
                    epf: selectedRow.epf || '',
                    role: selectedRow.role || '',
                    isAccountLocked: selectedRow.isAccountLocked || false,
                    status: selectedRow.status || false,
                }}
                enableReinitialize={true}
                //validationSchema={validationSchema}
                onSubmit={(values, { setSubmitting }) => {
                    onSubmit(values, setSubmitting)
                    setSubmitting(true)
                }}
            >
                {({ values, touched, errors, setFieldValue, isSubmitting }) => (
                    <Form>
                        <FormContainer>
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                                <div className="lg:col-span-2">
                                    <FormItem
                                        label="Name:"
                                        invalid={
                                            touched.empName && !!errors.empName
                                        }
                                        errorMessage={errors.empName}
                                    >
                                        <Field
                                            as={Input}
                                            name="empName"
                                            placeholder="Enter Employee Name"
                                        />
                                    </FormItem>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="..">
                                            <FormItem
                                                label="Company Code"
                                                asterisk={true}
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
                                        <div className="..">
                                            <FormItem
                                                label="Cost Center:"
                                                invalid={
                                                    touched.costCenter &&
                                                    !!errors.costCenter
                                                }
                                                errorMessage={errors.costCenter}
                                            >
                                                <Field
                                                    as={Input}
                                                    name="costCenter"
                                                    placeholder="Enter Cost Center"
                                                />
                                            </FormItem>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="..">
                                            <FormItem
                                                label="EPF:"
                                                invalid={
                                                    touched.epf && !!errors.epf
                                                }
                                                errorMessage={errors.epf}
                                            >
                                                <Field
                                                    as={Input}
                                                    name="epf"
                                                    placeholder="Enter EPF"
                                                />
                                            </FormItem>
                                        </div>
                                        <div className="..">
                                            <FormItem
                                                label="User ID:"
                                                invalid={
                                                    touched.userID &&
                                                    !!errors.userID
                                                }
                                                errorMessage={errors.userID}
                                            >
                                                <Field
                                                    as={Input}
                                                    name="userID"
                                                    placeholder="Enter User ID"
                                                />
                                            </FormItem>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="..">
                                            <FormItem
                                                label="Role"
                                                asterisk={true}
                                                invalid={
                                                    errors.role && touched.role
                                                }
                                                errorMessage={errors.role}
                                            >
                                                <Field name="role">
                                                    {({
                                                        field,
                                                        form,
                                                    }: FieldProps) => (
                                                        <Select<RoleSelectOption>
                                                            field={field}
                                                            form={form}
                                                            options={
                                                                roleOptions
                                                            }
                                                            value={roleOptions.filter(
                                                                (option) =>
                                                                    option.value ===
                                                                    values.role
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
                                        <div className=".."></div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="..">
                                            <FormItem
                                                label="Active:"
                                                invalid={
                                                    touched.status &&
                                                    !!errors.status
                                                }
                                                errorMessage={errors.status}
                                            >
                                                <Field
                                                    checked
                                                    type="checkbox"
                                                    name="status"
                                                    as={Checkbox}
                                                    onChange={() =>
                                                        setFieldValue(
                                                            'status',
                                                            !values.status
                                                        )
                                                    }
                                                />
                                            </FormItem>
                                        </div>
                                    </div>
                                </div>
                                <div className="lg:col-span-1">
                                    {/* <DoubleSidedImage
                                        width={350}
                                        src="/img/others/leave.png"
                                        darkModeSrc="/img/others/leave.png"
                                    /> */}
                                </div>
                            </div>
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                                <div className="col-span-6 ..."></div>
                                <div className="..">
                                    <Button
                                        size="sm"
                                        variant="twoTone"
                                        // icon={<HiOutlinePlusCircle />}
                                        onClick={() => {
                                            navigate('/ViewUsers')
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                </div>
                                <div className="..">
                                    <Button
                                        size="sm"
                                        variant="twoTone"
                                        type="submit"
                                        // icon={<HiOutlinePlusCircle />}
                                        // onClick={onDialogOpen}
                                    >
                                        Save Changes
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

export default EditUser
