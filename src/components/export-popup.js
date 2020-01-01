import React, { Component } from 'react';
import _ from 'lodash';
import { Container, Form, Button, Modal, Spinner } from 'react-bootstrap';
import { FormattedMessage, injectIntl } from 'react-intl';
import Axios from 'axios';

import firebase from '../utils/firebase';

class ExportPopup extends Component {
    constructor(props) {
        super(props);

        this.state = {
            exportType: 'txt'
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

    getTranscriptionData = () => {
        var that = this;
        const { file } = this.props;
        var storageRef = firebase.storage().ref(file.transcribedFile.filePath);
        storageRef.getDownloadURL().then((downloadUrl) => {
            Axios.get(downloadUrl)
                .then(({ data }) => {
                    that.downloadAsTxt(data);
                });
        })
        .catch(error => {
            // TODO: GET_DOWNLOAD_URL_ERROR
            console.log(error);
        })
    }

    downloadAsTxt = (editorData) => {
        if(_.isEmpty(editorData)) editorData = this.state.editorData;
        if(_.isEmpty(editorData)) {
            this.getTranscriptionData();
        } else {
            const { file } = this.props;
            var textData = '';
            _.each(editorData, data => {
                let alternative = data.alternatives[0];
                let { startTime, endTime, transcript } = alternative;
                textData += `${this.formatTime(startTime)} - ${this.formatTime(endTime)}\n${transcript}\n\n`;
            });
    
            var fileName = file.name;
            fileName = fileName.substr(0, fileName.lastIndexOf('.')) + '.txt';
    
            const element = document.createElement("a");
            const fileToUpload = new Blob([textData], { type: 'text/plain' });
            element.href = URL.createObjectURL(fileToUpload);
            element.download = fileName;
            document.body.appendChild(element); // Required for this to work in FireFox
            element.click();
            this.props.closeModal();
        }
    }

    downloadAsDocx = async () => {
        var that = this;
        var { file } = this.props;
        this.setState({ showSpinner: true });

        var getDocxFile = firebase.functions().httpsCallable('getDocxFile');
        getDocxFile({
            fileId: file.id
        }).then(({ data }) => {
            var storageRef = firebase.storage().ref(data.filePath);
            var fileName = file.name;
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
                        that.props.closeModal();
                        this.setState({ showSpinner: false });
                    });
                })
        }).catch((err) => {
            // TODO: GET_DOCX_FILE_ERROR
            console.log(err);
        });
    }

    downloadAsSrt = async () => {
        var that = this;
        var { file } = this.props;
        this.setState({ showSpinner: true });

        var getSrtFile = firebase.functions().httpsCallable('getSrtFile');
        getSrtFile({
            fileId: file.id
        }).then(({ data }) => {
            var storageRef = firebase.storage().ref(data.filePath);
            var fileName = file.name.replace(',', '').split(' ').join('_');
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
                        that.props.closeModal();
                        this.setState({ showSpinner: false });
                    });
                })
        }).catch((err) => {
            // TODO: GET_SRT_FILE_ERROR
            console.log(err);
        });
    }

    downloadFile = () => {
        const { exportType } = this.state;
        switch(exportType) {
            case 'srt':
                this.downloadAsSrt();
                break;
            case 'txt':
                this.downloadAsTxt();
                break;
            case 'docx':
                this.downloadAsDocx();
                break;
            default:
                break;
        }
    }

    handleExportTypeChange = (e) => {
        this.setState({
            exportType: e.target.value
        })
    }

    render() {
        const { formatMessage } = this.props.intl;
        return (
            <Modal show={ this.props.show } onHide={ this.props.closeModal } size='md' className='export-modal' centered dialogClassName="export-modal">
                <div>
                    <Modal.Header closeButton>
                        <div className='export-info-page-header'>
                            Select the type you want to export
                        </div>
                    </Modal.Header>
                    <Modal.Body>
                        <Container>
                            <Form>
                                <Form.Control
                                    as='select'
                                    defaultValue='txt'
                                    required
                                    onChange={this.handleExportTypeChange }
                                >
                                    <option></option>
                                    <option key='txt' value='txt'>
                                        { formatMessage({ id:'Transcription.Download.option1' }) }
                                    </option>
                                    <option key='docx' value='docx'>
                                        { formatMessage({ id:'Transcription.Download.option2' }) }
                                    </option>
                                    <option key='srt' value='srt'>
                                        { formatMessage({ id:'Transcription.Download.option3' }) }
                                    </option>
                                </Form.Control>
                                <Form.Control.Feedback type="invalid">
                                    <FormattedMessage id='UploadPopup.Feedback.spokenLanguage' />
                                </Form.Control.Feedback>
                            </Form>
                        </Container>
                    </Modal.Body>
                    <Modal.Footer className='float-right'>
                        <Button variant="danger" onClick={ this.props.closeModal }>
                            <FormattedMessage id='UploadPopup.cancelButton' />
                        </Button>
                        <Button type='submit' variant="success" onClick={ this.downloadFile }>
                            {
                                this.state.showSpinner &&
                                <Spinner
                                    as="span"
                                    animation="border"
                                    size="sm"
                                    role="status"
                                    aria-hidden="true"
                                />
                            }{
                                !this.state.showSpinner &&
                                <div>Export</div>
                            }
                        </Button>
                    </Modal.Footer>
                </div>
            </Modal>
        )
    }
}

export default injectIntl(ExportPopup);