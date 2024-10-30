import ActionBar from './components/ActionBar'
import LeaveCard from './components/LeaveCard'

const anualLeaveData = {
    precent: parseInt(((100 / 14) * 2).toFixed(0)),
    taken: 2,
    remaining: 12,
    total: 14,
    leaveType: 'Annual',
}
const CasualLeaveData = {
    precent: parseInt(((100 / 7) * 5).toFixed(0)),
    taken: 5,
    remaining: 2,
    total: 7,
    leaveType: 'Casual',
}
const leaveData = {
    precent: parseInt(((100 / 21) * 21).toFixed(0)),
    taken: 0,
    remaining: 21,
    total: 21,
    leaveType: 'Medical',
}

const Dashboard = () => {
    return (
        <>
            <ActionBar />

            <div className="grid grid-cols-4 gap-4">
                <LeaveCard
                    className="xl:col-span-1"
                    data={anualLeaveData}
                    colour={'red-500'}
                />
                <LeaveCard
                    className="xl:col-span-1"
                    data={CasualLeaveData}
                    colour={'green-500'}
                />
                <LeaveCard
                    className="xl:col-span-1"
                    data={leaveData}
                    colour={'yellow-500'}
                />
                <LeaveCard
                    className="xl:col-span-1"
                    data={anualLeaveData}
                    colour={'purple-500'}
                />
            </div>
        </>
    )
}

export default Dashboard
