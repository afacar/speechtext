import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDatabase, faClock, faCalendar, faFileDownload, faCheckSquare } from '@fortawesome/free-solid-svg-icons';

import ExportPopup from '../components/export-popup';
import FileLogo from '../assets/default-file-image.png';
import firebase from '../utils/firebase';
import Utils from '../utils';
import { addFile, updateFile, updateFileState, updateFileInState, removeFromUploadingFiles, setUploadingFileProgress } from '../actions';
import Axios from 'axios';

class File extends Component {
    constructor(props) {
        super(props);

        this.state = {
            file: props.file,
            progress: undefined,
            paused: false,
            fileSrc: FileLogo
        }
    }

    downloadThumbnail() {
        const { file } = this.state;

        if (!file || !file.thumbnail) return;

        if (file.thumbnail.publicUrl) {
            this.setState({
                fileSrc: file.thumbnail.publicUrl
            })
        } else {
            var ref = firebase.storage().ref(file.thumbnail.filePath);
            ref.getDownloadURL().then((downloadUrl) => {
                Axios.get(downloadUrl)
                    .then((url) => {
                        this.setState({
                            fileSrc: url.config.url
                        })
                    });
            })
                .catch(error => {
                    // TODO: GET_DOWNLOAD_URL_ERROR
                    console.log(error);
                })
        }
    }

    componentDidMount() {
        this.downloadThumbnail();
        this.initUploadIfNecessary(this.props.file);
    }

    componentWillUpdate({ file, uploadingFiles }) {
        var fileObj = _.find(uploadingFiles, { id: file.id });
        if (file.status === 'UPLOADING' && !_.isEmpty(fileObj)) {
            // this.setState({
            //     progress: fileObj.progress
            // });
            return false;
        }
        return true;
    }

    componentWillReceiveProps({ file, uploadingFiles }) {
        this.initUploadIfNecessary(file, uploadingFiles);
    }

    initUploadIfNecessary = (file, uploadingFiles) => {
        var fileObj = _.find(uploadingFiles, { id: file.id });
        if (file.status === 'INITIAL' && !_.isEmpty(fileObj)) {
            file.file = fileObj.file;
            this.uploadFile(file);
            this.setState({
                progress: 0,
                paused: false
            });
        }
        var progress = this.state.progress;
        if (file.status === 'PROCESSING') {
            progress = file.transcribedFile ? file.transcribedFile.progress : 0;
        }
        this.setState({
            file,
            progress
        });
    }

    uploadFile = (file) => {
        var that = this;
        const { user } = this.props;
        const fileExtension = file.name.substr(file.name.lastIndexOf('.') + 1);
        var storageRef = firebase.storage().ref(`userfiles/${user.uid}/${file.id}/originalFile/${file.id}.${fileExtension}`);

        this.setState({ progress: 0 });

        var uploadTask = storageRef.put(file.file);
        // this.props.onSelected(this.props.index);

        file.status = 'UPLOADING';
        this.props.updateFileInState(file);
        uploadTask.on('state_changed', (snapshot) => {
            var progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
            this.props.setUploadingFileProgress(file.id, progress);
            that.setState({ progress });

            switch (snapshot.state) {
                case firebase.storage.TaskState.PAUSED:
                    break;
                case firebase.storage.TaskState.RUNNING:
                    break;
                default:
                    break;
            }
        }, (error) => {
            // TODO: UPLOAD_FILE_ERROR
            // List of Error codes for storage can be found at
            // https://firebase.google.com/docs/storage/web/handle-errors#handle_error_messages
            that.setState({ error })
        }, () => {
            uploadTask.snapshot.ref.getDownloadURL().then(async (downloadURL) => {
                that.setState({ progress: 100 });
                file.originalFile.filePath = uploadTask.location_.path_;
                file.originalFile.url = downloadURL;
                file = _.omit(file, 'file');
                file.status = 'UPLOADED';

                if (!_.isEmpty(this.props.selectedFileOptions)) {
                    file.options = this.props.selectedFileOptions;
                }

                this.props.removeFromUploadingFiles(file.id);
                await this.props.updateFile(file, { originalFile: file.originalFile });
                await this.props.updateFileState(file.id, 'UPLOADED');
            });
        });
        this.setState({
            uploadTask
        });
    }

    /* pauseUpload = () => {
        this.setState({
            paused: true
        });
        this.state.uploadTask.pause();
    } */

    /* resumeUpload = () => {
        this.setState({
            paused: false
        });
        this.state.uploadTask.resume();
    } */

    /* editFile = (e) => {
        e.preventDefault();
        this.props.editFile(this.state.file.index);
    } */

    /* transcribeFile = () => {
        var { file } = this.state;
        if (_.isEmpty(file.options) || !file.options.language) {
            this.props.onSelected(this.props.index);
        } else {
            this.props.updateFileState(file.id, 'READY');
        }
    } */

