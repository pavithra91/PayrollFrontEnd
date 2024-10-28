import Timeline from '@/components/ui/Timeline'
import isEmpty from 'lodash/isEmpty'
import TimelineAvatar from '../components/TimeLineAvatar'
import Event from '../components/Event'
import Card from '@/components/ui/Card'

type PayrollActivitiesProps = {
    data?: {
        type: string
        dateTime: number
        ticket?: string
        status?: number
        userName: string
        userImg?: string
    }[]
}

const ViewPayrollActivities = ({ data = [] }: PayrollActivitiesProps) => {
    console.log('data' + data)
    return (
        <>
            <Card>
                <div className="flex items-center justify-between mb-6">
                    <h4>Payroll Activities</h4>
                    {/* <Button
                                            size="sm"
                                            onClick={onViewAllActivity}
                                        >
                                            View All
                                        </Button> */}
                </div>
                <div className="mt-6">
                    <Timeline>
                        {isEmpty(data) ? (
                            <Timeline.Item>No Activities</Timeline.Item>
                        ) : (
                            data.map((event, index) => (
                                <Timeline.Item
                                    key={event.type + index}
                                    media={<TimelineAvatar data={event} />}
                                >
                                    <Event compact data={event} />
                                </Timeline.Item>
                            ))
                        )}
                    </Timeline>
                </div>
            </Card>
        </>
    )
}

export default ViewPayrollActivities
