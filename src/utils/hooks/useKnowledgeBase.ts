import { AccountData } from '@/@types/Account'
import { ArticleData, CategoryData } from '@/@types/KnowledgeBase'
import {
    apiGetCategoriesData,
    apiGetArticleByCategory,
    apiAddArticle,
} from '@/services/KnowledgeBaseService'

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

    const getArticleByCategory = async (values: CategoryData) => {
        try {
            const resp = await apiGetArticleByCategory(values)
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

    const addArticle = async (values: ArticleData) => {
        try {
            const resp = await apiAddArticle(values)
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
        getArticleByCategory,
        addArticle,
    }
}

export default useKnowledgeBase
