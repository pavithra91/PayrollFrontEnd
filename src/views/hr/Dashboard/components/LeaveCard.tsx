import Card from '@/components/ui/Card'
import Progress from '@/components/ui/Progress'

export type Leave = {
    epf?: string
    leaveTypeName?: string
    year?: number
    allocatedLeave?: number
    usedLeave?: number
    remainingLeave?: number
    carrForwardLeave?: number
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

const calculatePercentage = (data: Leave) => {
    const allocatedLeave = data.allocatedLeave ?? 1 // Avoid division by 0
    const usedLeave = data.usedLeave ?? 0

    return (100 / allocatedLeave) * usedLeave
}

const LeaveCard = ({ data = {}, className, colour }: LeaveRequestProps) => {
    return (
        <Card className={className}>
            <div className="mt-6">
                <Progress
                    color={colour}
                    variant="circle"
                    percent={calculatePercentage(data)}
                    width={150}
                    className="flex justify-center"
                    strokeWidth={5}
                    customInfo={
                        <ProgressInfo remaining={data.remainingLeave} />
                    }
                />
            </div>
            <div className="text-center mt-6">
                <p className="font-semibold">{data.leaveTypeName} </p>
                <h4 className="font-bold">Remaining</h4>
            </div>
        </Card>
    )
}

export default LeaveCard
