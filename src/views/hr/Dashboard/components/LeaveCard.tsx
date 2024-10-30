import Card from '@/components/ui/Card'
import Progress from '@/components/ui/Progress'

export type Leave = {
    precent: number
    taken: number
    remaining: number
    total: number
    leaveType: string
}

type LeaveRequestProps = {
    data?: Partial<Leave>
    className?: string
    colour?: string
}

const ProgressInfo = ({ remaining }: { remaining?: number }) => {
    return (
        <div>
            <h3 className="font-bold">{remaining}</h3>
        </div>
    )
}

const LeaveCard = ({ data = {}, className, colour }: LeaveRequestProps) => {
    return (
        <Card className={className}>
            <div className="mt-6">
                <Progress
                    color={colour}
                    variant="circle"
                    percent={data.precent}
                    width={150}
                    className="flex justify-center"
                    strokeWidth={5}
                    customInfo={<ProgressInfo remaining={data.remaining} />}
                />
            </div>
            <div className="text-center mt-6">
                <p className="font-semibold">{data.leaveType} </p>
                <h4 className="font-bold">Remaining</h4>
            </div>
        </Card>
    )
}

export default LeaveCard
