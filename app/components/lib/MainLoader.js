import React from 'react'

const MainLoader = ({ loaded, children }) => {
  const classes = [ 'kirby', 'pikachu' ]
  const animationClassIndex = Math.floor(Math.random() * classes.length)
  const animationClass = classes[animationClassIndex]
  return (
      loaded ? children : <div className="loading container"><div className={`loading ${animationClass}`}></div><div className="loading title">Loading</div></div>
  )
}

export default MainLoader
