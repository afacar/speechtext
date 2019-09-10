import React, { Component } from 'react';
import { Card, ProgressBar } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faEdit, faTrashAlt, faPause, faPlay
} from '@fortawesome/free-solid-svg-icons';

class File extends Component {
    constructor(props) {
        super(props);

        this.state = {
            file: {},
            progress: 0,
            paused: false
        }
    }

    componentDidMount() {
        this.setState({
            file: this.props.file,
            progress: 65,
            paused: false
        });
    }

    pauseUpload = () => {
        this.setState({
            paused: true
        });
    }

    resumeUpload = () => {
        this.setState({
            paused: false
        });
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

export default File;