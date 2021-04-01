import React, { createContext, useState } from 'react'

export const ErrorContext = createContext();

export const ErrorProvider = ({ children }) => {

    const [showErrorModal, setShowErrorModal] = useState(false);
    const [errorParentFocusable, setErrorParentFocusable] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);

    return (
        <ErrorContext.Provider value={{ showErrorModal, setShowErrorModal, errorParentFocusable, setErrorParentFocusable, errorMessage, setErrorMessage }}>
            {children}
        </ErrorContext.Provider>
    )
}