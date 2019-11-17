import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { FormattedHTMLMessage } from 'react-intl';
import { Modal, Form, Row, Col, Button } from 'react-bootstrap';
import Rating from 'react-rating';

import './../styles/evaluation.css';
import { saveEvaluation } from './../actions';

class EvaluationPopup extends Component {
    constructor(props) {
        super(props);

        console.log(props)
        let fileInfo = props.match.params.fileInfo;
        if(_.isEmpty(props.match.params) || _.isEmpty(props.match.params.fileInfo)) {
            this.props.history.push('/');
        } else {
            fileInfo = fileInfo.split('_');
            let userId = fileInfo[0];
            let fileId = fileInfo[1];
            
            this.state = {
                transcriptionRating: 0,
                editorRating: 0,
                thoughts: '',
                userId,
                fileId
            }
        }
    }
    
    transcriptionRatingClicked = (value) => {
        this.setState({
            transcriptionRating: value
        })
    }

    editorRatingClicked = (value) => {
        this.setState({
            editorRating: value
        })
    }

    handleThoughtsChange = (e) => {
        this.setState({
            thoughts: e.target.value
        })
    }

    handleSuccess = () => {
        var that = this;
        this.props.saveEvaluation(this.state);
        this.setState({
            evaluationSaved: true
        }, () => {
            setTimeout(() => {
                that.props.history.push('/')
            }, 5000)
        })
    }

    handleCancel = () => {
        this.props.history.push('/');
    }

    renderSuccess = () => {
        return (
            <Modal show={true}>
                <Modal.Header>
                    Thank you for your feedback!
                </Modal.Header>
                <Modal.Body>
                    <i>You will be redirected to SpeechText.io soon...</i>
                </Modal.Body>
            </Modal>
        )
    }

    render() {
        if(_.isEmpty(this.state)) return null;
        if(this.state.evaluationSaved) {
            return this.renderSuccess();
        }
        return (
            <div>
                <Modal show={true} size="lg">
                    <Modal.Header>
                        <b>
                            Please give us feedback for the service given by SpeechText.io
                        </b>
                    </Modal.Header>
                    <Modal.Body>
                        <div>
                            <Row>
                                <Col lg='8'>
                                    Rate your experience with uploading / transcription process
                                </Col>
                                <Col lg='4'>
                                    <Rating
                                        emptySymbol="fa fa-star-o fa-2x"
                                        fullSymbol="fa fa-star fa-2x"
                                        fractions={2}
                                        className='rating m-auto'
                                        initialRating={ this.state.transcriptionRating }
                                        onClick={ this.transcriptionRatingClicked }
                                    />
                                </Col>
                            </Row>
                            <br />
                            <Row>
                                <Col lg='8'>
                                    Rate your experience with our online editor
                                </Col>
                                <Col lg='4'>
                                    <Rating
                                        emptySymbol="fa fa-star-o fa-2x"
                                        fullSymbol="fa fa-star fa-2x"
                                        fractions={2}
                                        className='rating m-auto'
                                        initialRating={ this.state.editorRating }
                                        onClick={ this.editorRatingClicked }
                                    />
                                </Col>
                            </Row>
                            <br />
                            <div>
                                <p>Any other comments about SpeechText.io? Let us know</p>
                                <Form.Control
                                    required
                                    type="text"
                                    as="textarea"
                                    rows="6"
                                    value={this.state.thoughts || ''}
                                    onChange={ this.handleThoughtsChange }
                                />                            
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant='danger' onClick={ this.handleCancel }>
                            Cancel
                        </Button>
                        <Button variant='success' onClick={ this.handleSuccess }>
                            Submit
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        )
    }
}

const mapStateToProps = ({ language }) => {
    return {
        language
    }
}

export default connect(mapStateToProps, { saveEvaluation })(EvaluationPopup);