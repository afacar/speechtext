import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import Alert from 'react-s-alert';
import 'react-s-alert/dist/s-alert-default.css';
import 'react-s-alert/dist/s-alert-css-effects/slide.css';

import { setLanguage, setSupportedLanguages, getPlans, getErrorDefinitions } from '../actions';
import Main from './landing/main';
import Dashboard from './dashboard/dashboard';
import User from './user/user';
import Privacy from './landing/privacy';
import Terms from './landing/terms';
import ScrollTop from '../components/scroll-top';
import FrequentlyAskedQuestions from './landing/faq';
import Evaluate from './../components/evaluation-popup';

class App extends Component {
    componentDidMount() {
        this.props.setLanguage(this.props.language);
        this.props.setSupportedLanguages(this.props.supportedLanguages);
        this.props.getPlans();
        this.props.getErrorDefinitions(this.props.language);
    }

    render() {
        return (
            <div>
                <BrowserRouter>
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
                </BrowserRouter>
                <Alert stack={{ limit: 3 }} timeout={ 5000 } html={ true } effect={ 'slide' } position={ 'top-right' } />
            </div>
        )
    }
}

export default connect(null, { setLanguage, setSupportedLanguages, getPlans, getErrorDefinitions })(App);