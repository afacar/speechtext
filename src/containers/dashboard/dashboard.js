import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, Prompt } from 'react-router';
import _ from 'lodash';

import { getFileList, updateFileState, removeFromUploadingFiles, login } from '../../actions';
import DashboardHeader from '../dashboard-header';
import FileList from './file-list';
import Utils from '../../utils';
import '../../styles/dashboard.css';

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
        if (!_.isEmpty(this.props.user)) this.props.getFileList();
    }

    componentWillReceiveProps({ user }) {
        if (_.isEmpty(this.props.user) && !_.isEmpty(user)) {
            //this.checkEmailVerified(user);
            this.props.getFileList();
        }
    }

    componentDidUpdate() {
        if (!this.state.blockNavigation && !_.isEmpty(this.props.uploadingFiles)) {
            this.setState({
                blockNavigation: true
            });
            window.addEventListener('beforeunload', this.beforeUnload);
        } else if (this.state.blockNavigation && _.isEmpty(this.props.uploadingFiles)) {
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
        setTimeout(() => { }, 1000);
        if (!_.isEmpty(this.props.uploadingFiles)) {
            if (e) e.preventDefault();
            _.each(this.props.uploadingFiles, file => {
                this.props.updateFileState(file.id, 'DELETED');
                this.props.removeFromUploadingFiles(file.id);
            })
        }
    }

    /*     checkEmailVerified = (user) => {
            if (!_.isEmpty(user)) {
                const { emailVerified } = user;
                this.setState({ emailVerified })
                this.props.getFileList();
            }
        } */

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
        //const { user } = this.props;
        //const verification = `Check [${user.email}], verify your email then refresh this page.`
        return (
            <div className='dashboard-container'>
                <DashboardHeader />
                <FileList emailVerified={this.state.emailVerified} />

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

export default connect(mapStateToProps, { getFileList, updateFileState, removeFromUploadingFiles, login })(withRouter(Dashboard));