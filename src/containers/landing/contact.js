import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { Container, Row, Col, Form, Card, Button } from 'react-bootstrap';
import Alert from 'react-s-alert';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { faTwitterSquare, faFacebookSquare, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { submitContactForm } from '../../actions';

import '../../styles/contact.css';

class Contact extends Component {
    constructor(props) {
        super(props);

        this.state = {
            values: {}
        };
    }

    handleValueChange = (stateName, value) => {
        var { values } = this.state;
        values[stateName] = value;
        this.setState({
            values
        });
    }

    handleSubmit = event => {
        var that = this;
        const { values } = this.state;
        const form = event.currentTarget;
        event.preventDefault();
        event.stopPropagation();
        if (form.checkValidity() === true) {
            // Submit Contact Form to db
            this.props.submitContactForm(values)
                .then((res) => {
                    Alert.success(res);
                    that.setState({ validated: false });
                })
                .catch(err => Alert.error(err))

            that.setState({
                values: {},
                validated: false
            });
            if (that.props.goToRef)
                that.props.goToRef('topRef');
        }
        this.setState({ validated: true });
        if (this.props.closeContactForm)
            this.props.closeContactForm();
    };

    render() {
        return (
            <Container className="contact-content mb-5 mt-5">
                <Row>
                    <Col lg='5' md='5' sm='12' xs='12'>
                        <h4><b>
                            <FormattedMessage id="Contact.title" />
                        </b></h4>
                        <br />
                        <p>
                            <FormattedMessage id="Contact.message" />
                        </p>
                        {/* <div>
                            <FontAwesomeIcon icon={ faPhoneAlt } size='2x' className='float-left' />
                            <p className='contact-info-data'>+90 554 242 14 17</p>
                        </div> */}
                        <br />
                        <div>
                            <FontAwesomeIcon icon={ faEnvelope } size='2x' className='float-left' />
                            <p className='contact-info-data'>
                                <a href='mailto:support@speechtext.io' target='_blank' rel="noopener noreferrer">support@speechtext.io</a>
                            </p>
                        </div>
                        <div>
                            <FontAwesomeIcon icon={ faTwitterSquare } size='2x' className='float-left' />
                            <p className='contact-info-data'>
                                <a href='https://twitter.com/speechtext_io' target='_blank' rel="noopener noreferrer">/speechtext_io</a>
                            </p>
                        </div>
                        <div>
                            <FontAwesomeIcon icon={ faFacebookSquare } size='2x' className='float-left' />
                            <p className='contact-info-data'>
                                <a href='https://www.facebook.com/speechtext.io' target='_blank' rel="noopener noreferrer">/speechtext.io</a>
                            </p>
                        </div>
                        <div>
                            <FontAwesomeIcon icon={ faLinkedin } size='2x' className='float-left' />
                            <p className='contact-info-data'>
                                <a href='https://www.linkedin.com/in/speechtext-io-425b28195/' target='_blank' rel="noopener noreferrer">/speechtext-io-425b28195</a>
                            </p>
                        </div>
                    </Col>
                    <Col lg='7' md='7' sm='12' xs='12'>
                        <Card className='card-style'>
                            <Form noValidate validated={this.state.validated} onSubmit={this.handleSubmit} >
                                <Form.Group controlId="formName">
                                    <Form.Label>
                                        <FormattedMessage id="Contact.Form.Label.nameSurname" />
                                    </Form.Label>
                                    <Form.Control
                                        required
                                        type="text"
                                        maxLength="100"
                                        value={this.state.values.nameSurname || ''}
                                        onChange={(e) => { this.handleValueChange('nameSurname', e.target.value) }}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        <FormattedMessage id="Contact.Form.Feedback.nameSurname" />
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group controlId="formEmail">
                                    <Form.Label>
                                        <FormattedMessage id="Contact.Form.Label.email" />
                                    </Form.Label>
                                    <Form.Control
                                        required
                                        type="email"
                                        maxLength="50"
                                        value={this.state.values.email || ''}
                                        onChange={(e) => { this.handleValueChange('email', e.target.value) }}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        <FormattedMessage id="Contact.Form.Feedback.email" />
                                    </Form.Control.Feedback>
                                </Form.Group>
                                
                                <Form.Group controlId="formUsageNeeded">
                                    <Form.Label>
                                        <FormattedMessage id="Contact.Form.Label.opinions" />
                                    </Form.Label>
                                    <Form.Control
                                        required
                                        type="text"
                                        as="textarea"
                                        rows="6"
                                        value={this.state.values.opinions || ''}
                                        onChange={(e) => { this.handleValueChange('opinions', e.target.value) }}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        <FormattedMessage id="Contact.Form.Feedback.opinions" />
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <Button type="submit" className='submit-button-style'>
                                    <FormattedMessage id="Contact.Form.Button.text" />
                                </Button>
                            </Form>
                        </Card>
                    </Col>
                </Row>
            </Container>
        )
    }
}

export default connect(null, { submitContactForm })(Contact);