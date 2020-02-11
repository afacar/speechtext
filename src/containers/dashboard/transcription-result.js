import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, Prompt } from 'react-router';
import _ from 'lodash';
import { Container, Spinner } from 'react-bootstrap';
import { Media } from 'react-media-player';
import { injectIntl } from 'react-intl';
import Axios from 'axios';

import firebase from '../../utils/firebase';
import SpeechTextPlayer from '../../components/player';
import SpeechTextEditor from '../../components/speech-text-editor';
import Export from '../../components/editor-export';
import { handleTimeChange, isPlaying, setEditorFocus, getFile } from "../../actions";
import UserHeader from '../user-header';
import "../../styles/user.css";

class TranscriptionResult extends Component {
    constructor(props) {
        super(props);

        let fileId;
        if (props.location && props.location.pathname) {
            fileId = props.location.pathname.substr('/edit/'.length);
        }

        if (_.isEmpty(fileId)) {
            props.history.push('/dashboard');
        }

        this.state = {
            editorData: null,
            numOfWords: '',
            intervalHolder: undefined,
            fileId,
            savingState: 0, // 0-initial, 1-saved, -1: not saved, -2: error
            blockNavigation: false
        }
    }

    componentWillUnmount = async () => {
        await this.updateTranscribedFile();
        if (this.state.intervalHolder) {
            clearInterval(this.state.intervalHolder);
        }
    }

    componentWillReceiveProps = async ({ user, selectedFile }) => {
        if (_.isEmpty(this.props.user) && !_.isEmpty(user)) {
            this.props.getFile(this.state.fileId);
        }
        if (_.isEmpty(this.props.selectedFile) && !_.isEmpty(selectedFile)) {
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
                            //this.props.setEditorFocus(-1, -1, -1)
                            this.props.handleTimeChange(data, -1);
                            let editorData = data;
                            that.setState({
                                editorData,
                                //prevEditorData: _.cloneDeep(editorData),
                                showSpinner: false
                            });
                            console.log('this.state.editorData is fetched', this.state.editorData)
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
    }

    componentDidUpdate() {
        const { savingState } = this.state;
        if(!this.state.blockNavigation && savingState < 0) {
            this.setState({
                blockNavigation: true
            });
            window.addEventListener('beforeunload', this.beforeUnload);
        } else if(this.state.blockNavigation && savingState >= 0) {
            this.setState({
                blockNavigation: false
            });
            window.removeEventListener('beforeunload', this.beforeUnload);
        }
    }

    beforeUnload = e => {
        const { intl } = this.props;
        e.preventDefault();
        let message = intl.formatMessage({ id: "Editor.leaveMessage" });
        e.returnValue = message;
        return message;
    }

    updateTranscribedFile = async () => {
        const { editorData, isSaved, savingState } = this.state;
        const { selectedFile } = this.props;
        console.log("TranscribedFile", selectedFile.transcribedFile);
        console.log("Editor data", editorData);
        console.log("Is saved", isSaved);
        if (!_.isEmpty(editorData) && !isSaved && savingState === -1) {
            this.setState({ savingState: 2 })
            var storageRef = firebase.storage().ref(selectedFile.transcribedFile.filePath);
            console.log("putting editordata as json");
            console.log(editorData)
            var currentUser = firebase.auth().currentUser;
            firebase.firestore().collection('userfiles').doc(currentUser.uid).collection('files').doc(selectedFile.id).update({ lastEdit: new Date() });
            await storageRef.put(new Blob([JSON.stringify(editorData)]))
                .then(snapshot => {
                    this.setState({ isSaved: true, savingState: 1 })
                    this.clearSavingState();
                    console.log('File uploaded', snapshot)
                })
                .catch(error => {
                    // TODO: UPDATE_TRANSCRIBED_FILE_ERROR	
                    this.setState({ savingState: -2 })
                    this.clearSavingState();
                    console.log(error);
                });
        }
    }

    clearSavingState = () => {
        setTimeout(() => {
            this.setState({
                savingState: 0
            })
        }, 1250)
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

    downloadAsTxt = async () => {
        await this.updateTranscribedFile();
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
                var fileName = selectedFile.name.replace(',', '').split(' ').join('_');
                fileName = fileName.substr(0, fileName.lastIndexOf('.')) + '.srt';
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
                // TODO: GET_SRT_FILE_ERROR
                console.log(err);
            });
    }

    getTranscriptionText = (words) => words.filter((theword) => theword.word.length > 0).map(theword => theword.word).join(' ')

