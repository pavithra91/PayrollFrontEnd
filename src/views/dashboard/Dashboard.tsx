/** Example purpose only */
import AdaptableCard from '@/components/shared/AdaptableCard'
import PayrunStatus from './PayrunStatus'

const Dashboard = () => {
    return (
        <>
            Dashboard
            <div className="w-full">
                <AdaptableCard>
                    <div className="grid grid-cols-2 gap-4">
                        <PayrunStatus companyCode={3000} period={202312} />
                        <PayrunStatus companyCode={2000} period={202312} />
                    </div>
                </AdaptableCard>
                <AdaptableCard>
                    <div className="grid grid-cols-2 gap-4"></div>
                </AdaptableCard>
            </div>
        </>
    )
}

export default Dashboard
