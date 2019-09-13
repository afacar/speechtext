import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import Alert from 'react-s-alert';
import 'react-s-alert/dist/s-alert-default.css';
import 'react-s-alert/dist/s-alert-css-effects/slide.css';

import { setLanguage, setSupportedLanguages, getPlans } from '../actions';
import Main from './main';
import Dashboard from './dashboard';
import Profile from './profile';

class App extends Component {
    componentDidMount() {
        this.props.setLanguage(this.props.language);
        this.props.setSupportedLanguages(this.props.supportedLanguages);
        this.props.getPlans();
    }

    render() {
        return (
            <div>
                <BrowserRouter>
                    <Route exact path='/' render={ props => <Main {...props} /> } />
                    <Route path='/dashboard' component={ Dashboard } />
                    <Route path='/profile' component={ Profile } />
                </BrowserRouter>
                <Alert stack={{ limit: 3 }} timeout={ 5000 } html={ true } effect={ 'slide' } position={ 'top-right' } />
            </div>
        )
    }
}

export default connect(null, { setLanguage, setSupportedLanguages, getPlans })(App);