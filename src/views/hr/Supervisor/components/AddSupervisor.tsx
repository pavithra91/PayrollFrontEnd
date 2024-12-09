import { Field, Form, Formik, FieldProps } from 'formik'
import {
    AllSupervisorData,
    useAppDispatch,
    useAppSelector,
} from '../store'
import { Select } from '@/components/ui/Select'
import { FormItem, FormContainer } from '@/components/ui/Form'
import AsyncSelect from 'react-select/async'
import { useState } from 'react'

const colourOptions = [
    { value: 'ocean', label: 'Ocean', color: '#00B8D9', isFixed: true },
    { value: 'blue', label: 'Blue', color: '#0052CC', isDisabled: true },
    { value: 'purple', label: 'Purple', color: '#5243AA' },
    { value: 'red', label: 'Red', color: '#FF5630', isFixed: true },
    { value: 'orange', label: 'Orange', color: '#FF8B00' },
    { value: 'yellow', label: 'Yellow', color: '#FFC400' },
    { value: 'green', label: 'Green', color: '#36B37E' },
    { value: 'forest', label: 'Forest', color: '#00875A' },
    { value: 'slate', label: 'Slate', color: '#253858' },
    { value: 'silver', label: 'Silver', color: '#666666' },
]



const AddSupervisor = () => {

    const employeeData = useAppSelector(
        (state) => state.SupervisorData.data.employeeData
    )

    var arr: { value: string; label: string }[] = []

    employeeData.map(items => {
        arr.push({value: items.epf, label: items.empName + ' - ' + items.epf})
    })

    console.log(employeeData)

    const filterColors = (inputValue: string) => {
        return arr.filter((i) =>
            i.label.toLowerCase().includes(inputValue.toLowerCase())
        )
    }
    
    const loadOptions = (inputValue: string, callback: (arg0: AllSupervisorData[]) => void) => {
        setTimeout(() => {
            callback(filterColors(inputValue))
        }, 1000)
    }

    const [_, setValue] = useState('')

    const handleInputChange = (newValue: string) => {
        const inputValue = newValue.replace(/\W/g, '')
        setValue(inputValue)
        return inputValue
    }

    return(
        <>
         <Formik
                initialValues={{

                }}
                enableReinitialize={true}
                //validationSchema={validationSchema}
                onSubmit={(values, { setSubmitting }) => {

                   // onSubmit(values, setSubmitting)

                    setSubmitting(true)
                }}
            >
                {({ values, touched, errors, setFieldValue, isSubmitting }) => (
                    <Form>
                        <FormContainer>
                        <Select
                cacheOptions
                loadOptions={loadOptions}
                defaultOptions
                onInputChange={handleInputChange}
                componentAs={AsyncSelect}
            />
                        </FormContainer>
                    </Form>
                )}
            </Formik>
        </>
    )

}

export default AddSupervisor