import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { Container, Card, Form, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faCheck } from '@fortawesome/free-solid-svg-icons';
import TagsInput from 'react-tagsinput';
import 'react-tagsinput/react-tagsinput.css';

import { updateFile } from '../actions';

class UploadOptions extends Component {
    constructor(props) {
        super(props);
        
        var options = props.file.options || {};
        options.context = options.context || [];
        this.state = {
            file: props.file,
            editFileName: false,
            options
        }

        this.textRef = null;
        this.setTextRef = element => {
            this.textRef = element;
        }        
    }

    componentWillReceiveProps({ file }) {
        this.setState({
            file
        })
    }

    handleFileNameChange = (event) => {
        var { file } = this.state;
        file.name = event.target.value;
        this.setState({
            file
        });
    }

    saveFileName = () => {
        const { file } = this.state;
        this.props.updateFile(file, { name: file.name });
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
        const { file } = this.state;
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

    render() {
        const { language, supportedLanguages } = this.props;
        const { options } = this.state;
        return (
            <Container className='upload-options-container'>
                <Container className='upload-options-filename'>
                    { this.renderFileName() }
                </Container>
                <Form className='form-options'>
                    <Card>
                        <Card.Title className='options-title'>
                            Options
                        </Card.Title>
                        <Card.Body>
                            <Form.Label>
                                Spoken Language
                            </Form.Label>
                            <Form.Control
                                as='select'
                                defaultValue={ options.language || language }
                                onChange={(e) => this.handleOptionsChange('language', e.target.value)}
                            >
                                {
                                    supportedLanguages.map(lang => {
                                        return (
                                            <option value={ lang.key }>
                                                { lang.value }
                                            </option>
                                        )
                                    })
                                }
                            </Form.Control>
                            <br />
                            <Form.Label>
                                Number of Speakers
                            </Form.Label>
                            <Form.Control
                                type='number'
                                min='1'
                                max='10'
                                value={ options.speakerCount }
                                onChange={ (e) => this.handleOptionsChange('speakerCount', e.target.value) }
                            />
                            <br />
                            <Form.Label>
                                Context
                            </Form.Label>
                            <TagsInput
                                value={ options.context }
                                onChange={ (tags) => this.handleOptionsChange('context', tags) }
                            />
                        </Card.Body>
                    </Card>
                </Form>
            </Container>
        )
    }
}

const mapStateToProps = ({ language, supportedLanguages }) => {
    return { language, supportedLanguages };
}

export default connect(mapStateToProps, { updateFile })(UploadOptions);