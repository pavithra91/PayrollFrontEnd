import { AdaptableCard } from '@/components/shared'
import Card from '@/components/ui/Card'

type salData = {
    epfGross: number
    taxableGross: number
    tax: number
    emp_contribution: number
    comp_contribution: number
    etf: number
}
interface DialogProps {
    salData: string | ''
}

const Summary: React.FC<DialogProps> = ({ salData }) => {
    let summary = null

    if (salData != '') {
        summary = JSON.parse(salData ? salData : '')
    }

    const cardHeader = (
        <div className="flex items-center">
            <span>
                <div className="grid grid-cols-6 gap-4">
                    <div className="col-start-1 col-end-3">
                        <h6 className="text-sm">Summary</h6>
                    </div>
                </div>
            </span>
        </div>
    )

    return (
        <>
            <Card bordered className="mb-4" header={cardHeader}>
                <div className="grid grid-flow-row auto-rows-max gap-4">
                    {[...summary].map((elm) => (
                        <AdaptableCard key={elm.id}>
                            <div className="grid grid-cols-8 gap-4">
                                <div className="col-span-3 ...">
                                    <span className="text-s">Gross : </span>
                                    <span className="text-s">
                                        {elm.taxableGross.toFixed(2)}
                                    </span>
                                </div>
                                <div className="col-span-3 ...">
                                    <span className="text-s">
                                        ETF Contribution (Employee) :{' '}
                                    </span>
                                    <span className="text-s">
                                        {elm.emp_contribution.toFixed(2)}
                                    </span>
                                </div>

                                <div className="col-span-2 ...">
                                    <span className="text-s">ETF : </span>
                                    <span className="text-s">
                                        {elm.etf.toFixed(2)}
                                    </span>
                                </div>
                            </div>

                            <div className="grid grid-cols-8 gap-4">
                                <div className="col-span-3 ...">
                                    <span className="text-s">Tax : </span>
                                    <span className="text-s">
                                        {elm.tax.toFixed(2)}
                                    </span>
                                </div>
                                <div className="col-span-3 ...">
                                    <span className="text-s">
                                        ETF Contribution (Company) :{' '}
                                    </span>
                                    <span className="text-s">
                                        {elm.comp_contribution.toFixed(2)}
                                    </span>
                                </div>

                                <div className="col-span-2 ...">
                                    <span className="text-s">
                                        Unrecovered :{' '}
                                    </span>
                                    <span className="text-s">
                                        {elm.unRecoveredTotal
                                            ? elm.unRecoveredTotal.toFixed(2)
                                            : '0.0'}
                                    </span>
                                </div>
                            </div>
                        </AdaptableCard>
                    ))}
                </div>
            </Card>
        </>
    )
}

export default Summary
