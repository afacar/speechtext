import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, Prompt } from 'react-router';
import _ from 'lodash';
import { fromJS } from 'immutable';
import { injectIntl, FormattedMessage } from 'react-intl';
import Axios from 'axios';
import { Transcript } from 'transcript-model';
import { convertToRaw, convertFromRaw, EditorState } from 'draft-js';
import { Button, Spinner } from 'react-bootstrap';

import firebase from '../../utils/firebase';
import VideoPlayer from '../../components/editor/video-player';
import SpeechTextEditor from '../../components/editor/editor-view';
import {
    convertFromTranscript,
    convertToTranscript,
    convertToJSON
} from '../../components/transcription';
import Export from '../../components/editor-export';
import { handleTimeChange, isPlaying, setEditorFocus, getFile, setTrimmedFileInfo } from "../../actions";
import Dashboard from '../dashboard-header';
import Utils from '../../utils';
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
            editorState: null,
            speakers: null,
            numOfWords: '',
            intervalHolder: undefined,
            fileId,
            savingState: 0, // 0-initial, 1-saved, -1: not saved, -2: error
            blockNavigation: false,
            currentTime: 0,
            showReduceCreditsSpinner: false
        }
    }

    componentDidMount() {
        this.updateInterval = setInterval(this.updateTranscribedFile, 60000);
    }

    componentWillUnmount = async () => {
        await this.updateTranscribedFile();
        if (this.state.intervalHolder) {
            clearInterval(this.state.intervalHolder);
        }
        clearInterval(this.updateInterval)
    }

    componentWillReceiveProps = ({ user, selectedFile }) => {
        if (_.isEmpty(this.props.user) && !_.isEmpty(user)) {
            this.props.getFile(this.state.fileId);
        }
        if (_.isEmpty(this.props.selectedFile) && !_.isEmpty(selectedFile)) {
            this.getTranscriptionResult(selectedFile);
        }
    }

    getTranscriptionResult = async (selectedFile) => {
        var that = this;
        if (!selectedFile) {
            selectedFile = this.props.selectedFile;
        }

        var { intervalHolder } = this.state;
        this.props.isPlaying(false)
        clearInterval(intervalHolder);
        if (!_.isEmpty(selectedFile) && selectedFile.status === 'DONE') {
            this.setState({
                showSpinner: true
            })
            let { data } = await firebase.functions().httpsCallable('getTranscriptionResult')({
                fileId: selectedFile.id
            });
            console.log('fileData : ' + data);
            let editorData = data.data;
            var { editorState, speakers } = that.formatDataForEditor(editorData);
            speakers = this.removeEmptySpeakers(speakers);
            that.setState({
                editorData,
                editorState,
                speakers,
                showSpinner: false,
                trimmed: data.trimmed,
                minutesToShow: data.minutesToShow,
                minutesToBePaid: data.minutesToBePaid
            });
        } else {
            this.setState({
                editorData: null,
                editorState: null,
                speakers: null,
                prevEditorData: {},
                intervalHolder: undefined,
                showSpinner: false
            })
        }

        let fileSrc = selectedFile.originalFile && selectedFile.originalFile.url ? selectedFile.originalFile.url : '';
        if (selectedFile.resizedFile) {
            var ref = firebase.storage().ref(selectedFile.resizedFile.filePath);
            ref.getDownloadURL().then((downloadUrl) => {
                Axios.get(downloadUrl)
                    .then((url) => {
                        fileSrc = url.config.url;
                        that.setState({
                            fileSrc
                        })
                    });
            })
                .catch(error => {
                    // TODO: GET_DOWNLOAD_URL_ERROR
                    console.log(error);
                    this.setState({
                        fileSrc
                    })
                })
        } else {
            this.setState({
                fileSrc
            })
        }
    }

    removeEmptySpeakers(speakers) {
        var filtered = speakers.toJS().filter(function (speaker) {
            return speaker.name !== '';
        });
        // console.log("Not Filtered ", speakers)
        // console.log("Filtered ", fromJS(filtered))
        // return speakers
        if (filtered.length === 0) {
            filtered.push({ name: '' })
        } else {
            if (filtered[0].name !== '')
                filtered.unshift({ name: '' })
        }
        return fromJS(filtered)
    }

    formatDataForEditor = (data) => {
        if (data) {
            const transcriptJson2 = convertToJSON(data)
            const transcript = Transcript.fromJson(transcriptJson2);
            return convertFromTranscript(transcript);
        }
        return {};
    }

    componentDidUpdate() {
        const { savingState } = this.state;
        if (!this.state.blockNavigation && savingState < 0) {
            this.setState({
                blockNavigation: true
            });
            window.addEventListener('beforeunload', this.beforeUnload);
        } else if (this.state.blockNavigation && savingState >= 0) {
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
        const { editorState, isSaved, savingState } = this.state;
        const { selectedFile } = this.props;
        console.log('updateTranscribedFile called')
        if (!_.isEmpty(editorState) && !isSaved && savingState === -1) {
            this.setState({ savingState: 2 })
            var storageRef = firebase.storage().ref(selectedFile.transcribedFile.filePath);
            var currentUser = firebase.auth().currentUser;
            firebase.firestore().collection('userfiles').doc(currentUser.uid).collection('files').doc(selectedFile.id).update({ lastEdit: new Date() });

            const transcript = convertToTranscript(
                this.state.editorState.getCurrentContent(),
                this.state.speakers
            );
            const blob = new Blob([JSON.stringify(transcript.toJSON(), null, 2)], {
                type: 'application/json;charset=utf-8',
            });
            await storageRef.put(blob)
                .then(snapshot => {
                    this.setState({ isSaved: true, savingState: 1 })
                    this.clearSavingState();
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

    downloadAsTxt = async () => {
        this.setState({ showDownloadSpinner: true });

        await this.updateTranscribedFile();
        const { selectedFile } = this.props;

        var getTxtFile = firebase.functions().httpsCallable('getTxtFile');
        getTxtFile({
            fileId: selectedFile.id
        }).then(({ data }) => {
            var storageRef = firebase.storage().ref(data.filePath);
            var fileName = selectedFile.name.replace(/,/g, '').replace(/'/g, '').replace(/ /g, '_');
            fileName = fileName.substr(0, fileName.lastIndexOf('.')) + '.txt';
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

    downloadAsDocx = async () => {
        this.setState({ showDownloadSpinner: true });

        await this.updateTranscribedFile();

        var { selectedFile } = this.props;

        var getDocxFile = firebase.functions().httpsCallable('getDocxFile');
        getDocxFile({
            fileId: selectedFile.id
        })
            .then(({ data }) => {
                var storageRef = firebase.storage().ref(data.filePath);
                var fileName = selectedFile.name.replace(/,/g, '').replace(/'/g, '').replace(/ /g, '_');
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
                var fileName = selectedFile.name.replace(/,/g, '').replace(/'/g, '').replace(/ /g, '_');
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

    speakerTagChanged = () => {
        this.setState({
            isSaved: false,
            savingState: -1
        })
    }

    handleTimeUpdate = (time) => {
        this.setState({ currentTime: time });
    }

    onTextChange = (editorState) => {
        if (this.state.editorState !== editorState) {
            this.setState({
                editorState,
                isSaved: false,
                savingState: -1
            })
        }
    }

    editSpeaker = (newSpeaker, index) => {
        var { speakers } = this.state;
        speakers = speakers.update(index, (item) => {
            return item.set('name', newSpeaker);
        })
        speakers = this.removeEmptySpeakers(speakers);
        this.setState({
            speakers
        })
    }

    addNewSpeaker = (newSpeaker) => {
        var { speakers } = this.state;
        var speakersJSON = speakers.toJS();
        speakersJSON[speakersJSON.length] = { name: newSpeaker };
        speakers = fromJS(speakersJSON);
        this.setState({
            speakers
        })
    }

    setSpeaker = (blockIndex, speakerIndex) => {
        var contentState = this.state.editorState.getCurrentContent()
        var contentStateJSON = convertToRaw(contentState);
        if (!contentStateJSON.blocks[blockIndex])
            contentStateJSON.blocks[blockIndex] = {};
        if (!contentStateJSON.blocks[blockIndex].data)
            contentStateJSON.blocks[blockIndex].data = {};
        contentStateJSON.blocks[blockIndex].data.speaker = speakerIndex;
        contentState = convertFromRaw(contentStateJSON);
        this.setState({
            editorState: EditorState.createWithContent(contentState)
        })
    }

    goToPayment = () => {
        const { fileId, minutesToBePaid } = this.state;

        this.props.setTrimmedFileInfo(fileId, minutesToBePaid);
        this.props.history.push(`/user#payment?fileId=${fileId}`);
    }

    reduceCredits = () => {
        const { user } = this.props;
        const { fileId, minutesToBePaid } = this.state;
        this.setState({
            showReduceCreditsSpinner: true
        })
        var fncReduceCredits = firebase.functions().httpsCallable('reduceCredits');
        fncReduceCredits({
            uid: user.uid,
            fileId,
            minutesToReduce: minutesToBePaid
        }).then(({ data }) => {
            if (data === 'SUCCESS') {
                this.setState({
                    showReduceCreditsSpinner: false
                })
                this.getTranscriptionResult();
            }
        })
    }

    render() {
        var { selectedFile, intl, user } = this.props;
        const { editorData, editorState, speakers, fileSrc, currentTime, trimmed, minutesToShow, minutesToBePaid, showReduceCreditsSpinner } = this.state;
        if (_.isEmpty(selectedFile)) selectedFile = {};
        let remainingMinutes = user && user.currentPlan ? user.currentPlan.remainingMinutes : 0;
        let amountToBePaid = (0.1 * minutesToBePaid).toFixed(2);
        return (
            <div>
                <Dashboard />
                <div className='transcription-container'>{/* TODO: change this!!!!!!!!!!!!!!!!!!!!!!*/}
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
                                <div>
                                    <div className="d-flex flex-col">
                                        <div className="p-2 flex-fill">
                                            <div className='row'>
                                                <div className='col-4 text-center' >
                                                    {selectedFile.name}
                                                    <VideoPlayer
                                                        //thumbnail TODO Put Thumbnail of video, undefined for audio
                                                        src={fileSrc}
                                                        onTimeUpdate={this.handleTimeUpdate}
                                                    />
                                                    {
                                                        !this.state.showSpinner && !_.isEmpty(editorData) &&
                                                        <Export
                                                            downloadAsDocx={this.downloadAsDocx}
                                                            downloadAsTxt={this.downloadAsTxt}
                                                            downloadAsSrt={this.downloadAsSrt}
                                                            onSave={this.updateTranscribedFile}
                                                            savingState={this.state.savingState}
                                                            fileType={selectedFile.options ? selectedFile.options.type : ''}
                                                            showDownloadSpinner={this.state.showDownloadSpinner}
                                                        />
                                                    }
                                                    {
                                                        trimmed &&
                                                        (
                                                            <div className='missing-credits-container'>
                                                                {
                                                                    remainingMinutes >= minutesToBePaid ?
                                                                        <div>
                                                                            <FormattedMessage id='Editor.trimmedReduceCreditMessage' values={{ minutesToShow, minutesToBePaid }} />
                                                                            <br />
                                                                            <Button onClick={this.reduceCredits}>
                                                                                <FormattedMessage id='Editor.reduceCredits' />
                                                                                {
                                                                                    showReduceCreditsSpinner && (
                                                                                        <Spinner animation="grow" role="status" size='sm' />
                                                                                    )
                                                                                }
                                                                            </Button>
                                                                        </div>
                                                                        :
                                                                        <div>
                                                                            <FormattedMessage id='Editor.trimmedPaymentMessage' values={{ minutesToShow, minutesToBePaid, amountToBePaid: '$' + amountToBePaid }} />
                                                                            < br />
                                                                            <Button onClick={this.goToPayment}>
                                                                                <FormattedMessage id='Editor.goToPayment' />
                                                                            </Button>
                                                                        </div>
                                                                }
                                                            </div>
                                                        )
                                                    }
                                                </div>
                                                <div className='col-8 editor-container'>
                                                    <SpeechTextEditor
                                                        editorState={editorState}
                                                        speakers={speakers}
                                                        currentTime={currentTime}
                                                        onTextChange={this.onTextChange}
                                                        editSpeaker={this.editSpeaker}
                                                        addNewSpeaker={this.addNewSpeaker}
                                                        setSpeaker={this.setSpeaker}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <React.Fragment>
                                        <Prompt
                                            when={this.state.blockNavigation}
                                            message={intl.formatMessage({ id: "Editor.leaveMessage" })}
                                        />
                                    </React.Fragment>
                                </div>
                            </div>
                        )
                    }
                </div>
            </div>
        );
    }
}

const mapStateToProps = ({ user, selectedFile }) => {
    return { user, selectedFile };
}

export default connect(mapStateToProps, { handleTimeChange, isPlaying, setEditorFocus, getFile, setTrimmedFileInfo })(injectIntl(withRouter(TranscriptionResult)));