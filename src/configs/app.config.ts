export type AppConfig = {
    baseURL: string
    apiPrefix: string
    authenticatedEntryPath: string
    authenticatedEntryPathUser: string
    unAuthenticatedEntryPath: string
    tourPath: string
    locale: string
    enableMock: boolean
    apiKey: string
}

const appConfig: AppConfig = {
    baseURL: 'https://localhost:44360',
    //baseURL: 'http://13.234.120.62',
    //baseURL: 'http://internal-cpstl-poc-internal-alb-1716520389.ap-southeast-1.elb.amazonaws.com',
    apiPrefix: '/api',
    authenticatedEntryPath: '/home',
    authenticatedEntryPathUser: '/UserDashboard',
    unAuthenticatedEntryPath: '/sign-in',
    tourPath: '/',
    locale: 'en',
    enableMock: false,
    apiKey: '806EA306F09943AA868C35CF772AC37F',
}

export default appConfig
