import React from 'react';
import AppView from '../views/app/app-view';
import { ConfigProvider } from '../context/ConfigContext'
import { PlayerProvider } from '../context/PlayerContext'

const AppController = () => {
    return (
        <ConfigProvider>
            <PlayerProvider>
                <div className='app-controller'>
                    <AppView />
                </div>
            </PlayerProvider>
        </ConfigProvider>
    )
}

export default AppController
