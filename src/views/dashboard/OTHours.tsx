import Card from '@/components/ui/Card'
import { SetStateAction, useEffect, useState } from 'react'
import { COLORS, COLOR_2 } from '@/constants/chart.constant'
import Chart from 'react-apexcharts'
import useCommon from '@/utils/hooks/useCommon'
import Loading from '@/components/shared/Loading'
import Timeline from '@/components/ui/Timeline'
import Button from '@/components/ui/Button'
import { useNavigate } from 'react-router-dom'
import TimelineAvatar from './components/TimeLineAvatar'
import Event from './components/Event'
import isEmpty from 'lodash/isEmpty'
import usePayrun from '@/utils/hooks/usePayrun'

interface DialogProps {
    companyCode: any
    period: any
}

const ticketData: {
    type: string
    dateTime: number
    ticket: string
    status: number
    userName: any
    userImg: string
}[] = []

const OTHours: React.FC<DialogProps> = ({ companyCode, period }) => {
    const { getOTHours } = useCommon()
    const { getPayrunByPeriod } = usePayrun()
    const [summaryList, setSummary] = useState<any[]>([])
    const [isDataLoaded, setDataLoaded] = useState(false)

    const today = new Date()
    const month = today.toLocaleDateString('en-US', { month: 'long' })
    const year = today.getFullYear()

    useEffect(() => {
        setDataLoaded(true)

        const results = getPayrunByPeriod({
            companyCode,
            period,
        })
        results.then((res) => {
            const listItems = JSON.parse(res?.data?.data ?? '')
            console.log(listItems[0])
            ticketData.length = 0

            if (listItems.length > 0) {
                if (listItems[0].dataTransferredBy != null) {
                    const ticket = {
                        type: 'UPDATE-TICKET',
                        dateTime: listItems[0].dataTransferredTime,
                        ticket: 'Payrun Status',
                        status: 0,
                        userName: listItems[0].dataTransferredBy,
                        userImg: '',
                    }

                    ticketData.push(ticket)
                }
                if (listItems[0].approvedBy != null) {
                    const ticket = {
                        type: 'UPDATE-TICKET',
                        dateTime: listItems[0].approvedTime,
                        ticket: 'Payrun Status',
                        status: 1,
                        userName: listItems[0].approvedBy,
                        userImg: '',
                    }

                    ticketData.push(ticket)
                }
                if (listItems[0].payrunBy != null) {
                    const ticket = {
                        type: 'UPDATE-TICKET',
                        dateTime: listItems[0].payrunTime,
                        ticket: 'Payrun Status',
                        status: 2,
                        userName: listItems[0].payrunBy,
                        userImg: '',
                    }

                    ticketData.push(ticket)
                }
                if (listItems[0].bankFileCreatedBy != null) {
                    const ticket = {
                        type: 'UPDATE-TICKET',
                        dateTime: listItems[0].bankFileCreatedTime,
                        ticket: 'Payrun Status',
                        status: 3,
                        userName: listItems[0].bankFileCreatedBy,
                        userImg: '',
                    }

                    ticketData.push(ticket)
                }
            }
        })

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

            setDataLoaded(false)
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

    const navigate = useNavigate()

    const onViewAllActivity = () => {
        navigate('/dashboard/PayrollActivities/PayrollActivities', {
            state: { data: ticketData },
        })
    }

    return (
        <>
            <Loading loading={isDataLoaded}>
                <div className="flex flex-col gap-4 h-full">
                    <div className="flex flex-col xl:flex-row gap-4">
                        <div className="flex flex-col gap-4 flex-auto">
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
                                            categories: summaryList
                                                ? summaryList[2]
                                                : [],
                                        },
                                        yaxis: {
                                            axisBorder: {
                                                show: false,
                                            },
                                            axisTicks: {
                                                show: false,
                                            },
                                            labels: {
                                                show: true,
                                                formatter: function (val) {
                                                    return val.toLocaleString()
                                                },
                                            },
                                        },
                                    }}
                                    series={summaryData}
                                    height={300}
                                />
                            </Card>
                        </div>
                        <div className="flex flex-col gap-4">
                            <div className="xl:w-[380px]">
                                <Card>
                                    <div className="flex items-center justify-between mb-6">
                                        <h4>Payroll Activities</h4>
                                        <Button
                                            size="sm"
                                            onClick={onViewAllActivity}
                                        >
                                            View All
                                        </Button>
                                    </div>
                                    <div className="mt-6">
                                        <Timeline>
                                            {isEmpty(data) ? (
                                                <Timeline.Item>
                                                    No Activities
                                                </Timeline.Item>
                                            ) : (
                                                ticketData
                                                    .slice(0, 2)
                                                    .map((event, index) => (
                                                        <Timeline.Item
                                                            key={
                                                                event.type +
                                                                index
                                                            }
                                                            media={
                                                                <TimelineAvatar
                                                                    data={event}
                                                                />
                                                            }
                                                        >
                                                            <Event
                                                                compact
                                                                data={event}
                                                            />
                                                        </Timeline.Item>
                                                    ))
                                            )}
                                        </Timeline>
                                    </div>
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>

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
            </Loading>
        </>
    )
}

export default OTHours
