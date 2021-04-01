import React, { useContext, useEffect } from 'react'
import './error-modal.css'
import { AntaresHorizontalList, AntaresFocusable, navigationUtilities } from 'antares'
import { ErrorContext } from '../../context/ErrorContext'
import SpinnerView from '../spinner/spinner-view'

const ErrorModal = ({ errorParentFocusable, errorMessage, focusTo }) => {

    const { setShowErrorModal } = useContext(ErrorContext)

    useEffect(() => {
        console.log('Error message in the modal: ', errorMessage)
    }, [errorMessage])

    const backToParentFocusable = () => {
        console.log('You wish to go back from the error modal to: ', errorParentFocusable)
        focusTo(errorParentFocusable);
        setShowErrorModal(false);
    }

    return (
        <div className='error-modal-and-message'>
            <span className='error-message'>{errorMessage ? errorMessage : 'An error occurred'}</span>
            <AntaresHorizontalList containerClassname='error-modal-outer' innerClassname='error-modal-inner' focusableId='error-modal' retainLastFocus={true} innerWidth={500}>
                <AntaresFocusable classname='error-button' focusedClassname='error-button-focused' focusableId='error-button-id' onEnterDown={backToParentFocusable} index={0}>
                    <span>BACK</span>
                </AntaresFocusable>
            </AntaresHorizontalList>
        </div>
    )
}

export default navigationUtilities(ErrorModal)
