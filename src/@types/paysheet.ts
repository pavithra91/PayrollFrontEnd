type empData = {
    epf: number
    empName: string
    companyCode: number
    location: number
    costCenter: string
    empGrade: string
    gradeCode: number
}

type salData = {
    epfGross: number
    taxableGross: number
    tax: number
    emp_contribution: number
    comp_contribution: number
    etf: number
}

export type payData = {
    empData: empData
    salData: salData
    earningData: string
    deductionData: number
}
