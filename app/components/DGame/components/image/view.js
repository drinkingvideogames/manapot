import React from 'react'

export default ({ hydrationState }) => {
    const { image } = hydrationState
    return (<img src={image && image.file && image.file.url} />)
}
