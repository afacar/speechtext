import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import _ from 'lodash';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Container, Card, Form, Row, Col, InputGroup, Button, ResponsiveEmbed, Spinner, Alert as BootstrapAlert } from 'react-bootstrap';
import Alert from 'react-s-alert';
import publicIp from 'public-ip';

import firebase from '../../utils/firebase';
import Utils from '../../utils';
import ApprovementPopup from '../../components/approvement-popup';
import SellingContract from './selling-contract';
import RefundContract from './refund-contract';
import MasterCardLogo from '../../assets/mastercard-logo.png';
import VisaLogo from '../../assets/visa-logo.png';

class Payment extends Component {
    constructor(props) {
        super(props);

        this.state = {
            duration: 0,
            durationType: 'hours',
            calculatedPrice: 0,
            state: 'INITIAL',
            selectedPlanType: undefined
        }
    }

    initializePage = () => {
        this.setState({
            duration: 0,
            durationType: 'hours',
            calculatedPrice: 0,
            state: 'INITIAL',
            basketId: undefined,
            checkoutForm: undefined,
            showSpinner: false,
            spinnerText: ''
        })
    }

    componentWillReceiveProps({ user }) {
        if (user && user.currentPlan) {
            const { currentPlan } = user;
            if(user.currentPlan.type === 'Monthly') {
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
        this.setState({
            duration: e.target.value
        })
    }

    calculatePrice = () => {
        var calculatedPrice = 0;
        var { duration, durationType } = this.state;
        const { currentPlan } = this.props.user;
        const { formatMessage } = this.props.intl;
        let durationInMinutes = parseFloat(duration) * (durationType === 'hours' ? 60 : 1);
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
        var { duration, durationType, basketId, sellingContractAccepted, refundContractAccepted } = this.state;
        if (!sellingContractAccepted) {
            Alert.error(intl.formatMessage({ id: 'Payment.Error.onlineSellingContract' }));
            return;
        }
        if (!refundContractAccepted) {
            Alert.error(intl.formatMessage({ id: 'Payment.Error.refundPolicy' }));
            return;
        }
        let durationInMinutes = parseFloat(duration) * (durationType === 'hours' ? 60 : 1);
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
            newPlanId: user.currentPlan.id,
            ip,
            basketId
        }).then(({ data }) => {
            const { basketId, checkoutForm } = data;
            that.setState({
                basketId,
                checkoutForm,
                showSpinner: false,
                spinnerText: ''
            })
            firebase.firestore().collection('payments').doc(user.uid).collection('userbasket').doc(basketId)
                .onSnapshot((snapshot) => {
                    if (snapshot && snapshot.data && snapshot.data().status === 'SUCCESS') {
                        that.setState({
                            state: 'SUCCESS'
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
        if (this.state.state !== 'SUCCESS') return null;
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
        const { name, surname, email, phoneNumner, Billing } = this.props.user;
        if(_.isEmpty(name) || _.isEmpty(surname) || _.isEmpty(email) || _.isEmpty(phoneNumner)) {
            if(_.isEmpty(Billing) || _.isEmpty(Billing.country) || _.isEmpty(Billing.city) || _.isEmpty(Billing.zipCode) || _.isEmpty(Billing.address)
                || ('tr' === Billing.country && _.isEmpty(Billing.identityNumber))) {
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
        }
        return {
            success: true
        }
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

    renderSellingContract = () => {
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
                    <a href='' onClick={this.sellingContractClicked}>
                        {this.props.language === 'tr' ? 'Mesafeli Satış Sözleşmesi' : 'Online Selling Contract'}
                    </a>
                    {this.props.language === 'tr' ? "'ni okudum ve onaylıyorum." : ''}
                </p>
            </div>
        )
    }

    renderRefundContract = () => {
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
                    <a href='' onClick={this.refundContractClicked}>
                        {this.props.language === 'tr' ? 'İptal ve İade Koşulları' : 'Cancel and Refund Policy'}
                    </a>
                    {this.props.language === 'tr' ? "'nı okudum ve onaylıyorum." : ''}
                </p>
            </div>
        )
    }

    renderPaymentForm = () => {
        var { currentPlan } = this.props.user;
        const { formatMessage } = this.props.intl;
        if (!currentPlan) currentPlan = {};
        const { calculatedPrice, duration, durationType, checkoutForm, showSpinner, state, showSellingContract, showRefundContract } = this.state;
        if (state === 'SUCCESS') return null;
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
                                this.renderSellingContract()
                            }
                            {
                                this.renderRefundContract()
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
                    <ResponsiveEmbed>
                        <embed src={checkoutForm.paymentPageUrl} />
                    </ResponsiveEmbed>
                }
            </div>
        )
    }

    changeCurrentPlan = () => {
        const { user } = this.props;
        if(user.currentPlan.type !== 'Demo') {
            this.setState({
                showApprovement: true
            });
        } else {
            this.submitPlanChange();
        }
    }

    submitPlanChange = () => {
        const { selectedPlanType } = this.state;
        const { plans, intl } = this.props;
        var selectedPlan = _.find(plans, { type: selectedPlanType });
        var fncAddBasket = firebase.functions().httpsCallable('changeUserPlan');
        fncAddBasket({ 
            planId: selectedPlan.planId
        }).then(({ data }) => {
            if(data.success) {
                Alert.success(intl.formatMessage({ id: 'Plan.Change.succesMessage' }));
            }
        })
        .catch(error => {
            // TODO: CHANGE_USER_PLAN_ERROR
            console.log(error);
        })
        this.setState({
            showApprovement: false
        });
    }

    cancelPlanChange = () => {
        this.setState({
            showApprovement: false
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
            <Card>
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
                                    onChange={ (e) => { this.handleSelectedPlanChange(e.target.value) } }
                                    value={ selectedPlanType }
                                    className={ selectedPlanType && selectedPlanType !== currentPlan.type ? 'plan-selection' : '' }
                                >
                                    {
                                        _.map(this.props.plans, (plan) => {
                                            let planPrice = 0, priceAmount = '';
                                            if(plan.type !== 'Demo') {
                                                planPrice = plan.price ? plan.price.toFixed(2) : null;
                                                priceAmount = this.props.intl.formatMessage({ id: `Payment.Plan.PlanAmount.${plan.priceAmount}` });
                                            }
                                            if(plan.type !== 'Demo' || currentPlan.type === 'Demo') {
                                                return (<option key={ plan.type } value={ plan.type }>
                                                    { plan.type === 'Demo' ? plan.planName : `${plan.planName} - $${planPrice} / ${priceAmount}` }
                                                </option>)
                                            }
                                        })
                                    }
                                </Form.Control>
                                {
                                    selectedPlanType && selectedPlanType !== currentPlan.type &&
                                    <Button variant='success' className='change-plan-button' onClick={ this.changeCurrentPlan }>
                                        <FormattedMessage id='Payment.Plan.changePlanButtonText' />
                                    </Button>
                                }
                            </div>
                        </Form.Group>
                    </Form>
                </Card.Title>
                <Card.Body>
                    <Row>
                        {
                            currentPlan.type === 'Demo' &&
                            <Col lg={6} md={6} sm={6}>
                                <Form.Label>
                                    <b><FormattedMessage id='Payment.CurrentPlan.durationLimit' /></b>
                                    {`${!currentPlan.quota || currentPlan.quota === 0 ? '-' : currentPlan.quota + <FormattedMessage id='Payment.CurrentPlan.durationType' />}`}
                                </Form.Label>
                            </Col>
                        }
                        {
                            currentPlan.type === 'Monthly' &&
                            <Col lg={6} md={6} sm={6}>
                                <Form.Label>
                                    <b><FormattedMessage id='Payment.CurrentPlan.expireDate' /></b>
                                    {Utils.formatExpireDate(currentPlan.expireDate)}
                                </Form.Label>
                            </Col>
                        }
                        <Col lg={6} md={6} sm={6}>
                            <Form.Label>
                                <b><FormattedMessage id='Payment.CurrentPlan.remainingMinutes' /></b>
                                {currentPlan.remainingMinutes}
                                <FormattedMessage id='Payment.CurrentPlan.durationType' />
                            </Form.Label>
                        </Col>
                        {
                            currentPlan.pricePerMinute > 0 &&
                            <Col lg={6} md={6} sm={6}>
                                <Form.Label>
                                    <b><FormattedMessage id='Payment.CurrentPlan.pricePerMinute' /></b>
                                    $ {currentPlan.pricePerMinute}
                                </Form.Label>
                            </Col>
                        }
                    </Row>
                </Card.Body>
            </Card>
        )
    }

    render() {
        return (
            <Container>
                {
                    this.renderCurrentPlan()
                }
                <br />
                {
                    this.renderPaymentForm()
                }
                {
                    this.renderSuccess()
                }
                {
                    this.state.showApprovement &&
                    <ApprovementPopup
                        show={ this.state.showApprovement }
                        headerText={{
                            id: 'Plan.Change.confirmationTitle'
                        }}
                        bodyText={{
                            id: 'Plan.Change.confirmationBody'
                        }}
                        successButton={{
                            id: 'Plan.Change.confirm'
                        }}
                        handleSuccess={ this.submitPlanChange }
                        cancelButton={{
                            id: 'Plan.Change.cancel'
                        }}
                        handleCancel={ this.cancelPlanChange }
                    />
                }
            </Container>
        )
    }
}

const mapStateToProps = ({ user, language, plans }) => {
    return {
        user,
        language,
        plans
    }
}

export default connect(mapStateToProps)(withRouter(injectIntl(Payment)));