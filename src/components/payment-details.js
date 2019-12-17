import React, { Component } from 'react';
import CreditCardInput from 'react-credit-card-input';
import { injectIntl, FormattedMessage } from 'react-intl';

class PaymentDetails extends Component {

    render() {
        const { cardNumber, expiry, cvc } = this.props;
        return (
            <div className="d-flex flex-column" style={{ width: '100%' }}>
                <CreditCardInput
                    cardNumberInputProps={{ value: cardNumber, onChange: this.props.handleCardNumberChange }}
                    cardExpiryInputProps={{ value: expiry, onChange: this.props.handleCardExpiryChange }}
                    cardCVCInputProps={{ value: cvc, onChange: this.props.handleCardCVCChange }}
                    onError={()=> {this.props.toggleSubmit(true)}}
                    fieldClassName="input"
                    containerStyle={{ width: '100%', padding: 0 }}
                />
            </div>
        )
    }
}

export default (injectIntl(PaymentDetails));
