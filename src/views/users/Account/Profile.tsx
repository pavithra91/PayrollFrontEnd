import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import { FormContainer } from '@/components/ui/Form'
import FormDesription from './FormDesription'
import FormRow from './FormRow'
import { Field, Form, Formik } from 'formik'
import {
    HiOutlineUserCircle,
    HiOutlineUser,
    HiOutlineBriefcase,
    HiOutlineLocationMarker,
    HiOutlineIdentification,
} from 'react-icons/hi'
import * as Yup from 'yup'
import useAccount from '@/utils/hooks/useAccount'

export type ProfileFormModel = {
    id: number
    userID: string
    empName: string
    epf: number
    costCenter: string
    role: string
    lastUpdateBy?: string
}

type ProfileProps = {
    data?: ProfileFormModel
    user?: any
}

const validationSchema = Yup.object().shape({
    // name: Yup.string()
    //     .min(3, 'Too Short!')
    //     .max(20, 'Too Long!')
    //     .required('User Name Required'),
    costCenter: Yup.string().required('Cost Center Required'),
})

const Profile = ({
    user,
    data = {
        id: user.id,
        userID: user.userID,
        empName: user.userName,
        epf: user.epf,
        costCenter: user.costCenter,
        role: user.authority[0],
        lastUpdateBy: user.userID,
    },
}: ProfileProps) => {
    const { updateUser } = useAccount()

    const onFormSubmit = async (
        values: ProfileFormModel,
        setSubmitting: (isSubmitting: boolean) => void
    ) => {
        console.log('values', values)

        const { id, userID, empName, costCenter, epf, role, lastUpdateBy } =
            values

        const result = await updateUser({
            id,
            userID,
            empName,
            costCenter,
            epf,
            role,
            lastUpdateBy,
            companyCode: 0,
            password: '',
            status: false,
            createdBy: '',
        })

        console.log(result?.status)

        if (result?.status === 'failed') {
            toast.push(
                <Notification
                    title={'Error ' + result.message}
                    type="danger"
                />,
                {
                    placement: 'top-center',
                }
            )
        } else {
            toast.push(
                <Notification title={'Profile updated'} type="success" />,
                {
                    placement: 'top-center',
                }
            )
        }

        setSubmitting(false)
    }

    return (
        <Formik
            enableReinitialize
            initialValues={data}
            validationSchema={validationSchema}
            onSubmit={(values, { setSubmitting }) => {
                setSubmitting(true)
                setTimeout(() => {
                    onFormSubmit(values, setSubmitting)
                }, 1000)
            }}
        >
            {({ touched, errors, isSubmitting, resetForm }) => {
                const validatorProps = { touched, errors }
                return (
                    <Form>
                        <FormContainer>
                            <FormDesription
                                title="General"
                                desc="Basic info, like your name and attched location that will displayed in public"
                            />
                            <FormRow
                                name="userID"
                                label="User ID"
                                {...validatorProps}
                            >
                                <Field
                                    disabled
                                    type="text"
                                    autoComplete="off"
                                    name="userID"
                                    placeholder="User ID"
                                    component={Input}
                                    prefix={
                                        <HiOutlineIdentification className="text-xl" />
                                    }
                                />
                            </FormRow>
                            <FormRow
                                name="empName"
                                label="Name"
                                {...validatorProps}
                            >
                                <Field
                                    type="text"
                                    autoComplete="off"
                                    name="empName"
                                    placeholder="Name"
                                    component={Input}
                                    prefix={
                                        <HiOutlineUserCircle className="text-xl" />
                                    }
                                />
                            </FormRow>
                            <FormRow name="epf" label="EPF" {...validatorProps}>
                                <Field
                                    disabled
                                    type="text"
                                    autoComplete="off"
                                    name="epf"
                                    placeholder="EPF"
                                    component={Input}
                                    prefix={
                                        <HiOutlineUser className="text-xl" />
                                    }
                                />
                            </FormRow>
                            <FormRow
                                name="costCenter"
                                label="Cost Center / Location"
                                {...validatorProps}
                            >
                                <Field
                                    type="text"
                                    autoComplete="off"
                                    name="costCenter"
                                    placeholder="Cost Center / Location"
                                    component={Input}
                                    prefix={
                                        <HiOutlineLocationMarker className="text-xl" />
                                    }
                                />
                            </FormRow>

                            <FormRow
                                name="role"
                                label="Role"
                                {...validatorProps}
                                border={false}
                            >
                                <Field
                                    disabled
                                    value={user.authority[0]}
                                    type="text"
                                    autoComplete="off"
                                    name="role"
                                    placeholder="Role"
                                    component={Input}
                                    prefix={
                                        <HiOutlineBriefcase className="text-xl" />
                                    }
                                />
                            </FormRow>

                            <div className="mt-4 ltr:text-right">
                                <Button
                                    className="ltr:mr-2 rtl:ml-2"
                                    type="button"
                                    onClick={() => resetForm()}
                                >
                                    Reset
                                </Button>
                                <Button
                                    variant="solid"
                                    loading={isSubmitting}
                                    type="submit"
                                >
                                    {isSubmitting ? 'Updating' : 'Update'}
                                </Button>
                            </div>
                        </FormContainer>
                    </Form>
                )
            }}
        </Formik>
    )
}

export default Profile
