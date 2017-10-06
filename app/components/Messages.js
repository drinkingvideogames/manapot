import React from 'react'
import Snackbar from 'material-ui/Snackbar'

class Messages extends React.Component {
  renderSnackbar (type) {
    return (
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center'
        }}
        open
        autoHideDuration={6000}
        message={<span className={`text-${type}`}>{this.props.messages[type].map((msg, i) => (<div key={msg.msg}>{msg.msg}</div>))}</span>}
      />
    )
  }

  render () {
    return this.props.messages.success ? (
      this.renderSnackbar('success')
    ) : this.props.messages.error ? (
      this.renderSnackbar('error')
    ) : this.props.messages.info ? (
      this.renderSnackbar('info')
    ) : null
  }
}

export default Messages
