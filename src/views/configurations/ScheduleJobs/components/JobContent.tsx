import {
    getScheduleJobsData,
    toggleNewJobDialog,
    useAppDispatch,
    useAppSelector,
} from '../store'
import { Field, Form, Formik, FieldProps } from 'formik'
import { FormItem, FormContainer } from '@/components/ui/Form'
import Input from '@/components/ui/Input'

const JobContent = () => {
    const dispatch = useAppDispatch()
    const onDialogClose = () => {
        dispatch(toggleNewJobDialog(false))
    }

    const selectedRow = useAppSelector(
        (state) => state.JobsData.data.selectedRow
    )

    console.log(selectedRow)

    return (
        <>
            <Formik
                initialValues={{
                    id: selectedRow.id,
                    jobName: selectedRow.jobName,
                    jobGroup: selectedRow.groupName,
                    cronExpression: selectedRow.cronExpression,
                }}
                enableReinitialize={true}
                //validationSchema={validationSchema}
                onSubmit={(values, { setSubmitting }) => {
                    //onSubmit(values, setSubmitting)

                    setSubmitting(true)
                }}
            >
                {({ values, touched, errors, setFieldValue, isSubmitting }) => (
                    <Form>
                        <FormContainer>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <FormItem label="Job Name">
                                    <Field
                                        type="text"
                                        autoComplete="jobName"
                                        name="jobName"
                                        placeholder="Job Name"
                                        component={Input}
                                    />
                                </FormItem>
                                <FormItem label="Job Group">
                                    <Field
                                        type="text"
                                        autoComplete="jobGroup"
                                        name="jobGroup"
                                        placeholder="Job Group"
                                        component={Input}
                                    />
                                </FormItem>
                            </div>

                            <FormItem label="Cron Expression">
                                <Field
                                    type="text"
                                    autoComplete="cronExpression"
                                    name="cronExpression"
                                    placeholder="Cron Expression"
                                    component={Input}
                                />
                            </FormItem>
                        </FormContainer>
                    </Form>
                )}
            </Formik>
        </>
    )
}

export default JobContent
