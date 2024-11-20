import Dialog from '@/components/ui/Dialog'
import {
    toggleNewAssignLevelDialog,
    useAppDispatch,
    useAppSelector,
} from '../store'
import AssignApproverForm from './AssignApproverForm'

const AssignApproverDialog = (onDataSaved: any) => {
    const dispatch = useAppDispatch()

    const newEmpAssignDialog = useAppSelector(
        (state) => state.empData.data.newAssignLevelDialog
    )

    const onDialogClose = () => {
        dispatch(toggleNewAssignLevelDialog(false))
    }

    return (
        <Dialog
            isOpen={newEmpAssignDialog}
            onClose={onDialogClose}
            onRequestClose={onDialogClose}
        >
            <h4>Assign Supervisor</h4>
            <div className="mt-4">
                <AssignApproverForm />
            </div>
        </Dialog>
    )
}

export default AssignApproverDialog
