import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import _ from 'lodash';
import { injectIntl } from 'react-intl';
import { Row, Col, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloudUploadAlt, faEdit, faTrash, faCloudDownloadAlt } from '@fortawesome/free-solid-svg-icons';
import Alert from 'react-s-alert';

import firebase from '../../utils/firebase';
import { getFileList, addFile, setSelectedFile, addToUploadingFiles, updateFileState, removeFromUploadingFiles } from '../../actions';
import '../../styles/file.css';
import '../../styles/dashboard.css';

import File from '../../components/file';
import ApprovementPopup from '../../components/approvement-popup';
import UploadPopup from '../../components/upload-popup';
import ExportPopup from '../../components/export-popup';

class FileList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            files: [],
            selectedFiles: []
        }
    }

    componentWillReceiveProps({ files, uploadingFiles }) {
        if (!_.isEmpty(files)) {
            _.each(files, file => {
                if (file.status === 'INITIAL' && (_.isEmpty(uploadingFiles) || _.isEmpty(_.find(uploadingFiles, { 'id': file.id })))) {
                    this.props.updateFileState(file.id, 'DELETED');
                }
            })
        }
        if (!_.isEmpty(this.state.filterValue)) {
            files = _.filter(files, (file) => {
                return file.name.toLowerCase().indexOf(this.state.filterValue.toLowerCase()) > -1
            });
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
            // TODO: file duration check should be active for only existing users
            if (currentPlan.remainingMinutes <= 0) {
                that.setState({
                    selectedFileDuration: fileDurationInMinutes,
                    showApprovement: true
                });
            } else {
                this.onFileValidated(file, fileDurationInMinutes, media.duration);
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

    uploadClicked = () => {
        if (!_.isEmpty(this.props.uploadingFiles)) {
            Alert.error(this.props.intl.formatMessage({
                id: 'FileUpload.multipleFileError'
            }));
            return;
        }
        this.setState({
            showUploadPopup: true
        })
    }

    cancelFileUpload = () => {
        this.setState({
            selectedFileDuration: '',
            showApprovement: false,
            showUploadPopup: false
        });
    }

    closeFileUploadPopup = () => {
        this.setState({
            selectedFileDuration: '',
            showUploadPopup: false
        });
    }

    onFileValidated = async (file, fileDurationInMinutes, durationInNanoSeconds) => {
        var { name, size, type } = file;
        var fileObj = {
            originalFile: {
                name,
                size,
                duration: fileDurationInMinutes,
                originalDuration: durationInNanoSeconds,
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
            showUploadPopup: true,
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
                fileToUpload: undefined,
                selectedFile: undefined
            });
        }
    }

    onFileSelected = (file) => {
        const { selectedFiles } = this.state;
        if (!selectedFiles.includes(file.id)) {
            selectedFiles.push(file.id);
        } else {
            selectedFiles.splice(selectedFiles.indexOf(file.id), 1);
        }
        this.setState({
            selectedFiles
        })
        /* if (file.status === 'DONE') {
            // const { files } = this.state;
            // const selectedFile = files[index];
            // this.props.setSelectedFile(selectedFile);
            const { selectedFiles } = this.state;
            if (!selectedFiles.includes(file.id)) {
                selectedFiles.push(file.id);
            } else {
                selectedFiles.splice(selectedFiles.indexOf(file.id), 1);
            }
            this.setState({
                selectedFiles
            })
        } */
    }

    filterFiles = (e) => {
        let value = e.target.value;
        let { files } = this.state;
        if (_.isEmpty(value)) {
            files = this.props.files;
        } else {
            files = _.filter(files, function (file) {
                return file.name.toLowerCase().indexOf(value.toLowerCase()) > -1;
            });
        }
        this.setState({
            files,
            filterValue: value
        })
    }

    deleteFiles = (fileId) => {
        const filesToDelete = [];
        const { selectedFiles } = this.state;

        if (!_.isEmpty(fileId)) {
            filesToDelete.push(fileId);
        } else if (!_.isEmpty(selectedFiles)) {
            selectedFiles.forEach(fileId => {
                filesToDelete.push(fileId);
            });
        }

        this.setState({
            filesToDelete,
            showDeleteApprovement: true
        })
    }

    deleteFilesAfterApproval = () => {
        const { filesToDelete } = this.state;
        if (!_.isEmpty(filesToDelete)) {
            filesToDelete.forEach(fileId => {
                this.props.updateFileState(fileId, 'DELETED');
                this.props.removeFromUploadingFiles(fileId);
            });
        }
        this.setState({
            filesToDelete: [],
            showDeleteApprovement: false
        })
    }

    cancelFileDeletion = () => {
        this.setState({
            filesToDelete: [],
            showDeleteApprovement: false
        })
    }

    getSelectedFileToExport = () => {
        const { files, selectedFiles } = this.state;
        return _.find(files, { id: selectedFiles[0] });
    }

    openInEditor = (fileId) => {
        const { selectedFiles } = this.state;
        if (_.isEmpty(fileId)) {
            if (!_.isEmpty(selectedFiles) && selectedFiles.length === 1) {
                fileId = selectedFiles[0];
            }
        }
        if (!_.isEmpty(fileId)) {
            window.open(`/edit/${fileId}`, '_blank');
        }
    }

    render() {
        var { user } = this.props;
        const currentPlan = user.currentPlan || {};
        const { selectedFiles } = this.state;
        return (
            <div className='col-xs-12 col-md-11 col-lg-10 col-xl-9 align-self-center dasboard-content-container' >
                <div className='file-actions-container'>
                    <div className='file-actions-buttons'>
                        <Button onClick={this.uploadClicked} className='primary'>
                            <FontAwesomeIcon icon={faCloudUploadAlt} />
                            Transcribe Speech
                        </Button>
                        <Button disabled={selectedFiles.length !== 1} className='secondary' onClick={() => this.openInEditor()}>
                            <FontAwesomeIcon icon={faEdit} />
                            Open in Editor
                        </Button>
                        <Button disabled={selectedFiles.length !== 1} className='secondary' onClick={() => { this.setState({ showExportPopup: true }) }}>
                            <FontAwesomeIcon icon={faCloudDownloadAlt} />
                            Export
                        </Button>
                        <Button disabled={selectedFiles.length === 0} className='secondary' onClick={() => this.deleteFiles()}>
                            <FontAwesomeIcon icon={faTrash} />
                            Delete
                        </Button>
                    </div>
                    <div className='file-actions-search'>
                        <input
                            type='text'
                            placeholder='Type to Search'
                            onChange={this.filterFiles}
                        />
                    </div>

                </div>
                <div className='file-list-container'>
                    {
                        this.state.files.map((file, index) => {
                            // var isSelected = !_.isEmpty(this.props.selectedFile) ? this.props.selectedFile.id === file.id : false;
                            return (
                                <File
                                    key={file.id}
                                    file={file}
                                    index={index}
                                    onSelected={this.onFileSelected}
                                    isSelected={selectedFiles.includes(file.id)}
                                    deleteFile={this.deleteFiles}
                                    openInEditor={this.openInEditor}
                                />
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
                <UploadPopup
                    show={this.state.showUploadPopup}
                    file={this.state.fileToUpload}
                    language={this.props.language}
                    supportedLanguages={this.props.supportedLanguages}
                    approveFileUpload={this.approveFileUpload}
                    cancelFileUpload={this.cancelFileUpload}
                    closeFileUploadPopup={this.closeFileUploadPopup}
                    onFileAdded={this.onFileAdded}
                />
                <ExportPopup
                    show={this.state.showExportPopup}
                    file={this.getSelectedFileToExport()}
                    closeModal={() => this.setState({ showExportPopup: false })}
                />
                <ApprovementPopup
                    show={this.state.showDeleteApprovement}
                    headerText={{
                        id: 'File.Delete.Approval.title'
                    }}
                    bodyText={{
                        id: 'File.Delete.Approval.body'
                    }}
                    handleSuccess={this.deleteFilesAfterApproval}
                    handleCancel={this.cancelFileDeletion}
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

export default connect(mapStateToProps, { getFileList, addFile, setSelectedFile, addToUploadingFiles, updateFileState, removeFromUploadingFiles })(withRouter(injectIntl(FileList)));