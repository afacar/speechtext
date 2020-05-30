import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import _ from 'lodash';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Container, Button, Alert as BootstrapAlert, Row, Col, Form } from 'react-bootstrap';
import Alert from 'react-s-alert';
import publicIp from 'public-ip';

import { clearTrimmedFileInfo } from '../../actions';
import firebase from '../../utils/firebase';
import CheckOutPage from '../../containers/user/checkout-page';
import SellingContract from './selling-contract';
import RefundContract from './refund-contract';


class Payment extends Component {
    constructor(props) {
        super(props);
        let fileId;
        let minAmountToPay = undefined;
        let duration = 1;
        let durationType = 'hours';
        if (props.location && props.location.hash) {
            fileId = props.location.hash.substr('#payment?fileId='.length);
            if (!_.isEmpty(props.trimmedFileInfo) && props.trimmedFileInfo.fileId === fileId) {
                minAmountToPay = props.trimmedFileInfo.minutesToBePaid;
                duration = props.trimmedFileInfo.minutesToBePaid;
                durationType = 'minutes';
            }
        }
        this.state = {
            duration,
            durationType,
            minAmountToPay,
            unitPrice: 6,
            calculatedPrice: 6,
            state: 'INITIAL',
            selectedPlanType: undefined,
            fileId,
            showSellingContract: false,
            showRefundContract: false
        }
    }

    componentWillReceiveProps({ user }) {
        if (_.isEmpty(this.props.user) && !_.isEmpty(user)) {
            if (!_.isEmpty(user.currentPlan) && user.currentPlan.planId === 'custom') {
                this.durationChanged(this.state.duration, user.currentPlan);
            }
        }
    }

    initializePage = () => {
        this.setState({
            duration: 1,
            durationType: 'hours',
            calculatedPrice: 6,
            state: 'INITIAL',
            basketId: undefined,
            checkoutForm: undefined,
            showSpinner: false,
            spinnerText: '',
            sellingContractAccepted: false,
            refundContractAccepted: false,
            showCheckOutForm: false, // new
            errorMessage: '',
            disabled: false,
            showContactForm: false,
        })
    }

    componentDidMount() {
        const { plans, user, trimmedFileInfo } = this.props;
        let calculatedPrice = 6;
        let duration = 1;
        let durationType = 'hours';
        if (!_.isEmpty(trimmedFileInfo) && this.state.fileId === trimmedFileInfo.fileId) {
            duration = trimmedFileInfo.minutesToBePaid;
            durationType = 'minutes';
        }
        if (plans.standard) calculatedPrice = plans.standarddard.hourPrice;
        if (user && user.currentPlan && user.currentPlan.planId === 'custom') calculatedPrice = user.currentPlan.pricePerHour;
        if (!_.isEmpty(plans)) {
            this.setState({
                duration,
                durationType,
                calculatedPrice,
                unitPrice: user.currentPlan.pricePerHour,
                state: 'INITIAL',
                basketId: undefined,
                checkoutForm: undefined,
                showSpinner: false,
                spinnerText: '',
                sellingContractAccepted: false,
                refundContractAccepted: false
            })
            this.calculatePrice(duration);
        }
    }

    durationChanged = (e, userPlan) => {
        let duration;
        if (!e.target) {
            duration = e;
            if (duration < 1) duration = 1;
            this.setState({ duration });
            this.calculatePrice(duration, userPlan);
        } else {
            duration = e.target.value;
            if (duration < 1) duration = 1;
            this.setState({ duration })
            this.calculatePrice(duration)
        }
    }

    durationTypeChanged = (e) => {
        let duration = this.state.duration;
        let durationType = e;
        if (e.target) {
            durationType = e.target.value;
        }
        this.setState({ durationType }, () => {
            this.calculatePrice(duration)
        })
    }

    calculatePrice = (duration, userPlan) => {
        const { durationType } = this.state;
        let calculatedPrice = 0;
        let { currentPlan } = this.props.user;
        if (_.isEmpty(currentPlan)) {
            currentPlan = userPlan;
        }
        let durationInMinutes = durationType === 'minutes' ? duration : duration * 60;
        let unitPrice = currentPlan.pricePerHour;
        calculatedPrice = this.calculateStandardPrice(unitPrice, durationInMinutes);
        this.setState({
            calculatedPrice,
            unitPrice,
            state: 'INITIAL',
            checkoutForm: undefined
        })
    }