    getErrorMessage = (file) => {
        const { errorDefinitions } = this.props;
        if (file.status !== 'ERROR') return '';
        if (_.isEmpty(errorDefinitions) || _.isEmpty(file.error)) return "An error occured during transcription!";
        let error = _.find(errorDefinitions, { key: file.error.key });
        if (!_.isEmpty(error)) {
            return error.value;
        }
        return '';
    }

    getFileStatus = (status) => {
        const { progress } = this.state;
        console.log('status', status)
        switch (status) {
            case 'ERROR':
                return 'Error';
            case 'UPLOADING':
                return `Uploading (${progress}%)`
            case 'READY':
            case 'UPLOADED':
            case 'CONVERTING':
            case 'PROCESSING':
            case 'TRANSCRIBING':
                return 'Processing...';
            default:
                return '';
        }
    }

    getFileStatusClassName = (status) => {
        switch (status) {
            case 'ERROR':
                return 'error';
            case 'UPLOADED':
            case 'READY':
            case 'CONVERTING':
            case 'PROCESSING':
            case 'TRANSCRIBING':
                return 'processing';
            default:
                return '';
        }
    }

    deleteFile = (e) => {
        e.preventDefault();
        e.stopPropagation();

        // this.setState({ showSpinner: true });
        this.props.deleteFile(this.props.file.id);
    }

    openInEditor = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const { file } = this.props;
        if (file.status === 'DONE') {
            this.props.openInEditor(this.props.file.id);
        }
    }

    exportClicked = (e) => {
        e.preventDefault();
        e.stopPropagation();

        this.setState({ showExportPopup: true })
    }

    closeExportModal = (e) => {
        this.setState({ showExportPopup: false });
    }

    fileSelected = (e) => {
        console.log('fileSelected')
        this.props.onSelected(this.state.file);
    }

    render() {
        const { file, progress, fileSrc } = this.state;

        let duration = '';
        let size = '';
        let createDate = '';
        if (file && file.originalFile) {
            const { originalFile } = file;
            if (originalFile.originalDuration) {
                duration = Utils.formatTime(originalFile.originalDuration);
            }
            if (originalFile.size) {
                size = Utils.formatSizeByteToMB(originalFile.size) + ' MB';
            }
            if (originalFile.createDate) {
                createDate = Utils.formatDateSimpleFormat(originalFile.createDate);
            }
        }
        return (
            <div onClick={this.openInEditor} className={`file-container ${file.status === 'DONE' ? 'completed ' : ''}${this.props.isSelected ? 'active' : ''}`}>
                {
                    (this.state.showSpinner || this.props.showSpinner) &&
                    <span className='file-spinner'>
                        <Spinner animation="border" role="status" size='sm' variant='danger' />
                    </span>
                }
                <div className='file-image-container'>
                    <img src={fileSrc} alt={file.name + ' thumbnail'} />
                </div>
                <div className='file-body-container'>
                    <div className='file-header'>
                        {file.name}
                    </div>
                    <div className='file-body'>
                        <div>
                            <FontAwesomeIcon
                                icon={faDatabase}
                                title='File Size'
                                className='file-info-image'
                            />
                            {size}
                        </div>
                        <div>
                            <FontAwesomeIcon
                                icon={faClock}
                                title='File Duration'
                                className='file-info-image'
                            />
                            {duration}
                        </div>
                        <div>
                            <FontAwesomeIcon
                                icon={faCalendar}
                                title='File Size'
                                className='file-info-image'
                            />
                            {createDate}
                        </div>
                    </div>
                    <div className={`file-footer`}>
                        <div className='file-buttons'>
                            <div className='file-button' id='export' onClick={this.fileSelected}>
                                <FontAwesomeIcon
                                    icon={faCheckSquare}
                                    title='Select'
                                    className='file-info-image'
                                    style={{ color: 'teal' }}
                                />
                                Select
                            </div>
                            <div className='file-button' id='export' onClick={this.exportClicked}>
                                <FontAwesomeIcon
                                    icon={faFileDownload}
                                    title='Export'
                                    className='file-info-image'
                                    style={{ color: 'darkslateblue' }}
                                />
                                Export
                            </div>
                        </div>
                        <div className={`file-status ${this.getFileStatusClassName(file.status)}`}>
                            {
                                this.getFileStatus(file.status)
                            }
                        </div>
                    </div>
                </div>
                <ExportPopup
                    show={this.state.showExportPopup}
                    file={this.props.file}
                    closeModal={this.closeExportModal}
                />
            </div>
        )
    }
}

const mapStateToProps = ({ user, selectedFile, selectedFileOptions, uploadingFiles, errorDefinitions }) => {
    return {
        user,
        selectedFile,
        selectedFileOptions,
        uploadingFiles,
        errorDefinitions
    }
}

export default connect(mapStateToProps, { addFile, updateFile, updateFileState, updateFileInState, removeFromUploadingFiles, setUploadingFileProgress })(File);