import React from 'react'
import { IndexRoute, Route } from 'react-router'
import App from './components/App'
import Home from './components/Home'
import Contact from './components/Contact'
import NotFound from './components/NotFound'
import { AuthForm, Profile, Forgot, Reset } from './components/Account'
import { NewGame, TemplateGame, EditGame } from './components/Game'
import { NewDGame, TemplateDGame } from './components/DGame'
import { UsersControl, RolesControl } from './components/UserManagement'

export default function getRoutes (store) {
  const ensureAuthenticatedPermission = (permission) => {
    return (nextState, replace) => {
      const state = store.getState()
      if (!state.auth.token || !state.auth.user) {
        return replace('/login')
      }
      if (!state.auth.user.permissions.includes(permission)) {
        return replace('/')
      }
    }
  }
  const ensureAuthenticated = (nextState, replace) => {
    if (!store.getState().auth.token) {
      replace('/login')
    }
  }
  const skipIfAuthenticated = (nextState, replace) => {
    if (store.getState().auth.token) {
      replace('/')
    }
  }
  const clearMessages = () => {
    store.dispatch({
      type: 'CLEAR_MESSAGES'
    })
  }
  return (
    <Route path='/' component={App}>
      <IndexRoute component={Home} onLeave={clearMessages} />
      <Route path='/contact' component={Contact} onLeave={clearMessages} />
      <Route path='/login' component={AuthForm} purpose='Login' onEnter={skipIfAuthenticated} onLeave={clearMessages} />
      <Route path='/signup' component={AuthForm} purpose='Signup' onEnter={skipIfAuthenticated} onLeave={clearMessages} />
      <Route path='/account' component={Profile} onEnter={ensureAuthenticated} onLeave={clearMessages} />
      <Route path='/forgot' component={Forgot} onEnter={skipIfAuthenticated} onLeave={clearMessages} />
      <Route path='/reset/:token' component={Reset} onEnter={skipIfAuthenticated} onLeave={clearMessages} />
      <Route path='/game/new' component={NewGame} onEnter={ensureAuthenticatedPermission('game:create')} onLeave={clearMessages} />
      <Route path='/game/:game/edit' component={EditGame} onEnter={ensureAuthenticatedPermission('game:edit')} onLeave={clearMessages} />
      <Route path='/game/:game' component={TemplateGame} />
      <Route path='/game/:game/drink/new' component={NewDGame} onEnter={ensureAuthenticatedPermission('drinkinggame:create')} onLeave={clearMessages} />
      <Route path='/game/:game/drink/edit' component={NewDGame} onEnter={ensureAuthenticatedPermission('drinkinggame:edit')} onLeave={clearMessages} />
      <Route path='/game/:game/drink/:dgame' component={TemplateDGame} />
      <Route path='/users' component={UsersControl} onEnter={ensureAuthenticatedPermission('admin:all')} onLeave={clearMessages} />
      <Route path='/users/roles' component={RolesControl} onEnter={ensureAuthenticatedPermission('admin:all')} onLeave={clearMessages} />
      <Route path='*' component={NotFound} onLeave={clearMessages} />
    </Route>
  )
}
