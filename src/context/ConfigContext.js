import React, { createContext, useState, useEffect } from 'react';

export const ConfigContext = createContext();

export const ConfigProvider = ({ children }) => {
    const [url, setUrl] = useState(null);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        fetch(`${process.env.PUBLIC_URL}/config.json`).then(res => res.json()
        ).then(res => {
            /* console.log('res from the fetch: ', res) */
            setUrl(res.url)
            setReady(true)
        })
    }, [])

    return (
        <ConfigContext.Provider value={{ url, setUrl, ready, setReady }}>
            {children}
        </ConfigContext.Provider>
    )
}