import ConfirmDialog from '@/components/shared/ConfirmDialog'

const ProcessConfirmationDialog = () => {
    const onDialogClose = () => {}

    return (
        <>
            <ConfirmDialog
                isOpen={false}
                type="danger"
                title="Delete product"
                confirmButtonColor="red-600"
                onClose={onDialogClose}
                onRequestClose={onDialogClose}
                onCancel={onDialogClose}
                //onConfirm={onDelete}
            >
                <p>
                    Are you sure you want to delete this product? All record
                    related to this product will be deleted as well. This action
                    cannot be undone.
                </p>
            </ConfirmDialog>
        </>
    )
}

export default ProcessConfirmationDialog