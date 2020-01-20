import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Container, Card, Form, Button, Modal, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import * as SAlert from 'react-s-alert';
import TagsInput from 'react-tagsinput';
import 'react-tagsinput/react-tagsinput.css';

import Utils from '../utils';

const ModalPageNames = { INFO: 0, UPLOAD: 1 };

class UploadPopup extends Component {
    constructor(props) {
        super(props);
        this.fileInputRef = React.createRef();
        
        var options = !_.isEmpty(props.file) ? props.file.options : {};
        if(!options.speakerCount) options.speakerCount = 1;
        if(!options.context) options.context= [];
        this.state = {
            editFileName: false,
            options,
            fileName: props.file ? props.file.name : '',
            activeWindow: ModalPageNames.INFO
        }

        this.textRef = null;
        this.setTextRef = element => {
            this.textRef = element;
        }        
    }

    componentWillReceiveProps({ file }) {
        if(_.isEmpty(file)) return;
        var options = file.options || {};
        options.context = options.context || [];
        this.setState({
            options,
            fileName: file.name,
            editFileName: false
        })
    }

    openFileDialog = () => {
        const { intl } = this.props;
        if(!_.isEmpty(this.props.uploadingFiles)) {
            Alert.error(intl.formatMessage({
                id: 'Dropzone.multipleFileError'
            }));
            return;
        }
        this.fileInputRef.current.value = '';
        this.fileInputRef.current.click();
    }

    onFileAdded = (evt) => {
        const files = evt.target.files;
        if (this.props.onFileAdded && !_.isEmpty(files)) {
            this.props.onFileAdded(files[0]);
            this.setState({
                activeWindow: ModalPageNames.UPLOAD
            });
        }
    }

    handleFileNameChange = (event) => {
        this.setState({
            fileName: event.target.value
        });
    }

    saveFileName = () => {
        const { formatMessage } = this.props.intl;
        const { fileName, options } = this.state;
        if(_.isEmpty(fileName)) {
            SAlert.error(formatMessage({ id: 'UploadPopup.Error.emptyFileName' }));
            return;
        }
        options.fileName = fileName;
        this.setState({
            editFileName: false,
            options
        });
    }
    
    handleOptionsChange = (name, value) => {
        var { options } = this.state;
        options[name] = value;
        this.setState({
            options
        });
    }

    editFileName = () => {
        this.setState({ editFileName: true });
    }

    renderFileName = () => {
        const { fileName } = this.state;
        if(this.state.editFileName) {
            return (
                <div>
                    <Form.Group>
                        <Form.Label>
                            <FormattedMessage id='UploadPopup.Label.fileName' />
                        </Form.Label>
                        <br />
                        <Form.Control
                            type='text'
                            value={ fileName || '' }
                            onChange={ this.handleFileNameChange }
                            onBlur={ this.saveFileName }
                            ref={ i => i ? ReactDOM.findDOMNode(i).focus() : '' }
                        />
                        <Button variant='success' className='float-right' onClick={ () => this.setState({ editFileName: false })}>
                            <FontAwesomeIcon icon={ faCheck } onClick={ this.saveFileName } />
                        </Button>
                    </Form.Group>
                </div>
            )
        } else {
            return (
                <div>
                    <Form.Group>
                        <Form.Label>
                            <FormattedMessage id='UploadPopup.Label.fileName' />
                        </Form.Label>
                        <br />
                        <Form.Label onClick={ this.editFileName } className='name'>
                            { fileName }
                        </Form.Label>
                        {/* <span className='float-right'>
                            <FontAwesomeIcon icon={ faEdit } onClick={ this.editFileName } size='2x' color='blue' />
                        </span> */}
                    </Form.Group>
                </div>
            )
        }
    }

    submitForm = event => {
        const form = event.currentTarget;
        event.preventDefault();
        event.stopPropagation();
        if (form.checkValidity() === true) {
            const { language, file } = this.props;
            var { options } = this.state;
            if(!options.language) options.language = language;
            if(options.language.indexOf('-') === -1) {
                options.language = Utils.LanguageMap[options.language];
            }
            options.autoTranscribe = true;
            if(!options.speakerCount) options.speakerCount = 1;
            file.options = _.merge(file.options, options);
            // if(file.status === 'INITIAL') {
            //     this.props.updateFileInState(file.id, { options });
            // } else {
            //     this.props.updateFile(file, { options: file.options });
    
            //     if(file.status === 'CONVERTED') {
            //         this.props.updateFileState(file.id, 'READY');
            //     }
            // }
            this.props.approveFileUpload(file.options);
        }
        this.setState({
            activeWindow: ModalPageNames.INFO,
            validated: true
        });
    }

    cancelClicked = () => {
        this.setState({
            activeWindow: ModalPageNames.INFO
        }, () => {
            this.props.cancelFileUpload();
        })
    }

    renderWindows = () => {
        const { activeWindow } = this.state;

        if(activeWindow === ModalPageNames.INFO) {
            return this.renderInfoWindow();
        } else if(activeWindow === ModalPageNames.UPLOAD) {
            return this.renderUploadUptions();
        }
    }

