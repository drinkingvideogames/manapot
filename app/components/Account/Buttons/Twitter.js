import React from 'react'
import BaseButton from './Base'

function TwitterButton (props) {
  const styles = theme => ({
    normal: {
      color: '#00b6f1'
    },
    block: {
      backgroundColor: '#00b6f1',
      color: '#ffffff'
    }
  })
  return (
    <BaseButton
      icon='twitter'
      aria-label='Twitter'
      {...props}
      styles={styles}
        />
  )
}

export default TwitterButton
export { TwitterButton }
