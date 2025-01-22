import Button from '@/components/ui/Button'
import reducer, { toggleNewUserDialog } from './store'
import { injectReducer, useAppDispatch } from '@/store'
import { HiOutlinePlusCircle } from 'react-icons/hi'
import UserData from './components/UserData'
import { Card } from '@/components/ui/Card'
import AddNewUser from './components/AddNewUser'
import { useNavigate } from 'react-router-dom'

injectReducer('userList', reducer)

const ViewUsers = () => {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    
    const onAddNewUser = () => {
        dispatch(toggleNewUserDialog(true))
    }

    return (
        <>         
               
            <div className="lg:flex items-center justify-between mb-4">

                <span className="mb-4 lg:mb-0">
                    <h4>User Accounts</h4>
                </span>
                <div className="flex flex-col md:flex-row md:items-center gap-1">
                    <Button
                        size="sm"
                        variant="twoTone"
                        icon={<HiOutlinePlusCircle />}
                        onClick={() => navigate('/AddNewUser')}
                    >
                        Add User
                    </Button>
                </div>
               

            </div>
            
            <UserData />

        </>
    )
}

export default ViewUsers
