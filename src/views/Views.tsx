import { Suspense } from 'react'
import Loading from '@/components/shared/Loading'
import {
    protectedRoutes,
    publicRoutes,
    protectedEmployeeRoutes,
} from '@/configs/routes.config'
import appConfig from '@/configs/app.config'
import PageContainer from '@/components/template/PageContainer'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAppSelector } from '@/store'
import ProtectedRoute from '@/components/route/ProtectedRoute'
import PublicRoute from '@/components/route/PublicRoute'
import AuthorityGuard from '@/components/route/AuthorityGuard'
import AppRoute from '@/components/route/AppRoute'
import type { LayoutType } from '@/@types/theme'

interface ViewsProps {
    pageContainerType?: 'default' | 'gutterless' | 'contained'
    layout?: LayoutType
}

type AllRoutesProps = ViewsProps

const { authenticatedEntryPath, authenticatedEntryPathUser } = appConfig

const AllRoutes = (props: AllRoutesProps) => {
    const userAuthority = useAppSelector((state) => state.auth.user.authority)
    var PathArray = protectedRoutes

    const getAuthenticatedEntryPath = () => {
        switch (userAuthority[0]) {
            case 'Admin':
                PathArray = protectedRoutes
                return authenticatedEntryPath
            case 'Supervisor':
                PathArray = protectedEmployeeRoutes
                return authenticatedEntryPathUser
            case 'User':
                PathArray = protectedEmployeeRoutes
                return authenticatedEntryPathUser
            default:
                return authenticatedEntryPath
        }
    }

    const authenticatedEntryPathToUse = getAuthenticatedEntryPath()
    console.log(authenticatedEntryPathToUse)

    return (
        <Routes>
            <Route path="/" element={<ProtectedRoute />}>
                <Route
                    path="/"
                    element={
                        <Navigate replace to={authenticatedEntryPathToUse} />
                    }
                />
                {PathArray.map((route, index) => (
                    <Route
                        key={route.key + index}
                        path={route.path}
                        element={
                            <AuthorityGuard
                                userAuthority={userAuthority}
                                authority={route.authority}
                            >
                                <PageContainer {...props} {...route.authority}>
                                    <AppRoute
                                        routeKey={route.key}
                                        component={route.component}
                                        {...route.authority}
                                    />
                                </PageContainer>
                            </AuthorityGuard>
                        }
                    />
                ))}
                <Route path="*" element={<Navigate replace to="/" />} />
            </Route>
            <Route path="/" element={<PublicRoute />}>
                {publicRoutes.map((route) => (
                    <Route
                        key={route.path}
                        path={route.path}
                        element={
                            <AppRoute
                                routeKey={route.key}
                                component={route.component}
                                {...route.meta}
                            />
                        }
                    />
                ))}
            </Route>
        </Routes>
    )
}

const Views = (props: ViewsProps) => {
    return (
        <Suspense fallback={<Loading loading={true} />}>
            <AllRoutes {...props} />
        </Suspense>
    )
}

export default Views
