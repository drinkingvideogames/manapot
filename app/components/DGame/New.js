import React from 'react'
import { DragDropContextProvider } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import Button from 'material-ui/Button'
import SaveIcon from 'material-ui-icons/Save'
import axios from 'axios'
import ComponentsSidebar from './parts/ComponentsSidebar'
import Layout from './parts/Layout'
import PageDetailsSidebar from './parts/PageDetailsSidebar'

class NewDrinkingGame extends React.Component {
    constructor (props) {
        super(props)
        this.state = { layout: [] }
    }

    changeLayout (component, insertIndex) {
        const { layout } = this.state
        const layoutClone = [].concat(layout)
        layoutClone.splice(insertIndex || (layout.length - 1), 0, component)
        this.setState({ layout: layoutClone })
    }

    removeFromLayout (i) {
        const { layout } = this.state
        const layoutClone = [].concat(layout)
        layoutClone.splice(i, 1)
        this.setState({ layout: layoutClone })
    }

    moveItem (fromIndex, toIndex, component) {
        const { layout } = this.state
        const layoutClone = [].concat(layout)
        if (fromIndex !== undefined) {
            const moved = layoutClone.splice(fromIndex, 1)[0]
            layoutClone.splice(toIndex, 0, moved)
        } else {
            layoutClone.splice(toIndex, 0, component)
        }
        this.setState({ layout: layoutClone })
    }

    updateState (states) {
        this.states = states
    }

    getAndCleanComponentState (comp) {
        let state = this.states[comp.componentId].component.state
        if (comp.componentKey === 'text') {
            delete state.editorState
        }
        return state
    }

    handleAction () {
        const { params } = this.props
        const pageComponents = this.state.layout.map((comp) =>
            ({ state: this.getAndCleanComponentState(comp), componentId: comp.componentId, component: comp.name, componentKey: comp.componentKey })
        )
        const pageDetails = this.details._reactInternalInstance._renderedComponent._instance.state
        const data = Object.assign({}, pageDetails, { layout: pageComponents, gameUrl: params.game })
        axios('/api/drink/', { method: 'POST', credentials: 'same-origin', data })
            .then((res) => {
                console.log('what', res)
            })
            .catch(console.error)
    }

    render () {
        const { classes } = this.props
        const { layout } = this.state
        return (
            <DragDropContextProvider backend={HTML5Backend}>
                <div className='container'>
                    <Layout changeLayout={this.changeLayout.bind(this)} onDrop={this.updateState.bind(this)} layout={layout} removeFromPage={this.removeFromLayout.bind(this)} moveItem={this.moveItem.bind(this)} />
                    <ComponentsSidebar />
                    <PageDetailsSidebar ref={(details) => { this.details = details }}/>
                    <Button fab color="primary" aria-label="new" className="page-action" onClick={this.handleAction.bind(this)}>
                        <SaveIcon />
                    </Button>
                </div>
            </DragDropContextProvider>
        )
    }
}

export default NewDrinkingGame
