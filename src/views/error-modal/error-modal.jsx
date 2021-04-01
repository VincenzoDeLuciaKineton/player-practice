import React, { useContext, useEffect } from 'react'
import './error-modal.css'
import { AntaresHorizontalList, AntaresFocusable, navigationUtilities } from 'antares'
import { ErrorContext } from '../../context/ErrorContext'
import SpinnerView from '../spinner/spinner-view'
import { PlayerContext } from '../../context/PlayerContext'

const ErrorModal = ({ focusTo }) => {

    const { setShowErrorModal, errorMessage, errorParentFocusable } = useContext(ErrorContext);
    const { displayPlayer, setDisplayPlayer } = useContext(PlayerContext);

    /* useEffect(() => {
        focusTo('error-button-id')
    }, []) */

    const backToParentFocusable = () => {
        console.log('ENTER DOWN ON ERROR BUTTON')
        if (displayPlayer) {
            setDisplayPlayer(false);
        }
        if (errorParentFocusable) {
            focusTo(errorParentFocusable);
            setShowErrorModal(false);
        }
    }

    return (
        <div className='error-modal-and-message'>
            <span className='error-message'>{errorMessage ? errorMessage : <SpinnerView />}</span>
            <AntaresHorizontalList
                containerClassname='error-modal-outer'
                innerClassname='error-modal-inner'
                focusableId='error-modal'
                remainInFocus={true}
                retainLastFocus={true}
                forceFocus={true}
                innerWidth={500}>
                <AntaresFocusable
                    classname='error-button'
                    focusedClassname='error-button-focused'
                    focusableId='error-button-id'
                    onEnterDown={backToParentFocusable}
                    index={0}>
                    <span>BACK</span>
                </AntaresFocusable>
            </AntaresHorizontalList>
        </div>
    )
}

export default navigationUtilities(ErrorModal)
