import {
    editSupervisor,
    toggleEditSupervisorDialog,
    useAppDispatch,
    useAppSelector,
} from '../store'
import { FormItem, FormContainer } from '@/components/ui/Form'
import Button from '@/components/ui/Button'
import useCommon from '@/utils/hooks/useCommon'
import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import { Field, Form, Formik, FieldProps } from 'formik'
import Input from '@/components/ui/Input'
import Switcher from '@/components/ui/Switcher'

type FormModel = {
    id?: number
    userId: string
    epf: string
    isActive: boolean
    isManager: boolean
    createdBy?: string
}

const EditSupervisor = () => {
    const dispatch = useAppDispatch()
    const { getUserFromLocalStorage } = useCommon()

    const selectedRow = useAppSelector(
        (state) => state.SupervisorData.data.selectedRow
    )

    const onSubmit = (
        formValue: FormModel,
        setSubmitting: (isSubmitting: boolean) => void
    ) => {
        setSubmitting(true)

        const { id, epf, isActive, isManager } = formValue

        const values = {
            id: id,
            epf: epf,
            isActive: isActive,
            isManager: isManager,
            createdBy: getUserFromLocalStorage().userID,
        }

        dispatch(editSupervisor(values))

        openNotification('success', 'User ' + epf + ' has updated')

        dispatch(toggleEditSupervisorDialog(false))
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
                    id: selectedRow.id || 0,
                    userId: selectedRow.epf || '',
                    epf: selectedRow.epf || '',
                    empName: selectedRow.empName || '',
                    grade: selectedRow.grade || '',
                    isManager: selectedRow.isManager || false,
                    isActive: selectedRow.isActive || false,
                }}
                enableReinitialize={true}
                //validationSchema={validationSchema}
                onSubmit={(values, { setSubmitting }) => {
                    // values.userId = values.epf
                    // values.epf = values.epf
                    onSubmit(values, setSubmitting)
                    setSubmitting(true)
                }}
            >
                {({ values, touched, errors, setFieldValue, isSubmitting }) => (
                    <Form>
                        <FormContainer>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                <div className="..">
                                    <FormItem label="EPF">
                                        <Field
                                            type="text"
                                            autoComplete="off"
                                            name="epf"
                                            placeholder="EPF"
                                            component={Input}
                                        />
                                    </FormItem>
                                </div>
                                <div className="..">
                                    <FormItem label="Name">
                                        <Field
                                            type="text"
                                            autoComplete="off"
                                            name="empName"
                                            placeholder="Name"
                                            component={Input}
                                        />
                                    </FormItem>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                <div className="..">
                                    <FormItem
                                        label="Active"
                                        invalid={
                                            errors.isActive && touched.isActive
                                        }
                                        errorMessage={errors.isActive}
                                    >
                                        <div>
                                            <Field
                                                name="isActive"
                                                component={Switcher}
                                            />
                                        </div>
                                    </FormItem>
                                </div>

                                <div className=".. ml-1">
                                    {' '}
                                    <FormItem
                                        label="Is Manager?"
                                        invalid={
                                            errors.isManager &&
                                            touched.isManager
                                        }
                                        errorMessage={errors.isManager}
                                    >
                                        <div>
                                            <Field
                                                name="isManager"
                                                component={Switcher}
                                            />
                                        </div>
                                    </FormItem>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-6 gap-4">
                                <div className="col-span-5 ..."></div>
                                <div className="..">
                                    <Button
                                        size="sm"
                                        variant="twoTone"
                                        type="submit"
                                    >
                                        Save
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

export default EditSupervisor