    handleEditorChange = (index, words) => {
        //console.log(`handleEditorChange is called with index ${index} and words >`, words)
        var { editorData } = this.state;
        editorData[index].alternatives[0].words = words;
        let transcript = this.getTranscriptionText(words);
        editorData[index].alternatives[0].transcript = transcript
        const numOfWords = transcript.split(' ').length
        this.setState({
            editorData,
            numOfWords,
            isSaved: false,
            savingState: -1
        })

        //this.props.setEditorFocus(index, activeWordIndex, caretPosition)
    }

    speakerTagChanged = () => {
        this.setState({
            isSaved: false,
            savingState: -1
        })
    }

    splitData = (activeIndex, activeWordIndex, caretPos, wordLength,) => {
        const { editorData } = this.state;
        let firstSplittedData = editorData[activeIndex];
        let secondSplittedData = _.cloneDeep(firstSplittedData);
        console.log("Split data first splitted data ", firstSplittedData);

        let endWord = firstSplittedData.alternatives[0].words[activeWordIndex];
        let endWordFirstPartStr = endWord.word.substring(0, caretPos - 1);
        let endWordSecondPartStr = endWord.word.substring(caretPos - 1, wordLength);



        let endWordFirstPart = _.cloneDeep(endWord);
        endWordFirstPart.word = endWordFirstPartStr;
        endWordFirstPart.confidence = 1;

        let endWordSecondPart = _.cloneDeep(endWord);
        endWordSecondPart.word = endWordSecondPartStr;
        endWordSecondPart.confidence = 1;

        firstSplittedData.alternatives[0].endTime = endWord.endTime;
        firstSplittedData.alternatives[0].words.splice(activeWordIndex, firstSplittedData.alternatives[0].words.length - activeWordIndex + 1, endWordFirstPart);
        firstSplittedData.alternatives[0].transcript = this.getTranscriptionText(firstSplittedData.alternatives[0].words);
        console.log("Javid end word first part ", endWordFirstPart)
        let startWord = endWordSecondPart;
        secondSplittedData.alternatives[0].startTime = startWord.startTime;
        secondSplittedData.alternatives[0].words.splice(0, activeWordIndex + 1, startWord);
        secondSplittedData.alternatives[0].transcript = this.getTranscriptionText(secondSplittedData.alternatives[0].words);
        editorData[activeIndex] = firstSplittedData;
        editorData.splice(activeIndex + 1, 0, secondSplittedData);
        console.log('After split new editorData>', editorData)
        this.setState({
            editorData,
            isSaved: false,
            savingState: -1,
        });
        //this.props.setEditorFocus(activeIndex + 1, 0, 0)
    }

    /*     changeActiveIndex = (activeIndex, activeWordIndex, caretPosition) => {
            const { editorData } = this.state
            if (activeWordIndex === -1) {
                let len = editorData[activeIndex].alternatives[0].words.length
                activeWordIndex = len - 1
            }
            if (caretPosition === -1) {
                caretPosition = editorData[activeIndex].alternatives[0].words[activeWordIndex].word.length + 1
            }
            console.log(`changeActiveIndex activeIndex: ${activeIndex} activeWordIndex: ${activeWordIndex} caretPosition: ${caretPosition}`)
            //this.props.setEditorFocus(activeIndex, activeWordIndex, caretPosition)
        } */

