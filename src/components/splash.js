import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { bake_cookie } from 'sfcookies';

import { login } from '../actions';
import LogoEn from '../assets/logo-en.png';
import LogoTr from '../assets/logo-tr.png';
import Utils from '../utils';
import '../styles/splash.css';

const { auth } = Utils.firebase;

class Splash extends Component {
    componentDidMount() {
        setTimeout(this.checkUser, 1000)
        //this.checkEmailVerified();
        if (!_.isEmpty(this.props.user)) this.props.getFileList();
    }

    checkUser = async () => {
        const { history } = this.props
        var that = this;
        auth().onAuthStateChanged(user => {
            const currentUser = user ? user : '';
            that.setState({ user: currentUser });
            if (currentUser) {
                const { uid, displayName, email, emailVerified, metadata } = currentUser;
                const { lastSignInTime, creationTime } = metadata;
                const isNewUser = creationTime === lastSignInTime
                const loginInfo = {
                    uid,
                    displayName,
                    email,
                    isNewUser,
                    emailVerified,
                    creationTime: new Date(creationTime),
                };
                that.props.login(loginInfo);
                bake_cookie(process.env.REACT_APP_LOGIN_INFO_NAME, loginInfo);
                history.push('/dashboard')
            } else {
                history.push('/auth')
            }
        });
    }

    render() {
        const { language } = this.props;
        return (
            <div className='splash-container'>
                <img
                    alt='Online Audio/Video Transcripton Logo'
                    src={language === 'tr-TR' ? LogoTr : LogoEn}
                    className='logo-style'
                />
                <span className='spinner-border text-dark'></span>
            </div>
        )
    }
}

const mapStateToProps = ({ language }) => {
    return { language };
}

export default connect(mapStateToProps, { login })(Splash);