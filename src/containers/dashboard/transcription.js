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
import { handleTimeChange, isPlaying, setEditorFocus } from "../../actions";

class Transcription extends Component {
    constructor(props) {
        super(props);

        this.state = {
            editorData: null,
            numOfWords: '',
            intervalHolder: undefined
        }
    }

    componentWillUnmount() {
        if (this.state.intervalHolder) {
            clearInterval(this.state.intervalHolder);
        }
    }

    componentWillReceiveProps = async ({ selectedFile }) => {
        console.log('TranscriptionWillReceiveProps', selectedFile)
        var that = this;
        var { intervalHolder } = this.state;
        this.props.isPlaying(false)
        clearInterval(intervalHolder);
        if (!_.isEmpty(selectedFile) && selectedFile.status === 'DONE') {
            //this.props.handleTimeChange(null, -1);
            this.setState({
                showSpinner: true
            })
            // Todo: this.props.getEditorDate(selectedFile)
            // editorDataAll: { fileId: editorData, fileId2: editorData...}
            var storageRef = firebase.storage().ref(selectedFile.transcribedFile.filePath);
            storageRef.getDownloadURL().then((downloadUrl) => {
                Axios.get(downloadUrl)
                    .then(({ data }) => {
                        this.props.setEditorFocus(-1, -1, -1)
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
                        console.log('this.state.editorData is fetched', this.state.editorData)
                        this.props.handleTimeChange(data, -1);
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
            //this.props.handleTimeChange(null, -1);
        }
    }

    componentWillUnmount = async () => {
        await this.updateTranscribedFile();
    }

    updateTranscribedFile = async () => {
        const { editorData, prevEditorData, isSaved } = this.state;
        const { selectedFile, user } = this.props;
        if (!_.isEmpty(editorData) && !isSaved) {
            return;
            /* var storageRef = firebase.storage().ref(selectedFile.transcribedFile.filePath);	
            storageRef.put(new Blob([JSON.stringify(editorData)]))
                .then(snapshot => {
                    this.setState({ isSaved: true })
                    console.log('File uploaded', snapshot)
                })
                .catch(error => {
                    // TODO: UPDATE_TRANSCRIBED_FILE_ERROR	
                    console.log(error);	
                });
            // } */
        }
    }

    addZero = (value, length) => {
        if (value === 0) {
            return length === 3 ? '000' : '00';
        }
        if (value < 10) return length === 3 ? '00' : '0' + value.toString();
        return value;
    }

    formatTime = ({ seconds, nanos }) => {
        let formattedTime = '';
        if (seconds > 60) {
            let minutes = parseInt(seconds / 60);
            seconds = seconds % 60;
            if (minutes > 60) {
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
        const file = new Blob([textData], { type: 'text/plain' });
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

    getTranscriptionText = (words) => words.filter((theword, i) => theword.word.length > 0).map(theword => theword.word).join(' ')

    handleEditorChange = (index, words) => {
        console.log(`handleEditorChange is called with index ${index} and words >`, words)
        var { editorData } = this.state;
        editorData[index].alternatives[0].words = words;
        let transcript = this.getTranscriptionText(words);
        editorData[index].alternatives[0].transcript = transcript
        const numOfWords = transcript.split(' ').length
        this.setState({
            editorData,
            numOfWords,
            isSaved: false
        })

        //this.props.setEditorFocus(index, activeWordIndex, caretPosition)
    }

    splitData = (activeIndex, activeWordIndex, caretPos, wordLength) => {
        const { editorData } = this.state;

        let wordIndex = activeWordIndex;
        if (caretPos <= wordLength / 2) {
            wordIndex -= 1;
        }

        let firstSplittedData = editorData[activeIndex];
        let secondSplittedData = _.cloneDeep(firstSplittedData);

        let endWord = firstSplittedData.alternatives[0].words[wordIndex];
        firstSplittedData.alternatives[0].endTime = endWord.endTime;
        firstSplittedData.alternatives[0].words.splice(wordIndex + 1);
        firstSplittedData.alternatives[0].transcript = this.getTranscriptionText(firstSplittedData.alternatives[0].words);

        let startWord = secondSplittedData.alternatives[0].words[wordIndex + 1];
        secondSplittedData.alternatives[0].startTime = startWord.startTime;
        secondSplittedData.alternatives[0].words.splice(0, wordIndex + 1);
        secondSplittedData.alternatives[0].transcript = this.getTranscriptionText(secondSplittedData.alternatives[0].words);

        editorData[activeIndex] = firstSplittedData;
        editorData.splice(activeIndex + 1, 0, secondSplittedData);
        console.log('After split new editorData>', editorData)
        this.setState({
            editorData,
            /* activeIndex: activeIndex + 1,
            activeWordIndex: 0,
            caretPosition: 0, */
            isSaved: false
        });
        this.props.setEditorFocus(activeIndex + 1, 0, 0)

        //this.props.handleSplitChange()
    }

    changeActiveIndex = (activeIndex, activeWordIndex, caretPosition) => {
        const { editorData } = this.state
        if (activeWordIndex === -1) {
            let len = editorData[activeIndex].alternatives[0].words.length
            activeWordIndex = len - 1
        }
        if (caretPosition === -1) {
            caretPosition = editorData[activeIndex].alternatives[0].words[activeWordIndex].word.length + 1
        }
        console.log(`changeActiveIndex activeIndex: ${activeIndex} activeWordIndex: ${activeWordIndex} caretPosition: ${caretPosition}`)
        this.props.setEditorFocus(activeIndex, activeWordIndex, caretPosition)
    }

    mergeData = (activeIndex) => {
        const { editorData } = this.state;

        if (activeIndex === 0) return;

        let prevData = editorData[activeIndex - 1];
        let currentData = editorData[activeIndex];
        let prevWordLength = prevData.alternatives[0].words.length;

        prevData.alternatives[0].words = prevData.alternatives[0].words.concat(currentData.alternatives[0].words);
        let wordLength = prevData.alternatives[0].words.length;
        prevData.alternatives[0].endTime = prevData.alternatives[0].words[wordLength - 1].endTime;
        prevData.alternatives[0].transcript = this.getTranscriptionText(prevData.alternatives[0].words);

        editorData[activeIndex - 1] = prevData;
        editorData.splice(activeIndex, 1);
        console.log('After merge new editorData>', editorData)

        this.setState({
            editorData,
            /* activeIndex: activeIndex - 1,
            activeWordIndex: prevWordLength,
            caretPosition: 0, */
            isSaved: false,
        });
        this.props.setEditorFocus(activeIndex - 1, prevWordLength, 0)

    }

    renderResults = () => {
        const { editorData, isSaved, numOfWords } = this.state;
        console.log('renderResults editorData', editorData)
        if (editorData === null) return;
        if (_.isEmpty(editorData)) return 'Sorry :/ There is no identifiable speech in your audio! Try with a better quality recording.'

        const { formatMessage } = this.props.intl;
        return (
            <div className=''>
                <div className={'float-left saved-editing-text ' + (isSaved ? 'saved' : 'editing')}>
                    {isSaved === undefined ? '' : isSaved ? 'Saved!' : 'Editing...'}
                </div>
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
                    <DropdownButton id="dropdown-item-button" title={formatMessage({ id: 'Transcription.Download.text' })}>
                        <Dropdown.Item as="button" onClick={this.downloadAsTxt}>
                            <FormattedMessage id='Transcription.Download.option1' />
                        </Dropdown.Item>
                        <Dropdown.Item as="button" onClick={this.downloadAsDocx}>
                            <FormattedMessage id='Transcription.Download.option2' />
                        </Dropdown.Item>
                        <Dropdown.Item as="button" onClick={this.downloadAsSrt}>
                            <FormattedMessage id='Transcription.Download.option3' />
                        </Dropdown.Item>
                    </DropdownButton>
                </div>
                <br />
                <SpeechTextEditor
                    key={editorData.length + '' + numOfWords}
                    editorData={editorData ? editorData : []}
                    changeActiveIndex={this.changeActiveIndex}
                    handleEditorChange={this.handleEditorChange}
                    splitData={this.splitData}
                    mergeData={this.mergeData}
                    suppressContentEditableWarning
                    //playerTime={this.state.playerTime}
                    editorClicked={this.editorClicked}
                    isPlaying={this.state.isPlaying}
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

    render() {
        console.log('Transcription Rendering...')
        var { selectedFile } = this.props;
        if (_.isEmpty(selectedFile)) selectedFile = {};
        return (
            <div className='transcription-container'>
                <div className='transcription-title'>
                    <div className='selected-file-name'>
                        {selectedFile.name}
                    </div>
                    <Media>
                        <SpeechTextPlayer
                            key={selectedFile.id}
                            src={selectedFile.originalFile && selectedFile.originalFile.url ? selectedFile.originalFile.url : ''}
                            type={selectedFile.options ? selectedFile.options.type : ''}
                            timeToSeek={this.state.timeToSeek}
                            editorData={this.state.editorData}
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
                        {this.renderResults()}
                    </div>
                }
            </div>
        );
    }
}

const mapStateToProps = ({ user, selectedFile }) => {
    return { user, selectedFile };
}

export default connect(mapStateToProps, { handleTimeChange, isPlaying, setEditorFocus })(injectIntl(Transcription));