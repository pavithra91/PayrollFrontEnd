import AdaptableCard from '@/components/shared/AdaptableCard'
import Container from '@/components/shared/Container'
import Profile from './Profile'
import TabContent from '@/components/ui/Tabs/TabContent'
import TabList from '@/components/ui/Tabs/TabList'
import TabNav from '@/components/ui/Tabs/TabNav'
import Tabs from '@/components/ui/Tabs'
import Password from './Password'
import Develeopment from './Develeopment'
import { useEffect, useState } from 'react'

const Settings = () => {
    const [User, setUser] = useState()
    const [isData, setIsData] = useState(false)
    useEffect(() => {
        const fetchData = async () => {
            await new Promise((resolve) => setTimeout(resolve, 100))

            const user = JSON.parse(localStorage.getItem('admin') ?? '')
            const userID = JSON.parse(user.auth).user

            console.log(userID)

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
                        <TabNav value="tab3">Develeopment</TabNav>
                    </TabList>
                    <div className="p-4">
                        <TabContent value="tab1">
                            {isData ? <Profile user={User} /> : ''}
                        </TabContent>
                        <TabContent value="tab2">
                            <Password />
                        </TabContent>
                        <TabContent value="tab3">
                            <Develeopment />
                        </TabContent>
                    </div>
                </Tabs>
            </AdaptableCard>
        </Container>
    )
}
export default Settings
