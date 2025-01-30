import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import {
    getBankTransferData,
    removeEmployeesFromBankList,
    setDeleteMode,
    setSelectedRow,
    setSelectedRows,
    setTableData,
    useAppDispatch,
    useAppSelector,
} from '../store'
import cloneDeep from 'lodash/cloneDeep'

const RemoveConfirmation = () => {
    const dispatch = useAppDispatch()
    const selectedRows = useAppSelector(
        (state) => state.BankTransferData.data.selectedRows
    )
    const selectedRow = useAppSelector(
        (state) => state.BankTransferData.data.selectedRow
    )
    const deleteMode = useAppSelector(
        (state) => state.BankTransferData.data.deleteMode
    )
    const tableData = useAppSelector(
        (state) => state.BankTransferData.data.tableData
    )

    const approvalData = useAppSelector(
        (state) => state.BankTransferData.data.comData
    )

    const onDialogClose = () => {
        dispatch(setDeleteMode(''))

        if (deleteMode === 'single') {
            dispatch(setSelectedRow([]))
        }
    }

    const onDelete = async () => {
        dispatch(setDeleteMode(''))

        if (deleteMode === 'single') {
            const success = await removeEmployeesFromBankList({ id: selectedRow, companyCode: approvalData.companyCode, period: approvalData.period })
            deleteSucceed(success)
            dispatch(setSelectedRow([]))
        }

        if (deleteMode === 'batch') {
            const success = await removeEmployeesFromBankList({ id: selectedRows, companyCode: approvalData.companyCode, period: approvalData.period })
            deleteSucceed(success, selectedRows.length)
            dispatch(setSelectedRows([]))
        }
    }

    const deleteSucceed = (success: boolean, orders = 0) => {
        if (success) {

            const newTableData = cloneDeep(tableData)
                    newTableData.companyCode = approvalData.companyCode
                    newTableData.period = approvalData.period
                    dispatch(setTableData(newTableData))

            dispatch(getBankTransferData(newTableData))
            toast.push(
                <Notification
                    title={'Successfuly Deleted'}
                    type="success"
                    duration={2500}
                >
                    {deleteMode === 'single' && 'Order '}
                    {deleteMode === 'batch' && `${orders} orders `}
                    successfuly deleted
                </Notification>,
                {
                    placement: 'top-center',
                }
            )
        }
    }

    return (
        <ConfirmDialog
            isOpen={deleteMode === 'single' || deleteMode === 'batch'}
            type="danger"
            title="Delete product"
            confirmButtonColor="red-600"
            onClose={onDialogClose}
            onRequestClose={onDialogClose}
            onCancel={onDialogClose}
            onConfirm={onDelete}
        >
            <p>
                Are you sure you want to delete this order? All record related
                to this order will be deleted as well. This action cannot be
                undone.
            </p>
        </ConfirmDialog>
    )
}

export default RemoveConfirmation
