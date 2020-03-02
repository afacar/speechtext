import React, { Component } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';

import { updateProfile } from '../actions';

import { injectIntl, FormattedMessage } from 'react-intl';
import { Modal, Container, Row, Col, Button, Spinner } from 'react-bootstrap';
import PaymentDetails from './payment-details';
import BillingDetails from './billing-details';
import CheckOutInfo from './check-out-info';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faCheckCircle, faTimesCircle
} from '@fortawesome/free-solid-svg-icons';
import '../styles/dashboard.css';
import '../styles/payment.css';


class CheckOutModal extends Component {

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
            this.props.toggleSubmit(true)
        }
    }

    renderCheckOutModal = () => {
        const { calculatedPrice, pricePerHour, duration, durationType, state, loading, disabled, errorMessage } = this.props;
        const { cardNumber, expiry, cvc, values } = this.state;
        if (state && state.toUpperCase() === 'SUCCESS') {
            return (
                <Modal.Body className="d-flex flex-column">
                    <Row className="justify-content-center">
                        <FontAwesomeIcon icon={faCheckCircle} size='4x' color={'green'} />
                    </Row>

                    <Row className="justify-content-center">
                        <h3>
                            <FormattedMessage id='Payment.successMessage' />
                        </h3>
                    </Row>
                </Modal.Body>
            )
        } else if (state && state.toUpperCase() === 'FAILURE') {
            return (
                <Modal.Body className="d-flex justify-content-center align-content-center flex-column">
                    <Row className="justify-content-center">
                        <FontAwesomeIcon icon={faTimesCircle} size='4x' color={'red'} />
                    </Row>

                    <Row className="justify-content-center">
                        <h3>{errorMessage}</h3>
                    </Row>
                </Modal.Body>
            )
        } else {
            return (
                <Modal.Body className="d-flex flex-row justify-content-center">
                    <Container>
                        <Row>
                            <Col lg='5' md='5' sm='6'>
                                <CheckOutInfo
                                    calculatedPrice={calculatedPrice}
                                    pricePerHour={pricePerHour}
                                    duration={duration}
                                    durationType={durationType}
                                    loading={loading}
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
                        <Button className="btn-lg checkout-button" onClick={this.startPayment} disabled={disabled}>
                            <FormattedMessage id='Payment.Summary.Pay' />
                            {
                                loading && (
                                    <Spinner animation="grow" role="status" />
                                )
                            }
                        </Button>
                    </Container>
                </Modal.Body>
            )
        }
    }

    render() {
        const { show, state } = this.props;
        return (
            <Modal
                show={show}
                onHide={this.props.handleClose}
                size={state === 'INITIAL' || state === 'PAYMENT' ? 'xl' : 'lg'}
                backdrop={state === 'INITIAL' || state === 'PAYMENT' ? 'static' : true}
            >
                <Modal.Header closeButton></Modal.Header>
                {this.renderCheckOutModal()}
            </Modal>
        )
    }
}

const mapStateToProps = ({ user }) => {
    return {
        user
    }
}

export default connect(mapStateToProps, { updateProfile })(injectIntl(CheckOutModal));
