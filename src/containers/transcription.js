import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import Axios from 'axios';
import ContentEditable from 'react-contenteditable';
import { Media } from 'react-media-player';

import firebase from '../utils/firebase';
import SpeechTextPlayer from '../components/player';
import UploadOptions from '../components/upload-options';

class Transcription extends Component {
    constructor(props) {
        super(props);

        this.state = {
            editorData: {}
        }
    }

    componentWillReceiveProps({ selectedFile }) {
        var that = this;
        if(!_.isEmpty(selectedFile) && selectedFile.status === 'DONE') {
            const { user } = this.props;
            var storageRef = firebase.storage().ref(selectedFile.transcribedFile.filePath);
            storageRef.getDownloadURL().then((downloadUrl) => {
                Axios.get(downloadUrl)
                .then(({ data }) => {
                    that.formatResults(data);
                });
            });
        } else {
            this.setState({
                editorData: {}
            })
        }
    }

    formatResults = (data) => {
        if(data) {
            var splittedData = data.split('---');
            if(!_.isEmpty(splittedData)) {
                var editorData = []
                var i = 0;
                splittedData.forEach(line => {
                    var lines = line.split(' \n ');
                    var times = lines[0].split(' - ');
                    editorData.push({
                        key: i++,
                        startTime: times[0],
                        endTime: times[1],
                        text: lines[1]
                    });
                });
                this.setState({
                    editorData
                });
            }
        }
    }

    renderResults = () => {
        const { editorData } = this.state;
        if(!_.isEmpty(editorData)) {
            var data = editorData.map((data, index) => {
                if(data.startTime && data.endTime) {
                    return (
                        <div className='conversionResult' key={ index } onClick={ () => this.transcriptionClicked(index) } >
                            <ContentEditable
                                className='conversionTime'
                                html={ data.startTime + ' - ' + data.endTime } // innerHTML of the editable div
                                disabled={ true } // use true to disable edition
                            />
                            <ContentEditable
                                html={ data.text } // innerHTML of the editable div
                                disabled={ false } // use true to disable edition
                                onChange={ (e) => { this.handleChange(data.key, e.target.value) }} // handle innerHTML change
                            />
                            <br />
                        </div>
                    )
                }
            });
            return (
                <div className=''>
                    { data }
                </div>
            );
        }
    }

    transcriptionClicked = (index) => {
        const { editorData } = this.state;
        let selectedRow = editorData[index];
        let splittedTime = selectedRow.startTime.trim().split(':');
        var timeToSeek = 0;
        if(splittedTime.length === 3) {
            timeToSeek += parseInt(splittedTime[0] * 3600);
            timeToSeek += parseInt(splittedTime[1] * 60);
            timeToSeek += parseInt(splittedTime[2]);
        } else if(splittedTime.length === 2) {
            timeToSeek += parseInt(splittedTime[0] * 60);
            timeToSeek += parseInt(splittedTime[1]);
        }
        this.setState({
            timeToSeek
        }, () => {
            this.setState({
                timeToSeek: undefined
            })
        });
    }

    handleChange = (key, value) => {
        var { editorData } = this.state;
        editorData = editorData.map((data) => {
            if(data.key === key) {
                data.text = value;
            }
            return data;
        });
        this.setState({
            editorData,
            timeToSeek: undefined
        });
    }
    
    renderOptions = () => {
        const { selectedFile } = this.props;
        if(!_.isEmpty(selectedFile) && selectedFile.status !== 'DONE') {
            return (
                <UploadOptions
                    disabled={ selectedFile.status !== 'PROCESSING' }
                />
            )
        }
    }

    render() {
        var { selectedFile } = this.props;
        if(_.isEmpty(selectedFile)) selectedFile = {};
        return (
            <div className='transcription-container'>
                <div className='transcription-title'>
                    <div className='selected-file-name'>
                        { selectedFile.name }
                    </div>
                    <Media>
                        <SpeechTextPlayer
                            key={ selectedFile.id }
                            src={ selectedFile.status === 'DONE' ? selectedFile.originalFile.url : '' }
                            timeToSeek={ this.state.timeToSeek }
                        />
                    </Media>
                </div>
                <div className='transcription'>
                    { this.renderResults() }
                    { this.renderOptions() }
                </div>
            </div>
        );
    }
}

const mapStateToProps = ({ user, selectedFile }) => {
    return { user, selectedFile };
}

export default connect(mapStateToProps)(Transcription);