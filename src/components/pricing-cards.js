import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { Button, Col, Container, Row } from 'react-bootstrap';
import MasterVisaLogo from '../assets/mastercard-visa-logo.png';
import SellingContract from '../containers/user/selling-contract';
import RefundContract from '../containers/user/refund-contract';
import _ from 'lodash';
import PricingSlider from './pricing-slider';
import "../styles/payment.css"

class StandardPaymentCard extends Component {
  state = {
    showSellingContract: false,
    showRefundContract: false
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

  renderTerms = () => {
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

  render() {
    var { currentPlan, unitPrice } = this.props;
    if (_.isEmpty(currentPlan)) {
      currentPlan = {};
    } else if(currentPlan.planId === 'custom') {
      unitPrice = currentPlan.pricePerHour;
    }
    const { showSellingContract, showRefundContract } = this.state
    return (
      <div className="d-flex justify-content-center" style={{ width: "100%", height: "100%" }}>
        <div className="card-pricing text-center px-3 mb-4" style={{ width: "100%", height: "100%" }}>
          <span className="h6 w-60 mx-auto px-4 py-1 rounded-bottom bg-primary text-white">
            <FormattedMessage id="Pricing.Standard.title" />
          </span>
          <div className="bg-transparent card-header pt-4 border-0 pricing-header-container" >
            <h2 className="h2 font-weight-normal text-primary text-center mb-0" data-pricing-value="30">
              $<span className="price">{unitPrice}</span>
              <span className="h6 text-muted ml-2">/
              <FormattedMessage id="Pricing.Standard.timeText" />
              </span>
            </h2>
          </div>
          <div className="card-body pt-0">
            <Container>
              <Row>
                <PricingSlider duration={this.props.duration} durationChanged={this.props.durationChanged} />
              </Row>
              <Row className="d-flex justify-content-md-center buy-button-surrounding mb-3 mt-5 align-items-center">
                <Col className="d-flex justify-content-end" md>
                  <h3>
                    <FormattedMessage id='Payment.Label.totalCost' />
                  </h3>
                  <h3>
                    <div className="price">:    ${this.props.price}</div>
                  </h3>
                </Col>
                <Col className="d-flex justify-content-start" md>
                  {
                    this.props.duration >= 50 && (
                      <Button className="btn btn-primary" onClick={this.props.handleBuy}>
                        <FormattedMessage id="Pricing.Standard.contactUs" />
                      </Button>
                    )
                  }
                  {
                    this.props.duration < 50 && (
                      <Button variant="outline-secondary"onClick={this.props.handleBuy}>
                        <FormattedMessage id="Pricing.Standard.loggedInButtonText" />
                      </Button>
                    )
                  }
                  <img src={MasterVisaLogo} alt='Master Card' className='card-logo' />
                </Col>
              </Row>
              <Row className="d-flex justify-content-center">
                {this.renderTerms()}
              </Row>
            </Container>
          </div>
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
    )
  }
}

export { StandardPaymentCard }