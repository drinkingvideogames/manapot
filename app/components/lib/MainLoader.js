import React from 'react'

const MainLoader = ({ loaded, children }) => {
    return (
        loaded ? children : <div className="loading container"><div className="loading run"></div><div className="loading title">Loading</div></div>
    )
}

export default MainLoader
