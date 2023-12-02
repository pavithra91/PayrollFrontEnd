import ApiService from './ApiService'
import { EmployeeSpecialTax } from '@/@types/empspecialrates'

type Response = {
    data: string
}

export async function apiAddEmpSplTax(data: EmployeeSpecialTax) {
    return ApiService.fetchData<Response>({
        url: '/admin/ManageSpecialTaxEmp',
        method: 'post',
        data,
    })
}
