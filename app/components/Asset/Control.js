import React from 'react'
import Dropzone from 'react-dropzone'
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog'
import Button from 'material-ui/Button'
import { GridList, GridListTile } from 'material-ui/GridList'
import axios from 'axios'
import Loader from '../lib/MainLoader'

class AssetControl extends React.Component {
  constructor (props) {
    super(props)
    this.state = { open: false, loaded: false, assets: [], selected: [], newFiles: [] }
  }

  componentDidMount () {
    axios.get('/api/asset')
      .then((res) => {
        this.setState({ loaded: true, assets: (res && res.data) || [] })
      })
      .catch(console.error)
  }

  saveAssets (assets, onDone) {
    const data = new FormData()
    assets.forEach((asset) => {
      data.append('assets', asset)
    })
    axios('/api/asset/', { method: 'POST', credentials: 'same-origin', data })
      .then((res) => {
        console.log(res)
        if (res.status === 200) {
          const { selected, assets } = this.state
          const updatedAssets = assets.concat(res.data)
          const newIds = res.data.map((asset) => asset._id)
          this.setState({ open: false, newFiles: [], selected: selected.concat(newIds), assets: updatedAssets }, onDone)
        } else {
          throw new Error('Upload failed')
        }
      })
      .catch(console.error)
  }

  updateControlOpenState (open, saving) {
    const { newFiles } = this.state
    if (!open && (saving === true)) {
      if (newFiles && newFiles.length) {
        this.saveAssets(newFiles, this.onUpdate.bind(this))
      } else {
        this.setState({ open, newFiles: [] }, this.onUpdate.bind(this))
      }
    } else {
      this.setState({ open, newFiles: [] })
    }
  }

  capItemsToLimit (items) {
    const { newFiles } = this.state
    const { limit } = this.props
    const array = [...items]
    const itemLimit = limit || 1
    let subset = array.splice(array.length - itemLimit, itemLimit)

    if (newFiles && newFiles.length) {
      const selectLimit = (limit - newFiles.length) || 0
      if (selectLimit === 0) {
        subset = []
      } else {
        subset = array.splice(array.length - selectLimit, selectLimit)
      }
    }

    return subset
  }

  capFilesToLimit (files) {
    const { limit } = this.props
    const fileLimit = limit || 1
    return [].concat(files).splice(-fileLimit, fileLimit)
  }

  handleDrop (inline, acceptedFiles) {
    if (inline) return /*Temporary*/
    if (acceptedFiles.length > 0) {
      const { newFiles, selected } = this.state
      const files = newFiles.concat(acceptedFiles)
      const cappedFiles = this.capFilesToLimit(files)
      this.setState({ newFiles: cappedFiles }, () => {
        const items = this.capItemsToLimit(selected)
        this.setState({ selected: items }, () => {
          if (inline) this.onUpdate()
        })
      })
    }
  }

  selectItem (asset) {
    const { selected } = this.state
    const selectedSet = new Set(selected)
    if (selectedSet.has(asset._id)) {
      selectedSet.delete(asset._id)
    } else {
      selectedSet.add(asset._id)
    }
    const items = this.capItemsToLimit(selectedSet)
    this.setState({ selected: items })
  }

  onUpdate () {
    const { onChange } = this.props
    const { assets, selected, newFiles } = this.state
    const embellishedSelected = selected.map((id) => (
      assets.find((asset) => asset._id === id)
    ))
    if (onChange) onChange(embellishedSelected, newFiles)
  }

  render () {
    const { children } = this.props
    const { open, loaded, assets, selected, newFiles } = this.state
    return (
      <div>
        <Dropzone
          ref={(dz) => { if (dz) dz.node.querySelector('input').setAttribute('disabled', 'disabled') }}
          accept='image/jpg, image/jpeg, image/png, image/gif'
          multiple={true}
          maxSize={10000000}
          onDrop={this.handleDrop.bind(this, true)}
          onClick={this.updateControlOpenState.bind(this, true)}
          style={{}}
        >
          {children}
        </Dropzone>
        <Dialog open={open} onRequestClose={this.updateControlOpenState.bind(this, false)} maxWidth="md">
          <DialogTitle>Assets</DialogTitle>
          <DialogContent>
            <Loader loaded={loaded}>
              <GridList cellHeight={160} cols={3}>
                <GridListTile cols={1} style={{ width: 320, cursor: 'pointer'}}>
                  <Dropzone
                    style={{ height: '100%', width: '100%', boxSizing: 'border-box', border: '2px dashed rgb(102, 102, 102)' }}
                    accept='image/jpg, image/jpeg, image/png, image/gif'
                    multiple={false}
                    maxSize={10000000}
                    onDrop={this.handleDrop.bind(this, false)}
                  >
                    Drop images here
                  </Dropzone>
                </GridListTile>
                {newFiles && newFiles.length ? newFiles.map((file) => (
                  <GridListTile key={file.lastModified} cols={1} style={{ width: 320, cursor: 'pointer', border: '1px dashed red' }}>
                    <img src={file.preview} />
                  </GridListTile>
                )) : []}
                {assets ? assets.map((asset) => (
                  asset.file && asset.file.url
                  ? <GridListTile key={asset._id} cols={1} style={{ width: 320, cursor: 'pointer', border: selected.includes(asset._id) ? '1px dashed red' : 'none' }} onClick={this.selectItem.bind(this, asset)}>
                      <img src={asset.file.url} />
                    </GridListTile>
                  : null
                )).filter((item) => item) : []}
              </GridList>
            </Loader>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.updateControlOpenState.bind(this, false)} color="primary">
              Cancel
            </Button>
            <Button raised onClick={this.updateControlOpenState.bind(this, false, true)} color="primary">
              Save {newFiles && newFiles.length ? 'and upload' : ''}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    )
  }
}

export default AssetControl
