import React, { useState, useParams } from 'react'
import { Switch, Route } from 'react-router-dom'

interface DialogProps {
    isEditOpen: boolean // Type for the 'isOpen' prop
    onEditClose: () => void // Type for the 'onClose' prop
    props: FormProps
}

const EditDialog: React.FC<DialogProps> = ({
    onEditClose,
    isEditOpen,
    props,
}) => {
    return <div></div>
}

export default EditDialog
