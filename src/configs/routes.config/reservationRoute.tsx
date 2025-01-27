import type { Routes } from '@/@types/routes'
import { ADMIN, FIADMIN, FIEX1, FIEX2, SECADMIN, SECUSER, SUPERVISOR, USER } from '@/constants/roles.constant'
import { lazy } from 'react'

const reservationRoute: Routes = [
    {
        key: 'CircuitBungalow',
        path: '/CircuitBungalow',
        component: lazy(
            () => import('@/views/reservation/Bungalows/Bungalows')
        ),
        authority: [ADMIN, SECADMIN],
    },
    {
        key: 'AddBungalow',
        path: '/AddBungalow',
        component: lazy(
            () => import('@/views/reservation/Bungalows/components/AddBungalow')
        ),
        authority: [ADMIN, SECADMIN],
    },
    {
        key: 'EditBungalow',
        path: '/EditBungalow',
        component: lazy(
            () =>
                import('@/views/reservation/Bungalows/components/EditBungalow')
        ),
        authority: [ADMIN, SECADMIN],
    },
    {
        key: 'Reservation',
        path: '/Reservation',
        component: lazy(
            () => import('@/views/reservation/Reservation/Reservation')
        ),
        authority: [ADMIN, FIADMIN, FIEX1, FIEX2, SECADMIN, SECUSER, SUPERVISOR, USER],
    },
    {
        key: 'appsReservation.AddReservation',
        path: '/AddReservation',
        component: lazy(
            () =>
                import(
                    '@/views/reservation/Reservation/components/AddReservation'
                )
        ),
        authority: [ADMIN, FIADMIN, FIEX1, FIEX2, SECADMIN, SECUSER, SUPERVISOR, USER],
    },
    {
        key: 'appsReservation.BookingConfirmation',
        path: '/BookingConfirmation',
        component: lazy(
            () =>
                import(
                    '@/views/reservation/BookingConfirmation/BookingConfirmation'
                )
        ),
        authority: [ADMIN, FIADMIN, FIEX1, FIEX2, SECADMIN, SECUSER, SUPERVISOR, USER],
    },
    {
        key: 'appsReservation.RaffleDraw',
        path: '/RaffleDraw',
        component: lazy(
            () =>
                import(
                    '@/views/reservation/RaffleDraw/RaffleDraw'
                )
        ),
        authority: [ADMIN, FIADMIN, SECADMIN],
    },
]

export default reservationRoute
