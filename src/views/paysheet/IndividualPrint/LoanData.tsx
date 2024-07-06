import { AdaptableCard } from '@/components/shared'
import Card from '@/components/ui/Card'

type loanData = {
    name: string
    payCode: number
    balanceAmount: number
    amount: number
    calCode: string
}

interface DialogProps {
    loanData: string | ''
    salData: string | ''
}

const EarningsData: React.FC<DialogProps> = ({ loanData, salData }) => {
    let earningData = null
    let summary = null

    if (loanData != '') {
        earningData = JSON.parse(loanData ? loanData : '')
        //summary = JSON.parse(salData ? salData : '')
    }

    const cardHeader = (
        <div className="flex items-center">
            <span>
                <div className="grid grid-cols-6 gap-4">
                    <div className="col-start-1 col-end-3">
                        <h6 className="text-sm">Loan Details</h6>
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
                            <div className="grid grid-cols-5 gap-4">
                                <div className="col-span-2 ...">
                                    <span className="text-s">
                                        {elm.payCode} {elm.name}
                                    </span>
                                </div>
                                <div className="...">
                                    <span className="text-s">
                                        {elm.balanceAmount.toFixed(2)}
                                    </span>
                                </div>
                                <div className="...">
                                    <span className="text-s">
                                        {elm.amount.toFixed(2)}
                                    </span>
                                </div>
                                <div className="...">
                                    <span className="text-s text-red-500">
                                        {(
                                            elm.balanceAmount - elm.amount
                                        ).toFixed(2)}
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
                                {/* <strong>GROSS PAY</strong> */}
                            </span>
                        </div>
                        <div className="...">
                            <span className="text-s">
                                <strong></strong>
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
