// Child Component

import React from 'react'

interface MyComponentProps {
    openDialog: () => void
}

const ChildComponent: React.FC<MyComponentProps> = ({ openDialog }) => {
    return <button onClick={openDialog}>Add</button>
}

export default ChildComponent
