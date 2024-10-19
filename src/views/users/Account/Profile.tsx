import AdaptableCard from '@/components/shared/AdaptableCard'
import Container from '@/components/shared/Container'
import ProfileInfo from './ProfileInfo'
import TabContent from '@/components/ui/Tabs/TabContent'
import TabList from '@/components/ui/Tabs/TabList'
import TabNav from '@/components/ui/Tabs/TabNav'
import Tabs from '@/components/ui/Tabs'
import Password from './Password'
import { useEffect, useState } from 'react'

const Profile = () => {
    const [User, setUser] = useState()
    const [isData, setIsData] = useState(false)
    useEffect(() => {
        const fetchData = async () => {
            await new Promise((resolve) => setTimeout(resolve, 100))

            const user = JSON.parse(localStorage.getItem('admin') ?? '')
            const userID = JSON.parse(user.auth).user

            setUser(userID)
            setIsData(true)
        }
        fetchData()
    }, [])

    return (
        <Container>
            <AdaptableCard>
                {/* <Profile /> */}

                <Tabs defaultValue="tab1">
                    <TabList>
                        <TabNav value="tab1">Profile</TabNav>
                        <TabNav value="tab2">Password</TabNav>
                    </TabList>
                    <div className="p-4">
                        <TabContent value="tab1">
                            {isData ? <ProfileInfo user={User} /> : ''}
                        </TabContent>
                        <TabContent value="tab2">
                            <Password />
                        </TabContent>
                    </div>
                </Tabs>
            </AdaptableCard>
        </Container>
    )
}
export default Profile
