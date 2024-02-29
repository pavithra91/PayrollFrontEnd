import Table from '@/components/ui/Table'
import useCalculations from '@/utils/hooks/useCalculation'
import { useState, useEffect } from 'react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import AddCalculationsPage from './AddCalculation'
import AddDialogComponent from './AddDialogComponent'
import type { CommonProps } from '@/@types/common'

interface FormProps extends CommonProps {
    disableSubmit?: boolean
}

const ViewCalculation = (props: FormProps) => {
    const { getCalculations, addCalculations } = useCalculations()

    const { Tr, Th, Td, THead, TBody } = Table

    const [data, setData] = useState([])

    // const [dialogIsOpen, setIsOpen] = useState(false)

    const openDialog = () => {
        setIsOpen(true)
    }

    const onDialogClose = (e: MouseEvent) => {
        console.log('onDialogClose', e)
        setIsOpen(false)
    }

    const onDialogOk = (e: MouseEvent) => {
        console.log('onDialogOk', e)
        setIsOpen(false)
    }

    const [isOpen, setIsOpen] = useState(false)

    //const openDialog = () => setIsOpen(true);
    const closeDialog = () => setIsOpen(false)

    const headerExtraContent = (
        <span className="flex items-center">
            <span className="mr-1 font-semibold">
                {/* <Button variant="solid" onClick={() => openDialog()}>
                    Add
                </Button> */}

                <Button variant="solid" onClick={openDialog}>
                    Add
                </Button>
                {isOpen && (
                    <AddDialogComponent
                        onClose={closeDialog}
                        isOpen={isOpen}
                        props={props}
                    />
                )}
            </span>
            <span className="text-emerald-500 text-xl"></span>
        </span>
    )

    useEffect(() => {
        const result = getCalculations()
        result.then((res) => {
            const listItems = JSON.parse(res?.data?.data ?? '').map(
                (item: any) => (
                    <Tr key={item.id}>
                        <Td>{item.companyCode}</Td>
                        <Td>{item.sequence}</Td>
                        <Td>{item.payCode}</Td>
                        <Td>{item.calCode}</Td>
                        <Td>{item.calFormula}</Td>
                        <Td>{item.calDescription}</Td>
                        <Td>{item.payCategory}</Td>
                        <Td>{item.contributor}</Td>
                        <Td key={item.id}>Edit</Td>
                    </Tr>
                )
            )

            setData(listItems)
        })
    }, [])

    return (
        <Card header="Calculations" headerExtra={headerExtraContent}>
            <Table>
                <THead>
                    <Tr>
                        <Th>Company</Th>
                        <Th>Sequence</Th>
                        <Th>Pay Code</Th>
                        <Th>Cal Code</Th>
                        <Th>Formula</Th>
                        <Th>Description</Th>
                        <Th>Category</Th>
                        <Th>Contributor</Th>
                        <Th></Th>
                    </Tr>
                </THead>
                <TBody>{data}</TBody>
            </Table>
        </Card>
    )
}

export default ViewCalculation
