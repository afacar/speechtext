import React, { Component } from 'react';
import { connect } from 'react-redux';
import { login } from '../actions';
import { FormattedMessage } from 'react-intl';
import { Modal } from 'react-bootstrap';
import Utils from '../utils';
import FirebaseUIAuth from "react-firebaseui-localized";
import { bake_cookie } from 'sfcookies';
import { withRouter } from 'react-router';

const { firebase } = Utils;
const uiConfig = {
    // Popup signin flow rather than redirect flow.
    signInFlow: 'popup',
    // Redirect to /signedIn after sign in is successful. Alternatively you can provide a callbacks.signInSuccess function.
    signInSuccessUrl: '/',
    credentialHelper: 'none',
    // We will display Google and Facebook as auth providers.
    signInOptions: [
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        firebase.auth.FacebookAuthProvider.PROVIDER_ID,
        firebase.auth.EmailAuthProvider.PROVIDER_ID
    ]
};

class Auth extends Component {
    componentDidMount() {
        var that = this;
        firebase.auth().onAuthStateChanged(user => {
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
                if(isNewUser) {
                    this.props.history.push('/dashboard');
                }
            }
        });
    }

    render() {
        return (
            <Modal show={this.props.show} onHide={this.props.handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        <FormattedMessage id="Auth.title" />
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <FirebaseUIAuth lang={this.props.language}
                        config={uiConfig}
                        auth={firebase.auth()}
                        firebase={firebase} />
                </Modal.Body>
            </Modal>
        )
    }
}

export default connect(null, { login })(withRouter(Auth));