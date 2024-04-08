import { ArticleData, CategoryData } from '@/@types/KnowledgeBase'
import ApiService from './ApiService'

// export async function apiGetCategoriesData<T>() {
//     return ApiService.fetchData<T>({
//         url: '/knowledge-base/categories',
//         method: 'get',
//     })
// }

type Response = {
    data: string
}

export async function apiGetCategoriesData() {
    return ApiService.fetchData<Response>({
        url: '/Help/get-categories',
        method: 'get',
    })
}

export async function apiGetArticleByCategory(values: CategoryData) {
    return ApiService.fetchData<Response>({
        url: '/Help/get-articles-id?id=' + values.id,
        method: 'get',
    })
}

export async function apiAddArticle(data: ArticleData) {
    console.log(data)
    return ApiService.fetchData<Response>({
        url: '/Help/create-article',
        method: 'post',
        data,
    })
}

export async function apiQueryArticleList<T, U extends Record<string, unknown>>(
    data: U
) {
    return ApiService.fetchData<T>({
        url: '/Help/articles-query',
        method: 'post',
        data,
    })
}

export async function apiGetArticle<T, U extends Record<string, unknown>>(
    params: U
) {
    return ApiService.fetchData<T>({
        url: '/knowledge-base/article',
        method: 'get',
        params,
    })
}

export async function apiPostArticle<T, U extends Record<string, unknown>>(
    data: U
) {
    return ApiService.fetchData<T>({
        url: '/knowledge-base/article',
        method: 'post',
        data,
    })
}

export async function apiGetOthersArticleList<
    T,
    U extends Record<string, unknown>
>(params: U) {
    return ApiService.fetchData<T>({
        url: '/knowledge-base/others-article',
        method: 'get',
        params,
    })
}

export async function apiGetCategorizedArticles<T>() {
    return ApiService.fetchData<T>({
        url: '/knowledge-base/categorized-articles',
        method: 'get',
    })
}
