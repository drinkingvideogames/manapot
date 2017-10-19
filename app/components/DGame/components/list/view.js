import React from 'react'
import List, { ListSubheader, ListItem, ListItemText } from 'material-ui/List'
import Avatar from 'material-ui/Avatar'
import CollectionIcon from 'material-ui-icons/Collections'

export default ({ hydrationState }) => {
    const { subheading, listBullet, list } = hydrationState
    return (
        <List>
            <ListSubheader>
                {subheading}
            </ListSubheader>
            {list.map((item, i) => (
                <ListItem key={`${item.id}`}>
                    {listBullet ?
                        <Avatar alt='What' src='/what' /> :
                        <Avatar>
                            <CollectionIcon />
                        </Avatar>
                    }
                    <ListItemText primary={item.text} />
                </ListItem>
            ))}
        </List>
    )
}