    calculateStandardPrice = (pricePerHour, minutes) => {
        // Calculates unit price/hour based on base price and hours
        if (minutes <= 0)
            return 0;
        return pricePerHour * minutes / 60
    }

    calculateCustomPrice = (pricePerHour, hours) => {
        // Calculates unit price/hour based on base price and hours
        if (hours <= 0)
            return 0
        return pricePerHour;
    }

    continueFileEdit = () => {
        const { fileId } = this.state;
        window.open(`/edit/${fileId}`, '_self');
    }

    renderSuccess = () => {
        const { state, error, fileId } = this.state;
        if (state !== 'SUCCESS' && state !== 'ERROR' && state !== 'FAILURE') return null;
        if (state !== 'SUCCESS') {
            const { formatMessage } = this.props.intl;
            let errorKey = error ? error.key : undefined;
            let errorDef = _.find(this.props.errorDefinitions, { key: errorKey });
            let errorMessage = errorKey ? errorDef.value : formatMessage({ id: 'Payment.Message.error' });
            return (
                <div>
                    <BootstrapAlert variant='danger'>
                        {errorMessage}
                    </BootstrapAlert>
                    <Button variant='primary' onClick={this.initializePage}>
                        <FormattedMessage id='Payment.Message.tryAgain' />
                    </Button>
                    <br />
                    <Button variant='link'>
                        <Link to='/dashboard'>
                            <FormattedMessage id='Payment.Message.goToDashboard' />
                        </Link>
                    </Button>
                </div>
            )
        };
        return (
            <div className='payment-success-message'>
                {
                    !_.isEmpty(fileId) &&
                    <Button variant='link' onClick={this.continueFileEdit}>
                        <FormattedMessage id='Payment.Button.continueEditing' />
                    </Button>
                }
                <BootstrapAlert variant='success'>
                    <FormattedMessage id='Payment.Message.success' />
                </BootstrapAlert>
                <Button variant='primary' onClick={this.initializePage}>
                    <FormattedMessage id='Payment.Message.addMoreCredits' />
                </Button>
                <br />
                <Button variant='link'>
                    <Link to='/dashboard'>
                        <FormattedMessage id='Payment.Message.goToDashboard' />
                    </Link>
                </Button>
            </div>
        )
    }

    sellingContractClicked = (e) => {
        e.preventDefault();
        e.stopPropagation();

        this.setState({ showSellingContract: true });
    }

    refundContractClicked = (e) => {
        e.preventDefault();
        e.stopPropagation();

        this.setState({ showRefundContract: true });
    }

    handleSellingContractVisibility = () => {
        this.setState({
            showSellingContract: !this.state.showSellingContract
        })
    }

    handleRefundContractVisibility = () => {
        this.setState({
            showRefundContract: !this.state.showRefundContract
        })
    }

    renderContract = () => {
        return (
            <div className='d-flex flex-row contract-text text-center' style={{ fontSize: 'small' }}>
                <p>
                    <span style={{ color: 'blue', textDecorationLine: 'underline', cursor: 'pointer' }} variant='link' onClick={this.sellingContractClicked}>
                        {this.props.language === 'tr-TR' ? 'Satış Sözleşmesi' : 'Selling Contract'}
                    </span>
                    {this.props.language !== 'tr-TR' ? ' and ' : ' ve '}
                    <span style={{ color: 'blue', textDecorationLine: 'underline', cursor: 'pointer' }} variant='link' onClick={this.refundContractClicked}>
                        {this.props.language === 'tr-TR' ? 'İade Koşulları' : 'Refund Policy'}
                    </span>
                </p>
            </div>
        )
    }

    onHide = () => {
        this.setState({ showCheckoutForm: false })
    }

    showForm = () => {
        if (parseInt(this.state.duration) >= 50) {
            this.setState({
                showContactForm: true
            })
        }
        else {
            this.setState({
                showCheckOutForm: true,
                state: 'PAYMENT'
            })
        }
    }

