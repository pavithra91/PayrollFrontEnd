import GrowShrinkTag from '@/components/shared/GrowShrinkTag'
import Card from '@/components/ui/Card/Card'
import { useState } from 'react'
import { NumericFormat } from 'react-number-format'

interface SimulateItem {
    ResultType: string
    CurrentValue: number
    Percentage: string
}

interface DialogProps {
    data: Array<SimulateItem>
}

const Statistics: React.FC<DialogProps> = ({ data }) => {
    function convertAndFormat(str: string) {
        const num = parseFloat(str)
        const formattedNum = num.toFixed(2)
        return formattedNum
    }

    return (
        <>
            {data && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {data.map(
                        (item: {
                            ResultType: string
                            CurrentValue: number
                            Percentage: string
                        }) => (
                            <Card key={item.ResultType}>
                                <h6 className="font-semibold mb-4 text-sm">
                                    {item.ResultType}
                                </h6>
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h3 className="font-bold">
                                            <NumericFormat
                                                thousandSeparator
                                                displayType="text"
                                                value={item.CurrentValue}
                                                prefix="Rs  "
                                            />
                                        </h3>
                                    </div>
                                    <GrowShrinkTag
                                        value={parseFloat(
                                            convertAndFormat(item.Percentage)
                                        )}
                                        suffix="%"
                                    />
                                </div>
                            </Card>
                        )
                    )}
                </div>
            )}
        </>
    )
}

export default Statistics
