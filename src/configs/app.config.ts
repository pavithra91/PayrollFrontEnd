export type AppConfig = {
    baseURL: string
    apiPrefix: string
    authenticatedEntryPath: string
    unAuthenticatedEntryPath: string
    tourPath: string
    locale: string
    enableMock: boolean
}

const appConfig: AppConfig = {
    baseURL: 'https://localhost:44360',
    apiPrefix: '/api',
    authenticatedEntryPath: '/home',
    unAuthenticatedEntryPath: '/home',
    tourPath: '/',
    locale: 'en',
    enableMock: false,
}

export default appConfig
