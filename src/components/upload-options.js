import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Container, Form, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faCheck } from '@fortawesome/free-solid-svg-icons';

import { updateFile } from '../actions';

class UploadOptions extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            file: props.file,
            editFileName: false
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
    
    renderFileName = () => {
        const { file } = this.state;
        if(this.state.editFileName) {
            return (
                <div>
                    <Form.Control type='text' className='file-name-edit' value={ file.name || '' } onChange={ this.handleFileNameChange } />
                    <Button variant='primary' className='float-right' onClick={ () => this.setState({ editFileName: false })}>
                        <FontAwesomeIcon icon={ faCheck } onClick={ this.saveFileName } />
                    </Button>
                </div>
            )
        } else {
            return (
                <div>
                    <Form.Label className='upload-options-filename'>
                        { file.name }
                    </Form.Label>
                    <span className='float-right'>
                        <FontAwesomeIcon icon={ faEdit } onClick={ () => this.setState({ editFileName: true }) } size='2x' color='blue' />
                    </span>
                </div>
            )
        }
    }

    render() {
        return (
            <Container className='upload-options-container'>
                <Form>
                    { this.renderFileName() }
                    <Form.Label>
                        Spoken Language
                    </Form.Label>
                </Form>
            </Container>
        )
    }
}

export default connect(null, { updateFile })(UploadOptions);