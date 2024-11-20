import { forwardRef, useEffect } from 'react'
import {
    getList,
    setDrawerClose,
    useAppDispatch,
    useAppSelector,
} from '../store'
import LeaveTypeForm, { FormikRef } from './LeaveTypeForm'
import useLeave from '@/utils/hooks/useLeave'
import useCommon from '@/utils/hooks/useCommon'
import useTimeOutMessage from '@/utils/hooks/useTimeOutMessage'
import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'

const LeaveTypeEditContent = forwardRef<FormikRef>((_, ref) => {
    const dispatch = useAppDispatch()

    const leaveType = useAppSelector(
        (state) => state.leaveTypeList.data.selectedLeaveType
    )
    const data = useAppSelector(
        (state) => state.leaveTypeList.data.leaveTypeList
    )
    const { leaveTypeId } = leaveType

    const [message, setMessage] = useTimeOutMessage()

    const { updateLeaveType } = useLeave()

    const { getUserFromLocalStorage } = useCommon()

    const onFormClose = () => {
        dispatch(setDrawerClose())
    }

    const onFormSubmit = async (values: any) => {
        const {
            leaveTypeId,
            leaveTypeName,
            description,
            carryForwardAllowed,
            maxDays,
        } = values

        if (leaveTypeId == undefined) {
            return
        }

        const result = await updateLeaveType({
            leaveTypeId: leaveTypeId,
            leaveTypeName,
            description,
            maxDays,
            carryForwardAllowed,
            createdBy: getUserFromLocalStorage().userID,
        })

        if (result?.status === 'failed') {
            setMessage(result.message)
            openNotification('danger', result.message)
        } else {
            setMessage('Successfully Saved')
            openNotification('success', 'Leave Type Updated Successfully')
            dispatch(getList())
        }

        dispatch(setDrawerClose())
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
            <LeaveTypeForm
                ref={ref}
                leaveType={leaveType}
                onFormSubmit={onFormSubmit}
                onFormClose={onFormClose}
            />
        </>
    )
})

LeaveTypeEditContent.displayName = 'LeaveTypeEditContent'

export type { FormikRef }

export default LeaveTypeEditContent
