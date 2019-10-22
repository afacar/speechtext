import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { Form, Button } from 'react-bootstrap';
import { FormattedMessage, injectIntl } from 'react-intl';
import countryList from 'country-list';

import Alert from 'react-s-alert';
import { updateProfile } from '../../actions';

class Profile extends Component {
    constructor(props) {
        super(props);
        console.log('profile constructor with props:', props)
        this.state = {
            values: {}
        }
    }

    initializeValues = (user) => {
        if (!_.isEmpty(user) && _.isEmpty(this.state.values)) {
            const { displayName, email, country, address } = user;
            var values = { displayName, email, country, address }
            this.setState({ values })
        }
    }

    componentDidMount() {
        this.initializeValues(this.props.user);
    }

 /*    componentWillReceiveProps({ user }) {
        console.log('profilecomponentWillReceiveProps with user:', user)
        this.initializeValues(user);
    } */

    handlePhoneChange = (data) => {
        var phoneNumber = data.intlPhoneNumber;
        var { values } = this.state;
        values.phoneNumber = phoneNumber;
        this.setState({
            values
        })
    }

    handleValueChange = (stateName, value) => {
        var { values } = this.state;
        values[stateName] = value;
        this.setState({ values });
    }

    handleSubmit = (event) => {
        const { values } = this.state;
        const { formatMessage } = this.props.intl;
        const form = event.currentTarget;
        event.preventDefault();
        event.stopPropagation();
        if (form.checkValidity() === true) {
            this.props.updateProfile(values);
            Alert.info(formatMessage({ id: 'Profile.Info.submitSuccess' }))
        }
        this.setState({ validated: true });
    }

    render() {
        const { formatMessage } = this.props.intl;
        var { values } = this.state;
        if (!values) values = {};
        return (
            <Form noValidate validated={this.state.validated} onSubmit={this.handleSubmit}>
                <Form.Group>
                    <Form.Label>
                        <FormattedMessage id='Profile.Label.nameSurname' />
                    </Form.Label>
                    <Form.Control
                        name="displayName"
                        type="text"
                        placeholder={formatMessage({ id: 'Profile.Feedback.nameSurname' })}
                        value={values.displayName || ''}
                        onChange={(e) => { this.handleValueChange('displayName', e.target.value) }}
                        required
                    />
                    <Form.Control.Feedback type="invalid">
                        <FormattedMessage id='Profile.Feedback.nameSurname' />
                    </Form.Control.Feedback>
                </Form.Group>

                <Form.Group>
                    <Form.Label>
                        <FormattedMessage id='Profile.Label.email' />
                    </Form.Label>
                    <Form.Control
                        name="email"
                        type="email"
                        placeholder={formatMessage({ id: 'Profile.Feedback.email' })}
                        value={values.email || ''}
                        onChange={(e) => { this.handleValueChange('email', e.target.value) }}
                        required
                    />
                    <Form.Control.Feedback type="invalid">
                        <FormattedMessage id='Profile.Feedback.email' />
                    </Form.Control.Feedback>
                </Form.Group>

                <Form.Group>
                    <Form.Label>
                        <FormattedMessage id='Profile.Label.country' />
                    </Form.Label>
                    <Form.Control
                        name='country'
                        as='select'
                        required
                        onChange={(e) => { this.handleValueChange('country', e.target.value) }}
                        value={values.country || ''}
                    >
                        <option />
                        {
                            _.map(countryList.getCodeList(), (value, key) => {
                                return <option key={key} value={key}>{value}</option>
                            })
                        }
                    </Form.Control>
                    <Form.Control.Feedback type="invalid">
                        <FormattedMessage id='Profile.Feedback.country' />
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group>
                    <Form.Label>
                        <FormattedMessage id='Profile.Label.address' />
                    </Form.Label>
                    <Form.Control
                        name="address"
                        type="textarea"
                        placeholder={formatMessage({ id: 'Profile.Feedback.address' })}
                        value={values.address || ''}
                        onChange={(e) => { this.handleValueChange('address', e.target.value) }}
                        required
                    />
                    <Form.Control.Feedback type="invalid">
                        <FormattedMessage id='Profile.Feedback.address' />
                    </Form.Control.Feedback>
                </Form.Group>
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