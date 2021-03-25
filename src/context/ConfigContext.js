import React, { createContext, useState, useEffect } from 'react';

export const ConfigContext = createContext();

export const ConfigProvider = ({ children }) => {
    const [url, setUrl] = useState(null);
    const [neededPlayer, setNeededPlayer] = useState(null);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        fetch(`${process.env.PUBLIC_URL}/config.json`).then(res => res.json()
        ).then(res => {
            /* console.log('res from the fetch: ', res) */
            setUrl(res.url)
            if (res.url.endsWith('.mpd')) {
                setNeededPlayer('dashjs')
            } else if (res.url.endsWith('.m3u8')) {
                setNeededPlayer('videojs')
            }
            setReady(true)
        })
    }, [])

    return (
        <ConfigContext.Provider value={{ url, neededPlayer, ready }}>
            {children}
        </ConfigContext.Provider>
    )

}