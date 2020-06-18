import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Col } from 'react-bootstrap';
import FirebaseUIAuth from "react-firebaseui-localized";
import { withRouter } from 'react-router';

import { login } from '../actions';
import Utils from '../utils';
import LogoContainer from './logo-container';
import '../styles/auth.css';

const { firebase } = Utils;
const uiConfig = {
    // Popup signin flow rather than redirect flow.
    signInFlow: 'redirect',
    // Redirect to /signedIn after sign in is successful. Alternatively you can provide a callbacks.signInSuccess function.
    signInSuccessUrl: '/',
    credentialHelper: 'none',
    // We will display Google and Facebook as auth providers.
    signInOptions: [
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        firebase.auth.FacebookAuthProvider.PROVIDER_ID,
        firebase.auth.EmailAuthProvider.PROVIDER_ID
    ],
    tosUrl: "https://speechtext.io/terms-of-service/",
    privacyPolicyUrl: "https://speechtext.io/privacy-policy/"
};

class Auth extends Component {
    componentDidMount() {
        this.unsubscribe = firebase.auth().onAuthStateChanged(currentUser => {
            console.log('authDidMount currentUser', currentUser)
            if (currentUser) {
                this.props.history.push('/')
            }
        })
    }

    componentWillUnmount() {
        this.unsubscribe()
    }

    render() {
        console.log('Auth Renders', this.props)
        console.log('Auth Renders currentUser', firebase.auth().currentUser)
        return (
            <div className="container auth-container">
                <Row>
                    <Col className='login-container'>
                        <LogoContainer />
                        <FirebaseUIAuth
                            lang={this.props.language ? this.props.language.split(/[-_]/)[0] : 'en'}
                            config={uiConfig}
                            auth={firebase.auth()}
                            firebase={firebase}
                        />
                    </Col>
                </Row>
            </div>
        )
    }
}

const mapStateToProps = ({ user }) => {
    return { user }
}

export default connect(mapStateToProps, { login })(withRouter(Auth));