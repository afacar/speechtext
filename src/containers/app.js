import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import Alert from 'react-s-alert';

import Utils from '../utils';
import { bake_cookie } from 'sfcookies';
import { withRouter } from 'react-router';

import 'react-s-alert/dist/s-alert-default.css';
import 'react-s-alert/dist/s-alert-css-effects/slide.css';

import { setLanguage, setSupportedLanguages, getPlans, getErrorDefinitions, login } from '../actions';
import Main from './landing/main';
import Dashboard from './dashboard/dashboard';
import User from './user/user';
import Privacy from './landing/privacy';
import Terms from './landing/terms';
import ScrollTop from '../components/scroll-top';
import FrequentlyAskedQuestions from './landing/faq';
import Evaluate from './../components/evaluation-popup';

const { firebase } = Utils;

class App extends Component {
    componentDidMount() {
        this.props.setLanguage(this.props.language);
        this.props.setSupportedLanguages(this.props.supportedLanguages);
        this.props.getPlans();
        this.props.getErrorDefinitions(this.props.language);
    
        var that = this;
        firebase.auth().onAuthStateChanged(user => {
            const currentUser = user ? user : '';
            that.setState({ user: currentUser });
            if (currentUser) {
                const { uid, displayName, email, emailVerified, metadata } = currentUser;
                const { lastSignInTime, creationTime } = metadata;
                const isNewUser = creationTime === lastSignInTime
                let sinceLogin = new Date().getTime() - new Date(lastSignInTime).getTime() 
                console.log('sinceLogin:', sinceLogin) 
                const loginInfo = {
                    uid,
                    displayName,
                    email,
                    isNewUser,
                    emailVerified,
                    creationTime: new Date(creationTime),
                };
                that.props.login(loginInfo);

                bake_cookie('speechtext-dev-login', loginInfo);
                if(sinceLogin < 3500) {
                    // Redirect new user to dashboard 
                    this.props.history.push('/dashboard')
                }
            }
        });
    }

    render() {
        return (
            <div>
                    <ScrollTop>
                        <Route exact path='/' render={ props => <Main {...props} /> } />
                        <Route path='/dashboard' component={ Dashboard } />
                        <Route path='/user' component={ User } />
                        <Route path='/privacy' component={ Privacy } />
                        <Route path='/terms' component={ Terms } />
                        <Route path='/faq' component={ FrequentlyAskedQuestions } />
                        <Route path='/feedback/:fileInfo' component={ Evaluate } />
                        <Route exact path='/feedback' component={ Evaluate } />
                    </ScrollTop>
                <Alert stack={{ limit: 3 }} timeout={ 5000 } html={ true } effect={ 'slide' } position={ 'top-right' } />
            </div>
        )
    }
}

export default connect(null, { setLanguage, setSupportedLanguages, getPlans, getErrorDefinitions, login })(withRouter(App));