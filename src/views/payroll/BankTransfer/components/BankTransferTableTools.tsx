import Button from '@/components/ui/Button'
import { HiDownload, HiOutlineTrash } from 'react-icons/hi'
// import OrderTableSearch from './OrderTableSearch'
import { setDeleteMode, useAppDispatch, useAppSelector } from '../store'
import { Link } from 'react-router-dom'
import BankTableSearch from './BankTableSearch'

const BatchDeleteButton = () => {
    const dispatch = useAppDispatch()

    const onBatchDelete = () => {
        dispatch(setDeleteMode('batch'))
    }

    return (
        <Button
            variant="solid"
            color="red-600"
            size="sm"
            icon={<HiOutlineTrash />}
            onClick={onBatchDelete}
        >
            Batch Delete
        </Button>
    )
}

const BankTransferTableTools = () => {
    const selectedRows = useAppSelector(
        (state) => state.BankTransferData.data.selectedRows
    )
    return (
        <div >
            {selectedRows.length > 0 && <BatchDeleteButton />}
            
            {/* <Link download to="/data/order-list.csv" target="_blank">
                <Button block size="sm" icon={<HiDownload />}>
                    Export
                </Button>
            </Link> */}
            {/* <BankTableSearch /> */}
        </div>
    )
}

export default BankTransferTableTools
