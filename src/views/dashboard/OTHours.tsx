import Card from '@/components/ui/Card'
import { useEffect, useState } from 'react'
import usePayrun from '@/utils/hooks/usePayrun'
import { COLORS } from '@/constants/chart.constant'
import Chart from 'react-apexcharts'

interface DialogProps {
    companyCode: any
    period: any
}

const OTHours: React.FC<DialogProps> = ({ companyCode, period }) => {
    const { getPayrunByPeriod } = usePayrun()
    const [payrunStatus, setPayrunStatus] = useState('')
    const [payrunTag, setPayrunTag] = useState('')

    const today = new Date()
    const month = today.toLocaleDateString('en-US', { month: 'long' })
    const year = today.getFullYear()

    useEffect(() => {
        const result = getPayrunByPeriod({
            companyCode,
            period,
        })
        result.then((res) => {
            const listItems = JSON.parse(res?.data?.data ?? '')
            console.log(listItems)
            if (listItems.length > 0) {
                console.log(listItems[0].payrunStatus)
                setPayrunStatus(listItems[0].payrunStatus)
                setPayrunTag(
                    'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-100 rounded-md border-0 mx-2'
                )
            } else {
                setPayrunStatus('Not Started')
                setPayrunTag(
                    'bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-100 rounded-md border-0 mx-2'
                )
            }
        })
    }, [])

    const data = [
        {
            data: [400, 430, 448, 470, 540, 580, 690, 1100, 1200, 1380],
        },
    ]

    return (
        <>
            <Card bordered className="mb-4">
                <Chart
                    options={{
                        plotOptions: {
                            bar: {
                                horizontal: true,
                            },
                        },
                        colors: COLORS,
                        dataLabels: {
                            enabled: false,
                        },
                        xaxis: {
                            categories: [
                                'South Korea',
                                'Canada',
                                'United Kingdom',
                                'Netherlands',
                                'Italy',
                                'France',
                                'Japan',
                                'United States',
                                'China',
                                'Germany',
                            ],
                        },
                    }}
                    series={data}
                    type="bar"
                    height={300}
                />
            </Card>
        </>
    )
}

export default OTHours
