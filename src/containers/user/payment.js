import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import _ from 'lodash';
import { Container, Card, Form, Row, Col, InputGroup, Button, ResponsiveEmbed, Spinner, Alert as BootstrapAlert } from 'react-bootstrap';
import Alert from 'react-s-alert';
import publicIp from 'public-ip';

import firebase from '../../utils/firebase';
import Utils from '../../utils';
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
            state: 'INITIAL'
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
        if(user && user.currentPlan && user.currentPlan.type === 'Monthly') {
            const { currentPlan } = user;
            this.setState({
                calculatedPrice: (currentPlan.pricePerMinute * currentPlan.quota).toFixed(2)
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
        let durationInMinutes = parseFloat(duration) * (durationType === 'hours' ? 60 : 1);
        if(durationInMinutes < 60) {
            Alert.error('You must buy at least 60 minutes!');
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
        const { language, user } = this.props;
        var { duration, durationType, basketId, sellingContractAccepted, refundContractAccepted } = this.state;
        if(!sellingContractAccepted) {
            if(language === 'tr') {
                Alert.error('Mesafeli Satış Sözleşmesini onaylayınız!');
            } else {
                Alert.error('Please accept Online Selling Contract!');
            }
            return;
        }
        if(!refundContractAccepted) {
            if(language === 'tr') {
                Alert.error('İptal ve İade Koşullarını onaylayınız!');
            } else {
                Alert.error('Please accept Cancel and Refund Policy!');
            }
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
                if(snapshot && snapshot.data && snapshot.data().status === 'SUCCESS') {
                    that.setState({
                        state: 'SUCCESS'
                    });
                }
            });
        });
    }

    renderSuccess = () => {
        if(this.state.state !== 'SUCCESS') return null;
        return (
            <div>
                <BootstrapAlert variant='success'>
                    Payment is successful.
                </BootstrapAlert>
                <Button variant='primary' onClick={ this.initializePage }>Add More Credits</Button>
                <br />
                <Button variant='link'>
                    <Link to='/dashboard'>Go to Dashboard</Link>
                </Button>
            </div>
        )
    }

    renderFormAsDemo = () => {
        return (
            <div>
                <BootstrapAlert variant='danger'>
                    You cannot add credit in Demo plan! <BootstrapAlert.Link href="#" onClick={() => this.props.changeTab('plan')}>Select a Plan</BootstrapAlert.Link> in order to add credits.
                </BootstrapAlert>
                {/* <Button variant='primary' onClick={() => this.props.changeTab('plan') }>Select a Plan</Button> */}
            </div>
        )
    }

    validatePayment = () => {
        const { name, surname, email, phoneNumner, Billing } = this.props.user;
        
        if(_.isEmpty(name) || _.isEmpty(surname) || _.isEmpty(email) || _.isEmpty(phoneNumner)) {
            if(_.isEmpty(Billing) || _.isEmpty(Billing.country) || _.isEmpty(Billing.city) || _.isEmpty(Billing.zipCode) || _.isEmpty(Billing.address) || _.isEmpty(Billing.identityNumber)) {
                return (
                    <div>
                        <BootstrapAlert variant='danger'>
                            You need to <BootstrapAlert.Link onClick={() => this.props.changeTab('profile')}>Complete Your Profile</BootstrapAlert.Link> in order to make payment!
                        </BootstrapAlert>
                        {/* <Button variant='primary' onClick={() => this.props.changeTab('payment') }>Go to Profile</Button> */}
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
                    value={ this.state.sellingContractAccepted }
                    onClick={ () => this.setState({ sellingContractAccepted: !this.state.sellingContractAccepted }) }
                />
                <p>
                    { this.props.language !== 'tr' ? 'I read and accepted ' : ''}
                    <a href='' onClick={ this.sellingContractClicked }>
                        { this.props.language === 'tr' ? 'Mesafeli Satış Sözleşmesi' : 'Online Selling Contract'}
                    </a>
                    { this.props.language === 'tr' ? "'ni okudum ve onaylıyorum." : '' }
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
                    value={ this.state.refundContractAccepted }
                    onClick={ () => this.setState({ refundContractAccepted: !this.state.refundContractAccepted }) }
                />
                <p>
                    { this.props.language !== 'tr' ? 'I read and accepted ' : ''}
                    <a href='' onClick={ this.refundContractClicked }>
                        { this.props.language === 'tr' ? 'İptal ve İade Koşulları' : 'Cancel and Refund Policy'}
                    </a>
                    { this.props.language === 'tr' ? "'nı okudum ve onaylıyorum." : '' }
                </p>
            </div>    
        )
    }

    renderPaymentForm = () => {
        var { currentPlan } = this.props.user;
        if(!currentPlan) currentPlan = {};
        const { calculatedPrice, duration, durationType, checkoutForm, showSpinner, state, showSellingContract, showRefundContract } = this.state;
        if(state === 'SUCCESS') return null;
        if(currentPlan.type === 'Demo') {
            return this.renderFormAsDemo();
        }
        var validationResult = this.validatePayment();
        if(!validationResult.success) {
            return validationResult;
        }
        return (
            <div>
                {
                    currentPlan.type === 'PayAsYouGo' &&
                    <Form.Group>
                        <Form.Label>Usage needed in minutes</Form.Label>
                        <InputGroup className="mb-3">
                            <Form.Control
                                name='duration'
                                placeholder="Duration needed"
                                aria-label="Duration needed"
                                type='number'
                                value={ duration }
                                onChange={ this.durationChanged }
                            />
                            <InputGroup.Append>
                                <Form.Control as='select' value={ this.state.durationType } onChange={ e => this.setState({ durationType: e.target.value }) }>
                                    <option key='hours' value='hours'>Hours</option>
                                    <option key='minutes' value='minutes'>Minutes</option>
                                </Form.Control>
                            </InputGroup.Append>
                            <InputGroup.Append>
                                <Button variant="primary" onClick={ this.calculatePrice }>Calculate</Button>
                            </InputGroup.Append>
                        </InputGroup>
                    </Form.Group>
                }
                {
                    showSellingContract &&
                    <SellingContract
                        show={ showSellingContract }
                        handleVisibility={ this.handleSellingContractVisibility }
                        duration={ duration }
                        durationType={ durationType }
                        calculatedPrice={ calculatedPrice }
                    />
                }
                {
                    showRefundContract &&
                    <RefundContract
                        show={ showRefundContract }
                        handleVisibility={ this.handleRefundContractVisibility }
                    />
                }
                {
                    calculatedPrice > 0 &&
                    <Form.Group>
                        <Form.Label><b>{`${currentPlan.type === 'PayAsYouGo' ? 'Calculated ' : '' }Price :`}</b> { `${currentPlan.currency === 'USD' ? '$' : ''} ${calculatedPrice} ${ currentPlan.currency === 'TRY' ? 'TL' : '' }` }</Form.Label>
                        <br />
                        <div className='mb-3'>
                            <img src={ MasterCardLogo } alt='Master Card' className='card-logo' />
                            <img src={ VisaLogo } alt='Visa' className='card-logo' />
                        </div>
                        <Button variant='success' onClick={ this.initializePayment }>{ currentPlan.type === 'PayAsYouGo' ? 'Make Payment' : 'Renew Subscription'  }</Button>
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
                        &nbsp;<span>{ this.state.spinnerText }</span>
                    </div>
                }
                {
                    checkoutForm && checkoutForm.paymentPageUrl &&
                    <ResponsiveEmbed>
                        <embed src={ checkoutForm.paymentPageUrl } />
                    </ResponsiveEmbed>
                }
            </div>
        )
    }

    render() {
        var { currentPlan } = this.props.user;
        if(_.isEmpty(currentPlan)) currentPlan = {};
        return (
            <Container>
                <Card>
                    <Card.Title className='current-plan-title'><b>CurrentPlan :</b> { currentPlan.planName }</Card.Title>
                    <Card.Body>
                        <Row>
                            {
                                currentPlan.type === 'Demo' &&
                                <Col lg={6} md={6} sm={6}>
                                    <Form.Label><b>Duration Limit : </b>{`${!currentPlan.quota || currentPlan.quota === 0 ? '-' : currentPlan.quota + ' mins'}`}</Form.Label>
                                </Col>
                            }
                            {
                                currentPlan.type === 'Monthly' &&
                                <Col lg={6} md={6} sm={6}>
                                    <Form.Label><b>Expire Date : </b> { Utils.formatExpireDate(currentPlan.expireDate) }</Form.Label>
                                </Col>
                            }
                            <Col lg={6} md={6} sm={6}>
                                <Form.Label><b>Remaining Duration : </b>{currentPlan.remainingMinutes} mins</Form.Label>
                            </Col>
                            {
                                currentPlan.pricePerMinute > 0 &&
                                <Col lg={6} md={6} sm={6}>
                                    <Form.Label><b>Price Per Minute : </b>$ {currentPlan.pricePerMinute}</Form.Label>
                                </Col>
                            }
                        </Row>
                    </Card.Body>
                </Card>
                <br />
                {
                    this.renderPaymentForm()
                }
                {
                    this.renderSuccess()
                }
            </Container>
        )
    }
}

const mapStateToProps = ({ user, language }) => {
    return {
        user,
        language
    }
}

export default connect(mapStateToProps)(withRouter(Payment));