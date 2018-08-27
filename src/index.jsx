import React from 'react'
import ReactDOM from 'react-dom'
import {AppContainer} from 'react-hot-loader'
import Routes from './routes'
import { DrizzleProvider } from 'drizzle-react'
import LoadingContainer from './components/LoadingContainer'
import drizzleOptions from './drizzleOptions'
import { store } from './store'
import { updateAccount } from './accounts/actions'

if (typeof window.web3 !== 'undefined') {
  const web3 = window.web3

  store.dispatch(updateAccount(web3.currentProvider.publicConfigStore._state.selectedAddress))

  web3.currentProvider.publicConfigStore.on('update', ({ selectedAddress }) => {
    store.dispatch(updateAccount(selectedAddress))
  })
}

const renderApp = (Component) => {
  ReactDOM.render(
    <AppContainer>
      <DrizzleProvider options={drizzleOptions} store={store}>
        <LoadingContainer>
          <Component />
        </LoadingContainer>
      </DrizzleProvider>
    </AppContainer>,
    document.getElementById('app')
  );
};

renderApp(Routes)

if (module.hot) {
  module.hot.accept('./routes', () => {
    renderApp(require('./routes').default);
  })
}
