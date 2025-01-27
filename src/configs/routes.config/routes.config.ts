import { lazy } from 'react'
import authRoute from './authRoute'
import type { Routes } from '@/@types/routes'
import appsRoute from './appsRoute'
import {
    ADMIN,
    USER,
    FIADMIN,
    FIEX1,
    FIEX2,
    SECADMIN,
    SECUSER,
    SUPERVISOR,
} from '@/constants/roles.constant'
import reservationRoute from './reservationRoute'
import leaveRoute from './leaveRoute'
import payrollRoute from './payrollRoute'

export const publicRoutes: Routes = [...authRoute]

export const protectedRoutes = [
    ...appsRoute,
    ...reservationRoute,
    ...leaveRoute,
    ...payrollRoute,
    {
        key: 'home',
        path: '/home',
        component: lazy(() => import('@/views/Home')),
        authority: [],
    },
    {
        key: 'UserDashboard',
        path: '/UserDashboard',
        component: lazy(() => import('@/views/hr/Dashboard/Dashboard')),
        authority: [ADMIN, FIADMIN],
    },
    // {
    //     key: 'dashboard',
    //     path: '/dashboard',
    //     component: lazy(() => import('@/views/dashboard/Dashboard')),
    //     authority: [],
    // },
    // {
    //     key: 'empSplTax',
    //     path: '/empSplTax',
    //     component: lazy(() => import('@/views/empSplTax/EmpSplTax')),
    //     authority: [],
    // },
    /** Example purpose only, please remove */
    {
        key: 'ViewSettings',
        path: '/ViewSettings',
        component: lazy(() => import('@/views/settings/Settings/ViewSettings')),
        authority: [ADMIN],
    },
    {
        key: 'Development',
        path: '/settings/ResetData/Development',
        component: lazy(() => import('@/views/settings/ResetData/Development')),
        authority: [ADMIN],
    },
    {
        key: 'ScheduleJobs',
        path: '/configurations/ScheduleJobs/ScheduleJobs',
        component: lazy(
            () => import('@/views/configurations/ScheduleJobs/ScheduleJobs')
        ),
        authority: [ADMIN],
    },
    {
        key: 'Paycodes',
        path: '/Paycodes',
        component: lazy(() => import('@/views/paycodes/PayCodes/PayCodes')),
        authority: [ADMIN, FIADMIN],
    },
    {
        key: 'Payments',
        path: '/Payments',
        component: lazy(() => import('@/views/payments/Payments')),
        authority: [ADMIN, FIADMIN],
    },
    {
        key: 'appsPayroll.calculations',
        path: '/calculations',
        component: lazy(() => import('@/views/calculations/Calculations')),
        authority: [ADMIN, FIADMIN],
    },
    {
        key: 'appsPayroll.taxcalculations',
        path: '/tax/Calculations/calculations',
        component: lazy(() => import('@/views/tax/Calculations/Calculations')),
        authority: [ADMIN, FIADMIN],
    },
    {
        key: 'ViewUsers',
        path: '/ViewUsers',
        component: lazy(() => import('@/views/users/Users/ViewUsers')),
        authority: [ADMIN],
    },
    {
        key: 'appsUserAccounts.AddNewUser',
        path: '/AddNewUser',
        component: lazy(
            () => import('@/views/users/Users/components/AddNewUser')
        ),
        authority: [ADMIN],
    },
    {
        key: 'appsUserAccounts.EditUser',
        path: '/EditUser',
        component: lazy(
            () => import('@/views/users/Users/components/EditUser')
        ),
        authority: [ADMIN],
    },
    {
        key: 'AdvancePaymentReport',
        path: '/AdvancePayment',
        component: lazy(
            () => import('@/views/hr/reports/AdvancePayment/AdvancePayment')
        ),
        authority: [ADMIN, FIADMIN],
    },
    {
        key: 'RaffleDraw',
        path: '/RaffleDraw',
        component: lazy(
            () => import('@/views/reservation/RaffleDraw/RaffleDraw')
        ),
        authority: [ADMIN, SECADMIN, SECUSER],
    },
    {
        key: 'ReservationPayments',
        path: '/ReservationPayments',
        component: lazy(
            () =>
                import(
                    '@/views/reservation/ReservationPayments/ReservationPayments'
                )
        ),
        authority: [ADMIN, SECADMIN],
    },
    {
        key: 'knowledgebase',
        path: '/knowledgebase',
        component: lazy(
            () => import('@/views/knowledgebase/HelpCenter/HelpCenter')
        ),
        authority: [],
    },

    {
        key: 'appsLeave.LeaveTypes',
        path: '/LeaveTypes',
        component: lazy(() => import('@/views/hr/LeaveTypes/LeaveTypes')),
        authority: [ADMIN],
    },
    // {
    //     key: 'groupMenu.single',
    //     path: '/group-single-menu-item-view',
    //     component: lazy(() => import('@/views/demo/GroupSingleMenuItemView')),
    //     authority: [],
    // },
    // {
    //     key: 'groupMenu.collapse.item1',
    //     path: '/group-collapse-menu-item-view-1',
    //     component: lazy(
    //         () => import('@/views/demo/GroupCollapseMenuItemView1')
    //     ),
    //     authority: [],
    // },
    // {
    //     key: 'groupMenu.collapse.item2',
    //     path: '/group-collapse-menu-item-view-2',
    //     component: lazy(
    //         () => import('@/views/demo/GroupCollapseMenuItemView2')
    //     ),
    //     authority: [],
    // },
    // {
    //     key: 'articleadd',
    //     path: '/knowledgebase/Article/articleadd',
    //     component: lazy(
    //         () => import('@/views/knowledgebase/Article/ArticleAdd')
    //     ),
    //     authority: [],
    // },
]

export const protectedEmployeeRoutes = [
    ...appsRoute,
    ...reservationRoute,
    ...leaveRoute,
    ...payrollRoute,
    {
        key: 'UserDashboard',
        path: '/UserDashboard',
        component: lazy(() => import('@/views/hr/Dashboard/Dashboard')),
        authority: [USER, SUPERVISOR, FIEX1, FIEX2, SECADMIN, SECUSER],
    },
]
