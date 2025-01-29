import type { Routes } from '@/@types/routes'
import {
    ADMIN,
    FIADMIN,
    FIEX1,
    FIEX2,
    SECADMIN,
    SECUSER,
    SUPERVISOR,
    USER,
} from '@/constants/roles.constant'
import { lazy } from 'react'

const payrollRoute: Routes = [
    {
        key: 'appsPayroll.DataVerification',
        path: '/DataVerification',
        component: lazy(
            () => import('@/views/payroll/Control/DataVerification')
        ),
        authority: [ADMIN, FIADMIN, FIEX1],
    },
    {
        key: 'appsPayroll.ProcessPayroll',
        path: '/ProcessPayroll',
        component: lazy(() => import('@/views/payroll/Process/ProcessPayroll')),
        authority: [ADMIN, FIADMIN, FIEX1],
    },
    {
        key: 'appsPayroll.BankTransfer',
        path: '/BankTransfer',
        component: lazy(
            () => import('@/views/payroll/BankTransfer/BankTransfer')
        ),
        authority: [ADMIN, FIADMIN, FIEX1],
    },
    {
        key: 'appsPayroll.PayrollSummary',
        path: '/PayrollSummary',
        component: lazy(() => import('@/views/reports/Summary/PayrollSummary')),
        authority: [ADMIN, FIADMIN, FIEX1],
    },
    {
        key: 'appsPayroll.PayrunSummary',
        path: '/PayrunSummary',
        component: lazy(
            () => import('@/views/payroll/PayrunSummary/PayrunSummary')
        ),
        authority: [ADMIN, FIADMIN, FIEX1],
    },

    {
        key: 'appsPayroll.UnrecoveredList',
        path: '/UnrecoveredList',
        component: lazy(
            () => import('@/views/reports/UnRecoveredReport/Unrecovered')
        ),
        authority: [ADMIN, FIADMIN, FIEX1],
    },
    {
        key: 'appsPayroll.LumpSumTaxReport',
        path: '/LumpSumTaxReport',
        component: lazy(
            () => import('@/views/reports/LumpSumTaxReport/LumpSumTaxReport')
        ),
        authority: [ADMIN, FIADMIN, FIEX1],
    },
    {
        key: 'appsPayroll.PayCodeWiseReport',
        path: '/PayCodeWiseReport',
        component: lazy(
            () => import('@/views/reports/PayCodeWiseReport/PayCodeWiseReport')
        ),
        authority: [ADMIN, FIADMIN, FIEX1],
    },
]

export default payrollRoute