    closeCheckOutForm = () => {
        if (!this.state.showSpinner) {
            this.setState({
                showCheckOutForm: false
            })
        }
    }

    closeContactForm = () => {
        this.setState({
            showContactForm: false
        })
    }

    validateInput = () => {
        const { duration, durationType } = this.state;
        const { trimmedFileInfo } = this.props;
        let calculatedPrice = 0;
        let { currentPlan } = this.props.user;
        let durationInMinutes = durationType === 'minutes' ? duration : duration * 60;
        let unitPrice = currentPlan.pricePerHour;
        calculatedPrice = this.calculateStandardPrice(unitPrice, durationInMinutes);
        if (!_.isEmpty(trimmedFileInfo) && durationInMinutes < trimmedFileInfo.minutesToBePaid) {
            const { formatMessage } = this.props.intl;
            Alert.error(formatMessage({ id: 'Payment.Error.minDurationLength' }, { minAmountToPay: trimmedFileInfo.minutesToBePaid }));
            calculatedPrice = this.calculateStandardPrice(unitPrice, durationInMinutes);
            this.setState({
                duration: trimmedFileInfo.minutesToBePaid,
                durationType: 'minutes',
                calculatedPrice
            });
            return false;
        }
        return true;
    }

    startPayment = async (obj) => {
        //TODO add payment function
        const { values, cardNumber, expiry, cvc } = obj;
        var card = {
            cardHolderName: values.displayName,
            cardNumber: cardNumber.replace(/\s/g, ''),
            expireMonth: expiry.substring(0, 2),
            expireYear: expiry.substring(5, 7),
            cvc
        }
        var that = this;
        const { language } = this.props;
        var { duration, durationType, basketId, fileId, state } = this.state;
        // let durationInMinutes = undefined;
        // if (selectedPlanType === 'PayAsYouGo')
        // durationInMinutes = parseFloat(duration) * (durationType === 'hours' ? 60 : 1);
        this.setState({
            showSpinner: true,
            disabled: true,
            showCheckOutForm: true,
        });
        let ip = '';
        try {
            ip = await publicIp.v4();
        } catch (error) {
            console.log('Cannot get user IP adress')
        }
        var fncAddBasket = firebase.functions().httpsCallable('addToBasketSecondary');
        fncAddBasket({
            hours: durationType === 'hours' ? parseInt(duration) : undefined,
            minutes: durationType === 'minutes' ? parseInt(duration) : undefined,
            locale: language,
            ip,
            basketId,
            card,
            fileId
        }).then(({ data }) => {
            const { basketId, result, error } = data;
            let errorMessage = '';
            if (error)
                errorMessage = error.errorMessage;
            else if (result && result.status === 'failure') {
                errorMessage = "Bilinmedik Hata Oluştu"
            }
            if (!_.isEmpty(errorMessage)) {
                Alert.error(errorMessage);
            }
            that.setState({
                basketId,
                result,
                state: _.isEmpty(errorMessage) ? 'SUCCESS' : state,
                errorMessage,
                showSpinner: false,
                spinnerText: '',
                disabled: false,
            })
            // setTimeout(() => {
            //     this.initializePage();
            // }, 2500)
        })
            .catch(error => {
                // TODO: ADD_TO_BASKET_ERROR
                // NOTE: This function need to thwrow an error on firebase to catch here!
                console.log("Error burada\n" + error)
                let errorMessage = 'Bilinmedik Hata Oluştu';
                this.setState({
                    errorMessage
                })
                Alert.error(errorMessage);
                // setTimeout(() => {
                //     this.initializePage();
                // }, 2500)
            })
    }

    toggleSubmit = (flag) => {
        this.setState({
            disabled: flag
        })
    }

    showError = (message) => {
        Alert.error(message);
    }

