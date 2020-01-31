import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { Card, ProgressBar, Dropdown, Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDatabase, faClock, faCalendar } from '@fortawesome/free-solid-svg-icons';

import ExportPopup from '../components/export-popup';
import FileLogo from '../assets/default-file-thumbnail.png';
import {
    faTrashAlt, faPause, faPlay
} from '@fortawesome/free-solid-svg-icons';
import firebase from '../utils/firebase';
import Utils from '../utils';
import { addFile, updateFile, updateFileState, updateFileInState, removeFromUploadingFiles, setUploadingFileProgress } from '../actions';

class File extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            file: props.file,
            progress: undefined,
            paused: false
        }
    }

    componentDidMount() {
        this.initUploadIfNecessary(this.props.file);
    }

    componentWillUpdate({ file, uploadingFiles }) {
        var fileObj = _.find(uploadingFiles, { id: file.id });
        if(file.status === 'UPLOADING' && !_.isEmpty(fileObj)) {
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
        if(file.status === 'INITIAL' && !_.isEmpty(fileObj)) {
            file.file = fileObj.file;
            this.uploadFile(file);
            this.setState({
                progress: 0,
                paused: false
            });
        }
        var progress = this.state.progress;
        if(file.status === 'PROCESSING') {
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
                    
                    if(!_.isEmpty(this.props.selectedFileOptions)) {
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

    pauseUpload = () => {
        this.setState({
            paused: true
        });
        this.state.uploadTask.pause();
    }

    resumeUpload = () => {
        this.setState({
            paused: false
        });
        this.state.uploadTask.resume();
    }

    editFile = (e) => {
        e.preventDefault();
        this.props.editFile(this.state.file.index);
    }

    transcribeFile = () => {
        var { file } = this.state;
        if(_.isEmpty(file.options) || !file.options.language) {
            this.props.onSelected(this.props.index);
        } else {
            this.props.updateFileState(file.id, 'READY');
        }
    }

    getErrorMessage = (file) => {
        const { errorDefinitions } = this.props;
        if(file.status !== 'ERROR') return '';
        if(_.isEmpty(errorDefinitions) || _.isEmpty(file.error)) return "An error occured during transcription!";
        let error = _.find(errorDefinitions, { key: file.error.key });
        if(!_.isEmpty(error)) {
            return error.value;
        }
        return '';
    }

    formatTime = (time) => {
        let seconds = Math.floor(time % 60);
        let minutes = Math.floor(time / 60);
        let hours = Math.floor(minutes / 60)
        if(hours > 0) {
            minutes = Math.floor(minutes % 60);
        }
        if(hours < 10) hours = `0${hours}`;
        if(minutes < 10) minutes = `0${minutes}`;
        if(seconds < 10) seconds = `0${seconds}`;
        if(!hours) hours = '00';
        if(!minutes) minutes = '00';
        if(!seconds) seconds = '00';
        return `${hours}:${minutes}:${seconds}`;
    }

    formatSize = (size) => {
        return (size / 1000000).toFixed(2);
    }

    getFileStatus = (status) => {
        switch(status) {
            case 'ERROR':
                return 'Error';
            case 'CONVERTING':
            case 'PROCESSING':
            case 'TRANSCRIBING':
                return 'Processing...';
            default:
                return '';
        }
    }

    getFileStatusClassName = (status) => {
        switch(status) {
            case 'ERROR':
                return 'error';
            case 'CONVERTING':
            case 'PROCESSING':
            case 'TRANSCRIBING':
                return 'processing';
            default:
                return '';
        }
    }

    deleteFile = () => {
        this.setState({ showSpinner: true });
        this.props.deleteFile(this.props.file.id);
    }

    openInEditor = () => {
        this.props.openInEditor(this.props.file.id);
    }

    showDropdownMenu = (e) => {
        e.stopPropagation();
        this.setState({
            showDropdownMenu: true
        })
    }

    hideDropdownMenu = (e) => {
        e.stopPropagation();
        this.setState({
            showDropdownMenu: false
        })
    }

    renderDropdown = () => {
        const { file } = this.props;
        return (
            <div>
                <ul
                    className='dropbtn icons btn-right'
                    onClick={ this.showDropdownMenu }
                    onMouseEnter={ this.showDropdownMenu }
                    onMouseLeave={ this.hideDropdownMenu }
                >
                    <li></li>
                    <li></li>
                    <li></li>
                    <Dropdown.Menu
                        show={ this.state.showDropdownMenu }
                    >
                        <Dropdown.Item eventKey="1" onClick={ this.openInEditor }>Edit</Dropdown.Item>
                        <Dropdown.Item eventKey="2" onClick={ () => this.setState({ showExportPopup: true}) }>Export</Dropdown.Item>
                        <Dropdown.Item eventKey="3" onClick={ this.deleteFile }>Delete</Dropdown.Item>
                    </Dropdown.Menu>
                </ul>
            </div>
        )
    }

    render() {
        const { file, progress, paused, showSpinner } = this.state;

        let errorText = this.getErrorMessage(file);
        let fileSrc = FileLogo;
        let fileImageContainerClass = 'file-image-container';
        if(file && file.thumbnail && file.thumbnail.publicUrl) {
            fileSrc = file.thumbnail.publicUrl;
        } else {
            fileImageContainerClass += ' default';
        }

        let duration = '';
        let size = '';
        let createDate = '';
        if(file && file.originalFile) {
            const { originalFile } = file;
            if(originalFile.originalDuration) {
                duration = this.formatTime(originalFile.originalDuration);
            }
            if(originalFile.size) {
                size = this.formatSize(originalFile.size) + ' MB';
            }
            if(originalFile.createDate) {
                createDate = Utils.formatDateSimpleFormat(originalFile.createDate);
            }
        }
        return (
            <div className={ `file-container ${ file.status === 'DONE' ? 'completed ' : ''}${this.props.isSelected ? 'active' : ''}` }>
                {
                    (this.state.showSpinner || this.props.showSpinner) &&
                    <span className='file-spinner'>
                        <Spinner animation="border" role="status" size='sm' variant='danger' />
                    </span>
                }
                {
                    file.status === 'DONE' &&
                    <span class= { `checkmark ${this.props.isSelected ? 'active' : ''}` }>
                        <div class="circle"></div>
                        <div class="stem"></div>
                        <div class="kick"></div>
                    </span>
                }
                <div className={ fileImageContainerClass }>
                    <Card.Img variant="left" src={ fileSrc } alt={ file.name + ' thumbnail' } />
                </div>
                <div className='file-body-container'>
                    {
                        file.status === 'DONE' &&
                        this.renderDropdown()
                    }
                    <div className='file-header'>
                        <label title={ file.name }>{ file.name }</label>
                    </div>
                    <div className='file-body'>
                        <FontAwesomeIcon 
                            icon={ faDatabase } 
                            title='File Size'
                            className='file-info-image' size="x" />
                        { size }
                        <br />
                        <FontAwesomeIcon 
                            icon={ faClock } 
                            title='File Duration' 
                            className='file-info-image' size="x" />
                        { duration }
                        <br />
                        <FontAwesomeIcon 
                            icon={ faCalendar } 
                            title='File Size' 
                            className='file-info-image' size="x" />
                        { createDate }
                        {
                            file.status === 'UPLOADING' && progress < 100 &&
                            <div className={ 'file-progress' }>
                                <span>{ 'Uploading...' }</span>
                                <ProgressBar striped now={ progress } />
                            </div>
                        }
                    </div>
                </div>
                <div className={ `file-footer ${this.getFileStatusClassName(file.status)}` }>
                    <span>
                        {
                            this.getFileStatus(file.status)
                        }
                    </span>
                </div>
                <ExportPopup
                    show={ this.state.showExportPopup }
                    file={ this.props.file }
                    closeModal={ () => this.setState({ showExportPopup: false}) }
                />
                    {
                        // !showSpinner && file.status !== 'PROCESSING' &&
                        // <span className='file-settings'>
                        //     {/* <FontAwesomeIcon icon={ faEdit } className='edit'  onClick={ this.editFile } /> */}
                        //     <FontAwesomeIcon icon={ faTrashAlt } className='delete' onClick={ this.deleteFile } />
                        // </span>
                    }
                    {/* {
                        showSpinner &&
                        <div className='float-right'>
                            <Spinner animation="border" role="status" size='sm' />
                        </div>
                    } */}
                    {/* {
                        file.status !== 'DONE' && file.status !== 'ERROR' && progress < 100 &&
                        <div className={ 'file-progress' }>
                            <span>{file.status === 'PROCESSING' ? 'Transcribing...' : 'Uploading...'}</span>
                            <ProgressBar striped now={ progress } className={file.status === 'PROCESSING' ? 'transcribe-progress' : ''} />
                            {
                                file.status !== 'PROCESSING' && !paused &&
                                <FontAwesomeIcon icon={ faPause } className='pause-play' onClick={ this.pauseUpload } />
                            }
                            {
                                file.status !== 'PROCESSING' && paused &&
                                <FontAwesomeIcon icon={ faPlay } className='pause-play'  onClick={ this.resumeUpload } />
                            }
                        </div>file.
                    } */}
                    {/* {
                        (file.status === 'UPLOADED' || file.status ==='CONVERTING') &&
                        <div className='mt-2'>
                            <Spinner animation="border" role="status" size='sm' />
                            <span className='ml-2'>Processing...</span>
                        </div>
                    }
                    {
                        file.status === 'ERROR' &&
                        <div className='file-error-text'>
                            { !_.isEmpty(errorText) ? errorText : 'An error occured during transcription!' }
                        </div>
                    } */}
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