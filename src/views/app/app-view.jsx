import React from 'react'
import './app-view.css'
import { navigationUtilities } from 'antares'
import ErrorController from '../../controllers/error-controller'
import HomeView from '../home/home-view'
import PlayerController from '../../controllers/player-controller'

const AppView = () => {

    return (
        <div className='app'>
            <HomeView />
            <PlayerController />
            <ErrorController />
        </div>
    )
}

export default navigationUtilities(AppView)
