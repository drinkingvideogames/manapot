import React from 'react'
import Typography from 'material-ui/Typography'

export default ({ hydrationState }) => {
    const { text, type } = hydrationState
    return (<Typography type={type}>{text}</Typography>)
}
