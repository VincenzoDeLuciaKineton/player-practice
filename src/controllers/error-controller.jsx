import React, { useContext } from 'react'
import { ErrorContext } from '../context/ErrorContext'
import ErrorModal from '../views/error-modal/error-modal'

const ErrorController = () => {

    const { showErrorModal, errorParentFocusable } = useContext(ErrorContext)

    return (
        <div className='error-controller'>
            { showErrorModal ? <ErrorModal errorParentFocusable={errorParentFocusable} /> : null}
        </div>
    )
}

export default ErrorController