    renderInfoWindow = () => {
        const { language, supportedLanguages, file, show } = this.props;
        const { options } = this.state;
        let selectedLanguage = options.language || language;
        let disabled = false;
        return (
            <div>
                <Modal.Header>
                    <div className='upload-info-page-header'>
                        In order to get the best transcription results, please make sure;
                    </div>
                </Modal.Header>
                <Modal.Body>
                    <Container>
                        <ul className='fa-ul'>
                            <li >
                                <span className='fa-li'>
                                    <i className='fa fa-check fa-2x' />
                                </span>
                                <label>
                                    The recording is free of background noise
                                </label>
                            </li>
                            <li>
                                <span className='fa-li'>
                                    <i className='fa fa-check fa-2x' />
                                </span>
                                <label>
                                    The speakers are close to microphone/device
                                </label>
                            </li>
                            <li>
                                <span className='fa-li'>
                                    <i className='fa fa-check fa-2x' />
                                </span>
                                <label>
                                    The speakers are not talking over
                                </label>
                            </li>
                        </ul>
                    </Container>
                </Modal.Body>
                <Modal.Footer className='float-right'>
                    <Button variant="danger" onClick={ this.cancelClicked }>
                        <FormattedMessage id='UploadPopup.cancelButton' />
                    </Button>
                    <Button variant="success" onClick={ this.openFileDialog }>
                        I understand
                        <span>
                            <i className='fa fa-arrow-right'></i>
                        </span>
                    </Button>
                </Modal.Footer>
            </div>
        )
    }

    renderUploadUptions = () => {
        const { language, supportedLanguages, file, show } = this.props;
        const { options } = this.state;
        const disabled = false;//file.status === 'PROCESSING' || file.status === 'DONE';
        let selectedLanguage = options.language || language;
        if(selectedLanguage.indexOf('-') > -1) selectedLanguage = selectedLanguage.substr(0, selectedLanguage.indexOf('-'));
        
        return (
            <div>
                <Modal.Header>
                    <b><FormattedMessage id='UploadPopup.header' /></b>
                </Modal.Header>
                <Form className='form-options' noValidate validated={ this.state.validated } onSubmit={ this.submitForm }>
                    <Modal.Body>
                    <Container className='upload-popup-filename'>
                            { this.renderFileName() }
                        </Container>
                        <Card>
                            <Card.Body>
                                <Form.Group>
                                    <Form.Label>
                                        <FormattedMessage id='UploadPopup.Label.spokenLanguage' />
                                    </Form.Label>
                                    <Form.Control
                                        as='select'
                                        defaultValue={ selectedLanguage }
                                        disabled={ disabled }
                                        required
                                        onChange={(e) => this.handleOptionsChange('language', e.target.value)}
                                    >
                                        {
                                            supportedLanguages.map(lang => {
                                                return (
                                                    <option key={ lang.key } value={ lang.key }>
                                                        { lang.value }
                                                    </option>
                                                )
                                            })
                                        }
                                    </Form.Control>
                                    <Form.Control.Feedback type="invalid">
                                        <FormattedMessage id='UploadPopup.Feedback.spokenLanguage' />
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <br />
                                <Form.Group>
                                    <Form.Label>
                                        <FormattedMessage id='UploadPopup.Label.numberOfSpeakers' />
                                    </Form.Label>
                                    <Form.Control
                                        type='number'
                                        required
                                        disabled={ disabled }
                                        min='1'
                                        max='10'
                                        value={ options.speakerCount }
                                        onChange={ (e) => this.handleOptionsChange('speakerCount', e.target.value) }
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        <FormattedMessage id='UploadPopup.Feedback.numberOfSpeakers' />
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <br />
                                <Form.Group>
                                    <Form.Label>
                                        <FormattedMessage id='UploadPopup.Label.context' />
                                    </Form.Label>
                                    <TagsInput
                                        value={ options.context }
                                        disabled= { disabled }
                                        className={ `react-tagsinput ${disabled ? 'disabled' : ''}` }
                                        onChange={ (tags) => this.handleOptionsChange('context', tags) }
                                        addOnBlur={ true }
                                    />
                                </Form.Group>
                                <br />
                                <Form.Group>
                                    <Alert variant='success'>Your transcription will automatically start after upload is complete.</Alert>
                                </Form.Group>
                            </Card.Body>
                        </Card>
                    </Modal.Body>
                    <Modal.Footer className='float-right'>
                        <Button variant="danger" onClick={ this.cancelClicked }>
                            <FormattedMessage id='UploadPopup.cancelButton' />
                        </Button>
                        <Button type='submit' variant="success">
                            <FormattedMessage id='UploadPopup.submitButton' />
                        </Button>
                    </Modal.Footer>
                </Form>
            </div>
        )
    }

    render() {
        return (
            <Modal show={ this.props.show } size='lg' className='upload-modal' centered>
                {
                    this.renderWindows()
                }
                <input
                    ref={ this.fileInputRef }
                    className='file-input'
                    type="file"
                    onChange={ this.onFileAdded }
                />
            </Modal>
        )
    }
}

export default injectIntl(UploadPopup);