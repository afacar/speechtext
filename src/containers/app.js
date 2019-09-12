import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import Alert from 'react-s-alert';
import 'react-s-alert/dist/s-alert-default.css';
import 'react-s-alert/dist/s-alert-css-effects/slide.css';

import { setLanguage, setSupportedLanguages } from '../actions';
import Main from './main';
import Dashboard from './dashboard';
import Profile from './profile';
import Privacy from './privacy';
import Terms from './terms';

class App extends Component {
    componentDidMount() {
        this.props.setLanguage(this.props.language);
        this.props.setSupportedLanguages(this.props.supportedLanguages);
    }

    render() {
        return (
            <div>
                <BrowserRouter>
                    <Route exact path='/' render={ props => <Main {...props} /> } />
                    <Route path='/dashboard' component={ Dashboard } />
                    <Route path='/profile' component={ Profile } />
                    <Route path='/privacy' component={ Privacy } />
                    <Route path='/terms' component={ Terms } />
                </BrowserRouter>
                <Alert stack={{ limit: 3 }} timeout={ 5000 } html={ true } effect={ 'slide' } position={ 'top-right' } />
            </div>
        )
    }
}

export default connect(null, { setLanguage, setSupportedLanguages })(App);