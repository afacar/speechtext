import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, Prompt } from 'react-router';
import _ from 'lodash';
import { Container, Row, Col, Alert, Spinner } from 'react-bootstrap';

import { getFileList, updateFileState, removeFromUploadingFiles } from '../../actions';
import '../../styles/dashboard.css';
import UserHeader from '../user-header';
import FileList from './file-list';
import Transcription from './transcription';
import Utils from '../../utils';
const { auth } = Utils.firebase;

class Dashboard extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            emailVerified: true,
            isSent: false,
            blockNavigation: false
        }
    }

    componentWillUnmount() {
        this.clearUploadingFiles();
    }

    componentDidMount() {
        this.checkEmailVerified(this.props.user);
    }

    componentWillReceiveProps({ user }) {
        if(_.isEmpty(this.props.user) && !_.isEmpty(user)) {
            this.checkEmailVerified(user);
        }
    }

    componentDidUpdate() {
        if(!this.state.blockNavigation && !_.isEmpty(this.props.uploadingFiles)) {
            this.setState({
                blockNavigation: true
            });
            window.addEventListener('beforeunload', this.beforeUnload);
        } else if(this.state.blockNavigation && _.isEmpty(this.props.uploadingFiles)) {
            this.setState({
                blockNavigation: false
            });
            window.removeEventListener('beforeunload', this.beforeUnload);
        }
    }

    beforeUnload = e => {
        e.preventDefault();
        let message = "If you leave, the uploading files will be lost!";
        e.returnValue = message;
        return message;
    }

    clearUploadingFiles = (e) => {
        setTimeout({}, 1000);
        if(!_.isEmpty(this.props.uploadingFiles)) {
            if(e) e.preventDefault();
            _.each(this.props.uploadingFiles, file => {
                this.props.updateFileState(file.id, 'DELETED');
                this.props.removeFromUploadingFiles(file.id);
            })
        }
    }

    checkEmailVerified = (user) => {
        if (!_.isEmpty(user)) {
            const { emailVerified } = auth().currentUser;
            this.setState({ emailVerified })
            this.props.getFileList();
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
        const another = this.state.isSent ? 'another' : ''
        return (
            <div>
                <UserHeader />
                <Container className='dashboard-container'>
                    {!this.state.emailVerified &&
                        <Alert variant='warning'>
                            {`We just sent ${another} verification email to ${user.email}! Refresh page after verifying your mail.`} <br />
                            {'If you do not recieve it in a few minutes, You can resend by clicking '} 
                            <Alert.Link onClick={this.resendVerificationEmail}>Here!</Alert.Link> 
                            {this.state.isSent === null && <Spinner size='sm' />}
                        </Alert>
                    }
                    <Row>
                        <Col lg="4" md="4" sm="6" xs="12">
                            <FileList emailVerified={this.state.emailVerified} />
                        </Col>
                        <Col lg="8" md="8" sm="6" xs="12">
                            <Transcription />
                        </Col>
                    </Row>
                </Container>
                <React.Fragment>
                    <Prompt
                        when={this.state.blockNavigation}
                        message='If you leave, the uplading file will be lost. Are you sure?'
                    />
                </React.Fragment>
            </div>
        );
    }
}

const mapStateToProps = ({ user, uploadingFiles }) => {
    return {
        user,
        uploadingFiles
    }
}

export default connect(mapStateToProps, { getFileList, updateFileState, removeFromUploadingFiles })(withRouter(Dashboard));