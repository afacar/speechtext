import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { Dropdown, DropdownButton, Spinner } from 'react-bootstrap';
import { Media } from 'react-media-player';
import { FormattedMessage, injectIntl } from 'react-intl';
import Axios from 'axios';

import firebase from '../../utils/firebase';
import SpeechTextPlayer from '../../components/player';
import SpeechTextEditor from '../../components/speech-text-editor';

class Transcription extends Component {
    constructor(props) {
        super(props);

        this.state = {
            editorData: null,
            intervalHolder: undefined,
            isSaved: true
        }
    }

    componentWillUnmount() {
        if(this.state.intervalHolder) {
            clearInterval(this.state.intervalHolder);
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

            var storageRef = firebase.storage().ref(selectedFile.transcribedFile.filePath);
            storageRef.getDownloadURL().then((downloadUrl) => {
                Axios.get(downloadUrl)
                .then(({ data }) => {
                    let editorData = data;
                    that.setState({
                        editorData,
                        //prevEditorData: _.cloneDeep(editorData),
                        showSpinner: false
                    }, () => {
                        intervalHolder = setInterval(() => {
                            that.updateTranscribedFile();
                        }, 20000);
                    })
                });
            })
            .catch(error => {
                // TODO: GET_DOWNLOAD_URL_ERROR
                console.log(error);
            })
        } else {
            this.setState({
                editorData: null,
                prevEditorData: {},
                intervalHolder: undefined,
                showSpinner: false
            })
        }
    }

    componentWillUnmount = async () => {
        await this.updateTranscribedFile();
    }

    updateTranscribedFile = async () => {
        const { editorData, prevEditorData, isSaved } = this.state;
        const { selectedFile, user } = this.props;
        if(!_.isEmpty(editorData) && !isSaved) {
            return;
            var storageRef = firebase.storage().ref(selectedFile.transcribedFile.filePath);	
            storageRef.put(new Blob([JSON.stringify(editorData)]))
                .then(snapshot => {
                    this.setState({ isSaved: true })
                    console.log('File uploaded', snapshot)
                })
                .catch(error => {
                    // TODO: UPDATE_TRANSCRIBED_FILE_ERROR	
                    console.log(error);	
                });
            // }
        }
    }

    addZero = (value, length) => {
        if(value === 0) {
            return length === 3 ? '000' : '00';
        }
        if(value < 10) return length === 3 ? '00' : '0' + value.toString();
        return value;
    }

    formatTime = ({ seconds, nanos }) => {
        let formattedTime = '';
        if(seconds > 60) {
            let minutes = parseInt(seconds / 60);
            seconds = seconds % 60;
            if(minutes > 60) {
                let hours = parseInt(minutes / 60);
                minutes = minutes % 60;
                formattedTime = this.addZero(hours) + ':';
            } else {
                formattedTime = '00:';
            }
            formattedTime += this.addZero(minutes) + ':';
        } else {
            formattedTime += '00:00:';
        }
        formattedTime += this.addZero(seconds) + '.' + this.addZero(nanos, 3);

        return formattedTime;
    }

    downloadAsTxt = () => {
        const { selectedFile } = this.props;
        const { editorData } = this.state;
        var textData = '';
        _.each(editorData, data => {
            let alternative = data.alternatives[0];
            let { startTime, endTime, transcript } = alternative;
            textData += `${this.formatTime(startTime)} - ${this.formatTime(endTime)}\n${transcript}\n\n`;
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

    downloadAsDocx = async () => {
        await this.updateTranscribedFile();
        
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
            .then(() => {
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

    downloadAsSrt = async () => {
        await this.updateTranscribedFile();
        
        var { selectedFile } = this.props;
        this.setState({ showDownloadSpinner: true });
        
        var getSrtFile = firebase.functions().httpsCallable('getSrtFile');
        getSrtFile({ 
            fileId: selectedFile.id
        })
        .then(({ data }) => {
            var storageRef = firebase.storage().ref(data.filePath);
            var fileName = selectedFile.name.split(' ').join('_');
            fileName = fileName.substr(0, fileName.lastIndexOf('.')) + '.srt';
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
            // TODO: GET_SRT_FILE_ERROR
            console.log(err);
        });
    }

    getTranscriptionText = (words) => words.map((theword, i) => theword.word).join(' ')

    handleWordChange = (index, wordIndex, text) => {
        console.log(`handleWordChange is called...`)
        console.log(`handleWordChange index: ${index}`)
        console.log(`handleWordChange wordIndex: ${wordIndex}`)
        console.log(`handleWordChange text: ${text}`)

        var { editorData } = this.state;
        // let prevEditorData = _.cloneDeep(editorData);
        if (text) editorData[index].alternatives[0].words[wordIndex].word = text.trim();
        else editorData[index].alternatives[0].words[wordIndex].word = ''
        editorData[index].alternatives[0].transcript = this.getTranscriptionText(editorData[index].alternatives[0].words);
        this.setState({
            editorData,
            //prevEditorData,
            isSaved: false
        })
    }

    handleSplitChange = () => this.setState({ isSaved: false })

    renderResults = () => {
        const { editorData } = this.state;
        console.log('renderResults editorData',editorData)
        if(editorData === null) return;
        if(_.isEmpty(editorData)) return 'Sorry :/ There is no identifiable speech in your audio!'

        const { formatMessage } = this.props.intl;
        return (
            <div className=''>
                <div className='d-flex flex-col justify-content-end align-items-center'>
                    <div>
                    {this.state.isSaved? 'Saved!': 'Editing...'}
                    </div>
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
                        <Dropdown.Item as="button" onClick={ this.downloadAsSrt }>
                            <FormattedMessage id='Transcription.Download.option3' />
                        </Dropdown.Item>
                    </DropdownButton>
                </div>
                <br />
                <SpeechTextEditor
                    editorData={ editorData ? editorData : [] }
                    handleWordChange={ this.handleWordChange }
                    handleSplitChange={ this.handleSplitChange }
                    suppressContentEditableWarning
                    playerTime={ this.state.playerTime }
                    editorClicked={ this.editorClicked }
                    isPlaying={ this.state.isPlaying }
                />
            </div>
        );
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

    handleTimeChange = (currentTime) => {
        let seconds = Math.floor(currentTime);
        let nanoSeconds = parseInt((currentTime - seconds) * 1000);
        this.setState({
            playerTime: {
                seconds,
                nanoSeconds
            }
        });
    }

    render() {
        console.log('Transcription Rendering...')
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
                            onPlay={ () => this.setState({ isPlaying: true }) }
                            onPause={ () => this.setState({ isPlaying: false }) }
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