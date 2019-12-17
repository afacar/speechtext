import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import _ from 'lodash';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Container, Button, ResponsiveEmbed, Modal, Spinner, Alert as BootstrapAlert } from 'react-bootstrap';
import Alert from 'react-s-alert';
import publicIp from 'public-ip';

import firebase from '../../utils/firebase';
import ApprovementPopup from '../../components/approvement-popup';
import { StandardPaymentCard } from '../../components/pricing-cards';

class Payment extends Component {
    constructor(props) {
        super(props);

        this.state = {
            duration: 1,
            durationType: 'hours',
            unitPrice: 9,
            calculatedPrice: 0,
            state: 'INITIAL',
            selectedPlanType: undefined
        }
    }

    initializePage = () => {
        this.setState({
            duration: 1,
            durationType: 'hours',
            calculatedPrice: this.props.plans.standard.hourPrice[1],
            state: 'INITIAL',
            basketId: undefined,
            checkoutForm: undefined,
            showSpinner: false,
            spinnerText: '',
            sellingContractAccepted: false,
            refundContractAccepted: false
        })
    }

    componentDidMount() {
        //this.setUserPlan(this.props.user);
        const { plans } = this.props
        this.setState({
            duration: 1,
            durationType: 'hours',
            calculatedPrice: plans.standard ? plans.standard.hourPrice : 9,
            state: 'INITIAL',
            basketId: undefined,
            checkoutForm: undefined,
            showSpinner: false,
            spinnerText: '',
            sellingContractAccepted: false,
            refundContractAccepted: false
        })
    }

    durationChanged = (e) => {
        if (e.target.value >= 1) {
            this.setState({ duration: e.target.value })
            this.calculatePrice(e.target.value)
        }
    }

    calculatePrice = (duration) => {
        let calculatedPrice = 0;
        const { pricePerHour, minPricePerHour } = this.props.plans;
        const { formatMessage } = this.props.intl;
        let unitPrice = this.calculateStandardPrice(pricePerHour, minPricePerHour, duration)
        if (duration < 1) {
            Alert.error(formatMessage({ id: 'Payment.Error.durationLength' }));
        } else if (duration <= 50) {
            calculatedPrice = unitPrice * duration;
        } else {
            unitPrice = minPricePerHour;
            calculatedPrice = unitPrice * duration;
        }
        this.setState({
            calculatedPrice,
            unitPrice,
            state: 'INITIAL',
            checkoutForm: undefined
        })
    }

    calculateStandardPrice = (pricePerHour, minPricePerHour, hours) => {
        // Calculates unit price/hour based on base price and hours
        if (hours <= 0)
            return 0
        if (hours >= 50)
            return minPricePerHour
        const numOf5s = parseInt(hours / 5)
        const price = pricePerHour - numOf5s * 0.5
        return price
    }

    initializePayment = async () => {
        var that = this;
        const { language, user, intl } = this.props;
        var { duration, basketId } = this.state;

        this.setState({
            state: 'PAYMENT',
            showSpinner: true,
            spinnerText: 'Initializing...'
        });

        if (!user.country) {
            this.setState({ infoForm: true })
            return
        }

        var ip = await publicIp.v4();
        var fncAddBasket = firebase.functions().httpsCallable('addToBasket');
        fncAddBasket({
            hours: duration,
            locale: language,
            ip,
            basketId
        }).then(({ data }) => {
            const { basketId, checkoutForm, error } = data;
            console.log('checkout result', checkoutForm)
            console.log('checkout error', error)
            that.setState({
                basketId,
                checkoutForm,
                error,
                showCheckoutForm: true,
                showSpinner: false,
                spinnerText: ''
            })
            if (checkoutForm || error) this.setState({ showCheckoutForm: true })

            firebase.firestore().collection('payments').doc(user.uid).collection('userbasket').doc(basketId)
                .onSnapshot((snapshot) => {
                    if (snapshot && snapshot.data) {
                        let data = snapshot.data();
                        that.setState({
                            state: data.status,
                            error: data.error,
                            showCheckoutForm: data.status === 'SUCCESS' ? false : true
                        });
                    }
                }, (error) => {
                    // TODO: GET_PAYMENT_RESULT_ERROR
                    console.log(error)
                });
        })
    }

