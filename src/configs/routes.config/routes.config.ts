import { lazy } from 'react'
import authRoute from './authRoute'
import type { Routes } from '@/@types/routes'

export const publicRoutes: Routes = [...authRoute]

export const protectedRoutes = [
    {
        key: 'home',
        path: '/home',
        component: lazy(() => import('@/views/Home')),
        authority: [],
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
    {
        key: 'calculations',
        path: '/calculations',
        component: lazy(() => import('@/views/calculations/Calculations')),
        authority: ['Admin'],
    },
    /** Example purpose only, please remove */
    {
        key: 'ViewSettings',
        path: '/ViewSettings',
        component: lazy(() => import('@/views/settings/Settings/ViewSettings')),
        authority: [],
    },
    {
        key: 'Development',
        path: '/settings/ResetData/Development',
        component: lazy(() => import('@/views/settings/ResetData/Development')),
        authority: [],
    },
    {
        key: 'Paycodes',
        path: '/Paycodes',
        component: lazy(() => import('@/views/paycodes/PayCodes/PayCodes')),
        authority: ['Admin'],
    },
    {
        key: 'calculations',
        path: '/calculations',
        component: lazy(() => import('@/views/calculations/Calculations')),
        authority: ['Admin'],
    },
    {
        key: 'taxcalculations',
        path: '/tax/Calculations/calculations',
        component: lazy(() => import('@/views/tax/Calculations/Calculations')),
        authority: ['Admin'],
    },
    {
        key: 'DataVerification',
        path: '/DataVerification',
        component: lazy(
            () => import('@/views/payroll/Control/DataVerification')
        ),
        authority: ['Admin'],
    },
    {
        key: 'ProcessPayroll',
        path: '/ProcessPayroll',
        component: lazy(() => import('@/views/payroll/Process/ProcessPayroll')),
        authority: ['Admin'],
    },
    {
        key: 'BankTransfer',
        path: '/BankTransfer',
        component: lazy(
            () => import('@/views/payroll/BankTransfer/BankTransfer')
        ),
        authority: ['Admin'],
    },
    {
        key: 'PayrollSummary',
        path: '/PayrollSummary',
        component: lazy(() => import('@/views/reports/Summary/PayrollSummary')),
        authority: ['Admin'],
    },
    {
        key: 'PayrunSummary',
        path: '/PayrunSummary',
        component: lazy(
            () => import('@/views/payroll/PayrunSummary/PayrunSummary')
        ),
        authority: ['Admin'],
    },
    {
        key: 'Paysheet',
        path: '/Paysheet',
        component: lazy(
            () => import('@/views/paysheet/PaysheetPrint/Paysheet')
        ),
        authority: ['Admin'],
    },
    {
        key: 'PaysheetPrint',
        path: '/PaysheetPrint',
        component: lazy(
            () => import('@/views/paysheet/IndividualPrint/PaysheetPrint')
        ),
        authority: ['Admin'],
    },
    {
        key: 'paysheet',
        path: '/paysheet',
        component: lazy(
            () => import('@/views/paysheet/IndividualPrint/PaysheetPrint')
        ),
        authority: [],
    },

    {
        key: 'ViewUsers',
        path: '/ViewUsers',
        component: lazy(() => import('@/views/users/Users/ViewUsers')),
        authority: [],
    },

    {
        key: 'UnrecoveredList',
        path: '/UnrecoveredList',
        component: lazy(
            () => import('@/views/reports/UnRecoveredReport/Unrecovered')
        ),
        authority: ['Admin'],
    },
    {
        key: 'LumpSumTaxReport',
        path: '/LumpSumTaxReport',
        component: lazy(
            () => import('@/views/reports/LumpSumTaxReport/LumpSumTaxReport')
        ),
        authority: ['Admin'],
    },
    {
        key: 'PayCodeWiseReport',
        path: '/PayCodeWiseReport',
        component: lazy(
            () => import('@/views/reports/PayCodeWiseReport/PayCodeWiseReport')
        ),
        authority: ['Admin'],
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
        key: 'articleadd',
        path: '/knowledgebase/Article/articleadd',
        component: lazy(
            () => import('@/views/knowledgebase/Article/ArticleAdd')
        ),
        authority: [],
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
]
