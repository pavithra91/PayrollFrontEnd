import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import ConfirmDialog from '@/components/shared/ConfirmDialog'

const ConfirmationDialog = (dialogOpen: boolean) => {
    const onDialogClose = () => {
        //  dispatch(toggleDeleteConfirmation(false))
    }

    const onDelete = async () => {
        toast.push(
            <Notification
                title={'Successfuly Deleted'}
                type="success"
                duration={2500}
            >
                Request Deleted Successfully
            </Notification>,
            {
                placement: 'top-center',
            }
        )
        // }
    }

    return (
        <ConfirmDialog
            isOpen={dialogOpen}
            type="danger"
            title="Confirm without Prier approavls"
            confirmButtonColor="red-600"
            onClose={onDialogClose}
            onRequestClose={onDialogClose}
            onCancel={onDialogClose}
            onConfirm={onDelete}
        >
            <p>
                Are you sure you want to delete this leave request? All record related
                to this leave request will be deleted as well. This action cannot be
                undone.
            </p>
        </ConfirmDialog>
    )
}

export default ConfirmationDialog
