import Dialog from '@/components/ui/Dialog'
import {
    toggleNewLeaveDialog,
    useAppDispatch,
    useAppSelector,
} from '../store'
import NewLeaveForm from './NewLeaveForm'

const NewLeaveDialog = () => {
    const dispatch = useAppDispatch()

    const newLeaveDialog = useAppSelector(
        (state) => state.leaveList.data.newLeaveDialog
    )

    const onDialogClose = () => {
        dispatch(toggleNewLeaveDialog(false))
    }

    return (
        <Dialog
            isOpen={newLeaveDialog}
            onClose={onDialogClose}
            onRequestClose={onDialogClose}
        >
            <h4>Add new Leave</h4>
            <div className="mt-4">
                <NewLeaveForm />
            </div>
        </Dialog>
    )
}

export default NewLeaveDialog
