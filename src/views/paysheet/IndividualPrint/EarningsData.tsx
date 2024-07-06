import { AdaptableCard } from '@/components/shared'
import Card from '@/components/ui/Card'

type earningsData = {
    name: string
    payCode: number
    amount: number
    calCode: string
}

interface DialogProps {
    earningsData: string | ''
    salData: string | ''
}

const EarningsData: React.FC<DialogProps> = ({ earningsData, salData }) => {
    let earningData = null
    let summary = null

    if (earningsData != '') {
        earningData = JSON.parse(earningsData ? earningsData : '')
        summary = JSON.parse(salData ? salData : '')
    }

    const cardHeader = (
        <div className="flex items-center">
            <span>
                <div className="grid grid-cols-6 gap-4">
                    <div className="col-start-1 col-end-3">
                        <h6 className="text-sm">Earnings</h6>
                    </div>
                </div>
            </span>
        </div>
    )

    return (
        <>
            <Card bordered className="mb-4" header={cardHeader}>
                <div className="grid grid-flow-row auto-rows-max gap-4">
                    {[...earningData].map((elm) => (
                        <AdaptableCard key={elm.id}>
                            <div className="grid grid-cols-3 gap-4">
                                <div className="col-span-2 ...">
                                    <span className="text-s">
                                        {elm.payCode} {elm.name}
                                    </span>
                                </div>
                                <div className="...">
                                    <span className="text-s">
                                        {elm.amount.toFixed(2)}
                                    </span>
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
                                <strong>GROSS PAY</strong>
                            </span>
                        </div>
                        <div className="...">
                            <span className="text-s">
                                <strong>
                                    {summary[0].grossAmount.toFixed(2)}
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

export default EarningsData
