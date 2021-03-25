import React from 'react'
import './app-view.css'
import { navigationUtilities } from 'antares'
import PlayerController from '../../controllers/player-controller'
import { ConfigProvider } from '../../context/ConfigContext'

const AppView = () => {
    return (
        <ConfigProvider>
            <div className='app'>
                <PlayerController />
            </div>
        </ConfigProvider>
    )
}

export default navigationUtilities(AppView)
