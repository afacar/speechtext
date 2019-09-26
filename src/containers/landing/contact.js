import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import Axios from 'axios';
import { Container, Form, Col, Card, Button } from 'react-bootstrap';
import IntlTelInput from 'react-bootstrap-intl-tel-input'
import Alert from 'react-s-alert';
import '../../styles/contact.css';

const serverUrl = 'http://localhost:3001';

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

    handlePhoneChange = (data) => {
        var { values } = this.state;
        values['phone'] = data.intlPhoneNumber;
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
            Axios.post(`${serverUrl}/saveDemoRequest`, { data: values })
                .then((response) => {
                    Alert.success("Talebiniz alınmıştır.\nGöndereceğimiz emailde yer alan link üzerinden demo'ya erişebilirsiniz.",
                        {
                            timeout: 10000
                        }
                    );
                    that.setState({
                        values: {},
                        validated: false
                    });
                    that.props.goToRef('topRef');
                })
                .catch((err) => {
                    Alert.error(err);
                })
        }
        this.setState({ validated: true });
    };

    render () {
        return (
            <Container className="mb-5 mt-5">
                <h4>
                    <FormattedMessage id="DemoRequest.title" />
                </h4>
                <Card className='card-style'>
                    <Form noValidate validated={ this.state.validated } onSubmit={ this.handleSubmit } >
                        <Form.Group controlId="formName">
                            <Form.Label>
                                <FormattedMessage id="DemoRequest.Form.Label.nameSurname" />
                            </Form.Label>
                            <Form.Control
                                required
                                type="text"
                                maxLength="100"
                                value={ this.state.values.nameSurname || '' }
                                onChange={ (e) => { this.handleValueChange('nameSurname', e.target.value) } }
                            />
                            <Form.Control.Feedback type="invalid">
                                <FormattedMessage id="DemoRequest.Form.Feedback.nameSurname" />
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group controlId="formEmail">
                            <Form.Label>
                                <FormattedMessage id="DemoRequest.Form.Label.email" />
                            </Form.Label>
                            <Form.Control
                                required
                                type="email"
                                maxLength="50"
                                value= { this.state.values.email || '' }
                                onChange={ (e) => { this.handleValueChange('email', e.target.value) } }
                            />
                            <Form.Control.Feedback type="invalid">
                                <FormattedMessage id="DemoRequest.Form.Feedback.email" />
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group controlId="formPhone">
                            <Form.Label>
                                <FormattedMessage id="DemoRequest.Form.Label.phone" />
                            </Form.Label>
                            <IntlTelInput
                                preferredCountries={['TR', 'US', 'GB']}
                                defaultCountry={'TR'}
                                maxLength="20"
                                value={ this.state.values.phone || '' }
                                onChange={(data) => this.handlePhoneChange(data)}
                            />
                        </Form.Group>
                        <Form.Group controlId="formSector">
                            <Form.Label>
                                <FormattedMessage id="DemoRequest.Form.Label.sector" />
                            </Form.Label>
                            <Form.Control
                                required
                                type="text"
                                maxLength="50"
                                value= { this.state.values.sector || '' }
                                onChange={ (e) => { this.handleValueChange('sector', e.target.value) } }
                            />
                            <Form.Control.Feedback type="invalid">
                                <FormattedMessage id="DemoRequest.Form.Feedback.sector" />
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Label>
                            <FormattedMessage id="DemoRequest.Form.Label.productType" />
                        </Form.Label>
                        <Form.Row>
                            <Form.Group as={Col} md="2" controlId="formProductDemo">
                                <Form.Check
                                    required
                                    custom
                                    type='radio'
                                    id="productDemo"
                                    label={ <FormattedMessage id="DemoRequest.Form.Radio.product1" /> }
                                    name="rdProduct"
                                    checked={ this.state.values.productType === 0 }
                                    onChange={ () => { this.handleValueChange('productType', 0) } }
                                    feedback=""
                                />
                            </Form.Group>
                            <Form.Group as={Col} md="2" controlId="formProductStandard">
                                <Form.Check
                                    required
                                    custom
                                    type='radio'
                                    id="productStandard"
                                    label={ <FormattedMessage id="DemoRequest.Form.Radio.product2" /> }
                                    name="rdProduct"
                                    checked={ this.state.values.productType === 1 }
                                    onChange={ () => { this.handleValueChange('productType', 1) } }
                                    feedback=""
                                />
                            </Form.Group>
                            <Form.Group as={Col} md="2" controlId="formProductCorporate">
                                <Form.Check
                                    required
                                    custom
                                    type='radio'
                                    id="productMonthly"
                                    label={ <FormattedMessage id="DemoRequest.Form.Radio.product3" /> }
                                    name="rdProduct"
                                    checked={ this.state.values.productType === 2 }
                                    onChange={ () => { this.handleValueChange('productType', 2) } }
                                    feedback=""
                                />
                            </Form.Group>
                            <Form.Group as={Col} md="2" controlId="formProductCorporate">
                                <Form.Check
                                    required
                                    custom
                                    type='radio'
                                    id="productCorporate"
                                    label={ <FormattedMessage id="DemoRequest.Form.Radio.product4" /> }
                                    name="rdProduct"
                                    checked={ this.state.values.productType === 3 }
                                    onChange={ () => { this.handleValueChange('productType', 3) } }
                                    feedback=""
                                />
                            </Form.Group>
                        </Form.Row>
                        <Form.Group controlId="formUsageNeeded">
                            <Form.Label>
                                <FormattedMessage id="DemoRequest.Form.Label.opinions" />
                            </Form.Label>
                            <Form.Control
                                required
                                type="text"
                                as="textarea"
                                rows="6"
                                value= { this.state.values.opinions || '' }
                                onChange={ (e) => { this.handleValueChange('opinions', e.target.value) } }
                            />
                            <Form.Control.Feedback type="invalid">
                                <FormattedMessage id="DemoRequest.Form.Feedback.opinions" />
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Button type="submit" className='submit-button-style'>
                            <FormattedMessage id="DemoRequest.Form.Button.text" />
                        </Button>
                    </Form>
                </Card>
                <br /><br /><br /><br /><br />
            </Container>
        )
    }
}

export default Contact;