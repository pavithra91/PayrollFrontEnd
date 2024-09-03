import AdaptableCard from '@/components/shared/AdaptableCard'
import PayrunStatus from './dashboard/PayrunStatus'
import OTHours from './dashboard/OTHours'
import useCommon from '@/utils/hooks/useCommon'

const Home = () => {
    const { getPreviousMonthAndYear } = useCommon()

    return (
        <>
            <div className="w-full">
                <AdaptableCard>
                    <div className="grid grid-cols-2 gap-4">
                        <PayrunStatus
                            companyCode={3000}
                            period={getPreviousMonthAndYear().previousPeriod}
                        />
                        <PayrunStatus
                            companyCode={2000}
                            period={getPreviousMonthAndYear().previousPeriod}
                        />
                    </div>
                </AdaptableCard>
                <AdaptableCard>
                    <div className="grid grid-cols-1 gap-4">
                        <OTHours
                            companyCode={3000}
                            period={getPreviousMonthAndYear().previousPeriod}
                        />
                    </div>
                </AdaptableCard>
            </div>
        </>
    )
}

export default Home
