import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import _ from 'lodash';
import { Card, Form, Accordion, Button } from 'react-bootstrap';
import IntlTelInput from 'react-bootstrap-intl-tel-input';
import countryList from 'country-list';

import { updateProfile } from '../../actions';

class Profile extends Component {
    constructor(props) {
        super(props);

        this.state = {
            identityVisible: false
        }
    }

    componentWillReceiveProps({ user }) {
        if(user.address && user.address.country === 'tr') {
            this.setState({
                identityVisible: true
            });
        }
    }

    handlePhoneChange = (args) => {
        this.props.change('phone', args.callingCode + args.phoneNumber)
    }
    
    handleCountryChange = (e) => {
        if('tr' === e.target.value) {
            this.setState({
                identityVisible: true
            })
        }
    }

    render() {
        const { handleSubmit, pristine, reset, submitting } = this.props;
        return (
            <Form onSubmit={ handleSubmit } initialValues={ this.state.initialValues }>
                <Form.Group>
                    <Form.Label>Name</Form.Label>
                    <Field
                        name="name"
                        component="input"
                        type="text"
                        placeholder="Name"
                        className='form-control'
                        required
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Surname</Form.Label>
                    <Field
                        name="surname"
                        component="input"
                        type="text"
                        placeholder="Surname"
                        className='form-control'
                        required
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Email</Form.Label>
                    <Field
                        name="email"
                        component="input"
                        type="email"
                        placeholder="Email"
                        className='form-control'
                        required
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Phone</Form.Label>
                    <Field
                        name="phone"
                        component={ IntlTelInput }
                        type="text"
                        placeholder="Phone"
                        className='form-control'
                        props={{
                            preferredCountries: ['TR', 'US', 'GB'],
                            defaultCountry: 'TR',
                            maxLength: "20",
                            onChange:this.handlePhoneChange
                        }}
                        required
                    />
                </Form.Group>
                <Card>
                    <Accordion defaultActiveKey='0'>
                        <Accordion.Toggle as={Card.Header} eventKey="0" className='address-title'>
                            Edit Address
                        </Accordion.Toggle>
                        <Accordion.Collapse eventKey="0">
                            <Card.Body>
                                <Form.Group>
                                    <Form.Label>Country</Form.Label>
                                    <Field name='country' component='select' required className='form-control' onChange={ this.handleCountryChange }>
                                        <option />
                                        {
                                            _.map(countryList.getCodeList(), (value, key) => {
                                                return <option value={ key }>{ value }</option>
                                            })
                                        }
                                    </Field>
                                </Form.Group>
                                <Form.Group>
                                <Form.Label>City</Form.Label>
                                    <Field
                                        name="city"
                                        component="input"
                                        type="text"
                                        placeholder="City"
                                        className='form-control'
                                        required
                                    />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>Zip Code</Form.Label>
                                    <Field
                                        name="zipCode"
                                        component="input"
                                        type="number"
                                        placeholder="Zip Code"
                                        className='form-control'
                                        required
                                    />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>Address</Form.Label>
                                    <Field
                                        name="openAddress"
                                        component="input"
                                        type="textarea"
                                        placeholder="Address"
                                        className='form-control'
                                        required
                                    />
                                </Form.Group>
                                {
                                    this.state.identityVisible &&
                                    <Form.Group>
                                        <Form.Label>Identity Number</Form.Label>
                                        <Field
                                            name="identityNumber"
                                            component="input"
                                            type="number"
                                            placeholder="Identity Number"
                                            className='form-control'
                                            required={ this.state.identityVisible }
                                        />
                                    </Form.Group>
                                }
                            </Card.Body>
                        </Accordion.Collapse>
                    </Accordion>
                </Card>
                <br />
                <Button type="button" disabled={pristine || submitting} className='float-right mx-3' onClick={reset}>Clear Values</Button>
                <Button type="submit" disabled={pristine || submitting} className='float-right'>Submit</Button>
            </Form>
        )
    }
}

const validate = (values) => {
    const errors = {}
    if (!values.name) {
        errors.name = 'Enter Name';
    }
    if (!values.surname) {
        errors.surname = 'Enter Surname';
    }
    if (!values.email) {
        errors.email = 'Enter Email';
    }
    if (!values.phone) {
        errors.phone = 'Enter Phone';
    }
    if (!values.country) {
        errors.country = 'Select Address Country';
    }
    if (!values.city) {
        errors.city = 'Enter City';
    }
    if (!values.zipCode) {
        errors.zipCode = 'Enter Zip Code';
    }
    if (!values.openAddress) {
        errors.openAddress = 'Enter Address';
    }
    if (!values.identityNumber) {
        errors.identityNumber = 'Enter IdentityNumber';
    }
    return errors;
}

const mapStateToProps = ({ user }) => {
    const { name, surname, email, phone } = user;
    var address = user.address || {};
    const { country, city, openAddress, zipCode, identityNumber } = address;
    var initialValues = { name, surname, email, phone, country, city, openAddress, zipCode, identityNumber };
    return {
        user,
        initialValues
    }
}

const mapDispatchToProps = (dispatch, /* ownProps */) => ({
    onSubmit: values => dispatch(updateProfile(values))
});

const profileForm = reduxForm({ form: 'profile', enableReinitialize: true, validate })(Profile);
export default connect(mapStateToProps, mapDispatchToProps)(profileForm);