import type { Routes } from '@/@types/routes'
import { ADMIN, FIADMIN, FIEX1, FIEX2, SECADMIN, SECUSER, SUPERVISOR, USER } from '@/constants/roles.constant'
import { lazy } from 'react'

const appsRoute: Routes = [
    {
        key: 'PayrollActivities',
        path: '/dashboard/PayrollActivities/PayrollActivities',
        component: lazy(
            () =>
                import('@/views/dashboard/PayrollActivities/PayrollActivities')
        ),
        authority: ['Admin'],
    },
    {
        key: 'AdvanceRequest',
        path: '/AdvanceRequest',
        component: lazy(
            () => import('@/views/hr/AdvancePayment/AdvancePayment')
        ),
        authority: [ADMIN, FIADMIN, FIEX1, FIEX2, SECADMIN, SECUSER, SUPERVISOR, USER],
    },
    {
        key: 'Profile',
        path: '/users/Account/Profile',
        component: lazy(() => import('@/views/users/Account/Profile')),
        authority: [],
    },
    {
        key: 'PaysheetView',
        path: '/PaysheetView',
        component: lazy(
            () => import('@/views/paysheet/IndividualPrint/PaysheetPrint')
        ),
        authority: [ADMIN, FIADMIN, FIEX1, FIEX2, SECADMIN, SECUSER, SUPERVISOR, USER],
    },
]

export default appsRoute
