import AdaptableCard from '@/components/shared/AdaptableCard'
import PayrunStatus from './dashboard/PayrunStatus'
import OTHours from './dashboard/OTHours'

const Home = () => {
    const today = new Date()
    const month = today.toLocaleDateString('en-US', { month: 'long' })
    const year = today.getFullYear()

    console.log(today.getMonth() + 1)

    return (
        <>
            <div className="w-full">
                <AdaptableCard>
                    <div className="grid grid-cols-2 gap-4">
                        <PayrunStatus companyCode={3000} period={202312} />
                        <PayrunStatus companyCode={2000} period={202312} />
                    </div>
                </AdaptableCard>
                <AdaptableCard>
                    <div className="grid grid-cols-1 gap-4">
                        <OTHours companyCode={3000} period={202312} />
                    </div>
                </AdaptableCard>
            </div>
        </>
    )
}

export default Home
