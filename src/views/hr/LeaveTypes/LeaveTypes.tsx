import Button from '@/components/ui/Button'
import LeaveTypeListContent from './components/LeaveTypeContent'
import NewLeaveTypeDialog from './components/NewLeaveTypeDialog'
import reducer, { toggleNewLeaveTypeDialog } from './store'
import { injectReducer, useAppDispatch } from '@/store'
import { HiOutlinePlusCircle } from 'react-icons/hi'

injectReducer('leaveTypeList', reducer)

const LeaveTypes = () => {
    const dispatch = useAppDispatch()

    const onAddNewLeaveType = () => {
        dispatch(toggleNewLeaveTypeDialog(true))
    }

    return (
        <>
            <div className="lg:flex items-center justify-between mb-4">
                <span className="mb-4 lg:mb-0">
                    <h4>Leave Types</h4>
                </span>
                <div className="flex flex-col md:flex-row md:items-center gap-1">
                    <Button
                        size="sm"
                        variant="twoTone"
                        icon={<HiOutlinePlusCircle />}
                        onClick={onAddNewLeaveType}
                    >
                        Add New Leave Type
                    </Button>
                </div>
            </div>

            <NewLeaveTypeDialog />
            <LeaveTypeListContent />
        </>
    )
}

export default LeaveTypes