    mergeData = (activeIndex, callback) => {
        const { editorData } = this.state;

        if (activeIndex === 0) return;

        let prevData = editorData[activeIndex - 1];
        let currentData = editorData[activeIndex];
        var wordIndex = prevData.alternatives[0].words.length;
        var offset = prevData.alternatives[0].words[wordIndex - 1].length;

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
            savingState: -1
        });
        callback(wordIndex, offset)
        //this.props.setEditorFocus(activeIndex - 1, prevWordLength, 0)
    }

    mergeSpans = (editableIndex, wordIndex, direction) => {
        if (wordIndex > 0) {
            console.log("Merge Spans with editableIndex, wordIndex, direction ", editableIndex, " ", wordIndex, " ", direction);
            const curWords = this.state.editorData[editableIndex].alternatives[0].words;
            const firstWord = curWords[wordIndex + direction];
            const secondWord = curWords[wordIndex];
            var finalWord = "";
            var dataCopy = {};
            if (direction === -1) {
                // Backspace is clicked
                finalWord = {
                    startTime: firstWord.startTime,
                    endTime: secondWord.endTime,
                    word: firstWord.word + secondWord.word,
                    confidence: 1,
                    speakerTag: firstWord.speakerTag
                }
                curWords[wordIndex + direction] = finalWord;
                curWords.splice(wordIndex, 1);
                console.log("Merge completed? curWords", curWords);
                dataCopy = this.state.editorData;
                console.log("Merge completed? dataCopy 1 ", dataCopy);
                dataCopy[editableIndex].alternatives[0].words = [];
                dataCopy[editableIndex].alternatives[0].words = curWords;
                this.setState({
                    editorData: dataCopy
                })
                console.log("Merge completed? dataCopy 2 ", dataCopy);
            } else if (direction === 1) {
                finalWord = {
                    startTime: secondWord.startTime,
                    endTime: firstWord.endTime,
                    word: secondWord.word + firstWord.word,
                    confidence: 1,
                    speakerTag: firstWord.speakerTag
                }
                curWords[wordIndex] = finalWord;
                curWords.splice(wordIndex, 1);
                console.log("Merge completed? curWords", curWords);
                dataCopy = this.state.editorData;
                console.log("Merge completed? dataCopy 1 ", dataCopy);
                dataCopy[editableIndex].alternatives[0].words = [];
                dataCopy[editableIndex].alternatives[0].words = curWords;
                this.setState({
                    editorData: dataCopy
                })
            }
            console.log("Merge final word ", finalWord);
            console.log("Merge completed? editorData", this.state.editorData);
            console.log("Merge concrete words ", firstWord, " ", secondWord);
        }
    }

    renderResults = () => {
        const { editorData } = this.state;
        const { intl } = this.props;
        console.log('renderResults editorData', editorData)
        if (editorData === null) return;
        if (_.isEmpty(editorData)) return 'Sorry :/ There is no identifiable speech in your audio! Try with a better quality recording.'
        return (
            <div>
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
                </div>
                <br />
                <div className="d-flex flex-col">
                    <div className="p-2 flex-fill">
                        <SpeechTextEditor
                            key={editorData.length}
                            editorData={editorData ? editorData : []}
                            //changeActiveIndex={this.changeActiveIndex}
                            handleEditorChange={this.handleEditorChange}
                            splitData={this.splitData}
                            mergeData={this.mergeData}
                            mergeSpans={this.mergeSpans}
                            //suppressContentEditableWarning
                            //playerTime={this.state.playerTime}
                            editorClicked={this.editorClicked}
                            //isPlaying={this.state.isPlaying}
                            speakerTagChanged={this.speakerTagChanged}
                        />
                    </div>
                </div>
                <React.Fragment>
                    <Prompt
                        when={this.state.blockNavigation}
                        message={ intl.formatMessage({ id: "Editor.leaveMessage" }) }
                    />
                </React.Fragment>
            </div>
        );
    }

    editorClicked = (seconds) => {
        console.log("editor clicked seek to ", seconds)
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
        const { editorData } = this.state;
        if (_.isEmpty(selectedFile)) selectedFile = {};
        let fileSrc = selectedFile.originalFile && selectedFile.originalFile.url ? selectedFile.originalFile.url : '';
        if(selectedFile.options && selectedFile.options.type.startsWith('video')) {
            if(selectedFile.resizedFile && selectedFile.resizedFile.publicUrl) {
                fileSrc = selectedFile.resizedFile.publicUrl;
            }
        }
        return (
            <div>
                <UserHeader />
                <Container className='transcription-container'>{/* TODO: change this!!!!!!!!!!!!!!!!!!!!!!*/}
                    {
                        !this.state.showSpinner && !_.isEmpty(editorData) &&
                        <Export
                            downloadAsDocx={ this.downloadAsDocx }
                            downloadAsTxt={ this.downloadAsTxt }
                            downloadAsSrt={ this.downloadAsSrt }
                            onSave={ this.updateTranscribedFile }
                            savingState={ this.state.savingState }
                            fileType={ selectedFile.options ? selectedFile.options.type : '' }
                        />
                    }
                    <div className='transcription-title'>
                        <Media>
                            <SpeechTextPlayer
                                key={ selectedFile.id }
                                src={ fileSrc }
                                fileName={ selectedFile.name }
                                duration={ selectedFile.originalFile && selectedFile.originalFile.duration ? selectedFile.originalFile.duration : undefined }
                                type={ selectedFile.options ? selectedFile.options.type : '' }
                                timeToSeek={ this.state.timeToSeek }
                                editorData={ this.state.editorData }
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
                        !this.state.showSpinner && (
                            <div className='transcription p-2 flex-fill'>
                                {this.renderResults()}
                            </div>
                        )
                    }
                </Container>
            </div>
        );
    }
}

const mapStateToProps = ({ user, selectedFile }) => {
    return { user, selectedFile };
}

export default connect(mapStateToProps, { handleTimeChange, isPlaying, setEditorFocus, getFile })(injectIntl(withRouter(TranscriptionResult)));