import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { Card, ProgressBar, Button, Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faTrashAlt, faPause, faPlay
} from '@fortawesome/free-solid-svg-icons';
import firebase from '../utils/firebase';
import { addFile, updateFile, updateFileState, updateFileInState } from '../actions';

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

    componentWillReceiveProps({ file }) {
        this.initUploadIfNecessary(file);
    }

    initUploadIfNecessary = file => {
        if(file.status === 'INITIAL' && file.file) {
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
            that.setState({ progress });
        
            switch (snapshot.state) {
                case firebase.storage.TaskState.PAUSED: // or 'paused'
                    console.log('paused');
                    break;
                case firebase.storage.TaskState.RUNNING: // or 'running'
                    console.log('unpaused');
                    break;
                default:
                    break;
            }
            }, (error) => {
                console.log('upload error', error);
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

                    await that.props.addFile(file);
    
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
                            file.status === 'CONVERTED' &&
                            <div className='file-transcribe-button'>
                                <Button bgColor='orange' onClick={ this.transcribeFile }>
                                    Transcribe
                                </Button>
                            </div>
                        }
                    </Card.Body>
                </Card>
            </div>
        )
    }
}

const mapStateToProps = ({ user, selectedFile, selectedFileOptions }) => {
    return {
        user,
        selectedFile,
        selectedFileOptions
    }
}

export default connect(mapStateToProps, { addFile, updateFile, updateFileState, updateFileInState })(File);