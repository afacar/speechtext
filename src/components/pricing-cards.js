import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { Button, Spinner, Col, Container, Row } from 'react-bootstrap';
import MasterVisaLogo from '../assets/mastercard-visa-logo.png';
import SellingContract from '../containers/user/selling-contract';
import RefundContract from '../containers/user/refund-contract';
import _ from 'lodash';
import PricingSlider from './pricing-slider';
import "../styles/payment.css"

class DemoCard extends Component {

  render() {
    var DemoButtonText = <FormattedMessage id="Pricing.Demo.buttonText" />;
    if (!_.isEmpty(this.props.user)) {
      DemoButtonText = <FormattedMessage id="Pricing.Demo.loggedInButtonText" />;
    }
    return (
      <div className="card card-pricing text-center px-3 mb-4">
        <span className="h6 w-60 mx-auto px-4 py-1 rounded-bottom bg-primary text-white shadow-sm">Demo</span>
        <div className="bg-transparent card-header pt-4 border-0 pricing-header-container" >
          <h2 className="h2 font-weight-normal text-primary text-center mb-0" data-pricing-value="15">
            <span className="price">
              <FormattedMessage id="Pricing.Demo.price" />
            </span>
          </h2>
        </div>
        <div className="card-body pt-0" >
          <ul className="list-unstyled mb-4 pricing-body-container" >
            <li className='list-unstyled'>
              <FormattedMessage id="Pricing.Demo.feature1" />
            </li>
            <li className='list-unstyled'>
              <FormattedMessage id="Pricing.Demo.feature2" />
            </li>
            <li className='list-unstyled'>
              <FormattedMessage id="Pricing.Demo.feature3" />
            </li>
            <li className='list-unstyled'>
              <FormattedMessage id="Pricing.Demo.feature4" />
            </li>
          </ul>
          <div className='pricing-footer-container' >
            <Button variant="outline-secondary" className="mb-3 payment-button-style" onClick={() => this.props.handleBuyNowButton('Demo')}>
              {DemoButtonText}
            </Button>
          </div>
        </div>
      </div>
    )
  }
}

class StandardCard extends Component {

