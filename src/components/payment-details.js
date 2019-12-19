import React, { Component } from 'react';
import CreditCardInput from 'react-credit-card-input';
import { injectIntl, FormattedMessage } from 'react-intl';
import '../styles/dashboard.css';

class PaymentDetails extends Component {

    render() {
        const { cardNumber, expiry, cvc } = this.props;
        return (
            <div className="d-flex flex-column border" style={{ width: '100%', borderColor: 'green' }}>
                <CreditCardInput
                    cardNumberInputProps={{ value: cardNumber, onChange: this.props.handleCardNumberChange }}
                    cardExpiryInputProps={{ value: expiry, onChange: this.props.handleCardExpiryChange }}
                    cardCVCInputProps={{ value: cvc, onChange: this.props.handleCardCVCChange }}
                    onError={() => { this.props.toggleSubmit(true) }}
                    containerStyle={{ border: '1px' }}
                    fieldClassName="input"
                />
            </div>
        )
    }
}

export default (injectIntl(PaymentDetails));
