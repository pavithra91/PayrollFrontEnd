import Dialog from '@/components/ui/Dialog'
import {
    toggleNewLeaveTypeDialog,
    useAppDispatch,
    useAppSelector,
} from '../store'
import NewLeaveTypeForm from './NewLeaveTypeForm'

const NewLeaveTypeDialog = () => {
    const dispatch = useAppDispatch()

    const newLeaveTypeDialog = useAppSelector(
        (state) => state.leaveTypeList.data.newLeaveTypeDialog
    )

    const onDialogClose = () => {
        dispatch(toggleNewLeaveTypeDialog(false))
    }

    return (
        <Dialog
            isOpen={newLeaveTypeDialog}
            onClose={onDialogClose}
            onRequestClose={onDialogClose}
        >
            <h4>Add new Leave Type</h4>
            <div className="mt-4">
                <NewLeaveTypeForm />
            </div>
        </Dialog>
    )
}

export default NewLeaveTypeDialog
