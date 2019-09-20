import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { Card, Form, Accordion, Button } from 'react-bootstrap';
import IntlTelInput from 'react-bootstrap-intl-tel-input';
import countryList from 'country-list';

import Alert from 'react-s-alert';
import { updateProfile } from '../../actions';

class Profile extends Component {
    constructor(props) {
        super(props);

        this.state = {
            identityVisible: false,
            values: {}
        }
    }

    initializeValues = (user) => {
        if(!_.isEmpty(user) && _.isEmpty(this.state.values)) {
            const { name, surname, email, phoneNumber } = user;
            var billing = user.Billing || {};
            const { country, city, zipCode, address, identityNumber } = billing;
            var values = {
                name, surname, email, phoneNumber, country, city, zipCode, address, identityNumber
            }
            this.setState({
                values
            })
        }
    }

    componentDidMount() {
        this.initializeValues(this.props.user);
    }

    componentWillReceiveProps({ user }) {
        if(user.Billing && user.Billing.country === 'tr') {
            this.setState({
                identityVisible: true
            });
        }
        this.initializeValues(user);
    }

    handlePhoneChange = (data) => {
        var phoneNumber = data.intlPhoneNumber;
        var { values } = this.state;
        values.phoneNumber = phoneNumber;
        this.setState({
            values
        })
    }
    
    handleValueChange = (stateName, value) => {
        if(stateName === 'country' && 'tr' === value) {
            this.setState({
                identityVisible: true
            })
        }
        var { values } = this.state;
        values[stateName] = value;
        this.setState({
            values
        });
    }

    handleSubmit = (event) => {
        const { values } = this.state;
        const form = event.currentTarget;
        event.preventDefault();
        event.stopPropagation();
        if (form.checkValidity() === true) {
            if(!values.phoneNumber || values.phoneNumber.length < 10) {
                Alert.error('Phone number must be minimum 10 digits');
                return;
            }
            this.props.updateProfile(values);
            Alert.info('Profile info updated successfully.')
        }
        this.setState({ validated: true });
    }

    render() {
        const { user } = this.props;
        var defaultPhone = user ? user.phoneNumber : '';
        var { values } = this.state;
        if(!values) values = {};
        return (
            <Form noValidate validated={ this.state.validated } onSubmit={ this.handleSubmit }>
                <Form.Group>
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                        name="name"
                        type="text"
                        placeholder="Name"
                        value={ values.name || '' }
                        onChange={ (e) => { this.handleValueChange('name', e.target.value) } }
                        required
                    />
                    <Form.Control.Feedback type="invalid">
                        Enter Name
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Surname</Form.Label>
                    <Form.Control
                        name="surname"
                        type="text"
                        placeholder="Surname"
                        value={ values.surname || '' }
                        onChange={ (e) => { this.handleValueChange('surname', e.target.value) } }
                        required
                    />
                    <Form.Control.Feedback type="invalid">
                        Enter Surname
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        name="email"
                        type="email"
                        placeholder="Email"
                        value={ values.email || '' }
                        onChange={ (e) => { this.handleValueChange('email', e.target.value) } }
                        required
                    />
                    <Form.Control.Feedback type="invalid">
                        Enter Email
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Phone Number</Form.Label>
                    <IntlTelInput
                        fieldName='phoneNumner'
                        preferredCountries={['TR', 'US', 'GB']}
                        defaultCountry={'TR'}
                        maxLength="20"
                        defaultValue={ defaultPhone }
                        value={ values.phoneNumber || '' }
                        onChange={ this.handlePhoneChange }
                        telInputProps={{
                            required: true
                        }}
                        inputClassName='form-control'
                        required
                    />
                    <Form.Control.Feedback type="invalid">
                        Enter Phone Number
                    </Form.Control.Feedback>
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
                                    <Form.Control
                                        name='country'
                                        as='select'
                                        required
                                        onChange={ (e) => { this.handleValueChange('country', e.target.value) } }
                                        value={ values.country || '' }
                                    >
                                        <option />
                                        {
                                            _.map(countryList.getCodeList(), (value, key) => {
                                                return <option key={ key } value={ key }>{ value }</option>
                                            })
                                        }
                                    </Form.Control>
                                    <Form.Control.Feedback type="invalid">
                                        Select Address Country
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group>
                                <Form.Label>City</Form.Label>
                                    <Form.Control
                                        name="city"
                                        type="text"
                                        placeholder="City"
                                        value={ values.city || '' }
                                        onChange={ (e) => { this.handleValueChange('city', e.target.value) } }
                                        required
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        Enter City
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>Zip Code</Form.Label>
                                    <Form.Control
                                        name="zipCode"
                                        type="number"
                                        placeholder="Zip Code"
                                        value={ values.zipCode || '' }
                                        onChange={ (e) => { this.handleValueChange('zipCode', e.target.value) } }
                                        required
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        Enter Zip Code
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>Address</Form.Label>
                                    <Form.Control
                                        name="address"
                                        type="textarea"
                                        placeholder="Address"
                                        value={ values.address || '' }
                                        onChange={ (e) => { this.handleValueChange('address', e.target.value) } }
                                        required
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        Enter Address
                                    </Form.Control.Feedback>
                                </Form.Group>
                                {
                                    this.state.identityVisible &&
                                    <Form.Group>
                                        <Form.Label>Identity Number</Form.Label>
                                        <Form.Control
                                            name="identityNumber"
                                            type="number"
                                            placeholder="Identity Number"
                                            value={ values.identityNumber || '' }
                                            onChange={ (e) => { this.handleValueChange('identityNumber', e.target.value) } }
                                            required={ this.state.identityVisible }
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            Enter Identification Number
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                }
                            </Card.Body>
                        </Accordion.Collapse>
                    </Accordion>
                </Card>
                <br />
                <Button type="submit" className='float-right'>Submit</Button>
            </Form>
        )
    }
}

const mapStateToProps = ({ user }) => {
    return {
        user
    }
}

export default connect(mapStateToProps, { updateProfile })(Profile);