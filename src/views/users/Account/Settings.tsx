import AdaptableCard from '@/components/shared/AdaptableCard'
import Container from '@/components/shared/Container'
import Profile from './Profile'
import TabContent from '@/components/ui/Tabs/TabContent'
import TabList from '@/components/ui/Tabs/TabList'
import TabNav from '@/components/ui/Tabs/TabNav'
import Tabs from '@/components/ui/Tabs'
import Password from './Password'

const Settings = () => {
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
                            <Profile />
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
export default Settings
