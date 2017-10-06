import React from 'react'
import BaseButton from './Base'

function FacebookButton (props) {
  const styles = theme => ({
    normal: {
      color: '#3b5998'
    },
    block: {
      backgroundColor: '#3b5998',
      color: '#ffffff'
    }
  })
  return (
    <BaseButton
      icon='facebook'
      aria-label='Facebook'
      {...props}
      styles={styles}
        />
  )
}

export default FacebookButton
export { FacebookButton }
