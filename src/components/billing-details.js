import React, { Component } from 'react';
import _ from 'lodash';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Form, Container } from 'react-bootstrap';
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
                    <Form.Label >
                        <FormattedMessage id='Payment.Billing.Name' />
                    </Form.Label>
                    <Container className="d-flex flex-column" style={{marginLeft: 14}}>
                        <Form.Control
                            name="displayName"
                            type="text"
                            isInvalid={!displayNameIsValid}
                            placeholder={formatMessage({ id: 'Payment.Billing.Name' })}
                            value={displayName || ''}
                            onChange={(e) => { this.props.handleValueChange('displayName', e.target.value) }}
                            required
                        />
                        <Form.Control.Feedback type="invalid">
                            <FormattedMessage id='Payment.Feedback.nameSurname' />
                        </Form.Control.Feedback>
                    </Container>

                </Form.Group>

                <Form.Group className="d-flex flex-row">
                    <Form.Label >
                        <FormattedMessage id='Profile.Label.country' />
                    </Form.Label>
                    <Container className="d-flex flex-column">
                        <Form.Control
                            name='country'
                            as='select'
                            isInvalid={!countryIsValid}
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
                    </Container>
                </Form.Group>
                <Form.Group className="d-flex flex-column">
                    <Form.Label>
                        <FormattedMessage id='Payment.Billing.Address' />
                    </Form.Label>
                    <Form.Control
                        name="address"
                        type="textarea"
                        placeholder={formatMessage({ id: 'Payment.Billing.Address' })}
                        isInvalid={!addressIsValid}
                        value={address || ''}
                        onChange={(e) => { this.props.handleValueChange('address', e.target.value) }}
                        required
                    />
                    <Form.Control.Feedback type="invalid">
                        <FormattedMessage id='Profile.Feedback.address' />
                    </Form.Control.Feedback>
                </Form.Group>
                <br />
            </Form>
        )
    }
}
export default (injectIntl(BillingDetails));
