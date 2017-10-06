import React from 'react'
import BaseButton from './Base'

function GoogleButton (props) {
  const styles = theme => ({
    normal: {
      color: '#df4a32'
    },
    block: {
      backgroundColor: '#df4a32',
      color: '#ffffff'
    }
  })
  return (
    <BaseButton
      icon='google'
      aria-label='Google'
      {...props}
      styles={styles}
        />
  )
}

export default GoogleButton
export { GoogleButton }
