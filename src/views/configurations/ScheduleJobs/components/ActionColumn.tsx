import { useCallback } from 'react'
import Button from '@/components/ui/Button'
import {
    //toggleNewAssignLevelDialog,
    setSelectedRow,
    useAppDispatch,
    Row,
} from '../store'
import { HiPause, HiPencil, HiPlay, HiStop } from 'react-icons/hi'

const ActionColumn = ({ row }: { row: Row }) => {
    const dispatch = useAppDispatch()

    const onView = useCallback(() => {
        //  dispatch(toggleNewAssignLevelDialog(true))
        dispatch(setSelectedRow(row))
    }, [dispatch, row])

    const onPause = useCallback(() => {
        //  dispatch(toggleNewAssignLevelDialog(true))
        dispatch(setSelectedRow(row))
    }, [dispatch, row])

    return (
        <>
            <div className="ltr:text-right rtl:text-left">
                <Button size="sm" icon={<HiPencil />} onClick={onView}></Button>
                <span className="ml-1"></span>
                <Button size="sm" icon={<HiStop />} onClick={onView}></Button>
                <span className="ml-1"></span>
                <Button size="sm" icon={<HiPause />} onClick={onPause}></Button>
            </div>
        </>
    )
}

export default ActionColumn
