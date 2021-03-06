import React from 'react'
import List, { ListSubheader, ListItem, ListItemText, ListItemSecondaryAction } from 'material-ui/List'
import Avatar from 'material-ui/Avatar'
import IconButton from 'material-ui/IconButton'
import AddIcon from 'material-ui-icons/Add'
import CollectionIcon from 'material-ui-icons/Collections'
import Toolbar from '../parts/Toolbar'
import ContentEditable from '../../../lib/ContentEditable'
import { AssetControl } from '../../../Asset'

class ListImageComponent extends React.Component {
    constructor (props) {
        super(props)
        this.state = Object.assign({
            subheading: 'List Sub Heading',
            listBullet: '',
            list: [ { text: 'Item 1', id: 0 } ]
        }, props.initialState)
    }

    addItem () {
        const { list } = this.state
        this.setState({ list: list.concat([ { text: `Item ${list.length + 1}`, id: list.length } ]) })
    }

    handleTextChange (e, subheading) {
        this.setState({ subheading })
    }

    handleTextClick (e) {
        const { subheading } = this.state
        if (subheading === 'List Sub Heading') this.setState({ subheading: '' })
    }

    handleTextBlur (e) {
        const { subheading } = this.state
        if (subheading === '') {
            this.setState({ subheading: 'List Sub Heading' })
        }
    }

    handleListChange (index, e, text) {
        const { list } = this.state
        const listCopy = [].concat(list)
        listCopy[index] = { text, id: index }
        this.setState({ list: listCopy })
    }

    handleListClick (index, e) {
        const { list } = this.state
        const listCopy = [].concat(list)
        const item = listCopy[index]
        if (item.text === `Item ${index + 1}`) {
            listCopy[index] = { text: '', id: index }
            this.setState({ list: listCopy })
        }
    }

    handleListBlur (index, e) {
        const { list } = this.state
        const listCopy = [].concat(list)
        const item = listCopy[index]
        if (item.text === '') {
            listCopy[index] = { text: `Item ${index + 1}`, id: index }
            this.setState({ list: listCopy })
        }
    }

    handleIconChange (images) {
        this.setState({ listBullet: images[0] || null })
    }

    handleDestroy () {
        const { destroy } = this.props
        if (destroy) destroy()
    }

    render () {
        const { connectDragSource } = this.props
        const { subheading, list, listBullet } = this.state
        return (
            <div>
                <List>
                    <ListSubheader className='editable'>
                        <ContentEditable
                            singleLine
                            html={subheading}
                            onClick={this.handleTextClick.bind(this)}
                            onChange={this.handleTextChange.bind(this)}
                            onBlur={this.handleTextBlur.bind(this)}
                            name='subheading'
                            contentEditable='plaintext-only'
                        />
                    </ListSubheader>
                    {list.map((item, i) => (
                        <ListItem key={`${item.id}`}>
                            <AssetControl onChange={this.handleIconChange.bind(this)}>
                                {listBullet ?
                                    <Avatar src={listBullet && listBullet.file && listBullet.file.url} /> :
                                    <Avatar>
                                        <CollectionIcon />
                                    </Avatar>
                                }
                            </AssetControl>
                            <span className='editable listItem'>
                                <ContentEditable
                                    singleLine
                                    html={item.text}
                                    onClick={this.handleListClick.bind(this, i)}
                                    onChange={this.handleListChange.bind(this, i)}
                                    onBlur={this.handleListBlur.bind(this, i)}
                                    name='text'
                                    contentEditable='plaintext-only'
                                />
                            </span>
                            <ListItemSecondaryAction>
                                <IconButton onClick={this.addItem.bind(this)}>
                                    <AddIcon />
                                </IconButton>
                            </ListItemSecondaryAction>
                        </ListItem>
                    ))}
                </List>
                <Toolbar
                    canDrag
                    canDelete
                    onDelete={this.handleDestroy.bind(this)}
                    connectDragSource={connectDragSource}
                />
            </div>
        )
    }
}

export default ListImageComponent
