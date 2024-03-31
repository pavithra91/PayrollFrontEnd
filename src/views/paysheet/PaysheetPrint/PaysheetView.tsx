import type { CommonProps, CompanyIdSelectOption } from '@/@types/common'
import { FC, useEffect, useState } from 'react'
import {
    FieldHelperProps,
    FieldInputProps,
    FieldMetaProps,
    useField,
} from 'formik'

interface FormProps extends CommonProps {
    disableSubmit?: boolean
}

interface RenderProps<V = any> {
    field: FieldInputProps<V>
    meta: FieldMetaProps<V>
    helpers: FieldHelperProps<V>
}

interface FieldWrapperProps<V = any> {
    name: string
    render: (formikProps: RenderProps<V>) => React.ReactElement
}


const PaysheetView = (props: FormProps) => {

return(<>
</>)
}

export default PaysheetView