import React, { Component } from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Container, Row, Col } from 'react-bootstrap';

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
        var { calculatedPrice, unitPrice, duration, durationType } = this.props
        if (duration === 1) {
            durationType = durationType.substring(0, durationType.length - 1);
        }
        return (
            <div className="d-flex flex-column justify-content-center">
                <Container className='order-summary-container'>
                    <h4 className='payment-modal-title'>
                        <FormattedMessage id="Payment.Summary.Title" />
                    </h4>
                    <Row>
                        <Col lg="7" md="7" sm="6" xs="6" className='summary-label'>
                            <FormattedMessage id={"Payment.Summary.Total.Duration"} />
                        </Col>
                        <Col lg="5" md="5" sm="6" xs="6" align='right'>
                            {duration ? duration + " " + durationType : 0}
                        </Col>
                    </Row>
                    <Row>
                        <Col lg="7" md="7" sm="6" xs="6" className='summary-label'>
                            <FormattedMessage id={"Payment.Summary.pricePerHour"} />
                        </Col>
                        <Col lg="5" md="5" sm="6" xs="6" align='right'>
                            {'$ ' + (unitPrice ? unitPrice : 0)}
                        </Col>
                    </Row>
                    <Row className='payment-total-container container'>
                        <Col lg="7" md="7" sm="6" xs="6" className='summary-label'>
                            <h4>
                                <FormattedMessage id={"Payment.Summary.Total.Price"} />
                            </h4>
                        </Col>
                        <Col lg="5" md="5" sm="6" xs="6" align='right'>
                            <h4>
                                {'$ ' + (calculatedPrice ? calculatedPrice : 0)}
                            </h4>
                        </Col>
                    </Row>
                </Container>
            </div >
        )
    }
}

export default (injectIntl(CheckOutInfo));
