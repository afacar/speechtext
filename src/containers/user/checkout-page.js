import React, { Component } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';

import { updateProfile } from '../../actions';

import { injectIntl, FormattedMessage } from 'react-intl';
import { Container, Row, Col, Button, Spinner } from 'react-bootstrap';
import PaymentDetails from '../../components/payment-details';
import BillingDetails from '../../components/billing-details';
import CheckOutInfo from '../../components/check-out-info';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faCheckCircle, faTimesCircle
} from '@fortawesome/free-solid-svg-icons';
import MasterVisaLogo from '../../assets/mastercard-visa-logo.png';
import '../../styles/dashboard.css';
import '../../styles/payment.css';


class CheckOutPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            cardNumber: '',
            expiry: '',
            cvc: '',
            validationErrorMessage: '',
            values: {},
            displayNameIsValid: true,
            countryIsValid: true,
            addressIsValid: true
        }
    }

    initializeValues = () => {
        const { user } = this.props;
        if (!_.isEmpty(user)) {
            const { displayName, email, country, address } = user;
            var values = { displayName, email, country, address };
            this.setState({
                values,
                cardNumber: '',
                expiry: '',
                cvc: '',
                validationErrorMessage: '',
                displayNameIsValid: true,
                countryIsValid: true,
                addressIsValid: true
            })
        }
    }

    componentDidMount() {
        this.initializeValues()
    }
    componentWillReceiveProps({ user, state }) {
        console.log("new props arrived ", user);
        console.log("new props arrived ", state);
        if (!_.isEmpty(user) && state !== 'PAYMENT') {
            this.initializeValues(user);
        }
    }

    handleValueChange = (stateName, value) => {
        this.props.toggleSubmit(false)

        var { values } = this.state;
        values[stateName] = value;
        this.setState({ values });
        if (value.length <= 0) {
            let inputField = stateName + "IsValid";
            this.setState(previousState => {
                previousState[inputField] = false;
                console.log(previousState)
                return previousState
            })
        } else {
            let inputField = stateName + "IsValid";
            this.setState(previousState => {
                previousState[inputField] = true;
                return previousState
            })
        }
    }

    handleCardNumberChange = (cardNumberEvent) => {
        console.log("card number changed ", cardNumberEvent.target.value)
        this.props.toggleSubmit(false)
        this.setState({
            cardNumber: cardNumberEvent.target.value
        })
    }

    handleCardExpiryChange = (expiryEvent) => {
        this.props.toggleSubmit(false)
        this.setState({
            expiry: expiryEvent.target.value
        })
    }

    handleCardCVCChange = (cvcEvent) => {
        this.props.toggleSubmit(false)
        this.setState({
            cvc: cvcEvent.target.value
        })
    }

    validateBillingDetails = () => {
        const { displayNameIsValid, countryIsValid, addressIsValid } = this.state;
        console.log(displayNameIsValid + '\n' + countryIsValid + '\n' + addressIsValid)
        return displayNameIsValid && countryIsValid && addressIsValid;
    }

    startPayment = () => {
        if (!this.props.validateInput()) return;
        const { values, cardNumber, expiry, cvc, } = this.state
        if (values && cardNumber && expiry && cvc.length === 3 && this.validateBillingDetails()) {
            console.log("Cardnumber", cardNumber)
            console.log("expiry", expiry)
            console.log("cvc", cvc)
            let paymentObj = {
                values,
                cardNumber,
                expiry,
                cvc
            }
            this.props.startPayment(paymentObj)
        } else {
            const { formatMessage } = this.props.intl;
            this.props.showError(formatMessage({ id: 'Payment.Error.emptyFields' }))
        }
    }

    renderCheckOutPage = () => {
        const { calculatedPrice, unitPrice, duration, durationType, state, showSpinner, disabled, errorMessage } = this.props;
        const { cardNumber, expiry, cvc, values } = this.state;
        if (state && state.toUpperCase() === 'SUCCESS') {
            return (
                <Container>
                    <Row className="justify-content-center">
                        <FontAwesomeIcon icon={faCheckCircle} size='4x' color={'green'} />
                    </Row>

                    <Row className="justify-content-center">
                        <h3>
                            <FormattedMessage id='Payment.successMessage' />
                        </h3>
                    </Row>
                </Container>
            )
        } else if (state && state.toUpperCase() === 'FAILURE') {
            return (
                <Container>
                    <Row className="justify-content-center">
                        <FontAwesomeIcon icon={faTimesCircle} size='4x' color={'red'} />
                    </Row>

                    <Row className="justify-content-center">
                        <h3>{errorMessage}</h3>
                    </Row>
                </Container>
            )
        } else {
            return (
                <Container>
                    <Row>
                        <Col lg='5' md='5' sm='6'>
                            <CheckOutInfo
                                calculatedPrice={calculatedPrice}
                                unitPrice={unitPrice}
                                duration={duration}
                                durationType={durationType}
                                validationErrorMessage={this.state.validationErrorMessage}
                            />
                        </Col>
                        <Col lg='7' md='7' sm='6' className='billing-detail-container'>
                            <h4 className='payment-modal-title'>
                                <FormattedMessage id="Payment.Billing.Title" />
                            </h4>
                            <BillingDetails
                                handleValueChange={this.handleValueChange}
                                values={values}
                                displayNameIsValid={this.state.displayNameIsValid}
                                countryIsValid={this.state.countryIsValid}
                                addressIsValid={this.state.addressIsValid}
                            />
                            <h4 style={{ marginTop: -20, color: '#086FA1' }}  >
                                <FormattedMessage id={"Payment.Card.Details"} />
                            </h4>
                            <PaymentDetails
                                cardNumber={cardNumber} expiry={expiry} cvc={cvc}
                                handleCardNumberChange={this.handleCardNumberChange}
                                handleCardExpiryChange={this.handleCardExpiryChange}
                                handleCardCVCChange={this.handleCardCVCChange}
                                toggleSubmit={this.props.toggleSubmit}
                            />
                        </Col>
                    </Row>
                    <div>
                        <Button className="btn-lg checkout-button" onClick={this.startPayment} disabled={disabled}>
                            <FormattedMessage id='Payment.Summary.Pay' />
                            {
                                showSpinner && (
                                    <Spinner animation="grow" role="status" />
                                )
                            }
                        </Button>
                        <img src={MasterVisaLogo} alt='Master Card' className='card-logo' />
                    </div>
                </Container>
            )
        }
    }

    render() {
        return (
            <div>
                {this.renderCheckOutPage()}
            </div>
        )
    }
}

const mapStateToProps = ({ user }) => {
    return {
        user
    }
}

export default connect(mapStateToProps, { updateProfile })(injectIntl(CheckOutPage));
