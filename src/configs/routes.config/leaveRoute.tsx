import type { Routes } from '@/@types/routes'
import { ADMIN, FIADMIN, FIEX1, FIEX2, SECADMIN, SECUSER, SUPERVISOR, USER } from '@/constants/roles.constant'
import { lazy } from 'react'

const leaveRoute: Routes = [
    {
        key: 'appsLeave.RequestLeave',
        path: '/RequestLeave',
        component: lazy(() => import('@/views/hr/RequestLeave/RequestLeave')),
        authority: [ADMIN, FIADMIN, FIEX1, FIEX2, SECADMIN, SECUSER, SUPERVISOR, USER],
    },
    {
        key: 'appsLeave.LeaveHistory',
        path: '/LeaveHistory',
        component: lazy(() => import('@/views/hr/LeaveHistory/LeaveHistory')),
        authority: [ADMIN, FIADMIN, FIEX1, FIEX2, SECADMIN, SECUSER, SUPERVISOR, USER],
    },
    {
        key: 'appsLeave.Supervisor',
        path: '/Supervisor',
        component: lazy(() => import('@/views/hr/Supervisor/Supervisor')),
        authority: [SUPERVISOR, SECADMIN, FIADMIN, ADMIN],
    },
    {
        key: 'appsLeave.AssignApprovalLevels',
        path: '/AssignApprovalLevels',
        component: lazy(
            () => import('@/views/hr/AssignApprovalLevels/AssignApprovalLevels')
        ),
        authority: [SUPERVISOR, SECADMIN, FIADMIN, ADMIN],
    },
    {
        key: 'appsLeave.LeaveApprove',
        path: '/LeaveApprove',
        component: lazy(() => import('@/views/hr/LeaveApprove/LeaveApprove')),
        authority: ['User', 'Supervisor'],
    },
]

export default leaveRoute