    renderTerms = () => {
        return (
            <div className='float-right' style={{ fontSize: 'small', width: '100%', marginTop: '25px' }}>
                <p>
                    <span style={{ color: 'blue', textDecorationLine: 'underline', cursor: 'pointer' }} variant='link' onClick={this.sellingContractClicked}>
                        {this.props.language === 'tr-TR' ? 'Satış Sözleşmesi' : 'Selling Contract'}
                    </span>
                    {this.props.language !== 'tr-TR' ? ' and ' : ' ve '}
                    <span style={{ color: 'blue', textDecorationLine: 'underline', cursor: 'pointer' }} variant='link' onClick={this.refundContractClicked}>
                        {this.props.language === 'tr-TR' ? 'İade Koşulları' : 'Refund Policy'}
                    </span>
                </p>
            </div>
        )
    }

    render() {
        const { duration, durationType, unitPrice, calculatedPrice, showSpinner, showSellingContract, showRefundContract, minAmountToPay, state } = this.state
        const { user, intl } = this.props;
        const { formatMessage } = intl;
        return (
            <Container>
                <div className="d-flex justify-content-center" style={{ width: "100%", height: "100%" }}>
                    <div className="card-pricing text-center px-3 mb-2" style={{ width: "100%", height: "100%" }}>
                        <span className="h6 w-60 mx-auto px-4 py-3 rounded bg-primary text-white">
                            <FormattedMessage id="Pricing.Standard.title" />
                            <span className="price">$ {unitPrice}</span>
                            <span className="h6 ml-2">/
                                <FormattedMessage id="Pricing.Standard.timeText" />
                            </span>
                        </span>
                        {
                            state === 'INITIAL' &&
                            <div>
                                <div className="card-body pt-0">
                                    <Container>
                                        <Row className="d-flex justify-content-md-center buy-button-surrounding mb-3 mt-5 align-items-center">
                                            <Col className="d-flex justify-content-center" md>
                                                <h3>
                                                    <FormattedMessage id='Payment.Label.totalSizeToBuy' />
                                                </h3>
                                                <Form.Control
                                                    type='number'
                                                    className='payment-amount-to-buy'
                                                    value={duration || minAmountToPay}
                                                    onChange={this.durationChanged}
                                                />
                                                <Form.Control as='select'
                                                    defaultValue='minutes'
                                                    required
                                                    value={durationType}
                                                    onChange={this.durationTypeChanged}
                                                    className='payment-duration'>
                                                    < option key='minutes' value='minutes'>
                                                        {formatMessage({ id: 'Payment.DurationType.minutes' })}
                                                    </option>
                                                    <option key='hours' value='hours'>
                                                        {formatMessage({ id: 'Payment.DurationType.hours' })}
                                                    </option>
                                                </Form.Control>
                                                <h3>
                                                    <div className="price">{this.props.price}</div>
                                                </h3>
                                                <br />
                                            </Col>
                                        </Row>
                                    </Container>
                                </div>
                                <CheckOutPage
                                    duration={duration}
                                    durationType={durationType}
                                    unitPrice={unitPrice}
                                    calculatedPrice={calculatedPrice}
                                    durationChanged={this.durationChanged}
                                    handleBuy={this.showForm}
                                    showSpinner={showSpinner}
                                    currentPlan={user.currentPlan}
                                    state={this.state.state}
                                    toggleSubmit={this.toggleSubmit}
                                    startPayment={this.startPayment}
                                    showError={this.showError}
                                    validateInput={this.validateInput}
                                />
                                {this.renderTerms()}
                            </div>
                        }
                        {
                            state === 'SUCCESS' &&
                            this.renderSuccess()
                        }
                        {
                            showSellingContract &&
                            <SellingContract
                                show={showSellingContract}
                                handleVisibility={this.handleSellingContractVisibility}
                                duration={this.props.duration}
                                durationType={this.props.durationType}
                                calculatedPrice={this.props.price}
                                unitPrice={this.props.unitPrice}
                            />
                        }
                        {
                            showRefundContract &&
                            <RefundContract
                                show={showRefundContract}
                                handleVisibility={this.handleRefundContractVisibility}
                            />
                        }
                    </div>
                </div>
            </Container >
        )
    }
}

const mapStateToProps = ({ user, language, plans, errorDefinitions, trimmedFileInfo }) => {
    return {
        user,
        language,
        plans,
        errorDefinitions,
        trimmedFileInfo
    }
}

export default connect(mapStateToProps, { clearTrimmedFileInfo })(withRouter(injectIntl(Payment)));

