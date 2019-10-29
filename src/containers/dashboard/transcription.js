import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import Axios from 'axios';
import { Dropdown, DropdownButton, Spinner } from 'react-bootstrap';
import ContentEditable from 'react-contenteditable';
import { Media } from 'react-media-player';
import { FormattedMessage, injectIntl } from 'react-intl';

import firebase from '../../utils/firebase';
import SpeechTextPlayer from '../../components/player';
import UploadOptions from '../../components/upload-options';
import SpeechTextEditor from '../../components/speech-text-editor';

class Transcription extends Component {
    constructor(props) {
        super(props);

        this.state = {
            editorData: {},
            intervalHolder: undefined
        }
    }

    componentWillReceiveProps = async ({ selectedFile }) => {
        var that = this;
        var { intervalHolder } = this.state;
        clearInterval(intervalHolder);
        if(!_.isEmpty(selectedFile) && selectedFile.status === 'DONE') {
            this.setState({
                showSpinner: true
            })

            const fileId = selectedFile.id;
            const uid = this.props.user.uid;
            const docPath = `userfiles/${uid}/files/${fileId}/result/transcription`;
            console.log('Getting doc at:', docPath)
            let dataSnapshot = await firebase.firestore().doc(docPath).get();

            if(dataSnapshot) {
                this.setState({
                    newEditorData: dataSnapshot.data()
                })
            }

            var storageRef = firebase.storage().ref(selectedFile.transcribedFile.filePath);
            storageRef.getDownloadURL().then((downloadUrl) => {
                Axios.get(downloadUrl)
                .then(({ data }) => {
                    that.formatResults(data);
                });
            })
            .catch(error => {
                // TODO: GET_DOWNLOAD_URL_ERROR
                console.log(error);
            })
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
            storageRef.put(new Blob([dataToUpload]))
                .then(snapshot => console.log('File uploaded', snapshot))
                .catch(error => {
                    // TODO: UPDATE_TRANSCRIBED_FILE_ERROR
                    console.log(error);
                });
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
        var that = this;
        var { selectedFile } = this.props;
        this.setState({ showDownloadSpinner: true });
        
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
                    this.setState({ showDownloadSpinner: false });
                });
            })
        }).catch((err) => {
            // TODO: GET_DOCX_FILE_ERROR
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

    handleWordChange = (index, wordIndex, text) => {
        var { newEditorData } = this.state;
        newEditorData.results[index].alternatives[0].words[wordIndex].word = text;
        this.setState({
            editedData:{
                index, wordIndex, text
            }
        })
    }

    renderResultsPlus = (editorData) => {
        return (
            <SpeechTextEditor
                editorData={ editorData }
                handleWordChange={ this.handleWordChange }
                suppressContentEditableWarning
                playerTime={ this.state.playerTime }
                editorClicked={ this.editorClicked }
            />
        );
    }

    renderResults = () => {
        const { editorData, selectedTextIndex, newEditorData } = this.state;
        if(!_.isEmpty(editorData)) {
            const { formatMessage } = this.props.intl;
            var data = editorData.map((data, index) => {
                if(!_.isEmpty(data.startTime) && !_.isEmpty(data.endTime)) {
                    return (
                        <div className='conversionResult' key={ index } onClick={ () => this.transcriptionClicked(index) } >
                            <ContentEditable
                                className='conversionTime'
                                html={ data.startTime + ' - ' + data.endTime } // innerHTML of the editable div
                                disabled={ true } // use true to disable edition
                            />
                            <ContentEditable
                                ref={ (r) => { if(index === selectedTextIndex) this.currentEditableText = r }}
                                id={ 'editable-content-' + index }
                                html={ data.text } // innerHTML of the editable div
                                disabled={ false } // use true to disable edition
                                onChange={ (e) => { this.handleChange(data.key, e.target.value) }} // handle innerHTML change
                            />
                            <br />
                        </div>
                    )
                }
            });
            if(!_.isEmpty(newEditorData) && !_.isEmpty(newEditorData.results)) {
                data = this.renderResultsPlus(newEditorData.results);
            }

            return (
                <div className=''>
                    <div className='d-flex flex-col justify-content-end align-items-center'>
                        {
                            this.state.showDownloadSpinner &&
                            <Spinner
                                as="span"
                                animation="border"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                                className='margin-right-5'
                            />
                        }
                        <DropdownButton id="dropdown-item-button" title={ formatMessage({ id:'Transcription.Download.text' })}>
                            <Dropdown.Item as="button" onClick={ this.downloadAsTxt }>
                                <FormattedMessage id='Transcription.Download.option1' />
                            </Dropdown.Item>
                            <Dropdown.Item as="button" onClick={ this.downloadAsDocx }>
                                <FormattedMessage id='Transcription.Download.option2' />
                            </Dropdown.Item>
                        </DropdownButton>
                    </div>
                    <br />
                    { data }
                </div>
            );
        }
        return false;
    }

    editorClicked = (seconds) => {
        this.setState({
            timeToSeek: seconds
        }, () => {
            this.setState({
                timeToSeek: undefined
            })
        })
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

    getFormattedTimeInSeconds = (startTime) => {
        var splittedTime = startTime.trim().split(':');
        var timeInSeconds = 0;
        if(splittedTime.length === 3) {
            timeInSeconds += parseInt(splittedTime[0] * 3600);
            timeInSeconds += parseInt(splittedTime[1] * 60);
            timeInSeconds += parseInt(splittedTime[2]);
        } else if(splittedTime.length === 2) {
            timeInSeconds += parseInt(splittedTime[0] * 60);
            timeInSeconds += parseInt(splittedTime[1]);
        }
        return timeInSeconds;
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
    
    handleTimeChange = (currentTime) => {
        // currentTime: 19.478
        let seconds = Math.floor(currentTime);
        let nanoSeconds = parseInt((currentTime - seconds) * 1000);
        this.setState({
            playerTime: {
                seconds,
                nanoSeconds
            }
        })

        const { editorData } = this.state;
        _.each(editorData, (data, index) => {
            if(data.startTime && data.endTime) {
                let startTime = this.getFormattedTimeInSeconds(data.startTime);
                let endTime = this.getFormattedTimeInSeconds(data.endTime);
                if(startTime <= currentTime && currentTime < endTime) {
                    this.setState({
                        selectedTextIndex: index
                    });
                    return false;
                }
            }
        })
        setTimeout(() =>{
            if(this.currentEditableText) {
                this.currentEditableText.el.current.focus();
            }
        }, 500);
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
                            src={ selectedFile.originalFile && selectedFile.originalFile.url ? selectedFile.originalFile.url : '' }
                            type={ selectedFile.options ? selectedFile.options.type : '' }
                            timeToSeek={ this.state.timeToSeek }
                            onTimeChanged={ this.handleTimeChange }
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
                        {/* { this.renderOptions() } */}
                    </div>
                }
            </div>
        );
    }
}

const mapStateToProps = ({ user, selectedFile }) => {
    return { user, selectedFile };
}

export default connect(mapStateToProps)(injectIntl(Transcription));