import type { CommonProps } from '@/@types/common'

import ViewCalculation from './ViewCalculation'

interface FormProps extends CommonProps {
    disableSubmit?: boolean
}

const CalculationsPage = (props: FormProps) => {
    return (
        <>
            <ViewCalculation></ViewCalculation>
        </>
    )
}

export default CalculationsPage
