import React, { useState } from 'react'
import './app-view.css'
import { navigationUtilities } from 'antares'
import PlayerController from '../../controllers/player-controller'
import HomeView from '../home/home-view'
import { ConfigProvider } from '../../context/ConfigContext'

const AppView = () => {

    const [startPlayer, setStartPlayer] = useState(false);

    return (
        <ConfigProvider>
            <div className='app'>
                {!startPlayer ? <HomeView setStartPlayer={setStartPlayer} /> : <PlayerController />}
            </div>
        </ConfigProvider>
    )
}

export default navigationUtilities(AppView)
