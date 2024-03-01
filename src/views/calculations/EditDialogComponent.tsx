import React, { useState } from 'react'
import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import type { CommonProps } from '@/@types/common'

interface DialogProps {
    isEditOpen: boolean
    onClose: () => void
    props: FormProps
}

interface FormProps extends CommonProps {
    disableSubmit?: boolean
}

const EditDialog: React.FC<DialogProps> = ({ onClose, isEditOpen, props }) => {
    return (
        <>
            <Dialog
                isOpen={isEditOpen}
                onClose={onClose}
                onRequestClose={onClose}
            >
                <h5 className="mb-4">Edit Calculations</h5>
            </Dialog>
        </>
    )
}

export default EditDialog
