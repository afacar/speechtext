import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import Alert from 'react-s-alert';

import { setLanguage, setSupportedLanguages, getPlans, getErrorDefinitions, login } from '../actions';
import Dashboard from './dashboard/dashboard';
import User from './user/user';
import TranscriptionResult from './dashboard/transcription-result'
import Evaluate from './../components/evaluation-popup';
import Auth from '../components/auth';

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
                        <Route exact path='/' component={Dashboard} />} />
                        <Route path='/auth' component={Auth} />
                        <Route path='/user' component={User} />
                        <Route path='/edit' component={TranscriptionResult} />
                        <Route path='/feedback/:fileInfo' component={Evaluate} />
                        <Route exact path='/feedback' component={Evaluate} />
                    </Switch>
                </BrowserRouter>
                <Alert stack={{ limit: 3 }} timeout={5000} html={true} effect={'slide'} position={'top-right'} />
            </div>
        )
    }
}

const mapStateToProps = ({ user }) => {
    return { user }
}

export default connect(mapStateToProps, { setLanguage, setSupportedLanguages, getPlans, getErrorDefinitions, login })(App);