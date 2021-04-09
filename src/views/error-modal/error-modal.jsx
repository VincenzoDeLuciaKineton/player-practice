import React, { useEffect, useContext, useRef } from 'react'
import './error-modal.css'
import { AntaresHorizontalList, AntaresFocusable, navigationUtilities, addKeydownEvent, removeKeydownEvent } from 'antares'
import { ErrorContext } from '../../context/ErrorContext'
import { PlayerContext } from '../../context/PlayerContext'
import SpinnerView from '../spinner/spinner-view'

const ErrorModal = ({ focusTo }) => {

    const { setShowErrorModal, errorMessage, errorParentFocusable } = useContext(ErrorContext);
    const { displayPlayer, setDisplayPlayer } = useContext(PlayerContext);

    const onKeyDown = useRef(null);

    const backToParentFocusable = () => {
        if (displayPlayer) {
            setDisplayPlayer(false);
        }
        if (errorParentFocusable) {
            focusTo(errorParentFocusable);
            setShowErrorModal(false);
        }
    }

    const onKeyDownHandler = (e) => {
        if (e.keyCode === 8 || e.keyCode === 461) {
            backToParentFocusable();
        }
    }

    useEffect(() => {
        if (!onKeyDown.current) {
            onKeyDown.current = addKeydownEvent(onKeyDownHandler);
        }
        return () => {
            removeKeydownEvent(onKeyDown.current);
            onKeyDown.current = null;
        };
    }, [onKeyDownHandler]);

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
