import React, { useContext } from 'react'
import './loader-view.css'
import { ConfigContext } from '../../context/ConfigContext'

const LoaderView = () => {
    const config = useContext(ConfigContext)

    /* useEffect(() => {
        console.log('LOADER MOUNTED')
        return console.log('LOADER UNMOUNTED')
    }, []) */

    return (
        <div className={config.ready ? 'loader-player-container' : 'loader-episodes-container'}>
            <div className='loader-player' />
        </div>
    )
}

export default LoaderView
