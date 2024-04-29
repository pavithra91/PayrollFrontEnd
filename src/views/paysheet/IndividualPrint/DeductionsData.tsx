import { AdaptableCard } from '@/components/shared'
import Card from '@/components/ui/Card'

type deductionsData = {
    name: string
    payCode: number
    amount: number
    calCode: string
}

interface DialogProps {
    deductionsData: string | ''
    salData: string | ''
    unRecoveredData: string | ''
}

const unRecoveredTagClass = (paytype: string) => {
    if (paytype == 'U') {
        return 'text-red-500'
    } else {
        return 'text-black-600'
    }
}

const DeductionsData: React.FC<DialogProps> = ({
    deductionsData,
    salData,
    unRecoveredData,
}) => {
    let deductionData = null
    let summary = null
    let unRecovered = null

    if (deductionsData != '') {
        deductionData = JSON.parse(deductionsData ? deductionsData : '')
        summary = JSON.parse(salData ? salData : '')
    }

    if (unRecoveredData != '') {
        unRecovered = JSON.parse(unRecoveredData ? unRecoveredData : '')
    }

    console.log(unRecovered)

    const cardHeader = (
        <div className="flex items-center">
            <span>
                <div className="grid grid-cols-6 gap-4">
                    <div className="col-start-1 col-end-3">
                        <h6 className="text-sm">Deductions</h6>
                    </div>
                </div>
            </span>
        </div>
    )

    return (
        <>
            <Card bordered className="mb-4" header={cardHeader}>
                <div className="grid grid-flow-row auto-rows-max gap-4">
                    {[...deductionData].map((elm) => (
                        <AdaptableCard key={elm.id}>
                            <div className="grid grid-cols-7">
                                <div className="col-span-5 ...">
                                    <span className="text-s">
                                        {elm.payCode} <span> </span>
                                        {elm.name}
                                    </span>
                                </div>
                                <div className="...">
                                    {/* <span className="text-s"> */}
                                    <span
                                        className={`text-s ${unRecoveredTagClass(
                                            elm.paytype
                                        )}`}
                                    >
                                        {elm.amount.toFixed(2)}
                                    </span>
                                </div>
                                <div className="...">
                                    <span className="text-s"></span>
                                </div>
                            </div>
                        </AdaptableCard>
                    ))}
                </div>

                <br></br>
                <hr></hr>
                <div className="grid grid-flow-row auto-rows-max gap-4">
                    <div className="grid grid-cols-3 gap-4 my-2">
                        <div className="col-span-2 ...">
                            <span className="text-s">
                                <strong>DEDUCTIONS</strong>
                            </span>
                        </div>
                        <div className="...">
                            <span className="text-s">
                                <strong>
                                    {summary[0].deductionGross.toFixed(2)}
                                </strong>
                            </span>
                        </div>
                    </div>
                </div>
                <hr></hr>
            </Card>
        </>
    )
}

export default DeductionsData
