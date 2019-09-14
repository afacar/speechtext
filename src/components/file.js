import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { Card, ProgressBar } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faEdit, faTrashAlt, faPause, faPlay
} from '@fortawesome/free-solid-svg-icons';
import firebase from '../utils/firebase';
import { updateFile } from '../actions';

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
        console.log(file);
        this.setState({
            file
        });
    }

    uploadFile = (file) => {
        var that = this;
        const { user } = this.props;
        const fileExtension = file.name.substr(file.name.lastIndexOf('.') + 1);
        var storageRef = firebase.storage().ref(`userfiles/${user.uid}/${file.id}/originalFile/${file.id}.${fileExtension}`);

        this.setState({ progress: 0 });

        var uploadTask = storageRef.put(file.file);

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
                    that.setState({ downloadURL, progress: 100 });
                    file.originalFile.url = downloadURL;
                    file = _.omit(file, 'file');
                    file.status = 'UPLOADED';
                    that.props.updateFile(file, {
                        status: 'UPLOADED',
                        originalFile: file.originalFile
                    });
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

    render() {
        return (
            <div className='file-container'>
                <Card>
                    <Card.Body>
                        { this.state.file.name }
                        <span className='file-settings'>
                            <FontAwesomeIcon icon={ faEdit } color='blue' className='edit'  onClick={ this.editFile } />
                            <FontAwesomeIcon icon={ faTrashAlt } color='red' onClick={ this.deleteFile } />
                        </span>
                        {
                            this.state.progress && this.state.progress < 100 &&
                            <div className={ `file-progress ${this.state.progress === 100 ? 'done' : ''}`}>
                                <ProgressBar striped={ this.state.progress !== 100 } now={ this.state.progress } />
                                {
                                    this.state.progress !== 100 && !this.state.paused &&
                                    <FontAwesomeIcon icon={ faPause } className='pause-play' onClick={ this.pauseUpload } />
                                }
                                {
                                    this.setState.progress !== 100 && this.state.paused &&
                                    <FontAwesomeIcon icon={ faPlay } className='pause-play'  onClick={ this.resumeUpload } />
                                }
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

export default connect(mapStateToProps, { updateFile })(File);