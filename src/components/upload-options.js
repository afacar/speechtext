import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import _ from 'lodash';
import { Container, Card, Form, Button } from 'react-bootstrap';
import BootstrapSwitchButton from 'bootstrap-switch-button-react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faCheck } from '@fortawesome/free-solid-svg-icons';
import TagsInput from 'react-tagsinput';
import 'react-tagsinput/react-tagsinput.css';

import { updateFile, updateFileState, updateFileInState } from '../actions';
import Utils from '../utils';

class UploadOptions extends Component {
    constructor(props) {
        super(props);
        
        var options = props.file ? props.file.options : {};
        if(!options.context) options.context= [];
        this.state = {
            editFileName: false,
            options
        }

        this.textRef = null;
        this.setTextRef = element => {
            this.textRef = element;
        }        
    }

    componentWillReceiveProps({ file }) {
        var options = file.options || {};
        options.context = options.context || [];
        this.setState({
            options,
            fileName: file.name,
            editFileName: false
        })
    }

    handleFileNameChange = (event) => {
        this.setState({
            fileName: event.target.value
        });
    }

    saveFileName = () => {
        const { file } = this.props;
        const { fileName } = this.state;
        this.props.updateFile(file, { name: fileName });
        this.setState({
            editFileName: false
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
        const { file } = this.props;
        if(this.state.editFileName) {
            return (
                <div>
                    <Form.Control
                        type='text'
                        className='file-name-edit'
                        value={ file.name || '' }
                        onChange={ this.handleFileNameChange }
                        onBlur={ this.saveFileName }
                        ref={ i => i ? ReactDOM.findDOMNode(i).focus() : '' }
                    />
                    <Button variant='primary' className='float-right' onClick={ () => this.setState({ editFileName: false })}>
                        <FontAwesomeIcon icon={ faCheck } onClick={ this.saveFileName } />
                    </Button>
                </div>
            )
        } else {
            return (
                <div>
                    <Form.Label onClick={ this.editFileName }>
                        { file.name }
                    </Form.Label>
                    <span className='float-right'>
                        <FontAwesomeIcon icon={ faEdit } onClick={ this.editFileName } size='2x' color='blue' />
                    </span>
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
            if(options.language.indexOf('-') == -1) {
                options.language = Utils.LanguageMap[options.language];
            }
            file.options = _.merge(file.options, options);
            if(file.status === 'INITIAL') {
                this.props.updateFileInState(file.id, { options });
            } else {
                this.props.updateFile(file, { options: file.options });
    
                if(file.status === 'CONVERTED') {
                    this.props.updateFileState(file.id, 'READY');
                }
            }
        }
        this.setState({ validated: true });
    }

    render() {
        const { language, supportedLanguages, file } = this.props;
        const { options } = this.state;
        const disabled = file.status === 'PROCESSING' || file.status === 'DONE';
        let selectedLanguage = options.language || language;
        if(selectedLanguage.indexOf('-') > -1) selectedLanguage = selectedLanguage.substr(0, selectedLanguage.indexOf('-'));
        return (
            <Container className='upload-options-container'>
                <Container className='upload-options-filename'>
                    { this.renderFileName() }
                </Container>
                <Form className='form-options' noValidate validated={ this.state.validated } onSubmit={ this.submitForm }>
                    <Card>
                        <Card.Title className='options-title'>
                            Options
                        </Card.Title>
                        <Card.Body>
                            <Form.Group>
                                <Form.Label>
                                    Spoken Language
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
                                    Select Spoken Language
                                </Form.Control.Feedback>
                            </Form.Group>
                            <br />
                            <Form.Group>
                                <Form.Label>
                                    Number of Speakers
                                </Form.Label>
                                <Form.Control
                                    type='number'
                                    required
                                    disabled={ disabled }
                                    min='1'
                                    max='10'
                                    value={ options.speakerCount || 1 }
                                    onChange={ (e) => this.handleOptionsChange('speakerCount', e.target.value) }
                                />
                                <Form.Control.Feedback type="invalid">
                                        Enter Number of Speakers
                                </Form.Control.Feedback>
                            </Form.Group>
                            <br />
                            <Form.Group>
                                <Form.Label>
                                    Context
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
                                <Form.Label>
                                    Auto Transcribe on Upload Complete
                                </Form.Label>
                                <BootstrapSwitchButton
                                    key={ file.id }
                                    checked={ options.autoTranscribe }
                                    disabled={ disabled }
                                    onlabel='On'
                                    onstyle='success'
                                    offlabel='Off'
                                    offstyle='secondary'
                                    style='mx-3'
                                    onChange={(checked) => this.handleOptionsChange('autoTranscribe', checked) }
                                />
                            </Form.Group>
                            {
                                !disabled &&
                                <Button type="submit" className='float-right'>
                                    Submit
                                </Button>
                            }
                        </Card.Body>
                    </Card>
                </Form>
            </Container>
        )
    }
}

const mapStateToProps = ({ language, supportedLanguages, selectedFile }) => {
    return {
        language,
        supportedLanguages,
        file: selectedFile };
}

export default connect(mapStateToProps, { updateFile, updateFileState, updateFileInState })(UploadOptions);