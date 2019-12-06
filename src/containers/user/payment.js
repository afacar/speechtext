import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import _ from 'lodash';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Container, Card, Form, Row, Col, InputGroup, Button, ResponsiveEmbed, Modal, Spinner, Alert as BootstrapAlert } from 'react-bootstrap';
import Alert from 'react-s-alert';
import publicIp from 'public-ip';

import firebase from '../../utils/firebase';
import Utils from '../../utils';
import ApprovementPopup from '../../components/approvement-popup';
import SellingContract from './selling-contract';
import RefundContract from './refund-contract';
import MasterCardLogo from '../../assets/mastercard-logo.png';
import VisaLogo from '../../assets/visa-logo.png';
import { DemoCard, StandardCard, MonthlyCard, StandardPaymentCard } from '../../components/pricing-cards';

class Payment extends Component {
    constructor(props) {
        super(props);

        this.state = {
            duration: 1,
            durationType: 'hours',
            calculatedPrice: 5.88,
            state: 'INITIAL',
            selectedPlanType: undefined
        }
    }

    initializePage = () => {
        this.setState({
            duration: 1,
            durationType: 'hours',
            calculatedPrice: 5.88,
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
        this.setUserPlan(this.props.user);
    }

    componentWillReceiveProps({ user }) {
        this.setUserPlan(user)
    }

    setUserPlan = (user) => {
        if (user && user.currentPlan) {
            const { currentPlan } = user;
            if (user.currentPlan.type === 'Monthly') {
                this.setState({
                    calculatedPrice: (currentPlan.pricePerMinute * currentPlan.quota).toFixed(2)
                })
            }
            this.setState({
                selectedPlanType: currentPlan.type
            })
        } else {
            this.setState({
                calculatedPrice: 0
            })
        }
    }

    durationChanged = (e) => {
        if (e.target.value >= 1) {
            this.setState({ duration: e.target.value })
            this.calculatePrice(e.target.value)
        }
    }

    calculatePrice = (duration) => {
        var calculatedPrice = 0;
        //var { duration, durationType } = this.state;
        const { currentPlan } = this.props.user;
        const { formatMessage } = this.props.intl;
        let durationInMinutes = parseFloat(duration) * 60;
        console.log('durationInMinutes', durationInMinutes)
        if (durationInMinutes < 60) {
            Alert.error(formatMessage({ id: 'Payment.Error.durationLength' }));
        } else {
            let pricePerMinute = parseFloat(currentPlan.pricePerMinute);
            calculatedPrice = (durationInMinutes * pricePerMinute).toFixed(2);
        }
        this.setState({
            calculatedPrice,
            state: 'INITIAL',
            checkoutForm: undefined
        })
    }

    initializePayment = async () => {
        var that = this;
        const { language, user, intl } = this.props;
        var { duration, durationType, basketId, sellingContractAccepted, refundContractAccepted, selectedPlanType } = this.state;
        /* if (!sellingContractAccepted) {
            Alert.error(intl.formatMessage({ id: 'Payment.Error.onlineSellingContract' }));
            return;
        }
        if (!refundContractAccepted) {
            Alert.error(intl.formatMessage({ id: 'Payment.Error.refundPolicy' }));
            return;
        } */
        let durationInMinutes = undefined;
        if (selectedPlanType === 'PayAsYouGo')
            durationInMinutes = parseFloat(duration) * 60 ;
        this.setState({
            state: 'PAYMENT',
            showSpinner: true,
            spinnerText: 'Initializing...'
        });

        var ip = await publicIp.v4();
        var fncAddBasket = firebase.functions().httpsCallable('addToBasket');
        fncAddBasket({
            minutes: durationInMinutes === 0 ? undefined : durationInMinutes,
            locale: language,
            ip,
            basketId
        }).then(({ data }) => {
            const { basketId, checkoutForm } = data;
            console.log('checkout result', checkoutForm)
            that.setState({
                basketId,
                checkoutForm,
                showSpinner: false,
                spinnerText: ''
            })
            checkoutForm && checkoutForm.paymentPageUrl && this.setState({ showCheckoutForm: true })

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
            .catch(error => {
                // TODO: ADD_TO_BASKET_ERROR
                // NOTE: This function need to thwrow an error on firebase to catch here!
                console.log(error)
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

    renderFormAsDemo = () => {
        return (
            <div>
                <BootstrapAlert variant='danger'>
                    <FormattedMessage id='Payment.Error.demoPlan' />
                </BootstrapAlert>
                {/* <Button variant='primary' onClick={() => this.props.changeTab('plan') }>Select a Plan</Button> */}
            </div>
        )
    }

    validatePayment = () => {
        const { displayName, email, country, address } = this.props.user;
        if (_.isEmpty(displayName) || _.isEmpty(email) || _.isEmpty(country) || _.isEmpty(address)) {
            return (
                <div>
                    <BootstrapAlert variant='danger'>
                        <FormattedMessage id='Payment.Error.incompleteProfile1' />
                        <BootstrapAlert.Link onClick={() => this.props.changeTab('profile')}>
                            <FormattedMessage id='Payment.Error.incompleteProfile2' />
                        </BootstrapAlert.Link>
                        <FormattedMessage id='Payment.Error.incompleteProfile3' />
                    </BootstrapAlert>
                </div>
            )
        }
        return {
            success: true
        }
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
            <div className='d-flex flex-row contract-text text-center' style={{ fontSize:'small' }}>
                <p>
                    {/* this.props.language !== 'tr' ? "I'm accepting " : '' */}
                    <span style={{ color:'blue', textDecorationLine: 'underline', cursor: 'pointer' }} variant='link' onClick={this.sellingContractClicked}>
                        {this.props.language === 'tr' ? 'Satış Sözleşmesi' : 'Selling Contract'}
                    </span>
                    {this.props.language !== 'tr' ? ' and ' : ' ve '}
                    <span style={{ color:'blue', textDecorationLine: 'underline', cursor: 'pointer' }} variant='link' onClick={this.refundContractClicked}>
                        {this.props.language === 'tr' ? 'İade Koşulları' : 'Refund Policy'}
                    </span>
                    {/* this.props.language === 'tr' ? "'ini kabul ediyorum." : '' */}
                </p>
            </div>
        )
    }

    /*     renderSellingContract = () => {
            return (
                <div className='d-flex flex-row'>
                    <Form.Check
                        name='sellingContractAccepted'
                        type='checkbox'
                        value={this.state.sellingContractAccepted}
                        onClick={() => this.setState({ sellingContractAccepted: !this.state.sellingContractAccepted })}
                    />
                    <p>
                        {this.props.language !== 'tr' ? 'I read and accepted ' : ''}
                        <Button variant='link' onClick={this.sellingContractClicked}>
                            {this.props.language === 'tr' ? 'Mesafeli Satış Sözleşmesi' : 'Online Selling Contract'}
                        </Button>
                        {this.props.language === 'tr' ? "'ni okudum ve onaylıyorum." : ''}
                    </p>
                </div>
            )
        } */

    /*     renderRefundContract = () => {
            return (
                <div className='d-flex flex-wor'>
                    <Form.Check
                        name='refundContractAccepted'
                        type='checkbox'
                        value={this.state.refundContractAccepted}
                        onClick={() => this.setState({ refundContractAccepted: !this.state.refundContractAccepted })}
                    />
                    <p>
                        {this.props.language !== 'tr' ? 'I read and accepted ' : ''}
                        <Button variant='link' onClick={this.refundContractClicked}>
                            {this.props.language === 'tr' ? 'İptal ve İade Koşulları' : 'Cancel and Refund Policy'}
                        </Button>
                        {this.props.language === 'tr' ? "'nı okudum ve onaylıyorum." : ''}
                    </p>
                </div>
            )
        } */

    renderPaymentForm = () => {
        var { currentPlan } = this.props.user;
        const { formatMessage } = this.props.intl;
        if (!currentPlan) currentPlan = {};
        const { calculatedPrice, duration, durationType, checkoutForm, showSpinner, state, showSellingContract, showRefundContract } = this.state;
        if (state === 'SUCCESS' || state === 'FAILURE' || state === 'ERROR') return null;
        if (currentPlan.type === 'Demo') {
            return this.renderFormAsDemo();
        }
        var validationResult = this.validatePayment();
        if (!validationResult.success) {
            return validationResult;
        }
        return (
            <div>
                {
                    currentPlan.type === 'PayAsYouGo' &&
                    <Form.Group>
                        <Form.Label>
                            <FormattedMessage id='Payment.Label.usageNeeded' />
                        </Form.Label>
                        <InputGroup className="mb-3">
                            <Form.Control
                                name='duration'
                                placeholder="Duration needed"
                                aria-label="Duration needed"
                                type='number'
                                value={duration}
                                onChange={this.durationChanged}
                            />
                            <InputGroup.Append>
                                <Form.Control as='select' value={this.state.durationType} onChange={e => this.setState({ durationType: e.target.value })}>
                                    <option key='hours' value='hours'>
                                        {formatMessage({ id: 'Payment.DurationType.hours' })}
                                    </option>
                                    <option key='minutes' value='minutes'>
                                        {formatMessage({ id: 'Payment.DurationType.minutes' })}
                                    </option>
                                </Form.Control>
                            </InputGroup.Append>
                            <InputGroup.Append>
                                <Button variant="primary" onClick={this.calculatePrice}>
                                    <FormattedMessage id='Payment.Label.calculate' />
                                </Button>
                            </InputGroup.Append>
                        </InputGroup>
                    </Form.Group>
                }
                {
                    showSellingContract &&
                    <SellingContract
                        show={showSellingContract}
                        handleVisibility={this.handleSellingContractVisibility}
                        duration={duration}
                        durationType={durationType}
                        calculatedPrice={calculatedPrice}
                    />
                }
                {
                    showRefundContract &&
                    <RefundContract
                        show={showRefundContract}
                        handleVisibility={this.handleRefundContractVisibility}
                    />
                }
                {
                    calculatedPrice > 0 &&
                    <Form.Group>
                        <Form.Label><b>{formatMessage({ id: 'Payment.Label.calculatedPrice' })}</b> {`${currentPlan.currency === 'USD' ? '$' : ''} ${calculatedPrice} ${currentPlan.currency === 'TRY' ? 'TL' : ''}`}</Form.Label>
                        <br />
                        <div className='mb-3'>
                            <img src={MasterCardLogo} alt='Master Card' className='card-logo' />
                            <img src={VisaLogo} alt='Visa' className='card-logo' />
                        </div>
                        <Button variant='success' onClick={this.initializePayment}>
                            {currentPlan.type === 'PayAsYouGo' ? formatMessage({ id: 'Payment.Button.makePayment' }) : formatMessage({ id: 'Payment.Button.renewSubscription' })}
                        </Button>
                        <div className='float-right d-flex flex-column'>
                            {
                                this.renderContract()
                            }
                        </div>
                    </Form.Group>
                }
                {
                    showSpinner &&
                    <div>
                        <Spinner animation="border" role="status" />
                        &nbsp;<span>{this.state.spinnerText}</span>
                    </div>
                }
                {
                    checkoutForm && checkoutForm.paymentPageUrl &&
                    <Modal show={this.state.showCheckoutForm} onHide={this.onHide}>
                        <Modal.Body>
                            <ResponsiveEmbed>
                                <embed src={checkoutForm.paymentPageUrl} />
                            </ResponsiveEmbed>
                        </Modal.Body>
                    </Modal>
                }
            </div>
        )
    }

    onHide = () => {
        console.log('onHide')
        this.setState({ showCheckoutForm: false })
    }

    changeCurrentPlan = () => {
        const { user } = this.props;
        if (user.currentPlan.type === 'Monthly') {
            this.setState({
                showApprovement: true
            });
        } else if (user.currentPlan.type === 'PayAsYouGo') {
            this.setState({
                showApprovement: true,
                confirmationBody2: true
            });
        } else {
            this.submitPlanChange();
        }
    }

    submitPlanChange = () => {
        console.log('change user plan')
        const { selectedPlanType } = this.state;
        const { plans, intl } = this.props;
        var selectedPlan = _.find(plans, { type: selectedPlanType });
        var fncChangeUserPlan = firebase.functions().httpsCallable('changeUserPlan');
        fncChangeUserPlan({
            planId: selectedPlan.planId
        }).then(({ data }) => {
            if (data.success) {
                Alert.success(intl.formatMessage({ id: 'Plan.Change.succesMessage' }));
            } else {
                Alert.error('Some error occured! Please try again later.')
            }
        })
            .catch(error => {
                // TODO: CHANGE_USER_PLAN_ERROR
                console.log(error);
            })
        this.setState({
            showApprovement: false,
            confirmationBody2: false
        });
    }

    cancelPlanChange = () => {
        this.setState({
            showApprovement: false,
            confirmationBody2: false
        })
    }

    handleSelectedPlanChange = (planType) => {
        this.setState({
            selectedPlanType: planType
        })
    }

    renderCurrentPlan = () => {
        var { currentPlan } = this.props.user;
        const { selectedPlanType } = this.state;
        if (_.isEmpty(currentPlan)) currentPlan = {};
        return (
            <Card className='current-plan-card'>
                <Card.Title className='current-plan-title'>
                    <Form>
                        <Form.Group>
                            <Form.Label>
                                <b><FormattedMessage id='Payment.CurrentPlan.title' /></b>
                            </Form.Label>
                            <div className='d-flex flex-row'>
                                <Form.Control
                                    name='plans'
                                    as='select'
                                    onChange={(e) => { this.handleSelectedPlanChange(e.target.value) }}
                                    value={selectedPlanType}
                                    className={selectedPlanType && selectedPlanType !== currentPlan.type ? 'plan-selection' : ''}
                                >
                                    {
                                        _.map(this.props.plans, (plan) => {
                                            let planPrice = 0, priceAmount = '';
                                            if (plan.type !== 'Demo') {
                                                planPrice = plan.price ? plan.price.toFixed(2) : null;
                                                priceAmount = this.props.intl.formatMessage({ id: `Payment.Plan.PlanAmount.${plan.priceAmount}` });
                                            }
                                            if (plan.type !== 'Demo' || currentPlan.type === 'Demo') {
                                                return (<option key={plan.type} value={plan.type}>
                                                    {plan.type === 'Demo' ? plan.planName : `${plan.planName} - $${planPrice} / ${priceAmount}`}
                                                </option>)
                                            }
                                        })
                                    }
                                </Form.Control>
                                {
                                    selectedPlanType && selectedPlanType !== currentPlan.type &&
                                    <Button variant='success' className='change-plan-button' onClick={this.changeCurrentPlan}>
                                        <FormattedMessage id='Payment.Plan.changePlanButtonText' />
                                    </Button>
                                }
                            </div>
                        </Form.Group>
                    </Form>
                </Card.Title>
                <Card.Body>
                    <Row>
                        <Col lg={6} md={6} sm={6}>
                            <Form.Label>
                                <b><FormattedMessage id='Payment.CurrentPlan.remainingMinutes' /></b>
                                {currentPlan.remainingMinutes}
                                <FormattedMessage id='Payment.CurrentPlan.durationType' />
                            </Form.Label><br />
                            <Form.Label>
                                <b><FormattedMessage id='Payment.CurrentPlan.expireDate' /></b>
                                {Utils.formatExpireDate(currentPlan.expireDate)}
                            </Form.Label>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        )
    }

    render() {
        const { checkoutForm, showSpinner } = this.state
        return (
            <Container>
                <div className="pricing card-deck flex-column flex-md-row mb-3">
                    <StandardPaymentCard
                        duration={this.state.duration}
                        price={this.state.calculatedPrice}
                        durationChanged={this.durationChanged}
                        handleBuy={this.initializePayment}
                        showSpinner={this.state.showSpinner}
                        renderContract={this.renderContract}
                        currentPlan={this.props.user.currentPlan}
                    />
                    <MonthlyCard user={this.props.user} />
                </div>
                <br />
                
                {
                    checkoutForm && checkoutForm.paymentPageUrl &&
                    <Modal show={this.state.showCheckoutForm} onHide={this.onHide}>
                        <Modal.Body>
                            <ResponsiveEmbed>
                                <embed src={checkoutForm.paymentPageUrl} />
                            </ResponsiveEmbed>
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