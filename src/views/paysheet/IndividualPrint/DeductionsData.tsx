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
}

const DeductionsData: React.FC<DialogProps> = ({ deductionsData }) => {
    let deductionData = null

    console.log(deductionsData)

    if (deductionsData != '') {
        deductionData = JSON.parse(deductionsData ? deductionsData : '')
    }

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
                        <>
                            <AdaptableCard>
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="col-span-2 ...">
                                        <span className="text-s">
                                            {elm.payCode} <span> </span>
                                            {elm.name}
                                        </span>
                                    </div>
                                    <div className="...">
                                        <span className="text-s">
                                            {elm.amount.toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                            </AdaptableCard>
                        </>
                    ))}
                </div>
            </Card>
        </>
    )
}

export default DeductionsData
