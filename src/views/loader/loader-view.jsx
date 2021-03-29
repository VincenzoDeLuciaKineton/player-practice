import React, { useContext } from 'react'
import './loader-view.css'
import { ConfigContext } from '../../context/ConfigContext'

const LoaderView = () => {
    const config = useContext(ConfigContext)

    return (
        <div className={config.ready ? 'loader-player-container' : 'loader-episodes-container'}>
            <div className='loader-player' />
        </div>
    )
}

export default LoaderView
