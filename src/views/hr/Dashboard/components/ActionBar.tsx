import Button from '@/components/ui/Button'
import { useAppDispatch } from '@/store/hook'
import useCommon from '@/utils/hooks/useCommon'
import { HiOutlineCash, HiOutlinePlusCircle } from 'react-icons/hi'
import { useNavigate } from 'react-router-dom'
import { toggleNewAdvanceDialog } from '../store/dashboardSlice'

const ActionBar = () => {
    const { getUserFromLocalStorage } = useCommon()

    const dispatch = useAppDispatch()

    const onAddNewLeave = () => {
        dispatch(toggleNewAdvanceDialog(true))
    }

    const navigate = useNavigate()

    return (
        <>
            <div className="lg:flex items-center justify-between mb-4">
                <h3 className="mb-4 lg:mb-0">
                    Hello, {getUserFromLocalStorage().userName}{' '}
                </h3>
                <div className="flex flex-col md:flex-row md:items-center gap-1">
                    <Button
                        size="sm"
                        variant="twoTone"
                        icon={<HiOutlineCash />}
                        //onClick={() => navigate('/RequestLeave')}
                        onClick={onAddNewLeave}
                    >
                        Advance Payment Request
                    </Button>
                    <Button
                        size="sm"
                        variant="twoTone"
                        icon={<HiOutlinePlusCircle />}
                        onClick={() => navigate('/RequestLeave')}
                        // onClick={onAddNewLeave}
                    >
                        Leave Request
                    </Button>
                </div>
            </div>
        </>
    )
}

export default ActionBar
