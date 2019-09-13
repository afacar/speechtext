import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Card, ProgressBar } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faEdit, faTrashAlt, faPause, faPlay
} from '@fortawesome/free-solid-svg-icons';
import firebase from '../utils/firebase';

class File extends Component {
    constructor(props) {
        super(props);
        console.log(props.file.name);
        this.state = {
            file: {},
            progress: 0,
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
        }
        this.setState({
            file: this.props.file,
            progress: 0,
            paused: false
        });
    }

    uploadFile = (file) => {
        var that = this;
        const { user } = this.props;
        const fileExtension = file.name.substr(file.name.lastIndexOf('.'));
        var storageRef = firebase.storage().ref(`files/${user.uid}/${file.id}.${fileExtension}`);

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

    render() {
        return (
            <div className='file-container'>
                <Card>
                    <Card.Body>
                        { this.props.file.name }
                        <span className='file-settings'>
                            <FontAwesomeIcon icon={ faEdit } color='blue' className='edit' />
                            <FontAwesomeIcon icon={ faTrashAlt } color='red' onClick={ () => this.props.deleteFile(this.state.file.index) } />
                        </span>
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

export default connect(mapStateToProps)(File);