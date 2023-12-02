import { EmployeeSpecialTax } from '@/@types/empspecialrates'
import { apiAddEmpSplTax } from '@/services/EmpSplTaxService'

type Status = 'success' | 'failed'

function useEmpSplTax() {
    const addEmpSplTax = async (values: EmployeeSpecialTax) => {
        try {
            const resp = await apiAddEmpSplTax(values)
            if (resp.data) {
                console.log(resp.data)
                return {
                    status: 'success',
                    message: '',
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
        addEmpSplTax,
    }
}

export default useEmpSplTax
