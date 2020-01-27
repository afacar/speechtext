import React, { Component } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';

import { updateProfile } from '../actions';

import { injectIntl, FormattedMessage } from 'react-intl';
import { Modal, Container, Row } from 'react-bootstrap';
import PaymentDetails from './payment-details';
import BillingDetails from './billing-details';
import CheckOutInfo from './check-out-info';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faCheckCircle, faTimesCircle
} from '@fortawesome/free-solid-svg-icons';
import '../styles/dashboard.css';

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

    componentWillReceiveProps({ user }) {
        if (_.isEmpty(this.props.user) && !_.isEmpty(user)) {
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
        }else{
            this.props.toggleSubmit(true)
        }
    }

    renderCheckOutModal = () => {
        const { calculatedPrice, rph, duration, durationType, state, loading, disabled, errorMessage } = this.props
        const { cardNumber, expiry, cvc, values } = this.state
        if (state === 'success' || state === 'SUCCESS') {
            return (
                <Modal.Body className="d-flex flex-column">
                    <Row className="justify-content-center">
                        <FontAwesomeIcon icon={faCheckCircle} size='4x' color={'green'} />
                    </Row>

                    <Row className="justify-content-center">
                        <h3>Ödemeniz Başarı ile tamamlandı</h3>
                    </Row>
                </Modal.Body>
            )
        } else if (state === 'failure' || state === 'failure') {
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
                        <h4 style={{ color: '#086FA1' }}>Billing Details</h4>
                        <BillingDetails handleValueChange={this.handleValueChange} values={values} displayNameIsValid={this.state.displayNameIsValid}
                            countryIsValid={this.state.countryIsValid} addressIsValid={this.state.addressIsValid} />
                        <h4 style={{ marginTop: -20, color: '#086FA1' }}  >
                            <FormattedMessage id={"Payment.Card.Details"} />
                        </h4>
                        <PaymentDetails cardNumber={cardNumber} expiry={expiry} cvc={cvc}
                            handleCardNumberChange={this.handleCardNumberChange}
                            handleCardExpiryChange={this.handleCardExpiryChange}
                            handleCardCVCChange={this.handleCardCVCChange}
                            toggleSubmit={this.props.toggleSubmit}
                        />
                    </Container>
                    <Container>
                        <CheckOutInfo startPayment={this.startPayment}
                            calculatedPrice={calculatedPrice} rph={rph}
                            duration={duration} durationType={durationType} loading={loading}
                            disabled={disabled} validationErrorMessage={this.state.validationErrorMessage} />
                    </Container>
                </Modal.Body>
            )
        }
    }

    render() {
        const { show, handleClose } = this.props
        return (
            <Modal
                show={show}
                onHide={() => handleClose()}
                size="lg"
            >
                {this.renderCheckOutModal()}
                {/* <Modal.Footer className="align-content-center">
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                     </Button>
                    <Button variant="primary" onClick={startPayment}>
                        {"Pay $" + calculatedPrice}
                    </Button>
                </Modal.Footer> */}
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
