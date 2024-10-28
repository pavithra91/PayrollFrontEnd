import type { Routes } from '@/@types/routes'
import { ADMIN, USER } from '@/constants/roles.constant'
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
]

export default appsRoute
