import {
    HiOutlineColorSwatch,
    HiOutlineDesktopComputer,
    HiOutlineTemplate,
    HiOutlineViewGridAdd,
    HiOutlineHome,
    HiOutlineCash,
    HiOutlineCalculator,
    HiOutlineScale,
    HiOutlineBookOpen,
    HiOutlinePrinter,
    HiOutlineUserGroup,
} from 'react-icons/hi'

export type NavigationIcons = Record<string, JSX.Element>

const navigationIcon: NavigationIcons = {
    home: <HiOutlineHome />,
    cash: <HiOutlineCash />,
    calculator: <HiOutlineCalculator />,
    openbook: <HiOutlineBookOpen />,
    printer: <HiOutlinePrinter />,
    users: <HiOutlineUserGroup />,
    outlineScale: <HiOutlineScale />,
    singleMenu: <HiOutlineViewGridAdd />,
    collapseMenu: <HiOutlineTemplate />,
    groupSingleMenu: <HiOutlineDesktopComputer />,
    groupCollapseMenu: <HiOutlineColorSwatch />,
}

export default navigationIcon
