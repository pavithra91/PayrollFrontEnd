import * as Yup from 'yup'
import { FormContainer, FormItem } from '@/components/ui/Form'
import { Field, Form, Formik, FormikProps } from 'formik'
import Input from '@/components/ui/Input'
import { forwardRef } from 'react'
import Button from '@/components/ui/Button'
import Switcher from '@/components/ui/Switcher'

const validationSchema = Yup.object().shape({
    leaveTypeName: Yup.string().required('Leave Type Name Required'),
    description: Yup.string().required('Description Required'),
    maxDays: Yup.number(),
})

export interface FormModel {}

export type FormikRef = FormikProps<FormModel>

type CustomerFormProps = {
    leaveType: any
    onFormSubmit: (values: FormModel) => void
    onFormClose: any
}

const LeaveTypeForm = forwardRef<FormikRef, CustomerFormProps>((props, ref) => {
    const { leaveType, onFormSubmit, onFormClose } = props

    return (
        <>
            <Formik
                initialValues={{
                    leaveTypeId: leaveType.leaveTypeId,
                    leaveTypeName: leaveType.leaveTypeName || '',
                    description: leaveType?.description || '',
                    maxDays: leaveType?.maxDays || 0,
                    carryForwardAllowed:
                        leaveType?.carryForwardAllowed || false,
                }}
                validationSchema={validationSchema}
                onSubmit={(values, { setSubmitting }) => {
                    onFormSubmit?.(values)
                    setSubmitting(false)
                }}
            >
                {({ touched, errors }) => (
                    <Form>
                        <FormContainer>
                            <div className="p-6">
                                <h3>Change Leave Type Details</h3>
                            </div>
                            <div className="p-6 pt-5">
                                <FormItem label="Leave Type Name">
                                    <Field
                                        type="text"
                                        autoComplete="off"
                                        name="leaveTypeName"
                                        placeholder="Name"
                                        component={Input}
                                    />
                                </FormItem>

                                <FormItem label="Description">
                                    <Field
                                        type="text"
                                        autoComplete="off"
                                        name="description"
                                        placeholder="Description"
                                        component={Input}
                                    />
                                </FormItem>

                                <FormItem label="Maximum Days">
                                    <Field
                                        type="text"
                                        autoComplete="off"
                                        name="maxDays"
                                        placeholder="Maximum Days"
                                        component={Input}
                                    />
                                </FormItem>

                                <FormItem label="Carry Forward Allowed">
                                    <div>
                                        <Field
                                            name="carryForwardAllowed"
                                            component={Switcher}
                                        />
                                    </div>
                                </FormItem>
                            </div>

                            <div className="drawer-footer flex justify-end p-6 mt-auto">
                                <Button
                                    type="button"
                                    size="sm"
                                    className="mr-2"
                                    onClick={onFormClose}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    size="sm"
                                    variant="solid"
                                    onClick={onFormSubmit}
                                >
                                    Save
                                </Button>
                            </div>
                        </FormContainer>
                    </Form>
                )}
            </Formik>
        </>
    )
})

LeaveTypeForm.displayName = 'LeaveTypeForm'

export default LeaveTypeForm
