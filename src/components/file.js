import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { Card, ProgressBar, Button, Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faTrashAlt, faPause, faPlay
} from '@fortawesome/free-solid-svg-icons';
import firebase from '../utils/firebase';
import { addFile, updateFile, updateFileState, updateFileInState, removeFromUploadingFiles, setUploadingFileProgress } from '../actions';
import { FormattedMessage } from 'react-intl';

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
        this.props.onSelected(this.props.index);

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
                    // that.props.updateFileState(file.id, 'UPLOADED');
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

    deleteFile = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const { file } = this.state;
        this.props.updateFileState(file.id, 'DELETED');
        this.props.removeFromUploadingFiles(file.id);
        this.setState({ showSpinner: true })
    }

    transcribeFile = () => {
        var { file } = this.state;
        if(_.isEmpty(file.options) || !file.options.language) {
            this.props.onSelected(this.props.index);
        } else {
            this.props.updateFileState(file.id, 'READY');
        }
    }

    render() {
        const { file, progress, paused, showSpinner } = this.state;
        return (
            <div className={ `file-container ${this.props.isSelected ? 'active' : ''}` }>
                <Card>
                    <Card.Body>
                        { file.name }
                        {
                            !showSpinner && file.status !== 'PROCESSING' &&
                            <span className='file-settings'>
                                {/* <FontAwesomeIcon icon={ faEdit } className='edit'  onClick={ this.editFile } /> */}
                                <FontAwesomeIcon icon={ faTrashAlt } className='delete' onClick={ this.deleteFile } />
                            </span>
                        }
                        {
                            showSpinner &&
                            <div className='float-right'>
                                <Spinner animation="border" role="status" size='sm' />
                            </div>
                        }
                        {
                            file.status !== 'DONE' && progress < 100 &&
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
                            </div>
                        }
                        {
                            (file.status === 'UPLOADED' || file.status ==='CONVERTING') &&
                            <div className='mt-2'>
                                <Spinner animation="border" role="status" size='sm' />
                                <span className='ml-2'>Processing...</span>
                            </div>
                        }
                        {
                            file.status === 'CONVERTED' &&
                            <div className='file-transcribe-button'>
                                <Button bg='orange' onClick={ this.transcribeFile }>
                                    <FormattedMessage id='File.Button.transcribe' />
                                </Button>
                            </div>
                        }
                    </Card.Body>
                </Card>
            </div>
        )
    }
}

const mapStateToProps = ({ user, selectedFile, selectedFileOptions, uploadingFiles }) => {
    return {
        user,
        selectedFile,
        selectedFileOptions,
        uploadingFiles
    }
}

export default connect(mapStateToProps, { addFile, updateFile, updateFileState, updateFileInState, removeFromUploadingFiles, setUploadingFileProgress })(File);