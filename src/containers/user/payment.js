import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import _ from 'lodash';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Container, Button, Modal, Alert as BootstrapAlert } from 'react-bootstrap';
import Alert from 'react-s-alert';
import publicIp from 'public-ip';

import firebase from '../../utils/firebase';
import ApprovementPopup from '../../components/approvement-popup';
import { StandardPaymentCard } from '../../components/pricing-cards';
import CheckOutModal from '../../components/check-out-modal';
import ContactFormModal from '../../components/contact-form-modal';

class Payment extends Component {
    constructor(props) {
        super(props);

        this.state = {
            duration: 1,
            durationType: 'hours',
            unitPrice: 9,
            calculatedPrice: 9,
            state: 'INITIAL',
            selectedPlanType: undefined
        }
    }

    initializePage = () => {
        this.setState({
            duration: 1,
            durationType: 'hours',
            calculatedPrice: 9,
            state: 'INITIAL',
            basketId: undefined,
            checkoutForm: undefined,
            showSpinner: false,
            spinnerText: '',
            sellingContractAccepted: false,
            refundContractAccepted: false,
            showCheckOutForm: false, // new
            loading: false,
            errorMessage: '',
            disabled: false,
            showContactForm: false,
        })
    }

    componentDidMount() {
        const { plans } = this.props
        if(!_.isEmpty(plans)) {
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
    }

    durationChanged = (e) => {
        if (!e.target) {
            this.setState({ duration: e })
            this.calculatePrice(e)
        }
        else {
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
                    <span style={{ color: 'blue', textDecorationLine: 'underline', cursor: 'pointer' }} variant='link' onClick={ this.sellingContractClicked }>
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
                state:'PAYMENT'
            })
        }
    }

    closeCheckOutForm = () => {
        if (!this.state.loading) {
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
        var { duration, basketId } = this.state;
        // let durationInMinutes = undefined;
        // if (selectedPlanType === 'PayAsYouGo')
            // durationInMinutes = parseFloat(duration) * (durationType === 'hours' ? 60 : 1);
        this.setState({
            state: 'PAYMENT',
            loading: true,
            disabled: true,
            showCheckOutForm: true,
        });

        var ip = await publicIp.v4();
        var fncAddBasket = firebase.functions().httpsCallable('addToBasketSecondary');
        fncAddBasket({
            hours: duration,
            // minutes: durationInMinutes === 0 ? undefined : durationInMinutes,
            locale: language,
            ip,
            basketId,
            card
        }).then(({ data }) => {
            const { basketId, result, error } = data;
            let errorMessage = '';
            if (error)
                errorMessage = error.errorMessage;
            else if (result && result.status === 'failure') {
                errorMessage = "Bilinmedik Hata Oluştu"
            }
            that.setState({
                basketId,
                result,
                state: result ? result.status : error.status,
                errorMessage,
                loading: false,
                spinnerText: '',
                disabled: false,
            })
            setTimeout(() => {
                this.initializePage();
            }, 2500)
            // firebase.firestore().collection('payments').doc(user.uid).collection('userbasket').doc(basketId)
            //     .onSnapshot((snapshot) => {
            //         if (snapshot && snapshot.data) {
            //             let data = snapshot.data();
            //             that.setState({
            //                 error: data.error
            //             });
            //         }
            //     }, (error) => {
            //         // TODO: GET_PAYMENT_RESULT_ERROR
            //         console.log(error)
            //     });
        })
            .catch(error => {
                // TODO: ADD_TO_BASKET_ERROR
                // NOTE: This function need to thwrow an error on firebase to catch here!
                console.log("Error burada\n" + error)
                this.setState({
                    state: 'failure',
                    errorMessage: 'Bilinmedik Hata Oluştu'
                })
                setTimeout(() => {
                    this.initializePage();
                }, 2500)
            })
    }

    toggleSubmit = (flag) => {
        this.setState({
            disabled: flag
        })
    }

    render() {
        const { showCheckOutForm, duration, durationType, unitPrice, calculatedPrice, error, showSpinner, showContactForm } = this.state
        const { user } = this.props;
        return (
            <Container>
                <div className="pricing card-deck flex-column flex-md-row mb-3">
                    <StandardPaymentCard
                        duration={duration}
                        unitPrice={unitPrice}
                        price={calculatedPrice}
                        durationChanged={this.durationChanged}
                        handleBuy={this.showForm}
                        showSpinner={showSpinner}
                        renderContract={this.renderContract}
                        currentPlan={user.currentPlan}
                    />
                </div>
                <br />
                {
                    <div>
                        <CheckOutModal show={showCheckOutForm}
                            handleClose={this.closeCheckOutForm}
                            calculatedPrice={calculatedPrice}
                            startPayment={this.startPayment}
                            duration={duration}
                            durationType={durationType}
                            pricePerHour={unitPrice}
                            errorMessage={this.state.errorMessage}
                            loading={this.state.loading}
                            disabled={this.state.disabled}
                            state={this.state.state}
                            toggleSubmit={this.toggleSubmit} />
                    </div>
                }
                {
                    <div>
                        <ContactFormModal show={showContactForm}
                            handleClose={this.closeContactForm}
                            closeContactForm={this.closeContactForm} />
                    </div>
                }
                {
                    error && <Modal show={this.state.showCheckoutForm} size='lg' onHide={this.onHide}>
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

