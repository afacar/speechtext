import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { Card, Form, Accordion, Button } from 'react-bootstrap';
import { FormattedMessage, injectIntl } from 'react-intl';
import IntlTelInput from 'react-bootstrap-intl-tel-input';
import countryList from 'country-list';

import Alert from 'react-s-alert';
import { updateProfile } from '../../actions';

class Profile extends Component {
    constructor(props) {
        super(props);

        this.state = {
            identityVisible: props.user ? (props.user.Billing ? props.user.Billing.country === 'tr' : false) : false,
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
        if(stateName === 'country') {
            this.setState({
                identityVisible: 'tr' === value
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
        const { formatMessage } = this.props.intl;
        const form = event.currentTarget;
        event.preventDefault();
        event.stopPropagation();
        if (form.checkValidity() === true) {
            if(!values.phoneNumber || values.phoneNumber.length < 10) {
                Alert.error(formatMessage({ id: 'Profile.Error.phoneNumberLength' }));
                return;
            }
            if(values.country !== 'tr') delete values.identityNumber;
            this.props.updateProfile(values);
            Alert.info(formatMessage({ id: 'Profile.Info.submitSuccess' }))
        }
        this.setState({ validated: true });
    }

    render() {
        const { user } = this.props;
        const { formatMessage } = this.props.intl;
        var defaultPhone = user ? user.phoneNumber : '';
        var { values } = this.state;
        if(!values) values = {};
        return (
            <Form noValidate validated={ this.state.validated } onSubmit={ this.handleSubmit }>
                <Form.Group>
                    <Form.Label>
                        <FormattedMessage id='Profile.Label.name' />
                    </Form.Label>
                    <Form.Control
                        name="name"
                        type="text"
                        placeholder={ formatMessage({ id: 'Profile.Feedback.name' }) }
                        value={ values.name || '' }
                        onChange={ (e) => { this.handleValueChange('name', e.target.value) } }
                        required
                    />
                    <Form.Control.Feedback type="invalid">
                        <FormattedMessage id='Profile.Feedback.enterName' />
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group>
                    <Form.Label>
                        <FormattedMessage id='Profile.Label.surname' />
                    </Form.Label>
                    <Form.Control
                        name="surname"
                        type="text"
                        placeholder={ formatMessage({ id: 'Profile.Feedback.surname' }) }
                        value={ values.surname || '' }
                        onChange={ (e) => { this.handleValueChange('surname', e.target.value) } }
                        required
                    />
                    <Form.Control.Feedback type="invalid">
                        <FormattedMessage id='Profile.Feedback.enterSurname' />
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group>
                    <Form.Label>
                        <FormattedMessage id='Profile.Label.email' />
                    </Form.Label>
                    <Form.Control
                        name="email"
                        type="email"
                        placeholder={ formatMessage({ id: 'Profile.Feedback.email' }) }
                        value={ values.email || '' }
                        onChange={ (e) => { this.handleValueChange('email', e.target.value) } }
                        required
                    />
                    <Form.Control.Feedback type="invalid">
                        <FormattedMessage id='Profile.Feedback.email' />
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group>
                    <Form.Label>
                        <FormattedMessage id='Profile.Label.phoneNumber' />
                    </Form.Label>
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
                        <FormattedMessage id='Profile.Feedback.phoneNumber' />
                    </Form.Control.Feedback>
                </Form.Group>
                <Card>
                    <Accordion defaultActiveKey='0'>
                        <Accordion.Toggle as={Card.Header} eventKey="0" className='address-title'>
                            <FormattedMessage id='Profile.Label.editAddress' />
                        </Accordion.Toggle>
                        <Accordion.Collapse eventKey="0">
                            <Card.Body>
                                <Form.Group>
                                    <Form.Label>
                                        <FormattedMessage id='Profile.Label.country' />
                                    </Form.Label>
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
                                        <FormattedMessage id='Profile.Feedback.country' />
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group>
                                <Form.Label>
                                    <FormattedMessage id='Profile.Label.city' />
                                </Form.Label>
                                    <Form.Control
                                        name="city"
                                        type="text"
                                        placeholder={ formatMessage({ id: 'Profile.Feedback.city' }) }
                                        value={ values.city || '' }
                                        onChange={ (e) => { this.handleValueChange('city', e.target.value) } }
                                        required
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        <FormattedMessage id='Profile.Feedback.city' />
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>
                                        <FormattedMessage id='Profile.Label.zipCode' />
                                    </Form.Label>
                                    <Form.Control
                                        name="zipCode"
                                        type="number"
                                        placeholder={ formatMessage({ id: 'Profile.Feedback.zipCode' }) }
                                        value={ values.zipCode || '' }
                                        onChange={ (e) => { this.handleValueChange('zipCode', e.target.value) } }
                                        required
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        <FormattedMessage id='Profile.Feedback.zipCode' />
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>
                                        <FormattedMessage id='Profile.Label.address' />
                                    </Form.Label>
                                    <Form.Control
                                        name="address"
                                        type="textarea"
                                        placeholder={ formatMessage({ id: 'Profile.Feedback.address' }) }
                                        value={ values.address || '' }
                                        onChange={ (e) => { this.handleValueChange('address', e.target.value) } }
                                        required
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        <FormattedMessage id='Profile.Feedback.address' />
                                    </Form.Control.Feedback>
                                </Form.Group>
                                {
                                    this.state.identityVisible &&
                                    <Form.Group>
                                        <Form.Label>
                                            <FormattedMessage id='Profile.Label.identityNumber' />
                                        </Form.Label>
                                        <Form.Control
                                            name="identityNumber"
                                            type="number"
                                            placeholder={ formatMessage({ id: 'Profile.Feedback.identityNumber' }) }
                                            value={ values.identityNumber || '' }
                                            onChange={ (e) => { this.handleValueChange('identityNumber', e.target.value) } }
                                            required={ this.state.identityVisible }
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            <FormattedMessage id='Profile.Feedback.identityNumber' />
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                }
                            </Card.Body>
                        </Accordion.Collapse>
                    </Accordion>
                </Card>
                <br />
                <Button type="submit" className='float-right'>
                    <FormattedMessage id='Profile.Button.submit' />
                </Button>
            </Form>
        )
    }
}

const mapStateToProps = ({ user }) => {
    return {
        user
    }
}

export default connect(mapStateToProps, { updateProfile })(injectIntl(Profile));