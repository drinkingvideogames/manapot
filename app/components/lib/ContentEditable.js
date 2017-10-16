import React, { Component } from 'react'

export default class ContentEditable extends Component {
  constructor (props) {
    super(props)
    this._onChange = this._onChange.bind(this)
    this._onPaste = this._onPaste.bind(this)
  }

  componentDidMount () {
    this.refs.element.onkeypress = (e) => {
      if (e.key === 'Enter') {
        this.refs.element.blur()
      }
    }
  }

  _onChange (ev) {
    const method = this.getInnerMethod()
    const value = this.parse.call(this)

    this.props.onChange(ev, value)
  }

  _onPaste (ev) {
    const { onPaste, contentEditable, singleLine } = this.props

    if (contentEditable === 'plaintext-only') {
      ev.preventDefault()
      var text = ev.clipboardData.getData('text')
      if (!!singleLine) text = text.replace(/\n/g, '')
      document.execCommand('insertText', false, text)
    }

    if (onPaste) {
      onPaste(ev)
    }
  }

  getInnerMethod () {
    return this.props.contentEditable === 'plaintext-only' ? 'innerText' : 'innerHTML'
  }

  parse () {
    const method = this.getInnerMethod()
    const singleLine = !!this.props.singleLine
    let value = this.refs.element[method]
    if (singleLine) {
      value = value.replace(/\n/g, '')
    }
    return value
  }

  shouldComponentUpdate (nextProps, nextState) {
    const method = this.getInnerMethod()
    return !this.refs.element[method] || (nextProps.html !== this.refs.element[method])
  }

  render () {
    const { html, contentEditable, singleLine, ...props } = this.props
    return (
      <div
        {...props}
        ref='element'
        dangerouslySetInnerHTML={{__html: html}}
        contentEditable={contentEditable !== 'false'}
        onInput={this._onChange}
        onPaste={this._onPaste}
      />
    )
  }
}
