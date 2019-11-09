import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import _ from 'lodash';
import firebase from '../../utils/firebase';
import { getFileList, addFile, setSelectedFile, addToUploadingFiles, updateFileState, removeFromUploadingFiles } from '../../actions';

import Dropzone from '../../components/dropzone';
import File from '../../components/file';
import ApprovementPopup from '../../components/approvement-popup';
import UploadOptions from '../../components/upload-options';

class FileList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            files: []
        }
    }

    componentWillReceiveProps({ files, uploadingFiles }) {
        if(!_.isEmpty(files)) {
            _.each(files, file => {
                if((file.status === 'INITIAL' || file.status === 'UPLOADING') && (_.isEmpty(uploadingFiles) || _.isEmpty(_.find(uploadingFiles, { 'id': file.id })))) {
                    this.props.updateFileState(file.id, 'DELETED');
                }
            })
        }
        this.setState({
            files
        });
    }

    onFileAdded = async (file) => {
        if (!this.props.emailVerified) {
            console.log('file-list onFileAdded emailNotVerified so returns;');
            return;
        }
        var that = this;
        var media = document.createElement(file.type.startsWith('audio') ? 'audio' : 'video');
        media.onloadedmetadata = () => {
            const { currentPlan } = this.props.user;
            let fileDurationInSeconds = parseInt(media.duration);
            let fileDurationInMinutes = Math.ceil(fileDurationInSeconds / 60);
            if (currentPlan.remainingMinutes - fileDurationInMinutes < 0) {
                that.setState({
                    selectedFileDuration: fileDurationInMinutes,
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
            showApprovement: false,
            showUploadOptions: false
        });
    }

    onFileValidated = async (file, fileDurationInMinutes) => {
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
        fileObj.id = id;
        this.setState({
            showUploadOptions: true,
            fileToUpload: fileObj,
            selectedFile: file
        })
    }

    approveFileUpload = (options) => {
        var { fileToUpload, selectedFile } = this.state;
        if (fileToUpload && selectedFile) {
            fileToUpload.options = Object.assign({}, fileToUpload.options, options);

            this.props.addFile(fileToUpload);

            fileToUpload.file = selectedFile;
            this.props.addToUploadingFiles(fileToUpload.id, selectedFile);
            this.props.setSelectedFile(fileToUpload);
            this.setState({
                showUploadOptions: false,
                fileToUpload: undefined,
                selectedFile: undefined
            });
        }
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
                <Dropzone onFileAdded={this.onFileAdded} />
                <div className='file-list-container'>
                    {
                        this.props.files.map((file, index) => {
                            var isSelected = !_.isEmpty(this.props.selectedFile) ? this.props.selectedFile.id === file.id : false;
                            return (
                                <div onClick={() => { this.onFileSelected(index) }} key={file.id}>
                                    <File
                                        key={file.id}
                                        file={file}
                                        index={index}
                                        onSelected={this.onFileSelected}
                                        isSelected={isSelected}
                                    />
                                </div>
                            )
                        })
                    }
                </div>
                <ApprovementPopup
                    show={this.state.showApprovement}
                    headerText={{
                        id: 'FileUpload.timeLimit.title'
                    }}
                    bodyText={{
                        id: 'FileUpload.timeLimit.body'
                    }}
                    bodySubText={{
                        id: 'FileUpload.timeLimit.bodySubText',
                        values: {
                            remainingMinutes: currentPlan.remainingMinutes,
                            selectedFileDuration: this.state.selectedFileDuration
                        }
                    }}
                    handleSuccess={this.goToPayment}
                    successButtonVariant='primary'
                    successButton={{
                        id: 'FileUpload.timeLimit.goToPayment'
                    }}
                    cancelButton={{
                        id: 'FileUpload.timeLimit.cancel'
                    }}
                    handleCancel={this.cancelFileUpload}
                />
                <UploadOptions
                    show={this.state.showUploadOptions}
                    file={this.state.fileToUpload}
                    language={this.props.language}
                    supportedLanguages={this.props.supportedLanguages}
                    approveFileUpload={this.approveFileUpload}
                    cancelFileUpload={this.cancelFileUpload}
                />
            </div>
        )
    }
}

const mapStateToProps = ({ user, userFiles, selectedFile, language, supportedLanguages, uploadingFiles }) => {
    return {
        user,
        language,
        supportedLanguages,
        files: userFiles,
        selectedFile,
        uploadingFiles
    }
}

export default connect(mapStateToProps, { getFileList, addFile, setSelectedFile, addToUploadingFiles, updateFileState, removeFromUploadingFiles })(withRouter(FileList));