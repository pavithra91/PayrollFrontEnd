import classNames from 'classnames'
import Drawer from '@/components/ui/Drawer'
import { HiOutlineCog, HiOutlineDocumentReport } from 'react-icons/hi'
import SidePanelContent, { SidePanelContentProps } from './SidePanelContent'
import withHeaderItem from '@/utils/hoc/withHeaderItem'
import { setPanelExpand, useAppSelector, useAppDispatch } from '@/store'
import type { CommonProps } from '@/@types/common'
import AuthorityCheck from '@/components/shared/AuthorityCheck'

type SidePanelProps = SidePanelContentProps & CommonProps

const _SidePanel = (props: SidePanelProps) => {
    const dispatch = useAppDispatch()

    const { className, ...rest } = props

    const panelExpand = useAppSelector((state) => state.theme.panelExpand)

    const direction = useAppSelector((state) => state.theme.direction)

    const openPanel = () => {
        dispatch(setPanelExpand(true))
    }

    const openHRMPanel = () => {
        window.open(
            'http://internal-cpstl-poc-internal-alb-1716520389.ap-southeast-1.elb.amazonaws.com/hrm/',
            '_blank'
        )
    }

    const closePanel = () => {
        dispatch(setPanelExpand(false))
        const bodyClassList = document.body.classList
        if (bodyClassList.contains('drawer-lock-scroll')) {
            bodyClassList.remove('drawer-lock-scroll', 'drawer-open')
        }
    }

    return (
        <>
            <AuthorityCheck authority={['Admin']} userAuthority={['Admin']}>
                <div
                    className={classNames('text-2xl', className)}
                    onClick={openPanel}
                    {...rest}
                >
                    <HiOutlineCog />
                </div>
            </AuthorityCheck>

            <AuthorityCheck authority={['Admin']} userAuthority={['Admin']}>
                <div
                    className={classNames('text-2xl', className)}
                    onClick={openHRMPanel}
                    {...rest}
                >
                    <HiOutlineDocumentReport />
                </div>
            </AuthorityCheck>

            <Drawer
                title="Side Panel"
                isOpen={panelExpand}
                placement={direction === 'rtl' ? 'left' : 'right'}
                width={375}
                onClose={closePanel}
                onRequestClose={closePanel}
            >
                <SidePanelContent callBackClose={closePanel} />
            </Drawer>
        </>
    )
}

const SidePanel = withHeaderItem(_SidePanel)

export default SidePanel
