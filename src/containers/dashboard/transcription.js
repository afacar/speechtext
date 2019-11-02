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
            let dataSnapshot = await firebase.firestore().doc(docPath).get();

            if(dataSnapshot) {
                let editorData = dataSnapshot.data();
                this.setState({
                    editorData,
                    prevEditorData: _.cloneDeep(editorData)
                }, () => {
                    intervalHolder = setInterval(() => {
                        that.updateTranscribedFile();
                    }, 10000);
                });
            }

            // var storageRef = firebase.storage().ref(selectedFile.transcribedFile.filePath);
            // storageRef.getDownloadURL().then((downloadUrl) => {
            //     Axios.get(downloadUrl)
            //     .then(({ data }) => {
            //         that.formatResults(data);
            //     });
            // })
            // .catch(error => {
            //     // TODO: GET_DOWNLOAD_URL_ERROR
            //     console.log(error);
            // })
        } else {
            this.setState({
                editorData: {},
                prevEditorData: {},
                intervalHolder: undefined
            })
        }
        this.setState({
            showSpinner: false
        });
    }

    componentWillUnmount = async () => {
        await this.updateTranscribedFile();
    }

    updateTranscribedFile = async () => {
        const { editorData, prevEditorData } = this.state;
        const { selectedFile, user } = this.props;
        const fileId = selectedFile.id;
        const uid = user.uid;
        // if(!_.isEqual(editorData, prevEditorData)) { // TODO:
            this.setState({
                prevEditorData: editorData
            });
            
            const docPath = `userfiles/${uid}/files/${fileId}/result/transcription`;
            await firebase.firestore().doc(docPath).set(editorData);
        // }
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
        this.updateTranscribedFile();

        const { selectedFile } = this.props;
        const { editorData } = this.state;
        var textData = '';
        _.each(editorData.results, data => {
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

    downloadAsSrt = () => {
        var that = this;
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

    // formatResults = (data) => {
    //     var that = this;
    //     if(data) {
    //         var splittedData = data.split('---');
    //         if(!_.isEmpty(splittedData)) {
    //             var { intervalHolder } = this.state;
    //             var editorData = []
    //             var i = 0;
    //             splittedData.forEach(line => {
    //                 var lines = line.split(' \n ');
    //                 var times = lines[0].split(' - ');
    //                 editorData.push({
    //                     key: i++,
    //                     startTime: times[0],
    //                     endTime: times[1],
    //                     text: lines[1]
    //                 });
    //             });
    //             if(intervalHolder) clearInterval(intervalHolder);
    //             intervalHolder = setInterval(() => {
    //                 that.updateTranscribedFile();
    //             }, 5000);
    //             this.setState({
    //                 editorData,
    //                 prevEditorData: editorData,
    //                 intervalHolder
    //             });
    //         }
    //     }
    //     this.setState({
    //         showSpinner: false
    //     })
    // }

    getTranscriptionText = (words) => {
        let transcriptionText = '';
        _.each(words, (word, index) => {
            transcriptionText += (index > 0 ? ' ' : '') + word.word;
        });
        return transcriptionText;
    }

    handleWordChange = (index, wordIndex, text) => {
        var { editorData } = this.state;
        let prevEditorData = _.cloneDeep(editorData);
        editorData.results[index].alternatives[0].words[wordIndex].word = text;
        editorData.results[index].alternatives[0].transcript = this.getTranscriptionText(editorData.results[index].alternatives[0].words);

        this.setState({
            editorData,
            prevEditorData
        })
    }

    renderResults = () => {
        const { editorData } = this.state;
        if(_.isEmpty(editorData)) return null;

        const { formatMessage } = this.props.intl;
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
                            <Dropdown.Item as="button" onClick={ this.downloadAsSrt }>
                                <FormattedMessage id='Transcription.Download.option3' />
                            </Dropdown.Item>
                        </DropdownButton>
                    </div>
                    <br />
                    <SpeechTextEditor
                        editorData={ editorData ? editorData.results : [] }
                        handleWordChange={ this.handleWordChange }
                        suppressContentEditableWarning
                        playerTime={ this.state.playerTime }
                        editorClicked={ this.editorClicked }
                        isPlaying={ this.state.isPlaying }
                    />
                </div>
        );
    }

    // renderResults = () => {
    //     const { editorData, selectedTextIndex, newEditorData } = this.state;
    //     if(!_.isEmpty(editorData)) {
    //         const { formatMessage } = this.props.intl;
    //         var data = editorData.map((data, index) => {
    //             if(!_.isEmpty(data.startTime) && !_.isEmpty(data.endTime)) {
    //                 return (
    //                     <div className='conversionResult' key={ index } onClick={ () => this.transcriptionClicked(index) } >
    //                         <ContentEditable
    //                             className='conversionTime'
    //                             html={ data.startTime + ' - ' + data.endTime } // innerHTML of the editable div
    //                             disabled={ true } // use true to disable edition
    //                         />
    //                         <ContentEditable
    //                             ref={ (r) => { if(index === selectedTextIndex) this.currentEditableText = r }}
    //                             id={ 'editable-content-' + index }
    //                             html={ data.text } // innerHTML of the editable div
    //                             disabled={ false } // use true to disable edition
    //                             onChange={ (e) => { this.handleChange(data.key, e.target.value) }} // handle innerHTML change
    //                         />
    //                         <br />
    //                     </div>
    //                 )
    //             }
    //         });
    //         if(!_.isEmpty(newEditorData) && !_.isEmpty(newEditorData.results)) {
    //             data = this.renderResultsPlus(newEditorData.results);
    //         }

    //         return (
    //             <div className=''>
    //                 <div className='d-flex flex-col justify-content-end align-items-center'>
    //                     {
    //                         this.state.showDownloadSpinner &&
    //                         <Spinner
    //                             as="span"
    //                             animation="border"
    //                             size="sm"
    //                             role="status"
    //                             aria-hidden="true"
    //                             className='margin-right-5'
    //                         />
    //                     }
    //                     <DropdownButton id="dropdown-item-button" title={ formatMessage({ id:'Transcription.Download.text' })}>
    //                         <Dropdown.Item as="button" onClick={ this.downloadAsTxt }>
    //                             <FormattedMessage id='Transcription.Download.option1' />
    //                         </Dropdown.Item>
    //                         <Dropdown.Item as="button" onClick={ this.downloadAsDocx }>
    //                             <FormattedMessage id='Transcription.Download.option2' />
    //                         </Dropdown.Item>
    //                     </DropdownButton>
    //                 </div>
    //                 <br />
    //                 { data }
    //             </div>
    //         );
    //     }
    //     return false;
    // }

    editorClicked = (seconds) => {
        this.setState({
            timeToSeek: seconds
        }, () => {
            this.setState({
                timeToSeek: undefined
            })
        })
    }

    // transcriptionClicked = (index) => {
    //     const { editorData } = this.state;
    //     let selectedRow = editorData[index];
    //     let splittedTime = selectedRow.startTime.trim().split(':');
    //     var timeToSeek = 0;
    //     if(splittedTime.length === 3) {
    //         timeToSeek += parseInt(splittedTime[0] * 3600);
    //         timeToSeek += parseInt(splittedTime[1] * 60);
    //         timeToSeek += parseInt(splittedTime[2]);
    //     } else if(splittedTime.length === 2) {
    //         timeToSeek += parseInt(splittedTime[0] * 60);
    //         timeToSeek += parseInt(splittedTime[1]);
    //     }
    //     this.setState({
    //         timeToSeek
    //     }, () => {
    //         this.setState({
    //             timeToSeek: undefined
    //         })
    //     });
    // }

    // getFormattedTimeInSeconds = (startTime) => {
    //     var splittedTime = startTime.trim().split(':');
    //     var timeInSeconds = 0;
    //     if(splittedTime.length === 3) {
    //         timeInSeconds += parseInt(splittedTime[0] * 3600);
    //         timeInSeconds += parseInt(splittedTime[1] * 60);
    //         timeInSeconds += parseInt(splittedTime[2]);
    //     } else if(splittedTime.length === 2) {
    //         timeInSeconds += parseInt(splittedTime[0] * 60);
    //         timeInSeconds += parseInt(splittedTime[1]);
    //     }
    //     return timeInSeconds;
    // }

    // handleChange = (key, value) => {
    //     var { editorData } = this.state;
    //     var prevEditorData = [];
    //     editorData = editorData.map((data) => {
    //         prevEditorData.push({...data});
    //         if(data.key === key) {
    //             data.text = value;
    //         }
    //         return data;
    //     });
    //     this.setState({
    //         editorData,
    //         prevEditorData,
    //         timeToSeek: undefined
    //     });
    // }
    
    handleTimeChange = (currentTime) => {
        let seconds = Math.floor(currentTime);
        let nanoSeconds = parseInt((currentTime - seconds) * 1000);
        this.setState({
            playerTime: {
                seconds,
                nanoSeconds
            }
        });

        // const { editorData } = this.state;
        // _.each(editorData, (data, index) => {
        //     if(data.startTime && data.endTime) {
        //         let startTime = this.getFormattedTimeInSeconds(data.startTime);
        //         let endTime = this.getFormattedTimeInSeconds(data.endTime);
        //         if(startTime <= currentTime && currentTime < endTime) {
        //             this.setState({
        //                 selectedTextIndex: index
        //             });
        //             return false;
        //         }
        //     }
        // })
        // setTimeout(() =>{
        //     if(this.currentEditableText) {
        //         this.currentEditableText.el.current.focus();
        //     }
        // }, 500);
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