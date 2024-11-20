import Button from '@/components/ui/Button'
import { FormItem, FormContainer } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Tabs from '@/components/ui/Tabs'
import TabContent from '@/components/ui/Tabs/TabContent'
import TabList from '@/components/ui/Tabs/TabList'
import TabNav from '@/components/ui/Tabs/TabNav'
import { Field, Form, Formik, FieldProps } from 'formik'
import {
    getEmployeeData,
    getSupervisorData,
    toggleNewAssignLevelDialog,
    useAppDispatch,
    useAppSelector,
} from '../store'
import { Select } from '@/components/ui/Select'
import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/Card'
import Avatar from '@/components/ui/Avatar'
import useLeave from '@/utils/hooks/useLeave'
import useCommon from '@/utils/hooks/useCommon'
import useTimeOutMessage from '@/utils/hooks/useTimeOutMessage'
import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import * as Yup from 'yup'

type LeaveApproveLevels = {
    value: number
    label: string
}

type Supervisor = {
    value: string
    label: string
}

const leaveApproveLevels = [
    {
        value: 1,
        label: 'Level 1',
    },
    {
        value: 2,
        label: 'Level 2',
    },
    {
        value: 3,
        label: 'Level 3',
    },
]

var supervisorList: any[] = []

const AssignApproverForm = (onDataSaved: any) => {
    const dispatch = useAppDispatch()
    const onDialogClose = () => {
        dispatch(toggleNewAssignLevelDialog(false))
    }
    const { addassignSupervisor } = useLeave()
    const [message, setMessage] = useTimeOutMessage()
    const { getUserFromLocalStorage } = useCommon()

    const [noOfLevels, setNoOfLevels] = useState<number>(1)
    const [isAlreadyAssigned, setIsAlreadyAssigned] = useState(false)

    const selectedRow = useAppSelector(
        (state) => state.empData.data.selectedRow
    )

    const resetSupervisors = () => {
        setIsAlreadyAssigned(false)
    }

    const handleUpdate = (newLevel: number | undefined) => {
        setNoOfLevels(newLevel ?? 1) // Use 1 if newLevel is undefined
    }

    const data = useAppSelector((state) => state.empData.data.supervisorData)

    const refineData = data.map((item) => ({
        value: item.id,
        label: item.epf,
    }))

    supervisorList = refineData

    const validationSchema = Yup.object().shape({
        approvalLevel: Yup.number()
            .required('Approval level is required')
            .min(1, 'Approval level must be at least 1'),
        approverNames: Yup.array()
            .of(Yup.string().required('Approver is required'))
            .default([]) // Sets default value to an empty array
            .test(
                'all-dropdowns-filled',
                'All approver dropdowns must be filled',
                function (approverNames = []) {
                    // Provides default empty array here
                    const { approvalLevel } = this.parent
                    return (
                        approverNames.length === approvalLevel &&
                        approverNames.every((name) => name)
                    )
                }
            ),
    })

    const fetchData = () => {
        console.log('running')

        //setEmployeeData()
        dispatch(getEmployeeData())
    }

    useEffect(() => {
        if (
            Array.isArray(selectedRow?.supervisorList) &&
            selectedRow.supervisorList.length > 0
        ) {
            setIsAlreadyAssigned(true)
        } else {
            setIsAlreadyAssigned(false)
        }
    }, [selectedRow])

    const onSubmit = async (
        values: any,
        setSubmitting: (isSubmitting: boolean) => void
    ) => {
        const { id, epf, approvalLevel, approverNames } = values

        const result = await addassignSupervisor({
            id,
            epf: epf + '',
            approvalLevel,
            approverNames,
            updateBy: getUserFromLocalStorage().userID,
        })

        console.log(result)

        fetchData()

        if (result?.status === 'failed') {
            setMessage(result.message)
            openNotification('danger', result.message)
        } else {
            setTimeout(() => {
                onDialogClose()
                setSubmitting(false)
            }, 500)
            setMessage('Successfully Saved')
            openNotification('success', 'Supervisor Assigned Successfully')
        }
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
                    id: selectedRow.id,
                    epf: selectedRow.epf,
                    approvalLevel: 1,
                    approverNames: Array(noOfLevels).fill(''),
                    supervisorList: selectedRow?.supervisorList ?? [],
                }}
                enableReinitialize={true}
                validationSchema={validationSchema}
                onSubmit={(values, { setSubmitting }) => {
                    values.approvalLevel = noOfLevels

                    onSubmit(values, setSubmitting)

                    setSubmitting(true)
                }}
            >
                {({ values, touched, errors, setFieldValue, isSubmitting }) => (
                    <Form>
                        <FormContainer>
                            <Tabs defaultValue="basicData">
                                <TabList>
                                    <TabNav value="basicData">
                                        Basic Data
                                    </TabNav>
                                    <TabNav value="superviorData">
                                        Supervisor Data
                                    </TabNav>
                                </TabList>
                                <div className="pt-6">
                                    <TabContent value="basicData">
                                        <FormItem label="User ID">
                                            <Field
                                                type="text"
                                                disabled
                                                autoComplete="off"
                                                name="userId"
                                                placeholder="User ID"
                                                component={Input}
                                            />
                                        </FormItem>
                                        <FormItem label="EPF">
                                            <Field
                                                type="text"
                                                disabled
                                                autoComplete="off"
                                                name="epf"
                                                placeholder="EPF"
                                                component={Input}
                                            />
                                        </FormItem>
                                    </TabContent>
                                    <TabContent value="superviorData">
                                        {isAlreadyAssigned && (
                                            <>
                                                {Array.from({
                                                    length:
                                                        selectedRow
                                                            .supervisorList
                                                            ?.length ?? 1,
                                                }).map((_, index) => (
                                                    <Card
                                                        className="mb-3"
                                                        key={index}
                                                    >
                                                        <h4 className="font-bold">
                                                            {selectedRow
                                                                ?.supervisorList?.[
                                                                index
                                                            ]?.level ||
                                                                'N/A'}{' '}
                                                            Approvals
                                                        </h4>
                                                        <div className="flex items-center mt-2">
                                                            <Avatar
                                                                shape="circle"
                                                                src="/img/avatars/thumb-1.jpg"
                                                            />

                                                            <span className="ml-5">
                                                                <h6 className="text-sm">
                                                                    {selectedRow
                                                                        ?.supervisorList?.[
                                                                        index
                                                                    ]?.epf ||
                                                                        'N/A'}
                                                                </h6>
                                                                <span className="text-xs">
                                                                    {selectedRow
                                                                        ?.supervisorList?.[
                                                                        index
                                                                    ]?.epf ||
                                                                        'N/A'}
                                                                </span>
                                                            </span>
                                                        </div>
                                                    </Card>
                                                ))}

                                                <FormItem>
                                                    <div className="flex justify-end">
                                                        <Button
                                                            type="reset"
                                                            className="ltr:mr-2 rtl:ml-2"
                                                            onClick={() =>
                                                                resetSupervisors()
                                                            }
                                                        >
                                                            Reset
                                                        </Button>
                                                    </div>
                                                </FormItem>
                                            </>
                                        )}

                                        {!isAlreadyAssigned && (
                                            <>
                                                <FormItem
                                                    label="Approval Levels"
                                                    asterisk={true}
                                                    invalid={
                                                        errors.approvalLevel &&
                                                        touched.approvalLevel
                                                    }
                                                    errorMessage={
                                                        errors.approvalLevel
                                                    }
                                                >
                                                    <Field name="approvalLevel">
                                                        {({
                                                            field,
                                                            form,
                                                        }: FieldProps) => (
                                                            <Select<LeaveApproveLevels>
                                                                {...field}
                                                                options={
                                                                    leaveApproveLevels
                                                                }
                                                                value={
                                                                    leaveApproveLevels.find(
                                                                        (
                                                                            option
                                                                        ) =>
                                                                            option.value ===
                                                                            values.approvalLevel
                                                                    ) || null
                                                                }
                                                                onChange={(
                                                                    selectedOption: LeaveApproveLevels | null
                                                                ) => {
                                                                    const newValue =
                                                                        selectedOption?.value ??
                                                                        1
                                                                    setFieldValue(
                                                                        'approvalLevel',
                                                                        newValue
                                                                    ) // Update Formik state
                                                                    handleUpdate(
                                                                        newValue
                                                                    ) // Set noOfLevels without causing re-renders
                                                                    setFieldValue(
                                                                        'approverNames',
                                                                        Array(
                                                                            newValue
                                                                        ).fill(
                                                                            ''
                                                                        )
                                                                    ) // Reset approver list based on level
                                                                }}
                                                            />
                                                        )}
                                                    </Field>
                                                </FormItem>

                                                {Array.from({
                                                    length: noOfLevels ?? 1,
                                                }).map((_, index) => (
                                                    <FormItem
                                                        key={index}
                                                        label={`Approver ${
                                                            index + 1
                                                        }`}
                                                        asterisk={true}
                                                    >
                                                        <Field
                                                            name={`approverNames[${index}]`}
                                                        >
                                                            {({
                                                                field,
                                                                form,
                                                            }: FieldProps) => {
                                                                // Get the selected supervisors to exclude from the current dropdown
                                                                const selectedSupervisors =
                                                                    values.approverNames.filter(
                                                                        (
                                                                            approver
                                                                        ) =>
                                                                            approver
                                                                    )

                                                                // Filter supervisor list to remove already selected ones
                                                                const availableSupervisors =
                                                                    supervisorList.filter(
                                                                        (
                                                                            supervisor
                                                                        ) =>
                                                                            !selectedSupervisors.includes(
                                                                                supervisor.value
                                                                            )
                                                                    )

                                                                return (
                                                                    <Select<Supervisor>
                                                                        field={
                                                                            field
                                                                        }
                                                                        form={
                                                                            form
                                                                        }
                                                                        options={
                                                                            availableSupervisors
                                                                        }
                                                                        value={availableSupervisors.find(
                                                                            (
                                                                                option
                                                                            ) =>
                                                                                option.value ===
                                                                                field.value
                                                                        )}
                                                                        onChange={(
                                                                            selectedOption: Supervisor | null
                                                                        ) => {
                                                                            const newValue =
                                                                                selectedOption?.value ||
                                                                                ''
                                                                            setFieldValue(
                                                                                field.name,
                                                                                newValue
                                                                            )
                                                                        }}
                                                                    />
                                                                )
                                                            }}
                                                        </Field>
                                                    </FormItem>
                                                ))}
                                            </>
                                        )}
                                    </TabContent>
                                </div>
                            </Tabs>
                            <Button
                                block
                                variant="solid"
                                loading={isSubmitting}
                                type="submit"
                            >
                                Save
                            </Button>
                        </FormContainer>
                    </Form>
                )}
            </Formik>
        </>
    )
}

export default AssignApproverForm
