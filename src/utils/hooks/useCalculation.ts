import { apiGetCalculations } from '@/services/CalculationService'

type Status = 'success' | 'failed'

function useCalculations() {
    const getCalculations = async () => {
        try {
            const resp = await apiGetCalculations()
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
        getCalculations,
    }
}

export default useCalculations
