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
}

const EarningsData: React.FC<DialogProps> = ({ earningsData }) => {
    let earningData = null

    console.log(earningsData)

    if (earningsData != '') {
        earningData = JSON.parse(earningsData ? earningsData : '')
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
                        <>
                            <AdaptableCard>
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

                            {/* <span className="text-xs">{elm.amount}</span> */}
                        </>
                    ))}
                </div>
            </Card>
        </>
    )
}

export default EarningsData
