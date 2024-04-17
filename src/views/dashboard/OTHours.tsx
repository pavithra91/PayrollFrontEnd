import Card from '@/components/ui/Card'
import { SetStateAction, useEffect, useState } from 'react'
import { COLORS } from '@/constants/chart.constant'
import Chart from 'react-apexcharts'
import useCommon from '@/utils/hooks/useCommon'

interface DialogProps {
    companyCode: any
    period: any
}

interface othoursList{
    othours: any[]
}

const OTHours: React.FC<DialogProps> = ({ companyCode, period }) => {
    const { getOTHours } = useCommon()

    const [otData, setData] = useState<othoursList>()
    const [costCenters, setCostCenters] = useState()

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
            const othours: any[] | ((prevState: never[]) => never[]) = []
            const costcenters: any[] | SetStateAction<undefined> = []

            listItems.map((elm: { othours: any; costCenter: any }) => {
                othours.push(elm.othours)
                costcenters.push(elm.costCenter)
            })
            setData(othours)
            setCostCenters(costcenters)
        })
    }, [])

    const data = [
        {
            data: otData,
        },
    ]

    return (
        <>
            <Card bordered className="mb-4">
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
                            categories: costCenters,
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
