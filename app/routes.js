import React from 'react'
import { IndexRoute, Route } from 'react-router'
import App from './components/App'
import Home from './components/Home'
import Contact from './components/Contact'
import NotFound from './components/NotFound'
import { AuthForm, Profile, Forgot, Reset, PublicProfile } from './components/Account'
import { NewGame, TemplateGame, EditGame } from './components/Game'
import { NewDGame, TemplateDGame, EditDGame } from './components/DGame'
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
  const clearStyles = () => {
    store.dispatch({ type: 'RESET_STYLES' })
  }
  const clearMessages = () => {
    store.dispatch({ type: 'CLEAR_MESSAGES' })
  }
  function call () {
    const argsArray = [...arguments]
    argsArray.forEach((func) => {
      if (typeof func === 'function') func()
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
      <Route path='/game/:game/drink/new' component={NewDGame} onEnter={ensureAuthenticatedPermission('drinkinggame:create')} onLeave={call.bind(null, clearMessages, clearStyles)} />
      <Route path='/game/:game/drink/:dgame/edit' component={EditDGame} onEnter={ensureAuthenticatedPermission('drinkinggame:edit')} onLeave={call.bind(null, clearMessages, clearStyles)} />
      <Route path='/game/:game/drink/:dgame' component={TemplateDGame} onLeave={clearStyles} />
      <Route path='/users' component={UsersControl} onEnter={ensureAuthenticatedPermission('admin:all')} onLeave={clearMessages} />
      <Route path='/users/roles' component={RolesControl} onEnter={ensureAuthenticatedPermission('admin:all')} onLeave={clearMessages} />
      <Route path='/user/:user' component={PublicProfile} />
      <Route path='*' component={NotFound} onLeave={clearMessages} />
    </Route>
  )
}
