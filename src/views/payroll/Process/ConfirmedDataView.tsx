import type { CommonProps } from '@/@types/common'
import { useState } from 'react'
import Steps from '@/components/ui/Steps'
import Button from '@/components/ui/Button'

type Option = {
    value: number
    label: string
}

interface FormProps extends CommonProps {
    disableSubmit?: boolean
}

const ConfirmedDataView = (props: FormProps) => {
    const [step, setStep] = useState(0)

    const onChange = (nextStep: number) => {
        if (nextStep < 0) {
            setStep(0)
        } else if (nextStep > 3) {
            setStep(3)
        } else {
            setStep(nextStep)
        }
    }

    const onNext = () => onChange(step + 1)

    const onPrevious = () => onChange(step - 1)

    return (
        <>
            <Steps current={step}>
                <Steps.Item title="Confirm Data Transfer" />
                <Steps.Item title="Process Payroll" />
                <Steps.Item title="Create Unrecovered" />
                <Steps.Item title="Payroll Summary" />
            </Steps>
            <div className="mt-6 h-40 bg-gray-50 dark:bg-gray-700 rounded flex items-center justify-center">
                <h6>Step {`${step + 1}`} content</h6>
            </div>
            {step == 2 && <h6>Step is two content</h6>}
            <div className="mt-4 text-right">
                <Button
                    className="mx-2"
                    disabled={step === 0}
                    onClick={onPrevious}
                >
                    Previous
                </Button>
                <Button disabled={step === 3} variant="solid" onClick={onNext}>
                    {step === 3 ? 'Completed' : 'Next'}
                </Button>
            </div>
        </>
    )
}
export default ConfirmedDataView
