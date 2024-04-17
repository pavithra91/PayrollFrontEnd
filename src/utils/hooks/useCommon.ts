import { PayrollDataSchema } from '@/@types/payroll'
import {
    apiGetOTHours,
} from '@/services/CommonService'

type Status = 'success' | 'failed'

function useCommon() {
    const getOTHours = async (values: PayrollDataSchema) => {
        try {
            const resp = await apiGetOTHours(values)
            if (resp.data) {
                return {
                    status: 'success',
                    message: '',
                    data: resp.data,
                }
            }
        } catch (errors: any) {
            return {
                status: 'failed',
                message: errors?.response?.data?.message || errors.toString(),
            }
        }
    }
    return {
        getOTHours,
    }
}

export default useCommon
