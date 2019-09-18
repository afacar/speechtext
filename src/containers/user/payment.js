import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { Container, Card, Form, Row, Col, InputGroup, Button } from 'react-bootstrap';
import Alert from 'react-s-alert';
import publicIp from 'public-ip';

import firebase from '../../utils/firebase';

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

    durationChanged = (e) => {
        this.setState({
            duration: e.target.value
        })
    }

    calculatePrice = () => {
        var calculatedPrice = 0;
        var { duration, durationType } = this.state;
        const { currentPlan } = this.props.user;
        let durationInMinutes = parseInt(duration) * (durationType === 'hours' ? 60 : 1);
        if(durationInMinutes < 60) {
            Alert.error('You must buy at lease 60 minutes!');
        } else {
            let pricePerMin = parseFloat(currentPlan.pricePerMin);
            calculatedPrice = durationInMinutes * pricePerMin;
        }
        this.setState({
            calculatedPrice,
            state: 'INITIAL'
        })
    }

    initializePayment = async () => {
        const { language, user } = this.props;
        var { duration, durationType } = this.state;
        let durationInMinutes = parseInt(duration) * (durationType === 'hours' ? 60 : 1);
        this.setState({
            state: 'PAYMENT'
        });
        
        var ip = await publicIp.v4();
        var fncAddBasket = firebase.functions().httpsCallable('addToBasket');
        fncAddBasket({ 
            minutes: durationInMinutes,
            locale: language,
            newPlanId: user.currentPlan.id,
            ip
        }).then( response => {
            console.log(response);
        });
    }

    render() {
        var { currentPlan } = this.props.user;
        const { calculatedPrice, duration } = this.state;
        if(_.isEmpty(currentPlan)) currentPlan = {};
        return (
            <Container>
                <Card>
                    <Card.Title className='current-plan-title'><b>CurrentPlan :</b> { currentPlan.planName }</Card.Title>
                    <Card.Body>
                        <Row>
                            <Col lg={6} md={6} sm={6}>
                                <Form.Label><b>Duration Limit : </b>{`${currentPlan.durationLimit || currentPlan.durationLimit === 0 ? '    -' : currentPlan.durationLimit + ' mins'}`}</Form.Label>
                            </Col>
                            <Col lg={6} md={6} sm={6}>
                                <Form.Label><b>Remaining Duration : </b>{currentPlan.remainingDuration} mins</Form.Label>
                            </Col>
                        </Row>
                        <Row>
                            <Col lg={6} md={6} sm={6}>
                                <Form.Label><b>Price Per Minute : </b>$ {currentPlan.pricePerMin}</Form.Label>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
                <br />
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
                {
                    calculatedPrice > 0 &&
                    <Form.Group>
                        <Form.Label><b>Calculated Price :</b> { `${currentPlan.currency === 'USD' ? '$' : ''} ${calculatedPrice} ${ currentPlan.currency === 'TRY' ? 'TL' : '' }` }</Form.Label>
                        <br />
                        <Button variant='success' onClick={ this.initializePayment }>Make Payment</Button>
                    </Form.Group>
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

export default connect(mapStateToProps)(Payment);