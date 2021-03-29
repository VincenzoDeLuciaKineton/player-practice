import React, { createContext, useState, useEffect } from 'react';

export const ConfigContext = createContext();

export const ConfigProvider = ({ children }) => {
    const [url, setUrl] = useState(null);
    const [controlsCountdownFromConfig, setControlsCountdownFromConfig] = useState(5000);
    const [readyToPlay, setReadyToPlay] = useState(false);

    useEffect(() => {
        fetch(`${process.env.PUBLIC_URL}/config.json`).then(res => res.json()
        ).then(res => {
            /* console.log('res from the fetch: ', res) */
            setUrl(res.url);
            setControlsCountdownFromConfig(res.controlsCountdown)
        })
    }, [])

    return (
        <ConfigContext.Provider value={{ url, setUrl, readyToPlay, setReadyToPlay, controlsCountdownFromConfig }}>
            {children}
        </ConfigContext.Provider>
    )
}