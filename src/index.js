import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { IntlProvider } from 'react-intl';

import reducers from './reducers';
import Utils from './utils';
import App from './containers/app';

const { supportedLanguages, currentLanguage, messages } = Utils.Localization;
Utils.initGoogleAnalytics();

const store = createStore(reducers, applyMiddleware(thunk));

const Root = () => (
    <Provider store={ store }>
        <IntlProvider locale={ currentLanguage } messages={messages[currentLanguage]} >
            <App language={ currentLanguage } supportedLanguages={ supportedLanguages } />
        </IntlProvider>
    </Provider>
);
  
ReactDOM.render(<Root />, document.getElementById('root'));