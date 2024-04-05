import type { CommonProps } from '@/@types/common'
import DoubleSidedImage from '@/components/shared/DoubleSidedImage'
import { Card } from '@/components/ui/Card'
import useKnowledgeBase from '@/utils/hooks/useKnowledgeBase'
import { useEffect, useMemo, useState } from 'react'


const demoData = '[{"id": 0, "name": "Accounts", "articleCounts": 5}, {"id": 1, "name": "Payroll", "articleCounts": 2}]'

const ListView = ({ categoryId }: { categoryId?: string }) => {
    
console.log(categoryId)
    return (
        <>
        <h1>Test {categoryId}</h1>
        </>
    )
}

export default ListView