import Card from '@/components/ui/Card'
import { SetStateAction, useEffect, useState } from 'react'
import { COLORS, COLOR_2 } from '@/constants/chart.constant'
import Chart from 'react-apexcharts'
import useCommon from '@/utils/hooks/useCommon'

interface DialogProps {
    companyCode: any
    period: any
}

interface othoursList {
    othours: any[]
}

const OTHours: React.FC<DialogProps> = ({ companyCode, period }) => {
    const { getOTHours } = useCommon()
    const [summaryList, setSummary] = useState<any[]>([])

    const today = new Date()
    const month = today.toLocaleDateString('en-US', { month: 'long' })
    const year = today.getFullYear()

    useEffect(() => {
        const result = getOTHours({
            companyCode,
            period,
        })
        result.then((res) => {
            const listItems = JSON.parse(res?.data?.data ?? '')
            const overTime = JSON.parse(listItems[0].overTimeData)
            const summary = JSON.parse(listItems[0].summaryData)

            const othours: any[] | ((prevState: never[]) => never[]) = []
            const costcenters: any[] | SetStateAction<undefined> = []
            const period: any[] | ((prevState: never[]) => never[]) = []
            const grossAmount: any[] | SetStateAction<undefined> = []

            const arr = []

            overTime.map((elm: { othours: any; costCenter: any }) => {
                othours.push(elm.othours)
                costcenters.push(elm.costCenter)
            })

            summary.map((elm: { period: any; Gross: any }) => {
                period.push(elm.period)
                grossAmount.push(elm.Gross)
            })

            arr.push(othours)
            arr.push(costcenters)
            arr.push(period)
            arr.push(grossAmount)

            setSummary(arr)
        })
    }, [])

    const data = [
        {
            data: summaryList ? summaryList[0] : [],
        },
    ]
    const summaryData = [
        {
            data: summaryList ? summaryList[3] : [],
        },
    ]

    return (
        <>
            <Card bordered className="mb-4">
                <h5>Gross Amount (Last 10 Months)</h5>
                <Chart
                    options={{
                        chart: {
                            type: 'line',
                            zoom: {
                                enabled: false,
                            },
                        },
                        dataLabels: {
                            enabled: false,
                        },
                        stroke: {
                            curve: 'smooth',
                            width: 3,
                        },
                        colors: [COLOR_2],
                        xaxis: {
                            categories: summaryList ? summaryList[2] : [],
                        },
                    }}
                    series={summaryData}
                    height={300}
                />
            </Card>
            <Card bordered className="mb-4">
                <h5>OverTime (Last Payrun)</h5>
                <Chart
                    options={{
                        plotOptions: {
                            bar: {
                                horizontal: false,
                            },
                        },
                        colors: COLORS,
                        dataLabels: {
                            enabled: false,
                        },
                        xaxis: {
                            categories: summaryList ? summaryList[1] : [],
                        },
                    }}
                    series={data}
                    type="bar"
                    height={400}
                />
            </Card>
        </>
    )
}

export default OTHours
