import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import Axios from 'axios';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import ContentEditable from 'react-contenteditable';
import { Media } from 'react-media-player';

import firebase from '../../utils/firebase';
import SpeechTextPlayer from '../../components/player';
import UploadOptions from '../../components/upload-options';

class Transcription extends Component {
    constructor(props) {
        super(props);

        this.state = {
            editorData: {},
            intervalHolder: undefined
        }
    }

    componentWillReceiveProps({ selectedFile }) {
        var that = this;
        var { intervalHolder } = this.state;
        clearInterval(intervalHolder);
        if(!_.isEmpty(selectedFile) && selectedFile.status === 'DONE') {
            this.setState({
                showSpinner: true
            })
            var storageRef = firebase.storage().ref(selectedFile.transcribedFile.filePath);
            storageRef.getDownloadURL().then((downloadUrl) => {
                Axios.get(downloadUrl)
                .then(({ data }) => {
                    that.formatResults(data);
                });
            });
        } else {
            this.setState({
                editorData: {},
                prevEditorData: {},
                intervalHolder: undefined,
                showSpinner: false
            })
        }
    }

    updateTranscribedFile = () => {
        const { editorData, prevEditorData } = this.state;
        const { selectedFile } = this.props;
        if(!_.isEqual(editorData, prevEditorData)) {
            this.setState({
                prevEditorData: editorData
            });
            const dataToUpload = editorData
                .map(({ startTime, endTime, text}) => {
                    return `${startTime} - ${endTime} \n ${text}---`;
                })
                .join('\n');
            var storageRef = firebase.storage().ref(selectedFile.transcribedFile.filePath);
            storageRef.put(new Blob([dataToUpload]));
        }
    }

    downloadAsTxt = () => {
        const { selectedFile } = this.props;
        const { editorData } = this.state;
        var textData = '';
        editorData.forEach(data => {
            if(data.startTime && data.endTime) {
                if(data.text) {
                    data.text = data.text.replace(/---/g, '');
                }
                textData += `${data.startTime} - ${data.endTime}\n${data.text}\n`;
            }
        });
    
        var fileName = selectedFile.name;
        fileName = fileName.substr(0, fileName.lastIndexOf('.')) + '.txt';
        
        const element = document.createElement("a");
        const file = new Blob([textData], {type: 'text/plain'});
        element.href = URL.createObjectURL(file);
        element.download = fileName;
        document.body.appendChild(element); // Required for this to work in FireFox
        element.click();
    }

    downloadAsDocx = () => {
        var { selectedFile } = this.props;

        var getDocxFile = firebase.functions().httpsCallable('getDocxFile');
        getDocxFile({ 
            fileId: selectedFile.id
        })
        .then(({ data }) => {
            var storageRef = firebase.storage().ref(data.filePath);
            var fileName = selectedFile.name;
            fileName = fileName.substr(0, fileName.lastIndexOf('.')) + '.docx';
            var newMetadata = {
                contentDisposition: `attachment;filename=${fileName}`
            }
            storageRef.updateMetadata(newMetadata)
            .then((metadata) => {
                storageRef.getDownloadURL().then((downloadUrl) => {
                    const element = document.createElement("a");
                    element.href = downloadUrl;
                    element.click();
                });
            })
        }).catch((err) => {
            console.log(err);
        });
    }

    formatResults = (data) => {
        var that = this;
        if(data) {
            var splittedData = data.split('---');
            if(!_.isEmpty(splittedData)) {
                var { intervalHolder } = this.state;
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
                if(intervalHolder) clearInterval(intervalHolder);
                intervalHolder = setInterval(() => {
                    that.updateTranscribedFile();
                }, 5000);
                this.setState({
                    editorData,
                    prevEditorData: editorData,
                    intervalHolder
                });
            }
        }
        this.setState({
            showSpinner: false
        })
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
                    <DropdownButton id="dropdown-item-button" title="Download" align='right' alignRight>
                        <Dropdown.Item as="button" onClick={ this.downloadAsTxt }>Text Document (.txt)</Dropdown.Item>
                        <Dropdown.Item as="button" onClick={ this.downloadAsDocx }>Word Document (.docx)</Dropdown.Item>
                    </DropdownButton>
                    <br />
                    { data }
                </div>
            );
        }
        return false;
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
        var prevEditorData = [];
        editorData = editorData.map((data) => {
            prevEditorData.push({...data});
            if(data.key === key) {
                data.text = value;
            }
            return data;
        });
        this.setState({
            editorData,
            prevEditorData,
            timeToSeek: undefined
        });
    }
    
    renderOptions = () => {
        const { editorData } = this.state;
        const { selectedFile } = this.props;
        if(_.isEmpty(editorData)) {
            if(!_.isEmpty(selectedFile) && selectedFile.status !== 'DONE') {
                return (
                    <UploadOptions
                        disabled={ selectedFile.status !== 'PROCESSING' }
                    />
                )
            }
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
                            type={ selectedFile.options ? selectedFile.options.type : '' }
                            timeToSeek={ this.state.timeToSeek }
                        />
                    </Media>
                </div>
                {
                    this.state.showSpinner &&
                    <div className="d-flex justify-content-center mt-5">
                        <div className="spinner-border" role="status">
                            <span className="sr-only">Loading...</span>
                        </div>
                    </div>
                }
                {
                    !this.state.showSpinner &&
                    <div className='transcription'>
                        { this.renderResults() }
                        { this.renderOptions() }
                    </div>
                }
            </div>
        );
    }
}

const mapStateToProps = ({ user, selectedFile }) => {
    return { user, selectedFile };
}

export default connect(mapStateToProps)(Transcription);