import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import _ from 'lodash';
import { Container, Row, Col, Alert } from 'react-bootstrap';

import { getFileList } from '../../actions';
import '../../styles/dashboard.css';
import UserHeader from '../user-header';
import FileList from './file-list';
import Transcription from './transcription';
import Utils from '../../utils';
const { auth } = Utils.firebase;

class Dashboard extends Component {
    state = {
        emailVerified: null
    }

    componentDidMount() {
        if (_.isEmpty(this.props.user)) {
            this.props.history.push('/');
        } else {
            const { emailVerified } = auth().currentUser;
            this.setState({ emailVerified })
            this.props.getFileList();
            localStorage.setItem('location', window.location.pathname);
        }
    }

    resendVerificationEmail = async () => {
        let { currentUser } = auth();
        await currentUser.sendEmailVerification()
            .then(() => {
                this.setState({ isSent: true })
            })
            .catch(error => {
                // TODO: VERIFY_EMAIL_ERROR
                console.log(error);
            })
    }

    render() {
        const { user } = this.props;
        return (
            <div>
                <UserHeader />
                <Container className='dashboard-container'>
                    {!this.state.emailVerified && 
                        <Alert variant='warning'>
                            {'You need to'} <Alert.Link onClick={this.resendVerificationEmail}>Verify</Alert.Link> {`your email ${user.email}!`}
                        </Alert>
                    }
                    {!this.state.emailVerified && this.state.isSent &&
                        <Alert variant='warning'>
                            {`A verification email sent to ${user.email}. Refresh page after verifying your mail.`}
                        </Alert>
                    }
                    <Row>
                        <Col lg="4" md="4">
                            <FileList emailVerified={this.state.emailVerified} />
                        </Col>
                        <Col lg="8" md="8">
                            <Transcription />
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
}

const mapStateToProps = ({ user }) => {
    return {
        user
    }
}

export default connect(mapStateToProps, { getFileList })(withRouter(Dashboard));