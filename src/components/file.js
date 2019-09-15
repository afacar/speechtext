import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { Card, ProgressBar, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faEdit, faTrashAlt, faPause, faPlay
} from '@fortawesome/free-solid-svg-icons';
import firebase from '../utils/firebase';
import { updateFile, updateFileState } from '../actions';

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
        if(file.file) {
            this.uploadFile(file);
            this.setState({
                progress: 0,
                paused: false
            });
        }
        var progress = this.state.progress;
        if(file.status === 'PROCESSING') {
            progress = file.transcribedFile.progress;
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
        uploadTask.on('state_changed', (snapshot) => {
            var progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
            that.setState({ progress });
        
            switch (snapshot.state) {
                case firebase.storage.TaskState.PAUSED: // or 'paused'
                    console.log('paused');
                case firebase.storage.TaskState.RUNNING: // or 'running'
                    console.log('unpaused');
                default:
                    break;
            }
            }, (error) => {
                console.log('upload error', error);
                that.setState({ error })
            }, () => {
                uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                    that.setState({ progress: 100 });
                    file.originalFile.filePath = uploadTask.location_.path_;
                    file.originalFile.url = downloadURL;
                    file = _.omit(file, 'file');
                    that.props.updateFile(file, {
                        originalFile: file.originalFile
                    });
    
                    that.props.updateFileState(file.id, 'UPLOADED');
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
        this.props.deleteFile(this.state.file.index);
    }

    transcribeFile = () => {
        var { file } = this.state;
        if(_.isEmpty(file.options) || !file.options.language) {
            this.props.onSelected(this.props.index);
        }
    }

    render() {
        const { file, progress, paused } = this.state;
        return (
            <div className={ `file-container ${this.props.isSelected ? 'active' : ''}` }>
                <Card>
                    <Card.Body>
                        { file.name }
                        <span className='file-settings'>
                            {/* <FontAwesomeIcon icon={ faEdit } className='edit'  onClick={ this.editFile } /> */}
                            <FontAwesomeIcon icon={ faTrashAlt } className='delete' onClick={ this.deleteFile } />
                        </span>
                        {
                            progress < 100 &&
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
                            file.status === 'CONVERTED' && !file.options.autoTranscribe &&
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

const mapStateToProps = ({ user }) => {
    return {
        user
    }
}

export default connect(mapStateToProps, { updateFile, updateFileState })(File);