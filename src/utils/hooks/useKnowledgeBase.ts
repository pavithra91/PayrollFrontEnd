import { AccountData } from '@/@types/Account'
import { apiGetCategoriesData } from '@/services/KnowledgeBaseService'

type Status = 'success' | 'failed'

function useKnowledgeBase() {
    
    const getCategoriesData = async () => {
        try {
            const resp = await apiGetCategoriesData()
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
        getCategoriesData,
    }
}

export default useKnowledgeBase
