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

const ViewCalculations = (props: FormProps) => {
    const { getTaxCalculations } = useCalculations()

    const [data, setData] = useState([])

    useEffect(() => {
        const result = getTaxCalculations()
        result.then((res) => {
            const listItems = JSON.parse(res?.data?.data ?? '')

            setData(listItems)

            console.log('data load')
        })
    }, [])

    const { Tr, Th, Td, THead, TBody } = Table

    const openDialog = () => {
        setIsOpen(true)
    }
    const openEditDialog = () => {
        console.log('open dialog')
        setEditIsOpen(true)
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
            {/* <span className="flex items-center">
                <span className="mr-1 font-semibold">
                    <Button variant="solid" onClick={openEditDialog}>
                        Edit
                    </Button>
                    {isEditOpen && (
                        <EditDialog
                            onClose={closeEditDialog}
                            isEditOpen={isEditOpen}
                            props={props}
                            item={undefined}
                        />
                    )}
                </span>
                <span className="text-emerald-500 text-xl"></span>
            </span> */}
        </span>
    )

    const handleButtonClick = (item: any) => {
        console.log('button click ')
        console.log(item.id)
        if (isOpen) {
            openEditDialog()
        } else {
            return
        }
    }

    return (
        <Card header="Tax Calculations" headerExtra={headerExtraContent}>
            <Table>
                <THead>
                    <Tr>
                        <Th>Range</Th>
                        <Th>Formula</Th>
                        <Th>Description</Th>
                        <Th>Status</Th>
                        <Th>Created By</Th>
                        <Th>Created Date</Th>
                        <Th></Th>
                    </Tr>
                </THead>
                <TBody>
                    {data.map((item: any) => (
                        <Tr key={item.id}>
                            <Td>{item.range}</Td>
                            <Td>{item.calFormula}</Td>
                            <Td>{item.description}</Td>
                            <Td>{item.status}</Td>
                            <Td>{item.createdBy}</Td>
                            <Td>{item.createdDate}</Td>
                            <Td>
                                <Button
                                    id={item.id}
                                    key={item.id}
                                    variant="solid"
                                    onClick={() => handleButtonClick(item)}
                                >
                                    Edit
                                </Button>
                                {isEditOpen && (
                                    <EditDialog
                                        key={item.id}
                                        onClose={closeEditDialog}
                                        isEditOpen={isEditOpen}
                                        props={props}
                                        item={item}
                                    />
                                )}
                            </Td>
                        </Tr>
                    ))}
                </TBody>
            </Table>
        </Card>
    )
}

export default ViewCalculations
