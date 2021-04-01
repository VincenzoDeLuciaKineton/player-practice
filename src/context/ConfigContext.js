import React, { createContext, useState, useEffect, useContext } from 'react'
import { ErrorContext } from './ErrorContext';

export const ConfigContext = createContext();

export const ConfigProvider = ({ children }) => {

    const { setShowErrorModal, setErrorMessage, setErrorParentFocusable } = useContext(ErrorContext)

    const [url, setUrl] = useState(null);
    const [controlsCountdownFromConfig, setControlsCountdownFromConfig] = useState(5000);
    const [readyToPlay, setReadyToPlay] = useState(false);

    useEffect(() => {
        fetch(`${process.env.PUBLIC_URL}/config.json`).then(res => res.json()
        ).then(res => {
            if (res.url) {
                setUrl(res.url);
            } else {
                setErrorParentFocusable('home-button-id')
                setErrorMessage('Failed to retrieve the requested data')
                setShowErrorModal(true);
            }
            if (res.controlsCountdown) {
                setControlsCountdownFromConfig(res.controlsCountdown);
            } else {
                setControlsCountdownFromConfig(5000);
            }
        }).catch(error => {
            console.log('error: ', error);
        })
    }, [])

    return (
        <ConfigContext.Provider value={{ url, setUrl, readyToPlay, setReadyToPlay, controlsCountdownFromConfig }}>
            {children}
        </ConfigContext.Provider>
    )
}