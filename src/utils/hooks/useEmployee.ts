import { AdvancePayment } from '@/@types/Leave'
import { apiAddAdvancePayment } from '@/services/EmployeeService'

function useEmployee() {
    const addAdvancePayment = async (values: AdvancePayment) => {
        try {
            const resp = await apiAddAdvancePayment(values)

            if (resp.data) {
                return {
                    status: 'success',
                    message: '',
                    data: resp.data,
                }
            }
        } catch (errors: any) {
            //console.log(errors?.response?.data)
            var msg = ''
            if (errors?.response?.data?.status != undefined) {
                msg = errors?.response?.data?.message || errors.toString()
            } else {
                msg = errors?.response?.data
            }
            return {
                status: 'failed',
                message: msg,
            }
        }
    }

    return {
        addAdvancePayment,
    }
}

export default useEmployee