    renderSuccess = () => {
        if (this.state.state !== 'SUCCESS' && this.state.state !== 'ERROR' && this.state.state !== 'FAILURE') return null;
        if (this.state.state !== 'SUCCESS') {
            const { formatMessage } = this.props.intl;
            let errorKey = this.state.error ? this.state.error.key : undefined;
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
            <div>
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
        console.log('sellingContractClicked')
        e.preventDefault();
        e.stopPropagation();

        this.setState({ showSellingContract: true });
    }

    refundContractClicked = (e) => {
        console.log('refundContractClicked')
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
                    {/* this.props.language !== 'tr' ? "I'm accepting " : '' */}
                    <span style={{ color: 'blue', textDecorationLine: 'underline', cursor: 'pointer' }} variant='link' onClick={this.sellingContractClicked}>
                        {this.props.language === 'tr' ? 'Satış Sözleşmesi' : 'Selling Contract'}
                    </span>
                    {this.props.language !== 'tr' ? ' and ' : ' ve '}
                    <span style={{ color: 'blue', textDecorationLine: 'underline', cursor: 'pointer' }} variant='link' onClick={this.refundContractClicked}>
                        {this.props.language === 'tr' ? 'İade Koşulları' : 'Refund Policy'}
                    </span>
                    {/* this.props.language === 'tr' ? "'ini kabul ediyorum." : '' */}
                </p>
            </div>
        )
    }

    onHide = () => {
        console.log('onHide')
        this.setState({ showCheckoutForm: false })
    }


    render() {
        const { checkoutForm, duration, unitPrice, calculatedPrice, error, showSpinner } = this.state
        const { user } = this.props;
        return (
            <Container>
                <div className="pricing card-deck flex-column flex-md-row mb-3">
                    <StandardPaymentCard
                        duration={duration}
                        unitPrice={unitPrice}
                        price={calculatedPrice}
                        durationChanged={this.durationChanged}
                        handleBuy={this.initializePayment}
                        showSpinner={showSpinner}
                        renderContract={this.renderContract}
                        currentPlan={user.currentPlan}
                    />
                </div>
                <br />
                {
                    checkoutForm && <Modal show={this.state.showCheckoutForm} onHide={this.onHide}>
                        <Modal.Body>
                            <ResponsiveEmbed>
                                <embed src={checkoutForm.paymentPageUrl} />
                            </ResponsiveEmbed>
                        </Modal.Body>
                    </Modal>
                }
                {
                    error && <Modal show={this.state.showCheckoutForm} onHide={this.onHide}>
                        <Modal.Header>Some error happened!</Modal.Header>
                        <Modal.Body>
                            {error.errorMessage}
                        </Modal.Body>
                    </Modal>
                }
                {
                    this.renderSuccess()
                }
                {
                    this.state.showApprovement &&
                    <ApprovementPopup
                        show={this.state.showApprovement}
                        headerText={{
                            id: 'Plan.Change.confirmationTitle'
                        }}
                        bodyText={{
                            id: this.state.confirmationBody2 ? 'Plan.Change.confirmationBody2' : 'Plan.Change.confirmationBody'
                        }}
                        successButton={{
                            id: 'Plan.Change.confirm'
                        }}
                        handleSuccess={this.submitPlanChange}
                        cancelButton={{
                            id: 'Plan.Change.cancel'
                        }}
                        handleCancel={this.cancelPlanChange}
                    />
                }
            </Container>
        )
    }
}

const mapStateToProps = ({ user, language, plans, errorDefinitions }) => {
    return {
        user,
        language,
        plans,
        errorDefinitions
    }
}

export default connect(mapStateToProps)(withRouter(injectIntl(Payment)));