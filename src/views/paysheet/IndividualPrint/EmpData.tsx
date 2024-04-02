import Card from '@/components/ui/Card'
import EarningsData from './EarningsData'
import DeductionsData from './DeductionsData'
import Summary from './Summary'
import SummaryCharts from './SummaryCharts'

type empData = {
    epf: number
    empName: string
    companyCode: number
    location: number
    costCenter: string
    empGrade: string
    gradeCode: number
}

type earningsData = {
    name: string
    payCode: number
    amount: number
    calCode: string
}

interface DialogProps {
    empData: string | ''
    earningsData: string | ''
    deductionsData: string | ''
    salData: string | ''
}

const EmpData: React.FC<DialogProps> = ({
    empData,
    earningsData,
    deductionsData,
    salData,
}) => {
    let employeeData = null

    if (empData != '') {
        employeeData = JSON.parse(empData ? empData : '')
    }

    const cardHeader = (
        <div className="flex items-center">
            <span>
                <div className="grid grid-cols-6 gap-4">
                    <div className="col-start-1 col-end-3">
                        <h6 className="text-sm">{employeeData[0].empName}</h6>
                        <span className="text-xs">
                            Grade : {employeeData[0].empGrade}
                        </span>
                    </div>
                    <div className="col-end-7 col-span-2">
                        <h6 className="text-sm">
                            {employeeData[0].companyCode == 3000
                                ? 'Ceylon Petroleum Storage Terminals Limited (CPSTL)'
                                : 'Ceylon Petroleum Corporation (CPC)'}
                        </h6>
                        <span className="text-xs">
                            Location : {employeeData[0].location}
                        </span>
                    </div>
                </div>
            </span>
        </div>
    )

    return (
        <>
            <Card bordered className="mb-4" header={cardHeader}>
                <div className="grid grid-cols-1 gap-4">
                    <Summary salData={salData} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <EarningsData earningsData={earningsData} />
                    <DeductionsData deductionsData={deductionsData} />
                </div>

                <div className="grid grid-cols-1 gap-4">
                    <SummaryCharts salData={salData} />
                </div>
            </Card>
        </>
    )
}

export default EmpData
