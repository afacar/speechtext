import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import { FormattedMessage, FormattedHTMLMessage, injectIntl } from 'react-intl';
import { Container, Card, Form, Button, Modal, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import * as SAlert from 'react-s-alert';
import TagsInput from 'react-tagsinput';
import 'react-tagsinput/react-tagsinput.css';

import Utils from '../utils';

const ModalPageNames = { INFO: 0, UPLOAD: 1, ERROR: 2, SUCCESS: 3 };

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
            const file = files[0];

            const sizeInMB = Utils.formatSizeByteToMB(file.size);
            if(sizeInMB > 500) {
                this.setState({
                    activeWindow: ModalPageNames.ERROR
                });
            } else {
                this.props.onFileAdded(files[0]);
                this.setState({
                    activeWindow: ModalPageNames.UPLOAD
                });
            }
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
                        <div className='d-flex'>
                            <Form.Control
                                type='text'
                                value={ fileName || '' }
                                onChange={ this.handleFileNameChange }
                                onBlur={ this.saveFileName }
                                ref={ i => i ? ReactDOM.findDOMNode(i).focus() : '' }
                                className='file-name-edit'
                            />
                            <Button variant='success' className='float-right ml-3' onClick={ () => this.setState({ editFileName: false })}>
                                <FontAwesomeIcon icon={ faCheck } onClick={ this.saveFileName } />
                            </Button>
                        </div>
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
    
            this.props.approveFileUpload(file.options);
        }
        this.setState({
            validated: true,
            activeWindow: ModalPageNames.SUCCESS
        });
    }

    cancelClicked = () => {
        this.setState({
            activeWindow: ModalPageNames.INFO
        }, () => {
            this.props.cancelFileUpload();
        })
    }

    closePopup = () => {
        this.setState({
            activeWindow: ModalPageNames.INFO
        }, () => {
            this.props.closeFileUploadPopup()
        })
    }

    renderWindows = () => {
        const { activeWindow } = this.state;

        if(activeWindow === ModalPageNames.INFO) {
            return this.renderInfoWindow();
        } else if(activeWindow === ModalPageNames.UPLOAD) {
            return this.renderUploadUptions();
        } else if(activeWindow === ModalPageNames.ERROR) {
            return this.renderError();
        } else if(activeWindow === ModalPageNames.SUCCESS) {
            return this.renderSuccess();
        }
    }

    renderInfoWindow = () => {
        return (
            <div>
                <Modal.Header>
                    <div className='upload-info-page-header'>
                        <FormattedMessage id='UploadPopup.InfoWindow.title' />
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
                                    <FormattedMessage id='UploadPopup.InfoWindow.info1' />
                                </label>
                            </li>
                            <li>
                                <span className='fa-li'>
                                    <i className='fa fa-check fa-2x' />
                                </span>
                                <label>
                                    <FormattedMessage id='UploadPopup.InfoWindow.info2' />
                                </label>
                            </li>
                            <li>
                                <span className='fa-li'>
                                    <i className='fa fa-check fa-2x' />
                                </span>
                                <label>
                                    <FormattedMessage id='UploadPopup.InfoWindow.info3' />
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
                        <FormattedMessage id='UploadPopup.infoConfirmButton' />
                        <span>
                            <i className='fa fa-arrow-right'></i>
                        </span>
                    </Button>
                </Modal.Footer>
            </div>
        )
    }

    renderUploadUptions = () => {
        const { language, supportedLanguages, intl } = this.props;
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
                                    <Alert variant='success'>{ intl.formatMessage({ id: 'UploadPopup.infoText' }) }</Alert>
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

    renderError = () => {
        return (
            <div>
                <Modal.Header>
                    <b>
                        <FormattedMessage id='FileUpload.fileSizeErrorTitle' />
                    </b>
                </Modal.Header>
                <Modal.Body>
                    <Container>
                        <p>
                            <FormattedMessage id='FileUpload.fileSizeError' />
                        </p>
                    </Container>
                </Modal.Body>
                <Modal.Footer className='float-right'>
                    <Button variant="danger" onClick={ this.cancelClicked }>
                        <FormattedMessage id='UploadPopup.cancelButton' />
                    </Button>
                    <Button onClick={ this.openFileDialog }>
                        <FormattedMessage id='UploadPopup.retryButton' />
                    </Button>
                </Modal.Footer>
            </div>
        )
    }

    renderSuccess = () => {
        return (
            <div>
                <Modal.Header>
                    <b>
                        <FormattedMessage id='FileUpload.successTitle' />
                    </b>
                </Modal.Header>
                <Modal.Body>
                    <Container>
                        <p>
                            <FormattedHTMLMessage id='FileUpload.successMessage' />
                        </p>
                    </Container>
                </Modal.Body>
                <Modal.Footer className='float-right'>
                    <Button variant="success" onClick={ this.closePopup }>
                        <FormattedMessage id='UploadPopup.closeButton' />
                    </Button>
                </Modal.Footer>
            </div>
        )
    }

    render() {
        return (
            <Modal show={ this.props.show } size='lg' className={ this.state.activeWindow === ModalPageNames.ERROR ? '' : 'upload-modal' } centered>
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