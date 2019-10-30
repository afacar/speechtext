import React, { Component } from 'react';
import { connect } from 'react-redux';
import { login } from '../actions';
import { FormattedMessage } from 'react-intl';
import { Modal } from 'react-bootstrap';
import Utils from '../utils';
import FirebaseUIAuth from "react-firebaseui-localized";

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
                const { uid, displayName, email, metadata } = currentUser;
                const { lastSignInTime, creationTime } = metadata;
                const isNewUser = creationTime === lastSignInTime
                console.log(`uid: ${uid} \ndisplayName: ${displayName}\nemail: ${email}`)
                that.props.login({
                    uid,
                    displayName,
                    email,
                    isNewUser,
                    creationTime: new Date(creationTime),
                });
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

export default connect(null, { login })(Auth);