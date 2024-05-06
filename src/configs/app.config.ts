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
    //baseURL: 'https://localhost:44360',
    //baseURL: 'http://13.234.120.62',
    baseURL: 'http://cpstl-poc-alb-347507899.ap-southeast-1.elb.amazonaws.com',
    apiPrefix: '/api',
    authenticatedEntryPath: '/home',
    unAuthenticatedEntryPath: '/sign-in',
    tourPath: '/',
    locale: 'en',
    enableMock: false,
}

export default appConfig