  render() {
    var StandardButtonText = <FormattedMessage id="Pricing.Standard.buttonText" />;
    if (!_.isEmpty(this.props.user)) {
      StandardButtonText = <FormattedMessage id="Pricing.Standard.loggedInButtonText" />;
    }
    return (
      <div className="card card-pricing text-center px-3 mb-4" >
        <span className="h6 w-60 mx-auto px-4 py-1 rounded-bottom bg-primary text-white">
          <FormattedMessage id="Pricing.Standard.title" />
        </span>
        <div className="bg-transparent card-header pt-4 border-0 pricing-header-container" >
          <h2 className="h2 font-weight-normal text-primary text-center mb-0" data-pricing-value="30">
            $<span className="price">5,90</span>
            <span className="h6 text-muted ml-2">/
                                      <FormattedMessage id="Pricing.Standard.timeText" />
            </span>
          </h2>
        </div>
        <div className="card-body pt-0">
          <ul className="list-unstyled mb-4 pricing-body-container">
            <li className='list-unstyled'>
              <FormattedMessage id="Pricing.Standard.feature1" />
            </li>
            <li className='list-unstyled'>
              <FormattedMessage id="Pricing.Standard.feature2" />
            </li>
            <li className='list-unstyled'>
              <FormattedMessage id="Pricing.Standard.feature3" />
            </li>
            <li className='list-unstyled'>
              <FormattedMessage id="Pricing.Standard.feature4" />
            </li>
            <li className='list-unstyled'>
              <FormattedMessage id="Pricing.Standard.feature5" />
            </li>
          </ul>
          <div className='pricing-footer-container' >
            <Button variant="outline-secondary" className="mb-3" onClick={() => this.props.handleBuyNowButton('PayAsYouGo')}>
              {StandardButtonText}
            </Button>
          </div>
        </div>
      </div>
    )
  }
}

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

  render() {
    var { currentPlan, unitPrice } = this.props;
    if (_.isEmpty(currentPlan)) currentPlan = {};
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
              {/* <Row>
                <Col>
                  <Form.Label>
                    <b><FormattedMessage id='Payment.CurrentPlan.remainingMinutes' /></b>
                    {currentPlan.remainingMinutes}
                    <FormattedMessage id='Payment.CurrentPlan.durationType' />
                  </Form.Label><br />
                  <Form.Label>
                    <b><FormattedMessage id='Payment.CurrentPlan.expireDate' /></b>
                    {Utils.formatDateSimpleFormat(currentPlan.expireDate)}
                  </Form.Label>
                </Col>
              </Row> */}
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
              {/* <Row>
                <Col>
                  {
                    this.props.duration >= 50 && (
                      <Button className="btn btn-primary mb-3" onClick={this.props.handleBuy}>
                        <FormattedMessage id="Pricing.Standard.contactUs" />
                      </Button>
                    )
                  }
                  {
                    this.props.duration < 50 && (
                      <Button variant="outline-secondary" className="mb-3" onClick={this.props.handleBuy}>
                        <FormattedMessage id="Pricing.Standard.loggedInButtonText" />
                      </Button>
                    )
                  }
                </Col>
              </Row> */}
              <Row className="d-flex justify-content-center">
                {/* <Col> */}
                {/* <span className='mb-3'> */}
                {/* <img src={MasterVisaLogo} alt='Master Card' className='card-logo' /> */}
                {this.renderTerms()}
                {/* </span> */}
                {/* </Col> */}
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

class MonthlyPaymentCard extends Component {
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

  render() {
    var { currentPlan } = this.props;
    if (_.isEmpty(currentPlan)) currentPlan = {};
    const { showSellingContract, showRefundContract } = this.state
    return (
      <div className="card card-pricing shadow text-center px-3 mb-4 card-pricing-popular">
        <span className="h6 w-60 mx-auto px-4 py-1 rounded-bottom bg-primary text-white shadow-sm">
          <FormattedMessage id="Pricing.Monthly.title" />
        </span>
        <div className="bg-transparent card-header pt-4 border-0 pricing-header-container" >
          <h2 className="h2 font-weight-normal text-primary text-center mb-0" data-pricing-value="30">
            $<span className="price">24,90</span>
            <span className="h6 text-muted ml-2">
              / 5 <FormattedMessage id="Pricing.Monthly.timeText" />
            </span>
          </h2>
        </div>
        <div className="card-body pt-0">
          <ul className="list-unstyled mb-4 pricing-body-container" >
            <li className='list-unstyled'>
              <FormattedMessage id="Pricing.Monthly.feature1" />
            </li>
            <li className='list-unstyled'>
              <FormattedMessage id="Pricing.Monthly.feature2" />
            </li>
            <li className='list-unstyled'>
              <FormattedMessage id="Pricing.Monthly.feature3" />
            </li>
            <li className='list-unstyled'>
              <FormattedMessage id="Pricing.Monthly.feature4" />
            </li>
            <li className='list-unstyled'>
              <FormattedMessage id="Pricing.Monthly.feature5" />
            </li>
          </ul>
          <div className='pricing-footer-container' >
            <Container>
              <Row>
                <Col>
                  <Button variant="outline-secondary" className="mb-3" onClick={() => this.props.handleBuy(5)}>
                    <FormattedMessage id="Pricing.Monthly.loggedInButtonText" />
                    {
                      this.props.showSpinner && <Spinner size='sm' animation='grow' role="status" />
                    }
                  </Button>
                </Col>
              </Row>
              <Row>
                <Col>
                  <span className='mb-3'>
                    <img src={MasterVisaLogo} alt='Master Card' className='card-logo' />
                    {this.renderContract()}
                  </span>
                </Col>
              </Row>
            </Container>
          </div>
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
    )
  }
}

class MonthlyCard extends Component {

  render() {
    var MonthlyButtonText = <FormattedMessage id="Pricing.Monthly.buttonText" />;
    if (!_.isEmpty(this.props.user)) {
      MonthlyButtonText = <FormattedMessage id="Pricing.Monthly.loggedInButtonText" />;
    }
    return (
      <div className="card card-pricing shadow text-center px-3 mb-4 card-pricing-popular">
        <span className="h6 w-60 mx-auto px-4 py-1 rounded-bottom bg-primary text-white shadow-sm">
          <FormattedMessage id="Pricing.Monthly.title" />
        </span>
        <div className="bg-transparent card-header pt-4 border-0 pricing-header-container" >
          <h2 className="h2 font-weight-normal text-primary text-center mb-0" data-pricing-value="30">
            $<span className="price">24,90</span>
            <span className="h6 text-muted ml-2">
              / 5
                      <FormattedMessage id="Pricing.Monthly.timeText" />
            </span>
          </h2>
        </div>
        <div className="card-body pt-0">
          <ul className="list-unstyled mb-4 pricing-body-container" >
            <li className='list-unstyled'>
              <FormattedMessage id="Pricing.Monthly.feature1" />
            </li>
            <li className='list-unstyled'>
              <FormattedMessage id="Pricing.Monthly.feature2" />
            </li>
            <li className='list-unstyled'>
              <FormattedMessage id="Pricing.Monthly.feature3" />
            </li>
            <li className='list-unstyled'>
              <FormattedMessage id="Pricing.Monthly.feature4" />
            </li>
            <li className='list-unstyled'>
              <FormattedMessage id="Pricing.Monthly.feature5" />
            </li>
          </ul>
          <div className='pricing-footer-container' >
            <Button variant="primary" className="mb-3" onClick={() => this.props.handleBuyNowButton('Monthly')}>
              {MonthlyButtonText}
            </Button>
          </div>
        </div>
      </div>
    )
  }
}

class EnterpriseCard extends Component {

  render() {
    const { goToRef } = this.props;
    return (
      <div className="card card-pricing text-center px-3 mb-4">
        <span className="h6 w-60 mx-auto px-4 py-1 rounded-bottom bg-primary text-white shadow-sm">
          <FormattedMessage id="Pricing.Enterprise.title" />
        </span>
        <div className="bg-transparent card-header pt-4 border-0 pricing-header-container">
          <h2 className="h2 font-weight-normal text-primary text-center mb-0 enterprise-header-style" data-pricing-value="45" >
            <span className="h6 text-muted ml-1">
              <FormattedMessage id="Pricing.Enterprise.pricingText" />
            </span>
          </h2>
        </div>
        <div className="card-body pt-0">
          <ul className="list-unstyled mb-4 pricing-body-container">
            <li className='list-unstyled'>
              <FormattedMessage id="Pricing.Enterprise.feature1" />
            </li>
            <li className='list-unstyled'>
              <FormattedMessage id="Pricing.Enterprise.feature2" />
            </li>
            <li className='list-unstyled'>
              <FormattedMessage id="Pricing.Enterprise.feature3" />
            </li>
            <li className='list-unstyled'>
              <FormattedMessage id="Pricing.Enterprise.feature4" />
            </li>
          </ul>
          <div className='pricing-footer-container' >
            <Button variant="outline-secondary" className="mb-3" onClick={() => goToRef('contactRef')}>
              <FormattedMessage id="Pricing.Enterprise.buttonText" />
            </Button>
          </div>
        </div>
      </div>
    )
  }
}

export { DemoCard, StandardCard, MonthlyCard, EnterpriseCard, StandardPaymentCard, MonthlyPaymentCard }