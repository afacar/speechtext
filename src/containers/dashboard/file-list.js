import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import _ from 'lodash';
import firebase from '../../utils/firebase';
import { getFileList, setFileToUpload, setSelectedFile } from '../../actions';

import Dropzone from '../../components/dropzone';
import File from '../../components/file';
import ApprovementPopup from '../../components/approvement-popup';

class FileList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            files: []
        }
    }

    componentWillReceiveProps({ files }) {
        this.setState({
            files
        });
    }

    onFileAdded = async (file) => {
        var that = this;
        var media = document.createElement(file.type.startsWith('audio') ? 'audio' : 'video');
        media.onloadedmetadata = () => {
            const { currentPlan } = this.props.user;
            console.log('onFileAdded media:', media);
            let fileDurationInSeconds = parseInt(media.duration);
            let fileDurationInMinutes = Math.ceil(fileDurationInSeconds / 60);
            if(currentPlan.remainingMinutes - fileDurationInMinutes < 0) {
                that.setState({
                    selectedFileDuration: fileDurationInMinutes + ' min(s)',
                    showApprovement: true
                });
            } else {
                this.onFileValidated(file, fileDurationInMinutes);
            }
        };
        media.src = URL.createObjectURL(file);
    }

    goToPayment = () => {
        this.setState({
            selectedFileDuration: '',
            showApprovement: false
        });
        this.props.history.push('/user#payment');
    }

    cancelFileUpload = () => {
        this.setState({
            selectedFileDuration: '',
            showApprovement: false
        });
    }

    onFileValidated = async (file, fileDurationInMinutes) => {
        console.log('onFileValidated file: ', file);
        var { name, size, type } = file;
        var fileObj = {
            originalFile: {
                name,
                size,
                duration: fileDurationInMinutes,
                createDate: new Date()
            },
            options: {
                type
            },
            name,
            status: 'INITIAL'
        }

        const { id } = await firebase.firestore().collection('userfiles').doc(this.props.user.uid).collection('files').doc();
        fileObj.file = file;
        fileObj.id = id;

        this.props.setFileToUpload(fileObj);
        this.props.setSelectedFile(fileObj);
    }

    onFileSelected = (index) => {
        const { files } = this.state;
        const selectedFile = files[index];
        this.props.setSelectedFile(selectedFile);
    }

    render() {
        var { user } = this.props;
        const currentPlan = user.currentPlan || {};
        return (
            <div>
                <Dropzone onFileAdded={ this.onFileAdded } />
                <div className='file-list-container'>
                    {
                        this.props.files.map((file, index) => {
                            var isSelected = !_.isEmpty(this.props.selectedFile) ? this.props.selectedFile.id === file.id : false;
                            return (
                                <div onClick={ () => { this.onFileSelected(index) } } key={ file.id }>
                                    <File
                                        key={ file.id }
                                        file={ file }
                                        index={ index }
                                        onSelected={ this.onFileSelected }
                                        isSelected={ isSelected }
                                    />
                                </div>
                            )
                        })
                    }
                </div>
                <ApprovementPopup
                    show={ this.state.showApprovement }
                    headerText='Time Limit Reached'
                    bodyText='You do not have enough credits to upload this file'
                    bodySubText={
                        <sub>
                            <b>Remaining Minutes:</b> { currentPlan.remainingMinutes } <br /><b>File Duration: </b> { this.state.selectedFileDuration }
                        </sub>
                    }
                    handleSuccess={ this.goToPayment }
                    successButtonVariant='primary'
                    successButtonText='Go to Payment'
                    handleCancel={ this.cancelFileUpload }
                />
            </div>
        )
    }
}

const mapStateToProps = ({ user, userFiles, selectedFile }) => {
    return {
        user,
        files: userFiles,
        selectedFile
    }
}

export default connect(mapStateToProps, { getFileList, setFileToUpload, setSelectedFile })(withRouter(FileList));