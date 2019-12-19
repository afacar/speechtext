import React, { Component } from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Card, Container, Row, Col, Button, Spinner } from 'react-bootstrap';

class CheckOutInfo extends Component {

    constructor(props) {
        super(props);
        this.state = {
            cardNumber: '',
            expiry: '',
            cvc: '',
        }
    }

    render() {
        var { calculatedPrice, rph, duration, durationType, startPayment, loading, disabled } = this.props
        if (duration === 1) {
            durationType = durationType.substring(0, durationType.length - 1);
        }
        return (
            <div className="d-flex flex-column justify-content-center">
                <Card>
                    <Card.Body>
                        <Card.Title className="border-bottom"><p style={{ color: '#086FA1' }} >Order Summary</p></Card.Title>
                        
                        <Row>
                            <Col className="d-flex flex-start">
                                <FormattedMessage id={"Payment.Summary.Total.Duration"} />
                            </Col>
                            <Col className="d-flex flex-end">
                                {duration + " " + durationType}
                            </Col>
                        </Row>

                        <Row>
                            <Col className="d-flex flex-start">
                                <FormattedMessage id={"Payment.Summary.RPH"} />
                            </Col>
                            <Col className="d-flex flex-end">
                                {'$' + rph}
                            </Col>
                        </Row>

                        <Container style={{ marginTop: '35%', padding: 0 }}>
                            <Row>
                                <Col className="d-flex flex-start">
                                    <h4 style={{ color: '#086FA1' }}  >
                                        <FormattedMessage id={"Payment.Summary.Total.Price"} />
                                    </h4>
                                </Col>
                                <Col className="d-flex flex-end">
                                    <h4 cstyle={{ color: '#086FA1' }}  >
                                        {'$' + calculatedPrice}
                                    </h4>
                                </Col>
                            </Row>
                            <Row className="d-flex justify-content-end" style={{ width: '100%' }}>
                                <Button className="btn-lg" style={{ backgroundColor: '#22884f', }} onClick={startPayment} disabled={disabled}>
                                    {
                                        !loading && (
                                            <FormattedMessage id='Payment.Summary.Pay'/>
                                        )
                                    }
                                    {
                                        loading && (
                                            < div >
                                                <Spinner animation="border" role="status" />
                                            </div>
                                        )
                                    }
                                </Button>
                            </Row>
                        </Container>
                    </Card.Body>
                </Card>
            </div >
        )
    }
}

export default (injectIntl(CheckOutInfo));
