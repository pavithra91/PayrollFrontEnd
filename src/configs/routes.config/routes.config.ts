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
    {
        key: 'dashboard',
        path: '/dashboard',
        component: lazy(() => import('@/views/dashboard/Dashboard')),
        authority: [],
    },
    {
        key: 'empSplTax',
        path: '/empSplTax',
        component: lazy(() => import('@/views/empSplTax/EmpSplTax')),
        authority: [],
    },
    {
        key: 'calculations',
        path: '/calculations',
        component: lazy(() => import('@/views/calculations/Calculations')),
        authority: ['Admin'],
    },
    /** Example purpose only, please remove */
    {
        key: 'paycodes',
        path: '/paycodes',
        component: lazy(() => import('@/views/paycodes/Paycodes')),
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
        key: 'groupMenu.single',
        path: '/group-single-menu-item-view',
        component: lazy(() => import('@/views/demo/GroupSingleMenuItemView')),
        authority: [],
    },
    {
        key: 'groupMenu.collapse.item1',
        path: '/group-collapse-menu-item-view-1',
        component: lazy(
            () => import('@/views/demo/GroupCollapseMenuItemView1')
        ),
        authority: [],
    },
    {
        key: 'groupMenu.collapse.item2',
        path: '/group-collapse-menu-item-view-2',
        component: lazy(
            () => import('@/views/demo/GroupCollapseMenuItemView2')
        ),
        authority: [],
    },
]
