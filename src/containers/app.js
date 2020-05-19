import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';

import { setLanguage, setSupportedLanguages, getPlans, getErrorDefinitions } from '../actions';
import Dashboard from './dashboard/dashboard';
import User from './user/user';
import TranscriptionResult from './dashboard/transcription-result'
import Evaluate from './../components/evaluation-popup';
import Auth from '../components/auth';
import Splash from '../components/splash';

import 'react-s-alert/dist/s-alert-default.css';
import 'react-s-alert/dist/s-alert-css-effects/slide.css';

class App extends Component {
    componentDidMount() {
        this.props.setLanguage(this.props.language);
        this.props.setSupportedLanguages(this.props.supportedLanguages);
        this.props.getPlans();
        this.props.getErrorDefinitions(this.props.language);
    }

    render() {
        return (
            <div className='app-container'>
                <BrowserRouter>
                    <Switch>
                        <Route exact path='/' component={Splash} /> />
                        <Route path='/dashboard' component={Dashboard} /> />
                        <Route path='/auth' component={Auth} />
                        <Route path='/user' component={User} />
                        <Route path='/edit' component={TranscriptionResult} />
                        <Route path='/feedback/:fileInfo' component={Evaluate} />
                        <Route exact path='/feedback' component={Evaluate} />
                    </Switch>
                </BrowserRouter>
            </div>
        )
    }
}

export default connect(null, { setLanguage, setSupportedLanguages, getPlans, getErrorDefinitions })(App);