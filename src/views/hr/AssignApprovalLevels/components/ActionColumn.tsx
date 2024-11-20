import { useCallback } from 'react'
import Button from '@/components/ui/Button'
import {
    toggleNewAssignLevelDialog,
    setSelectedRow,
    useAppDispatch,
    Row,
} from '../store'

const ActionColumn = ({ row }: { row: Row }) => {
    const dispatch = useAppDispatch()

    const onView = useCallback(() => {
        dispatch(toggleNewAssignLevelDialog(true))
        dispatch(setSelectedRow(row))
    }, [dispatch, row])

    return (
        <div className="ltr:text-right rtl:text-left">
            <Button size="sm" onClick={onView}>
                View
            </Button>
        </div>
    )
}

export default ActionColumn
