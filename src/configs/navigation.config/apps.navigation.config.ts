import { NavigationTree } from '@/@types/navigation'
import { NAV_ITEM_TYPE_ITEM } from '@/constants/navigation.constant'
import { ADMIN, USER } from '@/constants/roles.constant'

const appsNavigationConfig: NavigationTree[] = [
    {
        key: 'PayrollActivities',
        path: '/dashboard/PayrollActivities/PayrollActivities',
        title: 'Payroll Activities',
        translateKey: 'nav.collapseMenu.PayrollActivities',
        icon: '',
        type: NAV_ITEM_TYPE_ITEM,
        authority: [ADMIN],
        subMenu: [],
    },
]

export default appsNavigationConfig
