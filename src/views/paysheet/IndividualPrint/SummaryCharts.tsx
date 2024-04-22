import { AdaptableCard } from '@/components/shared'
import Card from '@/components/ui/Card'
import Chart from 'react-apexcharts'
import { COLORS } from '@/constants/chart.constant'

type salData = {
    epfGross: number
    taxableGross: number
    tax: number
    emp_contribution: number
    comp_contribution: number
    etf: number
}
interface DialogProps {
    salData: string | ''
}

const SummaryCharts: React.FC<DialogProps> = ({ salData }) => {
    let summary = null

    if (salData != '') {
        summary = JSON.parse(salData ? salData : '')
    }

    const data = [
        {
            name: 'Gross Amount',
            data: [summary[0].taxableGross],
        },
        {
            name: 'Gross Deduction',
            data: [summary[0].deductionGross],
        },
        {
            name: 'Tax',
            data: [summary[0].tax],
        },
    ]

    const cardHeader = (
        <div className="flex items-center">
            <span>
                <div className="grid grid-cols-6 gap-4">
                    <div className="col-start-1 col-end-3">
                        <h6 className="text-sm">Summary</h6>
                    </div>
                </div>
            </span>
        </div>
    )

    return (
        <>
            <Card bordered className="mb-4" header={cardHeader}>
                <Chart
                    options={{
                        plotOptions: {
                            bar: {
                                horizontal: false,
                                columnWidth: '55%',
                                borderRadius: 4,
                            },
                        },
                        colors: COLORS,
                        dataLabels: {
                            enabled: false,
                        },
                        stroke: {
                            show: true,
                            width: 2,
                            colors: ['transparent'],
                        },
                        xaxis: {
                            categories: ['202312'],
                        },
                        fill: {
                            opacity: 1,
                        },
                        tooltip: {
                            y: {
                                formatter: (val) => `${val} thousands`,
                            },
                        },
                    }}
                    series={data}
                    height={300}
                    type="bar"
                />
            </Card>
        </>
    )
}

export default SummaryCharts
