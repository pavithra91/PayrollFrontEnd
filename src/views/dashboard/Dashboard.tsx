/** Example purpose only */
import AdaptableCard from '@/components/shared/AdaptableCard'
import PayrunStatus from './PayrunStatus'
import OTHours from './OTHours'

const Dashboard = () => {
    function getPreviousMonthAndYear() {
        const now = new Date()
        now.setDate(0) // Set date to the last day of the current month (for accurate previous month calculation)

        const prevMonth = now.getMonth() - 1 // Get previous month (0-indexed)
        const prevYear =
            prevMonth < 0 ? now.getFullYear() - 1 : now.getFullYear() // Adjust year if necessary (if previous month is December)

        // Optional: Format the month and year as needed
        const formattedMonth = (prevMonth + 1).toString().padStart(2, '0') // Add leading zero for single-digit months (optional)
        const formattedYear = prevYear.toString()

        return {
            month: prevMonth,
            year: prevYear,
            formattedMonth,
            formattedYear,
        }
    }

    const { month, year, formattedMonth, formattedYear } =
        getPreviousMonthAndYear()

    console.log(
        `Previous month: ${month + 1} (index), ${formattedMonth} (formatted)`
    ) // month is 0-indexed

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
                    <div className="grid grid-cols-1 gap-4">
                        <OTHours companyCode={3000} period={202312} />
                    </div>
                </AdaptableCard>
            </div>
        </>
    )
}

export default Dashboard
