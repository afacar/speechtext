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
        var { calculatedPrice, pricePerHour, duration, durationType } = this.props
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
                        <Col lg="8" md="8" sm="6" xs="6">
                            <FormattedMessage id={"Payment.Summary.Total.Duration"} />
                        </Col>
                        <Col lg="4" md="4" sm="6" xs="6" align='right'>
                            {duration + " " + durationType}
                        </Col>
                    </Row>
                    <Row>
                        <Col lg="8" md="8" sm="6" xs="6">
                            <FormattedMessage id={"Payment.Summary.pricePerHour"} />
                        </Col>
                        <Col lg="4" md="4" sm="6" xs="6" align='right'>
                            {'$' + pricePerHour}
                        </Col>
                    </Row>
                    <Row className='payment-total-container container'>
                        <Col lg="8" md="8" sm="6" xs="6">
                            <h4>
                                <FormattedMessage id={"Payment.Summary.Total.Price"} />
                            </h4>
                        </Col>
                        <Col lg="4" md="4" sm="6" xs="6" align='right'>
                            <h4>
                                {'$' + calculatedPrice}
                            </h4>
                        </Col>
                    </Row>
                </Container>
            </div >
        )
    }
}

export default (injectIntl(CheckOutInfo));
