import React from 'react'
import Dropzone from 'react-dropzone'
import { withStyles } from 'material-ui/styles'
import Typography from 'material-ui/Typography'
import IconButton from 'material-ui/IconButton'
import ClearIcon from 'material-ui-icons/Clear'
import ContentEditable from '../../../lib/ContentEditable'
import GenreEditable from './Genre'

const styles = theme => ({
  deleteAsset: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    color: '#ffffff',
    position: 'absolute',
    right: '10px',
    top: '10px'
  },
  dropText: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)'
  },
  center: {
    textAlign: 'center'
  },
  bannerContainer: {
    position: 'relative'
  },
  bannerTitle: {
    position: 'absolute',
    bottom: '20px',
    left: '20px'
  },
  bannerGenre: {
    position: 'absolute',
    bottom: '20px',
    right: '20px'
  }
})

class EditableGameBanner extends React.Component {
  handleNameChange (e, name) {
    this.props.onChange({ name })
  }

  handleNameBlur (e) {
    if (!this.props.game.name) this.props.onChange({ name: 'Game Name' })
  }

  handleNameClick (e) {
    if (this.props.game.name === 'Game Name') {
      this.props.onChange({ name: '' })
    }
  }

  handleBannerDrop (acceptedFiles) {
    if (acceptedFiles.length > 0) {
      this.props.onChange({ banner: acceptedFiles[0] })
    }
  }

  clearBanner (e) {
    e.stopPropagation()
    this.props.onChange({ banner: undefined })
  }

  render () {
    let localStyles = {
      bannerImage: {
        boxSizing: 'border-box',
        cursor: 'pointer',
        height: '200px',
        position: 'relative',
        width: '100%'
      }
    }
    const classes = this.props.classes
    return (
      <div className={classes.bannerContainer}>
        <Dropzone
          accept='image/jpg, image/jpeg, image/png, image/gif'
          multiple={false}
          maxSize={10000000}
          onDrop={this.handleBannerDrop.bind(this)}
          style={
                  Object.assign({}, localStyles.bannerImage, {
                    padding: '10px',
                    textAlign: 'center',
                    background: 'rgba(20, 20, 20, 0.2)',
                    border: '1px dashed #000000',
                    backgroundImage: this.props.game.banner ? `url(${this.props.game.banner.preview || this.props.game.banner.file.url})` : '',
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center center'
                  })
                }
        >
          {!this.props.game.banner ? <div className={classes.dropText}>Drop a banner image here</div> : null}
          {this.props.game.banner ? (
            <IconButton className={classes.deleteAsset} onClick={this.clearBanner.bind(this)}>
              <ClearIcon />
            </IconButton>
            ) : null}
        </Dropzone>
        <div className={classes.bannerTitle}>
          <Typography type='display1' className='editable'>
            <ContentEditable
              html={this.props.game.name}
              onClick={this.handleNameClick.bind(this)}
              onChange={this.handleNameChange.bind(this)}
              onBlur={this.handleNameBlur.bind(this)}
              name='name'
              contentEditable='plaintext-only'
            />
          </Typography>
        </div>
        <div>
          <GenreEditable genre={this.props.game.genre} className={classes.bannerGenre} onChange={this.props.onChange} />
        </div>
      </div>
    )
  }
}

export default withStyles(styles)(EditableGameBanner)
