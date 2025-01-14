import { useCallback } from 'react'
import Button from '@/components/ui/Button'
import {
    //toggleNewAssignLevelDialog,
    setSelectedRow,
    useAppDispatch,
    Row,
    toggleNewJobDialog,
    pauseScheduleJob,
    runScheduleJob,
} from '../store'
import { HiPause, HiPencil, HiPlay, HiStop } from 'react-icons/hi'
import useCommon from '@/utils/hooks/useCommon'

const ActionColumn = ({ row }: { row: Row }) => {
    const dispatch = useAppDispatch()
    const {getUserFromLocalStorage} = useCommon()

    const onView = useCallback(() => {
        dispatch(toggleNewJobDialog(true))
        dispatch(setSelectedRow(row))
    }, [dispatch, row])

    const onPause = useCallback(() => {
        dispatch(setSelectedRow(row))
        const value = { 
            jobName: row.jobName,
            lastUpdateBy: getUserFromLocalStorage().epf
        }
        dispatch(pauseScheduleJob(value))
    }, [dispatch, row])

    const onPlay = useCallback(() => {
        dispatch(setSelectedRow(row))
        const value = { 
            jobName: row.jobName,
            lastUpdateBy: getUserFromLocalStorage().epf
        }
        dispatch(runScheduleJob(value))
    }, [dispatch, row])

    return (
        <>
            <div className="ltr:text-right rtl:text-left">
                <Button size="sm" icon={<HiPencil />} onClick={onView}></Button>
                <span className="ml-1"></span>
                <Button size="sm" disabled={row.isActive} icon={<HiPlay color='green' />} onClick={onPlay}></Button>
                <span className="ml-1"></span>
                <Button size="sm" disabled={!row.isActive} icon={<HiStop color='red' />} onClick={onPause}></Button>
            </div>
        </>
    )
}

export default ActionColumn
