import {
    HiOutlineColorSwatch,
    HiOutlineDesktopComputer,
    HiOutlineTemplate,
    HiOutlineViewGridAdd,
    HiOutlineCash,
    HiOutlineCalculator,
    HiOutlineScale,
    HiOutlineBookOpen,
    HiOutlinePrinter,
} from 'react-icons/hi'

import {
    FcAbout,
    FcHome,
    FcSettings,
    FcBullish,
    FcWikipedia,
    FcConferenceCall,
    FcPrint,
    FcWorkflow,
    FcMoneyTransfer,
    FcCalendar,
    FcApproval,
    FcTreeStructure,
    FcAlarmClock,
    FcBusinessman,
    FcLandscape,
} from 'react-icons/fc'

import { FaRegFilePdf, FaFileCsv, FaRegFileExcel } from 'react-icons/fa'

export type NavigationIcons = Record<string, JSX.Element>

const navigationIcon: NavigationIcons = {
    about: <FcAbout />,
    home: <FcHome />,
    settings: <FcSettings />,
    reports: <FcBullish />,
    helpcenter: <FcWikipedia />,
    print: <FcPrint />,
    process: <FcWorkflow />,
    money: <FcMoneyTransfer />,
    calendar: <FcCalendar />,
    approval: <FcApproval />,
    treeStructure: <FcTreeStructure />,
    cash: <HiOutlineCash />,
    calculator: <HiOutlineCalculator />,
    openbook: <HiOutlineBookOpen />,
    printer: <HiOutlinePrinter />,
    users: <FcConferenceCall />,
    manager: <FcBusinessman />,
    bungalow: <FcLandscape />,
    clock: <FcAlarmClock />,
    outlineScale: <HiOutlineScale />,
    singleMenu: <HiOutlineViewGridAdd />,
    collapseMenu: <HiOutlineTemplate />,
    groupSingleMenu: <HiOutlineDesktopComputer />,
    groupCollapseMenu: <HiOutlineColorSwatch />,

    filetopdf: <FaRegFilePdf />,
    filetocsv: <FaFileCsv />,
    filetoexcel: <FaRegFileExcel />,
}

export default navigationIcon
