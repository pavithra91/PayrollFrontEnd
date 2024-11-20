import Dialog from '@/components/ui/Dialog'
import {
    toggleNewAdvanceDialog,
    useAppDispatch,
    useAppSelector,
} from '../store'
import NewAdvanceForm from './NewAdvanceForm'

const NewAdvanceDialog = () => {
    const dispatch = useAppDispatch()

    const newAdvanceDialog = useAppSelector(
        (state) => state.dashboard.data.newAdvanceDialog
    )

    const onDialogClose = () => {
        dispatch(toggleNewAdvanceDialog(false))
    }

    return (
        <>
            <Dialog
                isOpen={newAdvanceDialog}
                onClose={onDialogClose}
                onRequestClose={onDialogClose}
            >
                <h4>Advance Payment Request</h4>
                <div className="mt-4">
                    <NewAdvanceForm />
                </div>
            </Dialog>
        </>
    )
}

export default NewAdvanceDialog
