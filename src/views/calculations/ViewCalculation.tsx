import Table from '@/components/ui/Table'
import useCalculations from '@/utils/hooks/useCalculation'
import { useState, useEffect } from 'react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import AddDialogComponent from './AddDialogComponent'
import type { CommonProps } from '@/@types/common'
import EditDialog from './EditDialogComponent'

interface FormProps extends CommonProps {
    disableSubmit?: boolean
}

const ViewCalculation = (props: FormProps) => {
    // const username = getUsernameFromLocalStorage()
    // console.log(username)

    const { getCalculations } = useCalculations()

    const { Tr, Th, Td, THead, TBody } = Table

    const [data, setData] = useState([])

    const openDialog = () => {
        setIsOpen(true)
    }
    const openEditDialog = () => {
        setEditIsOpen(true)
        console.log('test')
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
    const [isEditOpen, setEditIsOpen] = useState(false)

    //const openDialog = () => setIsOpen(true);
    const closeDialog = () => setIsOpen(false)
    const closeEditDialog = () => setEditIsOpen(false)

    const headerExtraContent = (
        <span className="flex items-center">
            <span className="mr-1 font-semibold">
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
            <span className="flex items-center">
                <span className="mr-1 font-semibold">
                    <Button variant="solid" onClick={openEditDialog}>
                        Edit
                    </Button>
                    {isEditOpen && (
                        <EditDialog
                            onClose={closeEditDialog}
                            isEditOpen={isEditOpen}
                            props={props}
                        />
                    )}
                </span>
                <span className="text-emerald-500 text-xl"></span>
            </span>
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
                        <Td key={item.id}>
                            <Button variant="solid" onClick={openEditDialog}>
                                Edit
                            </Button>
                            {isEditOpen && (
                                <EditDialog
                                    onClose={closeEditDialog}
                                    isEditOpen={isEditOpen}
                                    props={props}
                                />
                            )}
                        </Td>
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
