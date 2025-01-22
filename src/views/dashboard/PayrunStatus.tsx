import Card from '@/components/ui/Card'
import Avatar from '@/components/ui/Avatar'
import { HiFire } from 'react-icons/hi'
import Tag from '@/components/ui/Tag'
import { useEffect, useState } from 'react'
import usePayrun from '@/utils/hooks/usePayrun'
import type { CommonProps } from '@/@types/common'

interface DialogProps {
    companyCode: any
    period: any
}

const PayrunStatus: React.FC<DialogProps> = ({ companyCode, period }) => {
    const { getPayrunByPeriod } = usePayrun()
    const [payrunStatus, setPayrunStatus] = useState('')
    const [payrunTag, setPayrunTag] = useState('')

    const today = new Date()
    const curmonth = today.toLocaleDateString('en-US', { month: '2-digit' })
    const month = today.toLocaleDateString('en-US', { month: 'long' })
    const year = today.getFullYear()
    console.log(period)
    useEffect(() => {
        const result = getPayrunByPeriod({
            companyCode,
            period,
        })


        result.then((res) => {
            const listItems = JSON.parse(res?.data?.data ?? '')
            if (listItems.length > 0) {
                if (listItems[0].period == year + '' + curmonth) {
                    setPayrunStatus(listItems[0].payrunStatus)
                } else {
                    setPayrunStatus('Initiation pending')
                }

                setPayrunTag(
                    'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-100 rounded-md border-0 mx-2'
                )
            } else {
                setPayrunStatus('Initiation pending')
                setPayrunTag(
                    'bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-100 rounded-md border-0 mx-2'
                )
            }
        })
    }, [])

    return (
        <>
            <Card bordered className="mb-4">
                <div className="flex items-center gap-3">
                    <div>
                        <Avatar
                            className={
                                companyCode == 3000
                                    ? 'bg-emerald-500'
                                    : 'bg-rose-500'
                            }
                            shape="circle"
                            icon={<HiFire />}
                        ></Avatar>
                    </div>
                    <div>
                        <div className="flex items-center">
                            <h6>
                                {companyCode == 3000
                                    ? 'Ceylon Petroleum Storage Terminals Limited (CPSTL)'
                                    : 'Ceylon Petroleum Corporation (CPC)'}
                            </h6>
                            <Tag className={payrunTag}>
                                <span className="capitalize">
                                    {payrunStatus}
                                </span>
                            </Tag>
                        </div>
                        <div>
                            <span>
                                {month} {year}{' '}
                            </span>
                            <span> | </span>
                            <span>Payroll Status</span>
                        </div>
                    </div>
                </div>
            </Card>
        </>
    )
}

export default PayrunStatus
