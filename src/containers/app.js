import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import Alert from 'react-s-alert';
import 'react-s-alert/dist/s-alert-default.css';
import 'react-s-alert/dist/s-alert-css-effects/slide.css';

import { setLanguage, setSupportedLanguages } from '../actions';
import Main from './main';

class App extends Component {
    render() {
        return (
            <div>
                <BrowserRouter>
                    <Route exact path='/' render={ props => <Main {...props} /> } />
                </BrowserRouter>
                <Alert stack={{ limit: 3 }} timeout={ 5000 } html={ true } effect={ 'slide' } position={ 'top-right' } />
            </div>
        )
    }
}

export default connect(null, { setLanguage, setSupportedLanguages })(App);