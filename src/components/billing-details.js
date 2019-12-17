import React, { Component } from 'react';
import _ from 'lodash';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Form } from 'react-bootstrap';
import countryList from 'country-list';

class BillingDetails extends Component {

    render() {
        const { values, displayNameIsValid, countryIsValid, addressIsValid } = this.props;
        const { formatMessage } = this.props.intl;
        var displayName, country, address

        if (values) {
            displayName = values.displayName
            country = values.country
            address = values.address
        }
        return (
            <Form noValidate>
                <Form.Group className="d-flex flex-row">
                    <Form.Label style={{ width: '80px' }} >
                        <FormattedMessage id='Payment.Billing.Name' />
                    </Form.Label>
                    <Form.Control
                        name="displayName"
                        type="text"
                        isValid={displayNameIsValid}
                        placeholder={formatMessage({ id: 'Payment.Billing.Name' })}
                        value={displayName || ''}
                        onChange={(e) => { this.props.handleValueChange('displayName', e.target.value) }}
                        required
                    />
                    <Form.Control.Feedback type="invalid">
                        <FormattedMessage id='Payment.Billing.Name' />
                    </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="d-flex flex-row">
                    <Form.Label style={{ width: '80px' }} >
                        <FormattedMessage id='Profile.Label.country' />
                    </Form.Label>
                    <Form.Control
                        name='country'
                        as='select'
                        isValid={countryIsValid}
                        required
                        onChange={(e) => { this.props.handleValueChange('country', e.target.value) }}
                        value={country || ''}
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
                <Form.Group className="d-flex flex-row">
                    <Form.Label style={{ width: '80px' }} >
                        <FormattedMessage id='Payment.Billing.Address' />
                    </Form.Label>
                    <Form.Control
                        name="address"
                        type="textarea"
                        placeholder={formatMessage({ id: 'Payment.Billing.Address' })}
                        isValid={addressIsValid}
                        value={address || ''}
                        onChange={(e) => { this.props.handleValueChange('address', e.target.value) }}
                        required
                    />
                    <Form.Control.Feedback type="invalid">
                        <FormattedMessage id='Payment.Billing.Address' />
                    </Form.Control.Feedback>
                </Form.Group>
                <br />
            </Form>
        )
    }
}
export default (injectIntl(BillingDetails));
