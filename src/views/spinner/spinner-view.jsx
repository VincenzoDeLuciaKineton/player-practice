import React, { useEffect } from 'react'
import './spinner-view.css'

const SpinnerView = () => {

    useEffect(() => {
        console.log('SPINNER MOUNTED');

        return () => {
            console.log('SPINNER UNMOUNTED');
        }
    }, [])
    return (
        <div className='spinner-container'>
            <div className='spinner' />
        </div>
    )
}

export default SpinnerView
